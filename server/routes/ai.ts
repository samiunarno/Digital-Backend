import express from 'express';
import { GITHUB_TOOLS, executeTool, ToolCall } from '../lib/tools.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Require login for all AI operations
router.use(protect);

// Use AR_ENGINE_ENDPOINT or JOYI_ENGINE_ENDPOINT or standard Joyi AR-2 API URL
const ENGINE_ENDPOINT =
  process.env.AR_ENGINE_ENDPOINT ||
  process.env.ZHIPU_ENGINE_ENDPOINT ||
  'https://open.bigmodel.cn/api/paas/v4/chat/completions';

// Map client-facing model names to provider models
const MODEL_MAP: Record<string, string> = {
  'ar-neural-v2': 'glm-4',
  'ar-neural-v2-vision': 'glm-4v',
};

// Key resolution: check ZHIPU_API_KEY first, fallback to AR_ENGINE_KEY
function getApiKey(): string | undefined {
  return process.env.ZHIPU_API_KEY || process.env.AR_ENGINE_KEY;
}

/* ── Proxy to Joyi / AR Engine ── */
async function proxyToJoyi(params: {
  apiKey: string;
  model: string;
  messages: any[];
  images?: any;
  system?: string; // Support system prompt if supplied separately
  tools?: any[];
  tool_choice?: any;
  timeoutMs?: number;
  stream?: boolean; // New streaming flag
}) {
  const resolvedModel = MODEL_MAP[params.model] || params.model || 'glm-4';
  
  // Format messages properly
  const finalMessages = [...params.messages];
  if (params.system) {
    // If system prompt is provided separately, place it as the first system message if not already there
    const hasSystem = finalMessages.some(m => m.role === 'system');
    if (!hasSystem) {
      finalMessages.unshift({ role: 'system', content: params.system });
    }
  }

  const body: any = {
    model: resolvedModel,
    messages: finalMessages,
  };

  if (params.images) body.images = params.images;
  if (params.tools) body.tools = params.tools;
  if (params.tool_choice) body.tool_choice = params.tool_choice;
  if (params.stream) body.stream = true;

  const timeoutMs = params.timeoutMs ?? 30000; // 30s timeout
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(ENGINE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({} as any));
      return {
        ok: false as const,
        status: response.status,
        data,
      };
    }

    if (params.stream) {
      return { ok: true as const, response };
    }

    const data = await response.json().catch(() => ({} as any));
    return { ok: true as const, data };
  } catch (e: any) {
    return {
      ok: false as const,
      status: 0,
      data: {
        error: e?.name || 'FetchError',
        message: e?.message || String(e),
        timeoutMs,
        endpoint: ENGINE_ENDPOINT,
      },
    };
  } finally {
    clearTimeout(t);
  }
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
- AI: Joyi AI AR-2 (proxied through /api/ai/chat)
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
   Normal proxy chat OR full agentic GitHub loop
   Accepts JOYI_API_KEY or AR_ENGINE_KEY
───────────────────────────────────────── */
/* ── SSE Stream Parser Helper ── */
async function parseSSEStream(
  response: any,
  onChunk: (choice: any) => void
): Promise<{ fullContent: string; toolCalls: any[]; finishReason: string | null }> {
  const reader = response.body;
  if (!reader) {
    return { fullContent: '', toolCalls: [], finishReason: null };
  }

  let fullContent = '';
  const toolCallsMap: Record<number, any> = {};
  let finishReason: string | null = null;

  // Check if it's a web-standard ReadableStream or a Node stream
  if (typeof reader.getReader === 'function') {
    const r = reader.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
      const { value, done } = await r.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (trimmed.startsWith('data: ')) {
          const dataStr = trimmed.slice(6);
          if (dataStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(dataStr);
            const choice = parsed.choices?.[0];
            if (choice) {
              onChunk(choice);
              const delta = choice.delta;
              if (delta?.content) {
                fullContent += delta.content;
              }
              if (delta?.tool_calls) {
                for (const tc of delta.tool_calls) {
                  const index = tc.index ?? 0;
                  if (!toolCallsMap[index]) {
                    toolCallsMap[index] = {
                      id: tc.id || '',
                      type: tc.type || 'function',
                      function: { name: '', arguments: '' }
                    };
                  }
                  if (tc.id) toolCallsMap[index].id = tc.id;
                  if (tc.function?.name) toolCallsMap[index].function.name += tc.function.name;
                  if (tc.function?.arguments) toolCallsMap[index].function.arguments += tc.function.arguments;
                }
              }
              if (choice.finish_reason) {
                finishReason = choice.finish_reason;
              }
            }
          } catch (err) {
            // Ignore JSON parse errors for partial chunks
          }
        }
      }
    }
  } else {
    let buffer = '';
    for await (const chunk of reader) {
      buffer += chunk.toString();
      let lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (trimmed.startsWith('data: ')) {
          const dataStr = trimmed.slice(6);
          if (dataStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(dataStr);
            const choice = parsed.choices?.[0];
            if (choice) {
              onChunk(choice);
              const delta = choice.delta;
              if (delta?.content) {
                fullContent += delta.content;
              }
              if (delta?.tool_calls) {
                for (const tc of delta.tool_calls) {
                  const index = tc.index ?? 0;
                  if (!toolCallsMap[index]) {
                    toolCallsMap[index] = {
                      id: tc.id || '',
                      type: tc.type || 'function',
                      function: { name: '', arguments: '' }
                    };
                  }
                  if (tc.id) toolCallsMap[index].id = tc.id;
                  if (tc.function?.name) toolCallsMap[index].function.name += tc.function.name;
                  if (tc.function?.arguments) toolCallsMap[index].function.arguments += tc.function.arguments;
                }
              }
              if (choice.finish_reason) {
                finishReason = choice.finish_reason;
              }
            }
          } catch (err) {
            // Ignore
          }
        }
      }
    }
  }

  const toolCalls = Object.values(toolCallsMap).map((tc: any) => ({
    id: tc.id,
    type: tc.type,
    function: tc.function,
  }));

  return { fullContent, toolCalls, finishReason };
}

router.post('/chat', async (req, res) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      return res.status(500).json({
        error: 'AI Provider Key not configured on server',
        hint: 'Add JOYI_API_KEY or AR_ENGINE_KEY to server .env and restart the server.',
        envKeysPresent: {
          ZHIPU_API_KEY: !!process.env.ZHIPU_API_KEY,
          AR_ENGINE_KEY: !!process.env.AR_ENGINE_KEY,
        },
      });
    }

    const { messages, model, useGitHubTools = false, images, stream = false } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

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

    // Check if the client requested streaming (SSE)
    if (stream || req.headers.accept === 'text/event-stream') {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      const sendSSE = (type: string, data: any) => {
        res.write(`data: ${JSON.stringify({ type, ...data })}\n\n`);
      };

      try {
        /* ── NORMAL STREAMING MODE ── */
        if (!useGitHubTools || !hasGithubToken) {
          const proxied = await proxyToJoyi({
            apiKey,
            model: model || 'glm-4',
            messages: chatMessages,
            system: systemPrompt || undefined,
            images,
            stream: true,
          });

          if (!proxied.ok) {
            sendSSE('error', { error: 'AI provider error', status: proxied.status });
            return res.end();
          }

          const response = (proxied as any).response;
          await parseSSEStream(response, (choice) => {
            const delta = choice.delta;
            if (delta?.content) {
              sendSSE('text', { content: delta.content });
            }
          });

          sendSSE('done', {});
          return res.end();
        }

        /* ── AGENTIC GITHUB STREAMING MODE ── */
        const toolCallLog: ToolCall[] = [];
        const agentMessages = [...chatMessages];
        const MAX_ITERS = 12;
        let iter = 0;
        let finalResponseSent = false;

        while (iter < MAX_ITERS) {
          iter++;

          sendSSE('status', { message: `Joyi is thinking (Iteration ${iter})...` });

          const proxied = await proxyToJoyi({
            apiKey,
            model: model || 'glm-4',
            messages: agentMessages,
            system: systemPrompt || undefined,
            tools: GITHUB_TOOLS,
            tool_choice: 'auto',
            stream: true,
          });

          if (!proxied.ok) {
            sendSSE('error', { error: 'AI provider error in agentic loop', status: proxied.status });
            return res.end();
          }

          const response = (proxied as any).response;
          let currentContent = '';
          const { fullContent, toolCalls, finishReason } = await parseSSEStream(response, (choice) => {
            const delta = choice.delta;
            if (delta?.content) {
              currentContent += delta.content;
              sendSSE('text', { content: delta.content });
            }
          });

          const assistantMsg: any = {
            role: 'assistant',
            content: fullContent,
          };
          if (toolCalls.length > 0) {
            assistantMsg.tool_calls = toolCalls.map((tc, idx) => ({
              id: tc.id || `call_${Date.now()}_${idx}`,
              type: 'function',
              function: tc.function,
            }));
          }

          agentMessages.push(assistantMsg);

          if (!toolCalls || toolCalls.length === 0 || finishReason === 'stop') {
            finalResponseSent = true;
            break;
          }

          // Execute each tool call
          for (const tc of toolCalls) {
            const name = tc.function?.name;
            let args: Record<string, any> = {};
            try {
              args = JSON.parse(tc.function?.arguments || '{}');
            } catch { args = {}; }

            const callId = tc.id || `call_${Date.now()}`;
            const record: ToolCall = { id: callId, name, args };

            sendSSE('status', {
              message: `Executing ${name.replace('github_', '').replace(/_/g, ' ')}...`,
              tool: name,
              args,
            });

            try {
              const result = await executeTool(name, args);
              record.result = result;
              agentMessages.push({
                role: 'tool',
                tool_call_id: callId,
                name,
                content: JSON.stringify(result),
              });

              if (name === 'github_update_file') {
                sendSSE('file_updated', { path: args.path });
              }
            } catch (err: any) {
              record.error = err.message;
              agentMessages.push({
                role: 'tool',
                tool_call_id: callId,
                name,
                content: JSON.stringify({ error: err.message }),
              });
            }

            toolCallLog.push(record);
            sendSSE('tool_end', record);
          }
        }

        if (!finalResponseSent) {
          const summary = `I completed ${toolCallLog.length} GitHub operation(s). Here's what happened:\n\n` +
            toolCallLog
              .map(t => `- **${t.name.replace('github_', '').replace(/_/g, ' ')}**${t.args?.path ? ` \`${t.args.path}\`` : ''}: ${t.error ? `❌ ${t.error}` : '✅ Done'}`)
              .join('\n');
          sendSSE('text', { content: summary });
        }

        sendSSE('done', { toolCallLog });
        res.end();
      } catch (err: any) {
        console.error('Streaming AI error:', err);
        sendSSE('error', { error: err.message || 'Streaming execution error' });
        res.end();
      }
      return;
    }

    /* ── NORMAL (NON-STREAMING) MODE ── */
    if (!useGitHubTools || !hasGithubToken) {
      const proxied = await proxyToJoyi({
        apiKey,
        model: model || 'glm-4',
        messages: chatMessages,
        system: systemPrompt || undefined,
        images,
      });

      if (!proxied.ok) {
        return res.status(proxied.status || 502).json({
          error: 'AI provider error',
          providerStatus: proxied.status,
          providerData: proxied.data,
        });
      }

      return res.json(proxied.data);
    }

    /* ── AGENTIC GITHUB (NON-STREAMING) MODE ── */
    const toolCallLog: ToolCall[] = [];
    const agentMessages = [...chatMessages];
    const MAX_ITERS = 12;
    let iter = 0;

    while (iter < MAX_ITERS) {
      iter++;

      const proxied = await proxyToJoyi({
        apiKey,
        model: model || 'glm-4',
        messages: agentMessages,
        system: systemPrompt || undefined,
        tools: GITHUB_TOOLS,
        tool_choice: 'auto',
      });

      if (!proxied.ok) {
        return res.status(proxied.status || 502).json({
          error: 'AI provider error in agentic loop',
          providerStatus: proxied.status,
          providerData: proxied.data,
          toolCallLog,
        });
      }

      const data = proxied.data;
      const choice = data?.choices?.[0];
      if (!choice) break;

      const assistantMsg = choice.message;
      const finishReason = choice.finish_reason;

      agentMessages.push(assistantMsg);

      const toolCalls = assistantMsg?.tool_calls;
      if (!toolCalls?.length || finishReason === 'stop') {
        return res.json({ ...data, toolCallLog });
      }

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
   POST /api/ai/project/generate
   Accepts JOYI_API_KEY or AR_ENGINE_KEY
───────────────────────────────────────── */
router.post('/project/generate', async (req, res) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      return res.status(500).json({
        error: 'AI Provider Key not configured on server',
        hint: 'Add JOYI_API_KEY or AR_ENGINE_KEY to server .env and restart the server.',
      });
    }

    const {
      prompt,
      designVibe = 'google-io-dark',
      stack = 'react-vite-tailwind-ts',
      maxFiles = 20,
    } = req.body || {};

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing/invalid prompt' });
    }

    const system = [
      'You are a senior full-stack engineer generating a complete project snapshot.',
      'Return ONLY valid JSON. No markdown. No backticks. No comments outside JSON.',
      'Schema:',
      '{ "summary": string, "files": [ { "path": string, "content": string } ] }',
      '',
      'Hard constraints:',
      '- files length MUST be <= maxFiles',
      '- Each path must be unique',
      '- content must be the exact file contents (not wrapped).',
      '',
      `Target stack: ${stack}`,
      `Design vibe: ${designVibe}`,
      'When uncertain, make reasonable defaults and still produce runnable code.',
    ].join('\n');

    const user = `User request:\n${prompt}\n\nGenerate the project files now.`;

    const proxied = await proxyToJoyi({
      apiKey,
      model: 'ar-neural-v2',
      messages: [
        { role: 'user', content: user },
      ],
      system,
      timeoutMs: 30000,
    });

    if (!proxied.ok) {
      return res.status(proxied.status || 502).json({
        error: 'AI provider error',
        providerStatus: proxied.status,
        providerData: proxied.data,
        model: 'ar-neural-v2',
        engineEndpoint: ENGINE_ENDPOINT,
        timeoutMs: proxied.data?.timeoutMs,
        upstreamError: proxied.data?.error,
      });
    }

    // The provider returns a chat completion payload. Try to extract text.
    const raw =
      proxied.data?.choices?.[0]?.message?.content ??
      proxied.data?.choices?.[0]?.text ??
      '';

    const text = typeof raw === 'string' ? raw.trim() : '';

    // Extract JSON even if the model prepends whitespace.
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    const jsonStr =
      firstBrace >= 0 && lastBrace >= firstBrace
        ? text.slice(firstBrace, lastBrace + 1)
        : text;

    let parsed: any;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (e: any) {
      return res.status(502).json({
        error: 'AI returned non-JSON output',
        rawPreview: text.slice(0, 600),
      });
    }

    if (
      !parsed ||
      typeof parsed.summary !== 'string' ||
      !Array.isArray(parsed.files)
    ) {
      return res.status(502).json({
        error: 'AI returned JSON but schema is invalid',
      });
    }

    // Basic file sanitization
    const files = parsed.files
      .filter(
        (f: any) =>
          f &&
          typeof f.path === 'string' &&
          f.path.trim().length > 0 &&
          typeof f.content === 'string',
      )
      .slice(0, Number(maxFiles) || 20);

    return res.json({ summary: parsed.summary, files });
  } catch (error: any) {
    console.error('AI project generation error:', error?.message || error);
    return res.status(500).json({ error: 'Failed to generate project' });
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
        'User-Agent': 'Antigravity-Joyi-Agent',
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
