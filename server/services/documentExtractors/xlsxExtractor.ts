import * as XLSX from "xlsx";

export async function extractTextFromXlsx(buffer: Buffer) {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const out: string[] = [];

  workbook.SheetNames.forEach((name) => {
    const sheet = workbook.Sheets[name];
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any;
    out.push(`\n### Sheet: ${name}\n`);
    for (const row of rows) {
      out.push(row.map((cell) => (cell === null || cell === undefined ? "" : String(cell))).join("\t"));
    }
  });

  return out.join("\n");
}

