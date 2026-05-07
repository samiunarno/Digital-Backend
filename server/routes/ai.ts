import express from "express";

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const apiKey = process.env.ZHIPU_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "ZHIPU_API_KEY not configured on server" });
    }

    const { messages, model, images } = req.body;

    const body: any = {
      model: model || "glm-4",
      messages,
    };

    if (images) {
      body.images = images;
    }

    const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
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
    console.error("Zhipu API proxy error:", error.message);
    res.status(500).json({ error: "Failed to contact AI service" });
  }
});

export default router;
