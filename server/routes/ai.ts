import express from "express";

const router = express.Router();

// AR Neural Engine – Joyi AI Processing Pipeline
const ENGINE_ENDPOINT = process.env.AR_ENGINE_ENDPOINT || "https://open.bigmodel.cn/api/paas/v4/chat/completions";

router.post("/chat", async (req, res) => {
  try {
    const apiKey = process.env.AR_ENGINE_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "AR Engine key not configured on server" });
    }

    const { messages, model, images } = req.body;

    // Model resolution – maps client-facing names to engine identifiers
    const modelMap: Record<string, string> = {
      'ar-neural-v2': 'glm-4',
      'ar-neural-v2-vision': 'glm-4v',
    };

    const body: any = {
      model: modelMap[model] || model || "glm-4",
      messages,
    };

    if (images) {
      body.images = images;
    }

    const response = await fetch(ENGINE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error("AR Engine proxy error:", error.message);
    res.status(500).json({ error: "Failed to contact AI service" });
  }
});

export default router;
