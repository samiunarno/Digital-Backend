import express from "express";

const router = express.Router();

// AI provider: Zhipu (GLM-4)
// Required env vars (server):
// - ZHIPU_API_KEY (must be set)
// Optional env vars:
// - ZHIPU_ENGINE_ENDPOINT (defaults to open.bigmodel.cn)
const ENGINE_ENDPOINT =
  process.env.ZHIPU_ENGINE_ENDPOINT ||
  "https://open.bigmodel.cn/api/paas/v4/chat/completions";


// Map client-facing model names to provider models
const modelMap: Record<string, string> = {
  "ar-neural-v2": "glm-4",
  "ar-neural-v2-vision": "glm-4v",
};

async function proxyToZhipu(params: {
  apiKey: string;
  model: string;
  messages: any[];
  images?: any;
  timeoutMs?: number;
}) {
  const body: any = {
    model: modelMap[params.model] || params.model || "glm-4",
    messages: params.messages,
  };

  if (params.images) body.images = params.images;

  const timeoutMs = params.timeoutMs ?? 20000; // 20s hard timeout for upstream calls
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(ENGINE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({} as any));

    if (!response.ok) {
      return {
        ok: false as const,
        status: response.status,
        data,
      };
    }

    return { ok: true as const, data };
  } catch (e: any) {
    // Make sure we never hang; return structured failure.
    return {
      ok: false as const,
      status: 0,
      data: {
        error: e?.name || "FetchError",
        message: e?.message || String(e),
        timeoutMs,
        endpoint: ENGINE_ENDPOINT,
      },
    };
  } finally {
    clearTimeout(t);
  }
}

router.post("/chat", async (req, res) => {
  try {
    const apiKey = process.env.ZHIPU_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "ZHIPU_API_KEY not configured on server",
        hint: "Add ZHIPU_API_KEY to server .env and restart the server.",
        envKeysPresent: {
          ZHIPU_API_KEY: !!process.env.ZHIPU_API_KEY,
          AR_ENGINE_KEY: !!process.env.AR_ENGINE_KEY,
        },
      });
    }

    const { messages, model, images } = req.body;

    const proxied = await proxyToZhipu({
      apiKey,
      model: model || "glm-4",
      messages,
      images,
    });

    if (!proxied.ok) {
      return res.status(proxied.status).json({
        error: "AI provider error",
        providerStatus: proxied.status,
        providerData: proxied.data,
      });
    }

    return res.json(proxied.data);
  } catch (error: any) {
    console.error("AI proxy error:", error?.message || error);
    return res.status(500).json({ error: "Failed to contact AI service" });
  }
});

router.post("/project/generate", async (req, res) => {
  try {
    const apiKey = process.env.ZHIPU_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "ZHIPU_API_KEY not configured on server",
        hint: "Add ZHIPU_API_KEY to server .env and restart the server.",
      });
    }

    const {
      prompt,
      designVibe = "google-io-dark",
      stack = "react-vite-tailwind-ts",
      maxFiles = 20,
    } = req.body || {};

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Missing/invalid prompt" });
    }

    const system = [
      "You are a senior full-stack engineer generating a complete project snapshot.",
      "Return ONLY valid JSON. No markdown. No backticks. No comments outside JSON.",
      "Schema:",
      '{ "summary": string, "files": [ { "path": string, "content": string } ] }',
      "",
      "Hard constraints:",
      "- files length MUST be <= maxFiles",
      "- Each path must be unique",
      "- content must be the exact file contents (not wrapped).",
      "",
      `Target stack: ${stack}`,
      `Design vibe: ${designVibe}`,
      "When uncertain, make reasonable defaults and still produce runnable code.",
    ].join("\n");

    const user = `User request:\n${prompt}\n\nGenerate the project files now.`;

    const proxied = await proxyToZhipu({
      apiKey,
      model: "ar-neural-v2",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      timeoutMs: 20000,
    });

    if (!proxied.ok) {
      return res.status(proxied.status || 502).json({
        error: "AI provider error",
        providerStatus: proxied.status,
        providerData: proxied.data,
        model: "ar-neural-v2",
        engineEndpoint: ENGINE_ENDPOINT,
        timeoutMs: proxied.data?.timeoutMs,
        upstreamError: proxied.data?.error,
      });
    }

    // The provider returns a chat completion payload. Try to extract text.
    const raw =
      proxied.data?.choices?.[0]?.message?.content ??
      proxied.data?.choices?.[0]?.text ??
      "";

    const text = typeof raw === "string" ? raw.trim() : "";

    // Extract JSON even if the model prepends whitespace.
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    const jsonStr =
      firstBrace >= 0 && lastBrace >= firstBrace
        ? text.slice(firstBrace, lastBrace + 1)
        : text;

    let parsed: any;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (e: any) {
      return res.status(502).json({
        error: "AI returned non-JSON output",
        rawPreview: text.slice(0, 600),
      });
    }

    if (
      !parsed ||
      typeof parsed.summary !== "string" ||
      !Array.isArray(parsed.files)
    ) {
      return res.status(502).json({
        error: "AI returned JSON but schema is invalid",
      });
    }

    // Basic file sanitization
    const files = parsed.files
      .filter(
        (f: any) =>
          f &&
          typeof f.path === "string" &&
          f.path.trim().length > 0 &&
          typeof f.content === "string",
      )
      .slice(0, Number(maxFiles) || 20);

    return res.json({ summary: parsed.summary, files });
  } catch (error: any) {
    console.error("AI project generation error:", error?.message || error);
    return res.status(500).json({ error: "Failed to generate project" });
  }
});

export default router;

