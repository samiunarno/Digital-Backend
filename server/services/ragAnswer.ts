import { vectorStore } from "./simpleVectorStore.js";

function formatContext(chunks: Array<{ filename: string; chunkIndex: number; text: string }>) {
  return chunks
    .map(
      (c) =>
        `[[SOURCE: ${c.filename} :: chunk ${c.chunkIndex}]]\n${c.text}`,
    )
    .join("\n\n");
}

export function buildRagSystemPrompt(params: { baseInstruction: string }) {
  return `${params.baseInstruction}\n\nYou have access to retrieved document excerpts.\n\nRULES:\n- Answer the user question using ONLY the provided excerpts when possible.\n- If the answer is not contained in the excerpts, say what is missing and ask a targeted follow-up question.\n- Quote short supporting snippets from the excerpts when relevant.\n`;
}

export async function getRagContext(params: {
  sessionId: string;
  question: string;
  topK?: number;
}) {
  const topDocs = vectorStore.search({
    sessionId: params.sessionId,
    query: params.question,
    topK: params.topK ?? 5,
  });

  return formatContext(
    topDocs.map((d) => ({ filename: d.filename, chunkIndex: d.chunkIndex, text: d.text })),
  );
}

