import fs from "node:fs";
import XLSX from "xlsx";

export const getArrByExcel = (excelFilePath) => {
  const fileBuffer = fs.readFileSync(excelFilePath);
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet);
};
