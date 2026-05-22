import express from "express";
import { chunkText } from "../services/chunker.js";
import { extractDocumentText } from "../services/documentExtractors/index.js";
import { getRagContext, buildRagSystemPrompt } from "../services/ragAnswer.js";
import { vectorStore } from "../services/simpleVectorStore.js";
import { callAiProxy } from "../services/aiChat.js";
import { createSession } from "../services/sessionStore.js";

const router = express.Router();

const baseInstruction = `You are Joyi. You are not a corporate assistant. Answer like a human.
Use the provided excerpts from the uploaded documents.
If the answer is not in the excerpts, say what is missing and ask a targeted follow-up.
Do NOT hallucinate.
`;

function requireSessionAndQuestion(req: any) {
  const { sessionId, question } = req.body as { sessionId?: string; question?: string };
  if (!sessionId) {
    return { ok: false as const, res: { status: 400, body: { error: "Missing sessionId" } } };
  }
  if (!question) {
    return { ok: false as const, res: { status: 400, body: { error: "Missing question" } } };
  }
  return { ok: true as const, sessionId, question };
}

// JSON upload contract (frontend will be updated next):
// { files: [{ filename, mimeType, base64 }] }
router.post("/upload", async (req, res) => {
  try {
    const { files } = req.body as {
      files?: Array<{ filename: string; mimeType: string; base64: string }>;
    };

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: "No files provided" });
    }

    const sessionId = createSession({ filenames: files.map((f) => f.filename) });

    // Extract + chunk + index
    for (const f of files) {
      const buffer = Buffer.from(f.base64, "base64");
      const extracted = await extractDocumentText({ buffer, filename: f.filename, mimeType: f.mimeType });

      const chunks = chunkText({ text: extracted.text, chunkSize: 1800, overlap: 250 });
      if (chunks.length > 0) {
        vectorStore.upsertSessionChunks({ sessionId, filename: f.filename, chunks });
      }
    }

    return res.json({ sessionId, stored: files.length });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e?.message || "Upload failed" });
  }
});

router.post("/chat", async (req, res) => {
  try {
    const parsed = requireSessionAndQuestion(req);
    if (!parsed.ok) {
      return res.status(parsed.res.status).json(parsed.res.body);
    }

    const ragContext = await getRagContext({
      sessionId: parsed.sessionId,
      question: parsed.question,
      topK: 6,
    });

    const system = buildRagSystemPrompt({ baseInstruction });

    const messages = [
      { role: "system", content: system },
      {
        role: "user",
        content: `EXCERPTS FROM DOCUMENTS (use these as your source):\n${ragContext}`,
      },
      { role: "user", content: parsed.question },
    ];

    const model = "ar-neural-v2";
    const { reply } = await callAiProxy({
      model,
      messages,
    });

    return res.json({ reply });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e?.message || "Chat failed" });
  }
});

export default router;

