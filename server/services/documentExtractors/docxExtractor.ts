import mammoth from "mammoth";

export async function extractTextFromDocx(buffer: Buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return result.value || "";
}

