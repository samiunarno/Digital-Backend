type StoreDoc = {
  id: string;
  sessionId: string;
  filename: string;
  chunkIndex: number;
  text: string;
  // Lightweight scoring fields
  tokens: string[];
};

function tokenize(s: string) {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 5000);
}

function score(queryTokens: string[], docTokens: string[]) {
  if (!queryTokens.length || !docTokens.length) return 0;
  const q = new Set(queryTokens);
  let hits = 0;
  for (const t of q) {
    if (docTokens.includes(t)) hits++;
  }
  return hits / Math.max(1, q.size);
}

export class SimpleVectorStore {
  private docs: StoreDoc[] = [];

  upsertSessionChunks(params: {
    sessionId: string;
    filename: string;
    chunks: string[];
  }) {
    const { sessionId, filename, chunks } = params;
    chunks.forEach((chunk, chunkIndex) => {
      const id = `${sessionId}:${filename}:${chunkIndex}`;
      this.docs.push({
        id,
        sessionId,
        filename,
        chunkIndex,
        text: chunk,
        tokens: tokenize(chunk),
      });
    });
  }

  search(params: { sessionId: string; query: string; topK?: number }) {
    const { sessionId, query, topK = 5 } = params;
    const queryTokens = tokenize(query);

    const candidates = this.docs.filter((d) => d.sessionId === sessionId);
    const scored = candidates
      .map((d) => ({
        doc: d,
        score: score(queryTokens, d.tokens),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map((s) => s.doc);

    // Fallback: if nothing scored, return first chunks
    if (scored.length === 0) {
      return candidates.slice(0, topK);
    }

    return scored;
  }
}

export const vectorStore = new SimpleVectorStore();

