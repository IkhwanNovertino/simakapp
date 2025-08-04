import * as xlsx from "xlsx";

export async function importAssessment(buffer: Buffer) {
  const workbook = xlsx.read(buffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: ''});
  const rowsData: Record<string, any> = rows.slice(8); // Skip header row

  return rowsData;
}