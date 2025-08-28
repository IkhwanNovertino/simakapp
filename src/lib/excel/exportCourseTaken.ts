import ExcelJS from 'exceljs';
import { prisma } from '../prisma';

export async function exportCourseTaken({ data }: { data: any }) {
  
  const workbook = new ExcelJS.Workbook();
  // Iterasi data 
  for (const dataCourses of data?.dataCoursesByMajor) {
    const worksheet = workbook.addWorksheet(`Mata Kuliah ${dataCourses?.major?.stringCode}`);
  
    // Tinggi Row masing masing worksheet
    worksheet.properties.defaultRowHeight = 25;
  
    const headerTable = [
      'No',
      'KODE MK',
      "NAMA MATA KULIAH",
      "SKS",
      "SEMESTER",
      "JUMLAH MAHASISWA",
    ];
  
    // <!-------------------Menambahkan DATA  MATKUL SI---------------------------->
  
    // === [1] Baris Judul Besar (Merged)
    worksheet.mergeCells("A2:F2")
    const titleCell = worksheet.getCell('A2')
    titleCell.value = `REKAPITULASI MATA KULIAH PROGRAM STUDI ${dataCourses?.major?.name.toUpperCase()}`
    titleCell.font = { size: 14, bold: true }
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
    
    worksheet.mergeCells("A3:F3")
    const subTitleCell = worksheet.getCell('A3')
    subTitleCell.value = `${data?.dataPeriod?.name}`
    subTitleCell.font = { size: 12, bold: true }
    subTitleCell.alignment = { vertical: 'middle', horizontal: 'center' }
    
    worksheet.addRow([])
    const headerSI = worksheet.addRow(headerTable);
  
    headerSI.height = 80;
    headerSI.eachCell((cell) => {
      cell.font = { size: 12, bold: true }
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFDDDDDD' },
      }
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      }
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    });
    
    // Ukuran lebar column
    const colWidths = [4, 15, 60, 8, 12, 20];
    colWidths.forEach((w, i) => {
      worksheet.getColumn(i + 1).width = w
    });
    
    dataCourses?.courses.forEach((items: any, i: number) => {
      const rowdata: any = [
        i + 1,
        items?.course?.code,
        items?.course?.name,
        items?.course?.sks,
        items?.semester,
        items?.studentCount,
      ];

      const addRow = worksheet.addRow(rowdata);
      addRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        },
        cell.font = {size: 12},
        cell.alignment = { vertical: 'middle' }
      });
      addRow.height = 30;
    })
  }
  
  
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}