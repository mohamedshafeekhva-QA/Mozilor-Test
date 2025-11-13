import ExcelJS from 'exceljs';
import path from 'path';

export async function getInvalidLoginData(fileName, sheetName) {
    const filePath = path.resolve(__dirname, '../test-data/', fileName);
    const workBook = new ExcelJS.Workbook();
    await workBook.xlsx.readFile(filePath);
    const worksheet = workBook.getWorksheet(sheetName);

    const invalidCredential = []

    for(let i = 2;i<= worksheet.rowCount; i++){

        const row = worksheet.getRow(i);
        invalidCredential.push({
          email: String(row.getCell(1).value || ''),
          password: String(row.getCell(2).value || ''),
          errorMessage: String(row.getCell(3).value)
      });

    }
    return invalidCredential
}