import fs from "fs";

export async function extractTextFromBuffer(buffer: Buffer, encoding: BufferEncoding = "utf8") {
  // Best-effort: try decode as utf-8; if it looks binary, fall back.
  const text = buffer.toString(encoding);
  return text;
}

export function sanitizeExtractedText(text: string) {
  // Normalize whitespace but keep line breaks.
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, "  ")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/\n{3,}/g, "\n\n");
}

export async function readFileAsBuffer(path: string) {
  return fs.promises.readFile(path);
}

