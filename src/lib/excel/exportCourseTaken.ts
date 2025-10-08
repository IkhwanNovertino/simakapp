import ExcelJS from 'exceljs';

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
    // worksheet.mergeCells("A2:F2")
    // const titleCell = worksheet.getCell('A2')
    // titleCell.value = `REKAPITULASI MATA KULIAH PROGRAM STUDI ${dataCourses?.major?.name.toUpperCase()}`
    // titleCell.font = { size: 14, bold: true }
    // titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
    
    // worksheet.mergeCells("A3:F3")
    // const subTitleCell = worksheet.getCell('A3')
    // subTitleCell.value = `${data?.dataPeriod?.name}`
    // subTitleCell.font = { size: 12, bold: true }
    // subTitleCell.alignment = { vertical: 'middle', horizontal: 'center' }
    
    // worksheet.addRow([])
    // const headerSI = worksheet.addRow(headerTable);
  
    // headerSI.height = 80;
    // headerSI.eachCell((cell) => {
    //   cell.font = { size: 12, bold: true }
    //   cell.fill = {
    //     type: 'pattern',
    //     pattern: 'solid',
    //     fgColor: { argb: 'FFDDDDDD' },
    //   }
    //   cell.border = {
    //     top: { style: 'thin' },
    //     left: { style: 'thin' },
    //     bottom: { style: 'thin' },
    //     right: { style: 'thin' },
    //   }
    //   cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    // });
    
    // Ukuran lebar column
    // const colWidths = [4, 15, 60, 8, 12, 20];
    // colWidths.forEach((w, i) => {
    //   worksheet.getColumn(i + 1).width = w
    // });
    
    // dataCourses?.courses.forEach((items: any, i: number) => {
    //   const rowdata: any = [
    //     i + 1,
    //     items?.course?.code,
    //     items?.course?.name,
    //     items?.course?.sks,
    //     items?.semester,
    //     items?.studentCount,
    //   ];

    //   const addRow = worksheet.addRow(rowdata)
    //   addRow.height = 30;
    //   addRow.eachCell((cell) => {
    //   cell.border = {
    //     top: { style: 'thin' },
    //     left: { style: 'thin' },
    //     bottom: { style: 'thin' },
    //     right: { style: 'thin' },
    //   },
    //   cell.font = {size: 12},
    //   cell.alignment = { vertical: 'middle' }
    //   })
    // })
    
  // Baris 2
  worksheet.mergeCells("A2:A3");
  worksheet.mergeCells("B2:B3");
  worksheet.mergeCells("C2:C3");
  worksheet.mergeCells("D2:H2"); // Mahasiswa (jumlah)
  worksheet.mergeCells("I2:P2"); // Angkatan (jumlah)

  worksheet.getCell("A2").value = "No.";
  worksheet.getCell("B2").value = "Kode Mata Kuliah";
  worksheet.getCell("C2").value = "Nama Mata Kuliah";
  worksheet.getCell("D2").value = "Mahasiswa (jumlah)";
  worksheet.getCell("I2").value = "Angkatan (jumlah)";

  // Baris 3
  const headerRow3 = [
    "BJB",
    "BJM",
    "ONLINE",
    "REG. SORE",
    "Total",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
    "2025",
    "Total",
  ];
  worksheet.spliceRows(3, 1, ["", "", "", ...headerRow3]);

  // Styling header
  worksheet.getRow(2).height = 25;
  worksheet.getRow(3).height = 20;
  [2, 3].forEach((r) => {
    worksheet.getRow(r).font = { bold: true, size: 11 };
    worksheet.getRow(r).alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  });

  // Border header
  for (let r = 2; r <= 3; r++) {
    for (let c = 1; c <= 16; c++) {
      worksheet.getCell(r, c).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }
  }

  // ================================
  // 🔹 Data
  // ================================
  const data = [
    {
      no: 1,
      kode: "SI-001",
      nama: "Pemrograman Berorientasi Objek",
      mahasiswa: [20, 5, 0, 7, 32],
      angkatan: [5, 3, 3, 1, 20, 0, 0, 32],
    },
    {
      no: 2,
      kode: "TI-001",
      nama: "Proyek Perangkat Lunak",
      mahasiswa: [25, 3, 1, 10, 39],
      angkatan: [1, 2, 1, 35, 0, 0, 0, 39],
    },
  ];

  let startRow = 4;
  data.forEach((d, i) => {
    const row = worksheet.getRow(startRow + i);
    row.values = [
      d.no,
      d.kode,
      d.nama,
      ...d.mahasiswa,
      ...d.angkatan,
    ];

    row.alignment = { vertical: "middle", horizontal: "center" };
    row.height = 18;
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  // ================================
  // 🔹 Lebar Kolom
  // ================================
  const colWidths = [4, 14, 30, 6, 6, 8, 10, 8, 6, 6, 6, 6, 6, 6, 6, 8];
  colWidths.forEach((w, i) => (worksheet.getColumn(i + 1).width = w));
  }
  
  
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}