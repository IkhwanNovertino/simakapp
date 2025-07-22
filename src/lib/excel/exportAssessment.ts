import { prisma } from "../prisma";
import ExcelJS from "exceljs";

export async function exportAssessment(academicClassId: string) {
  const academicClass = await prisma.academicClass.findUnique({
    where: { id: academicClassId },
    select: {
      course: {
        include: {
          assessment: {
            include: {
              assessmentDetail: {
                include: {
                  grade: true,
                },
                orderBy: {
                  seq_number: 'desc',
                }
              },
            },
          },
          major: {
            select: {
              id: true,
              name: true,
            },
          }
        },
      },
      academicClassDetail: true,
      lecturer: {
        select: {
          id: true,
          name: true,
        },
      },
      name: true,
    },
  });

  const krsDetails = await prisma.krsDetail.findMany({
    where: {
      courseId: academicClass?.course?.id,
      krs: {
        student: {
          id: {
            in: academicClass?.academicClassDetail.map((detail: any) => detail.studentId) || [],
          }
        },
        reregister: {
          periodId: academicClass?.periodId,
        },
      },
    },
    include: {
      krs: {
        include: {
          student: {
            select: { id: true, name: true, nim: true }
          },
        }
      },
      krsGrade: {
        include: {
          assessmentDetail: {
            include: {
              grade: true,
            },
          },
        },
        orderBy: {
          assessmentDetail: { seq_number: 'desc' }
        },
      },
    },
  });

  const assessmentDetails = academicClass?.course.assessment?.assessmentDetail || [];

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`${academicClass?.course.code}-${academicClass?.course?.name}`);
  worksheet.properties.defaultRowHeight = 25;
  // SET HEADERS
  const headers = [
    'No',
    'NIM',
    "Nama Mahasiswa",
    ...assessmentDetails.map((detail: any) => detail.grade?.name || "Unknown"),
    "Nilai Akhir",
    "Abs",
    "uids",
  ]

  // === [1] Baris Judul Besar (Merged)
  worksheet.mergeCells("A1:K1")
  const titleCell = worksheet.getCell('A1')
  titleCell.value = 'DAFTAR NILAI MATA KULIAH'
  titleCell.font = { size: 14, bold: true }
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
  
  // === [2] Baris Sub Judul Besar (Merged)
  worksheet.mergeCells("A2:K2")
  const subTitleCell = worksheet.getCell('A2')
  subTitleCell.value = "PASTIKAN CELL TIDAK DIUBAH, AGAR IMPORT BERJALAN DENGAN BAIK."
  subTitleCell.font = { size: 11, bold: true }
  subTitleCell.alignment = { vertical: 'middle', horizontal: 'center' }
  
  // === [3] Baris Sub Judul 1 Besar (Merged)
  // worksheet.mergeCells('A3', String.fromCharCode(67 + assessmentDetails.length + 2) + '1')
  worksheet.mergeCells("A3:K3")
  const subTitle1Cell = worksheet.getCell('A3')
  subTitle1Cell.value = "DISARANKAN UNTUK MENYIMPAN DI FORMAT .xlsx"
  subTitle1Cell.font = { size: 11, bold: true }
  subTitle1Cell.alignment = { vertical: 'middle', horizontal: 'center' }
  subTitle1Cell.border = {
    bottom: { style: 'medium' },
  }
  
  // === [4] Baris Matkul
  worksheet.mergeCells("A5:B5")
  const matkul = worksheet.getCell('A5')
  matkul.value = "Mata Kuliah"
  matkul.font = { size: 11, }
  matkul.alignment = { vertical: 'middle' }
  
  const matkulField = worksheet.getCell('C5')
  matkulField.value = `: ${academicClass?.course?.name.toUpperCase()}`
  matkulField.font = { size: 11, }
  matkulField.alignment = { vertical: 'middle'}
  
  // === [4] Baris Dosen
  worksheet.mergeCells("D5:E5")
  const lecturer = worksheet.getCell('D5')
  lecturer.value = "Dosen Pengampu"
  lecturer.font = { size: 11, }
  lecturer.alignment = { vertical: 'middle' }
  
  const lecturerField = worksheet.getCell('F5')
  lecturerField.value = `: ${academicClass?.lecturer?.name.toUpperCase()}`
  lecturerField.font = { size: 11, }
  lecturerField.alignment = { vertical: 'middle'}
  
  // === [4] Baris Prodi
  worksheet.mergeCells("A6:B6")
  const prodi = worksheet.getCell('A6')
  prodi.value = "Prodi"
  prodi.font = { size: 11, }
  prodi.alignment = { vertical: 'middle' }
  
  const prodiField = worksheet.getCell('C6')
  prodiField.value = `: ${academicClass?.course?.major?.name.toUpperCase()}`
  prodiField.font = { size: 11, }
  prodiField.alignment = { vertical: 'middle'}
  
  // === [4] Baris kelas
  worksheet.mergeCells("D6:E6")
  const academicClassName = worksheet.getCell('D6')
  academicClassName.value = "Kelas"
  academicClassName.font = { size: 11, }
  academicClassName.alignment = { vertical: 'middle' }
  
  const academicClassField = worksheet.getCell('F6')
  academicClassField.value = `: ${academicClass?.name.toUpperCase()}`
  academicClassField.font = { size: 11, }
  academicClassField.alignment = { vertical: 'middle' }
  
  // === [4] Baris semester
  worksheet.mergeCells("A7:B7")
  const semester = worksheet.getCell('A7')
  semester.value = "Semester"
  semester.font = { size: 11, }
  semester.alignment = { vertical: 'middle' }
  
  const semesterField = worksheet.getCell('C7')
  semesterField.value = `: -`
  semesterField.font = { size: 11, }
  semesterField.alignment = { vertical: 'middle'}
  
  // === [4] Baris schedule
  worksheet.mergeCells("D7:E7")
  const schedule = worksheet.getCell('D7')
  schedule.value = "Hari, Jam"
  schedule.font = { size: 11, }
  schedule.alignment = { vertical: 'middle' }
  
  const scheduleField = worksheet.getCell('F7')
  scheduleField.value = `: -`
  scheduleField.font = { size: 11, }
  scheduleField.alignment = { vertical: 'middle' }
  
  // === [4] Baris semester
  worksheet.mergeCells("A8:B8")
  const period = worksheet.getCell('A8')
  period.value = "Thn. Akad"
  period.font = { size: 11, }
  period.alignment = { vertical: 'middle' }
  
  const periodField = worksheet.getCell('C8')
  periodField.value = `: -`
  periodField.font = { size: 11, }
  periodField.alignment = { vertical: 'middle'}
  
  // === [4] Baris schedule
  worksheet.mergeCells("D8:E8")
  const date = worksheet.getCell('D8')
  date.value = "Tanggal"
  date.font = { size: 11, }
  date.alignment = { vertical: 'middle' }
  
  const dateField = worksheet.getCell('F8')
  dateField.value = `: -`
  dateField.font = { size: 11, }
  dateField.alignment = { vertical: 'middle'}

  worksheet.addRow([])
  const header = worksheet.addRow(headers)
  header.height = 40;


  header.eachCell((cell) => {
    cell.font = { bold: true }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDDDDDD' }, // abu-abu muda
    }
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    }
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
  })

  krsDetails.forEach((detail: any, index: any) => {
    const row: any = [
      index + 1,
      detail.krs.student.nim,
      detail.krs.student.name,
      ...assessmentDetails.map((assessmentDetail: any) => {
        const grade = detail.krsGrade.find((g: any) => g.assessmentDetailId === assessmentDetail.id);
        return grade ? grade.score : 0;
      }),
      Number(detail.finalScore),
      detail.gradeLetter ?? "",
      detail.id,
    ];

    const dataRow = worksheet.addRow(row)
    dataRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      }
      cell.alignment = { vertical: 'middle', wrapText: true }
    });
    const uidsColumnsIndex = headers.indexOf('uids') + 1;

    worksheet.eachRow((row, rowNumber) => {
      const cell = row.getCell(uidsColumnsIndex);
      if (rowNumber > 9) { // Skip header row
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '000000' }, // abu-abu muda
        };
        
      }
    });
  });


   // === [4] Lebar Kolom
  const colWidths = [4, 15, 45, ...assessmentDetails.map(() => 10), 10, 8, 5];
  colWidths.forEach((w, i) => {
    worksheet.getColumn(i + 1).width = w
  })

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}