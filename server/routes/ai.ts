import express from 'express';
import { GITHUB_TOOLS, executeTool, ToolCall } from '../lib/tools.js';

const router = express.Router();

const ENGINE = process.env.AR_ENGINE_ENDPOINT || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

const MODEL_MAP: Record<string, string> = {
  'ar-neural-v2': 'glm-4',
  'ar-neural-v2-vision': 'glm-4v',
};

/* ── Call GLM-4 once ── */
async function callGLM(payload: object): Promise<any> {
  const key = process.env.AR_ENGINE_KEY;
  if (!key) throw new Error('AR_ENGINE_KEY not set in .env');

  const res = await fetch(ENGINE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json() as any;
  if (!res.ok) {
    throw new Error(data?.error?.message || data?.msg || `GLM API error ${res.status}`);
  }
  return data;
}

/* ── Build GitHub-aware context injection ── */
function buildGithubContext(): string {
  const owner = process.env.GITHUB_OWNER || 'samiunarno';
  const repo  = process.env.GITHUB_REPO  || 'Digital-Backend';
  return `
## Your GitHub Access
You have LIVE read/write access to the GitHub repository: ${owner}/${repo}

**Tech Stack:**
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS v4
- Backend: Node.js + Express + TypeScript (tsx)
- Database: MongoDB (Mongoose)
- AI: ZhipuAI GLM-4 (proxied through /api/ai/chat)
- Auth: JWT + bcrypt
- Animations: Framer Motion (motion/react)
- Icons: Lucide React

**Key directories:**
- \`src/components/\` — React page components (Portfolio.tsx, CMSDashboard.tsx, AIChatPage.tsx, AdminLogin.tsx, AdminRegister.tsx)
- \`src/\` — App.tsx (router), index.css (design tokens), types.ts, data/
- \`server/routes/\` — Express API routes (ai.ts, auth.ts, github.ts, etc.)
- \`server/lib/\` — Shared server utilities (github.ts, tools.ts)
- \`server/models/\` — Mongoose models (User.ts, Portfolio.ts, etc.)

**Workflow rules:**
1. ALWAYS read the current file content before modifying it
2. For small changes: commit directly to main branch
3. For large features (new pages, major refactors): create a new branch like joyi/feature-name, then open a Pull Request
4. Write complete file content (not diffs) when calling github_update_file
5. Use clear commit messages like "feat: add dark mode toggle to navbar"
6. After making changes, tell the user exactly what you changed and link to the commit
`;
}

/* ─────────────────────────────────────────
   POST /api/ai/chat
   Normal chat OR full agentic GitHub loop
───────────────────────────────────────── */
router.post('/chat', async (req, res) => {
  try {
    const { messages, model, useGitHubTools = false } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const resolvedModel = MODEL_MAP[model] || model || 'glm-4';
    const hasGithubToken = !!(process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN !== 'PASTE_YOUR_PAT_HERE');

    /* Split system prompt from chat messages */
    let systemPrompt = '';
    const chatMessages: any[] = [];

    for (const msg of messages) {
      if (msg.role === 'system') {
        systemPrompt += (systemPrompt ? '\n\n' : '') + msg.content;
      } else if (['user', 'assistant', 'tool'].includes(msg.role)) {
        chatMessages.push(msg);
      }
    }

    // Inject GitHub context into system prompt when GitHub mode is on
    if (useGitHubTools && hasGithubToken) {
      systemPrompt += buildGithubContext();
    }

    // Ensure conversation starts with user message
    if (!chatMessages.length || chatMessages[0]?.role !== 'user') {
      chatMessages.unshift({ role: 'user', content: 'Hello' });
    }

    const basePayload: any = {
      model: resolvedModel,
      messages: chatMessages,
    };
    if (systemPrompt) basePayload.system = systemPrompt;

    /* ── NORMAL MODE ── */
    if (!useGitHubTools || !hasGithubToken) {
      const data = await callGLM(basePayload);
      return res.json(data);
    }

    /* ── AGENTIC GITHUB MODE ── */
    const toolCallLog: ToolCall[] = [];
    const agentMessages = [...chatMessages];
    const MAX_ITERS = 12;
    let iter = 0;

    while (iter < MAX_ITERS) {
      iter++;

      const payload = {
        ...basePayload,
        messages: agentMessages,
        tools: GITHUB_TOOLS,
        tool_choice: 'auto',
      };

      const data = await callGLM(payload);
      const choice = data?.choices?.[0];
      if (!choice) break;

      const assistantMsg = choice.message;
      const finishReason = choice.finish_reason;

      // Always push assistant turn
      agentMessages.push(assistantMsg);

      // No tool calls → done
      const toolCalls = assistantMsg?.tool_calls;
      if (!toolCalls?.length || finishReason === 'stop') {
        return res.json({ ...data, toolCallLog });
      }

      // Execute each tool call
      for (const tc of toolCalls) {
        const name = tc.function?.name || tc.name;
        let args: Record<string, any> = {};
        try {
          args = JSON.parse(tc.function?.arguments || tc.arguments || '{}');
        } catch { args = {}; }

        const record: ToolCall = { id: tc.id || `call_${Date.now()}`, name, args };

        try {
          const result = await executeTool(name, args);
          record.result = result;
          agentMessages.push({
            role: 'tool',
            tool_call_id: tc.id,
            name,
            content: JSON.stringify(result),
          });
        } catch (err: any) {
          record.error = err.message;
          agentMessages.push({
            role: 'tool',
            tool_call_id: tc.id,
            name,
            content: JSON.stringify({ error: err.message }),
          });
        }

        toolCallLog.push(record);
      }
    }

    // Hit max iterations — summarize what was done
    return res.json({
      choices: [{
        finish_reason: 'stop',
        index: 0,
        message: {
          role: 'assistant',
          content:
            `I completed ${toolCallLog.length} GitHub operation(s). Here's what happened:\n\n` +
            toolCallLog
              .map(t => `- **${t.name.replace('github_', '').replace(/_/g, ' ')}**${t.args?.path ? ` \`${t.args.path}\`` : ''}: ${t.error ? `❌ ${t.error}` : '✅ Done'}`)
              .join('\n'),
        },
      }],
      toolCallLog,
    });

  } catch (err: any) {
    console.error('AI route error:', err.message);
    res.status(500).json({ error: err.message || 'AI service error' });
  }
});

/* ─────────────────────────────────────────
   GET /api/ai/github-status
───────────────────────────────────────── */
router.get('/github-status', async (_req, res) => {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER || 'samiunarno';
  const repo  = process.env.GITHUB_REPO  || 'Digital-Backend';

  if (!token || token === 'PASTE_YOUR_PAT_HERE') {
    return res.json({ connected: false, message: 'GITHUB_TOKEN not configured' });
  }

  try {
    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
    });
    const d = await r.json() as any;
    if (r.ok) {
      return res.json({
        connected: true,
        repo: d.full_name,
        branch: d.default_branch,
        url: d.html_url,
        private: d.private,
        description: d.description,
        stars: d.stargazers_count,
      });
    }
    return res.json({ connected: false, message: d.message });
  } catch (e: any) {
    return res.json({ connected: false, message: e.message });
  }
});

export default router;
