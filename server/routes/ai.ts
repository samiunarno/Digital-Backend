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

    const body: any = {
      model: modelMap[model] || model || "glm-4",
      messages,
    };

    // If the model supports vision and images are provided, forward them.
    // Frontend currently sends: { format: 'png', data: base64 }
    if (images) body.images = images;

    const response = await fetch(ENGINE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Normalize non-2xx errors into a consistent shape
    if (!response.ok) {
      return res.status(response.status).json({
        error: "AI provider error",
        providerStatus: response.status,
        providerData: data,
      });
    }

    return res.json(data);
  } catch (error: any) {
    console.error("AI proxy error:", error?.message || error);
    return res.status(500).json({ error: "Failed to contact AI service" });
  }
});

export default router;

