export function chunkText(params: { text: string; chunkSize?: number; overlap?: number }) {
  const { text, chunkSize = 1800, overlap = 250 } = params;
  const normalized = text || "";

  if (normalized.length <= chunkSize) {
    return [normalized];
  }

  const chunks: string[] = [];
  let start = 0;
  while (start < normalized.length) {
    const end = Math.min(normalized.length, start + chunkSize);
    const chunk = normalized.slice(start, end).trim();
    if (chunk) chunks.push(chunk);
    if (end === normalized.length) break;
    start = Math.max(0, end - overlap);
  }

  return chunks;
}

