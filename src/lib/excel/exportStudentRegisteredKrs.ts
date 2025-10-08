import ExcelJS from 'exceljs';

export async function exportStudentRegisteredKrs({ data }: { data: any }) {
  
  const workbook = new ExcelJS.Workbook();
  // Iterasi data 
  for (const dataStudent of data?.dataStudentByMajor) {
    const worksheet = workbook.addWorksheet(`Mahasiswa ${dataStudent?.major?.stringCode}`);
  
    // Tinggi Row masing masing worksheet
    worksheet.properties.defaultRowHeight = 25;
  
    const headerTable = [
      'No',
      'NIM',
      'Nama Mahasiswa',
      'Prodi',
      'Dosen Penasehat/Wali Akademik',
      'Semester',
      'IP Semester',
      'Jumlah SKS',
      'Status KRS',
    ];
  
    // <!-------------------Menambahkan DATA MAHASISWA SI---------------------------->
  
    // === [1] Baris Judul Besar (Merged)
    worksheet.mergeCells("A2:I2")
    const titleCell = worksheet.getCell('A2')
    titleCell.value = `REKAP MAHASISWA SUDAH KRS `
    titleCell.font = { size: 14, bold: true }
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
    
    worksheet.mergeCells("A3:I3")
    const subTitleCellA3 = worksheet.getCell('A3')
    subTitleCellA3.value = `PROGRAM STUDI ${dataStudent?.major?.name.toUpperCase()}`
    subTitleCellA3.font = { size: 12, bold: true }
    subTitleCellA3.alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells("A4:I4")
    const subTitleCellA4 = worksheet.getCell('A4')
    subTitleCellA4.value = `${data?.dataPeriod?.name}`
    subTitleCellA4.font = { size: 12, bold: true }
    subTitleCellA4.alignment = { vertical: 'middle', horizontal: 'center' }
    
    worksheet.addRow([])
    const headerSI = worksheet.addRow(headerTable);
  
    headerSI.height = 30;
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
    const colWidths = [4, 14, 35, 6, 35, 10, 12, 12, 12];
    colWidths.forEach((w, i) => {
      worksheet.getColumn(i + 1).width = w
    });
    
    dataStudent?.students.forEach((items: any, i: number) => {
      const rowdata: any = [
        i + 1,
        items?.student?.nim,
        items?.student?.name,
        items?.student?.major?.stringCode,
        items?.lecturer?.name,
        items?.reregisterDetail?.semester,
        items?.ips,
        items?.maxSks,
        items?.isStatusForm === "APPROVED" ? "ACC" : "Belum ACC"
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