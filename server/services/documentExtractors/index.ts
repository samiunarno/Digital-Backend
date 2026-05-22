import { extractTextFromBuffer, sanitizeExtractedText } from "./textExtractor.js";
import { extractTextFromPdf } from "./pdfExtractor.js";
import { extractTextFromDocx } from "./docxExtractor.js";
import { extractTextFromXlsx } from "./xlsxExtractor.js";

export type ExtractedDocument = {
  text: string;
  mimeType: string;
  filename: string;
};

export async function extractDocumentText(params: {
  buffer: Buffer;
  filename: string;
  mimeType: string;
}): Promise<ExtractedDocument> {
  const { buffer, filename, mimeType } = params;

  const lower = filename.toLowerCase();

  let text = "";
  // MIME-based + filename-extension fallback
  if (mimeType === "application/pdf" || lower.endsWith(".pdf")) {
    text = await extractTextFromPdf(buffer);
  } else if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    lower.endsWith(".docx")
  ) {
    text = await extractTextFromDocx(buffer);
  } else if (
    mimeType.includes("spreadsheet") ||
    lower.endsWith(".xlsx") ||
    lower.endsWith(".xls")
  ) {
    text = await extractTextFromXlsx(buffer);
  } else {
    text = await extractTextFromBuffer(buffer);
  }

  return {
    text: sanitizeExtractedText(text),
    mimeType,
    filename,
  };
}

