// pdf-parse ships as ESM with `PDFParse` class. This extractor is best-effort.
import { PDFParse } from "pdf-parse";

export async function extractTextFromPdf(buffer: Buffer) {
  // The ESM build does not expose a simple default function in this TS setup.
  // We use the class API via `getText()`.
  const parser = new PDFParse({ data: buffer } as any);
  const result = await (parser as any).getText?.({});
  return result?.text || "";
}






