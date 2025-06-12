import { role } from "@/lib/data";
import { courseType } from "@/lib/setting";
import { DegreeStatus, Gender, Location, PrismaClient, Religion, RoleType, SemesterType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Permission
  const permissionData = [
    { pathname: "periods", name: "period", nama: "periode" },
    { pathname: "permissions", name: "permission", nama: "hak akses" },
    { pathname: "roles", name: "role", nama: "role" },
    { pathname: "users", name: "user", nama: "pengguna" },
    { pathname: "lecturers", name: "lecturer", nama: "dosen" },
    { pathname: "operators", name: "operator", nama: "operator" },
    { pathname: "students", name: "student", nama: "mahasiswa" },
    { pathname: "majors", name: "major", nama: "program studi" },
    { pathname: "reregistrations", name: "reregistration", nama: "herregistrasi" },
    { pathname: "curriculums", name: "curruculum", nama: "kurikulum" },
    { pathname: "courses", name: "course", nama: "mata kuliah" },
    { pathname: "rooms", name: "room", nama: "ruangan" },
    { pathname: "krs", name: "krs", nama: "krs" },
    { pathname: "schedules", name: "schedule", nama: "jadwal" },
    { pathname: "classes", name: "class", nama: "kelas" },
    { pathname: "khs", name: "khs", nama: "khs" },
    { pathname: "attendances", name: "attendance", nama: "presensi" },
    { pathname: "transkip", name: "transkip", nama: "transkip" },
    { pathname: "events", name: "event", nama: "event" },
    { pathname: "announcements", name: "announcements", nama: "pengumuman" },
  ];
  const action = ["view", "create", "edit", "delete"];
  for (const resource of permissionData) {
    for (const act of action) {
      await prisma.permission.create({
        data: {
          name: `${act}:${resource.pathname}`,
          description: `${act}:${resource.nama}`
        }
      })
    }
  }

  // role
  const roleName = ["admin", "dosen", "perwalian akademik", "finance", "akademik", "mahasiswa"]

  for (const element of roleName) {
    await prisma.role.create({
      data: {
        name: element,
        description: element,
        roleType: (element === "dosen" && "LECTURER") || (element === "mahasiswa" && "STUDENT") ||
          (element === "perwalian akademik" && "ADVISOR") || (element === "admin" && "OPERATOR") ||
          (element === "finance" && "OPERATOR") || (element === "akademik" && "OPERATOR")as RoleType,
      }
    })
  }

  const permissions = await prisma.permission.count();

  // rolePermission
  for (let i = 1; i <= permissions; i++) {
    await prisma.rolePermission.create({
      data: {
        roleId: 1,
        permissionId: i,
      }
    })
  };

  // user
  const hashPassword = bcrypt.hashSync("admin", 10);
  await prisma.operator.create({
    data: {
      name: "operator1",
      department: "",
      user: {
        create: {
          email: "admin1@stmik.com",
          password: hashPassword,
          roleId: 1,
          isStatus: true,
        }
      }
    }
  })
  await prisma.operator.create({
    data: {
      name: "finance1",
      department: "Keuangan",
      user: {
        create: {
          email: "finance1@stmik.com",
          password: bcrypt.hashSync("finance", 10),
          roleId: 4,
          isStatus: true,
        }
      }
    }
  })

  // prodi/major
  await prisma.major.createMany({
    data: [
      {
        name: "Sistem Informasi",
        numberCode: 1,
        stringCode: "SI",
      },
      {
        name: "Teknik Informatika",
        numberCode: 2,
        stringCode: "TI",
      },
    ]
  })
  // GradeComponent
  await prisma.gradeComponent.createMany({
    data: [
      { name: "Absensi dan Aktivitas" },
      { name: "Tugas Kelompok" },
      { name: "Tugas Mandiri" },
      { name: "Ujian Tengah Semester" },
      { name: "Ujian Akhir Semester" },
      { name: "Praktikum" },
      { name: "Report/ Laporan" },
      { name: "Presentasi Laporan" },
      { name: "Kejelasan Permasalahan Penelitian" },
      { name: "Tinjauan Pustaka dan Landasan Teori" },
      { name: "Kelengkapan Data" },
      { name: "Instrumen Penelitian" },
      { name: "Metode Pengujian" },
      { name: "Demonstrasi" },
    ]
  })

  await prisma.assessment.create({
    data: {
        name: "REGULER",
        assessmentDetail: {
          create: [
            {
              percentage: 10,
              grade: {
                connect: {
                  name: "Absensi dan Aktivitas"
                }
              },
            },
            {
              percentage: 20,
              grade: {
                connect: {
                  name: "Tugas Mandiri"
                }
              },
            },
            {
              percentage: 10,
              grade: {
                connect: {
                  name: "Tugas Kelompok"
                }
              },
            },
            {
              percentage: 25,
              grade: {
                connect: {
                  name: "Ujian Tengah Semester"
                }
              },
            },
            {
              percentage: 35,
              grade: {
                connect: {
                  name: "Ujian Akhir Semester"
                }
              },
            },
          ]
        },
      },
  })
  await prisma.assessment.create({
    data: {
        name: "PRAKTIKUM",
        assessmentDetail: {
          create: [
            {
              percentage: 60,
              grade: {
                connect: {
                  name: "Praktikum"
                }
              },
            },
            {
              percentage: 20,
              grade: {
                connect: {
                  name: "Report/ Laporan"
                }
              },
            },
            {
              percentage: 20,
              grade: {
                connect: {
                  name: "Presentasi Laporan"
                }
              },
            },
          ]
        },
      },
  })
  await prisma.assessment.create({
    data: {
        name: "SEMINAR PROPOSAL",
        assessmentDetail: {
          create: [
            {
              percentage: 20,
              grade: {
                connect: {
                  name: "Kejelasan Permasalahan Penelitian"
                }
              },
            },
            {
              percentage: 15,
              grade: {
                connect: {
                  name: "Tinjauan Pustaka dan Landasan Teori"
                }
              },
            },
            {
              percentage: 15,
              grade: {
                connect: {
                  name: "Kelengkapan Data"
                }
              },
            },
            {
              percentage: 15,
              grade: {
                connect: {
                  name: "Instrumen Penelitian"
                }
              },
            },
            {
              percentage: 15,
              grade: {
                connect: {
                  name: "Metode Pengujian"
                }
              },
            },
            {
              percentage: 20,
              grade: {
                connect: {
                  name: "Presentasi Laporan"
                }
              },
            },
          ]
        },
      },
  })
  await prisma.assessment.create({
    data: {
        name: "TUGAS AKHIR",
        assessmentDetail: {
          create: [
            {
              percentage: 30,
              grade: {
                connect: {
                  name: "Report/ Laporan"
                }
              },
            },
            {
              percentage: 30,
              grade: {
                connect: {
                  name: "Presentasi Laporan"
                }
              },
            },
            {
              percentage: 40,
              grade: {
                connect: {
                  name: "Demonstrasi"
                }
              },
            },
          ]
        },
      },
  })

  

  // course
  const courseData = [
    // SI
    { code: "SB-ISI-007", name: "Pengantar Teknologi Informasi", sks: 3, prodi: "SI", courseType: "WAJIB",  isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ISI-028", name: "Pendidikan Kewarganegaraan dan Antikorupsi", sks: 3, prodi: "SI", courseType: "WAJIB",  isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ISI-030", name: "Bahasa Inggris", sks: 3, prodi: "SI", courseType: "WAJIB",  isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ISI-001", name: "Konsep Sistem Informasi", sks: 2, prodi: "SI", courseType: "WAJIB",  isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ISI-014", name: "Dasar Pemrograman", sks: 3, prodi: "SI", courseType: "WAJIB",  isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ISI-029", name: "Bahasa Indonesia", sks: 3, prodi: "SI", courseType: "WAJIB",  isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ISO-007", name: "Human Resource Management", sks: 3, prodi: "SI", courseType: "PILIHAN", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ISO-004", name: "Computational Thinking", sks: 3, prodi: "SI", courseType: "PILIHAN", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ISPB1-002", name: "Pengantar Bisnis (PBMB)", sks: 3, prodi: "SI", courseType: "PILIHAN", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ISPS1-004", name: "Analisis & Desain Proses Bisnis (Pemodelan Bisnis) (PSI)", sks: 3, prodi: "SI", courseType: "PILIHAN", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ISPB2-006", name: "E-Commerce(PBMB)", sks: 3, prodi: "SI", courseType: "PILIHAN", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ISPS2-006", name: "Artificial Intelligence (PSI)", sks: 3, prodi: "SI", courseType: "PILIHAN", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ISO-101", name: "Big Data", sks: 3, prodi: "SI", courseType: "PILIHAN", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ISO-103", name: "Matematika Diskrit", sks: 3, prodi: "SI", courseType: "PILIHAN", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ISO-105", name: "Analitik dan Visualisasi Data", sks: 3, prodi: "SI", courseType: "PILIHAN", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ISO-107", name: "Cloud Computing", sks: 3, prodi: "SI", courseType: "PILIHAN", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ISO-109", name: "Kreatif Digital", sks: 3, prodi: "SI", courseType: "PILIHAN", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ISI-025", name: "Praktek Kerja Lapangan", sks: 3, prodi: "SI", courseType: "WAJIB",  isPKL: true, isSkripsi: false, assessment: "PRAKTIKUM"},
    { code: "SB-ISI-024", name: "Tugas Akhir", sks: 6, prodi: "SI", courseType: "WAJIB",  isPKL: false, isSkripsi: true, assessment: "TUGAS AKHIR"},

    // TI
    { code: "SB-ITI-016", name: "Pendidikan Kewarganegaraan dan Antikorupsi", sks: 3, prodi: "TI", courseType: "WAJIB", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ITI-006", name: "Algoritma Pemrograman", sks: 3, prodi: "TI", courseType: "WAJIB", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ITI-014", name: "Pendidikan Agama", sks: 3, prodi: "TI", courseType: "WAJIB", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ITI-009", name: "Pengenalan Pemrograman", sks: 3, prodi: "TI", courseType: "WAJIB", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ITI-023", name: "Statistika dan Probabilitas", sks: 3, prodi: "TI", courseType: "WAJIB", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ITI-002", name: "Hukum dan Kebijakan Teknologi Informasi", sks: 2, prodi: "TI", courseType: "WAJIB", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ITI-027", name: "Kompleksitas Algoritma", sks: 3, prodi: "TI", courseType: "WAJIB", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ITO-004", name: "Kalkulus", sks: 3, prodi: "TI", courseType: "PILIHAN", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ITJN-006", name: "Komunikasi Data (Konsentrasi JN)", sks: 3, prodi: "TI", courseType: "PILIHAN", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ITSC-001", name: "Computer Vision (Konsentrasi SC)", sks: 3, prodi: "TI", courseType: "PILIHAN", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ITSC-002", name: "Expert System (Konsentrasi SC)", sks: 3, prodi: "TI", courseType: "PILIHAN", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ITSC-004", name: "Data Mining (Konsentrasi SC)", sks: 3, prodi: "TI", courseType: "PILIHAN", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ITO-002", name: "Matematika Diskrit", sks: 3, prodi: "TI", courseType: "PILIHAN", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ITO-108", name: "E-Marketing", sks: 3, prodi: "TI", courseType: "PILIHAN", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ITO-107", name: "E-Commerce", sks: 3, prodi: "TI", courseType: "PILIHAN", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ITO-101", name: "Mobile Computing", sks: 3, prodi: "TI", courseType: "PILIHAN", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ITO-105", name: "Kreatif Digital", sks: 3, prodi: "TI", courseType: "PILIHAN", isPKL: false, isSkripsi: false, assessment: "REGULER"},
    { code: "SB-ITI-028", name: "Praktek Kerja Lapangan", sks: 3, prodi: "TI", courseType: "WAJIB", isPKL: true, isSkripsi: false, assessment: "PRAKTIKUM"},
    { code: "SB-ITI-030", name: "Tugas Akhir", sks: 6, prodi: "TI", courseType: "WAJIB", isPKL: false, isSkripsi: true, assessment: "TUGAS AKHIR"},
  ];


  for (const course of courseData) {
    await prisma.course.create({
      data: {
        name: course.name,
        code: course.code,
        sks: course.sks,
        major: {
          connect: {
            id: course.prodi === "SI" ? 1 : 2,
          }
        },
        courseType: course.courseType,
        isPKL: course.isPKL,
        isSkripsi: course.isSkripsi,
        assessment: {
          connect: {
            name: course.assessment,
          },
        },
      }
    })
  }

  // Lokal/Ruang
  const roomData = [
    {name: "202", location: "BJB", capacity: 30},
    {name: "204", location: "BJB", capacity: 30},
    {name: "301", location: "BJB", capacity: 30},
    {name: "302", location: "BJB", capacity: 30},
    {name: "S201", location: "BJB", capacity: 30},
    {name: "S202", location: "BJB", capacity: 30},
    {name: "S203", location: "BJB", capacity: 30},
    {name: "S204", location: "BJB", capacity: 30},
    {name: "S1", location: "BJB", capacity: 30},
    {name: "S2", location: "BJB", capacity: 30},
    {name: "D1", location: "BJB", capacity: 30},
  ]

  for (const rooms of roomData) {
    await prisma.room.create({
      data: {
        name: rooms.name,
        location: rooms.location as Location,
        capacity: rooms.capacity,
      }
    })
  }

  // Periode Akademik
  const periodData = [
    {semesterType: "GANJIL", year: 2020, name: "GANJIL 2020/2021"},
    {semesterType: "GENAP", year: 2021, name: "GENAP 2020/2021"},
    {semesterType: "GANJIL", year: 2021, name: "GANJIL 2021/2022"},
    {semesterType: "GENAP", year: 2022, name: "GENAP 2021/2022"},
    {semesterType: "GANJIL", year: 2022, name: "GANJIL 2022/2023"},
    {semesterType: "GENAP", year: 2023, name: "GENAP 2022/2023"},
    {semesterType: "GANJIL", year: 2023, name: "GANJIL 2023/2024"},
    {semesterType: "GENAP", year: 2024, name: "GENAP 2023/2024"},
    {semesterType: "GANJIL", year: 2024, name: "GANJIL 2024/2025"},
    {semesterType: "GENAP", year: 2025, name: "GENAP 2024/2025"},
  ]

  for (const period of periodData) {
    await prisma.period.create({
      data: {
        semesterType: period.semesterType as SemesterType,
        year: period.year,
        name: period.name,
        reregister: {
          create: {
            name: `Herregistrasi ${period.name}`
          }
        }
      }
    })
  }

  for (let i = 1; i <= 10; i++) {
    await prisma.user.create({
      data: {
        email: `lecturer${i}@stmik.com`,
        password: bcrypt.hashSync(`lecturer`, 10),
        roleId: (i % 2 === 0 ? 3: 2),
        isStatus: true,
        lecturer: {
          create: {
            npk: `110.0${i}`,
            nidn: `12340001${i}`,
            name: `Lecturer${i}`,
            degree: (i % 2 === 0 ? DegreeStatus.S3 : DegreeStatus.S2) ,
            gender: Gender.WANITA,
            religion: Religion.KATOLIK,
            majorId: (i % 2 === 0 ? 1 : 2),
            year: 2014,
          }
        }
      }
    })
  }

  const lecturer = await prisma.lecturer.findMany({
    where: {
      user: {
        roleId: 3,
      }
    }
  })
  const students = []
  for (let i = 0; i < 10; i++) {
    students.push({
      nim: `310118${i % 2 === 0 ? '01' : '02'}210${i}`,
      name: `Student${i + 1}`,
      year: 2018,
      religion: Religion.ISLAM,
      gender: (i % 2 === 0 ? Gender.PRIA : Gender.WANITA),
      majorId: (i % 2 === 0 ? 1 : 2),
      statusRegister: "BARU",
      lecturerId: (i % 3 === 0  && lecturer[0].id) || (i % 4 === 0 && lecturer[1].id) || (i % 5 === 0 && lecturer[2].id) || lecturer[3].id,
    })
  };
  for (let i = 0; i < 10; i++) {
    students.push({
      nim: `310119${i % 2 === 0 ? '01' : '02'}220${i}`,
      name: `Student1${i + 1}`,
      year: 2019,
      religion: Religion.ISLAM,
      gender: (i % 2 === 0 ? Gender.PRIA : Gender.WANITA),
      majorId: (i % 2 === 0 ? 1 : 2),
      statusRegister: "BARU",
      lecturerId: (i % 3 === 0  && lecturer[0].id) || (i % 4 === 0 && lecturer[1].id) || (i % 5 === 0 && lecturer[2].id) || lecturer[3].id,
    })
  };

  for (let i = 0; i < 10; i++) {
    students.push({
      nim: `310120${i % 2 === 0 ? '01' : '02'}230${i}`,
      name: `Student2${i + 1}`,
      year: 2020,
      religion: Religion.ISLAM,
      gender: (i % 2 === 0 ? Gender.PRIA : Gender.WANITA),
      majorId: (i % 2 === 0 ? 1 : 2),
      statusRegister: "BARU",
      lecturerId: (i % 3 === 0  && lecturer[0].id) || (i % 4 === 0 && lecturer[1].id) || (i % 5 === 0 && lecturer[2].id) || lecturer[3].id,
    })
  }
  for (let i = 0; i < 10; i++) {
    students.push({
      nim: `310121${i % 2 === 0 ? '01' : '02'}230${i}`,
      name: `Student3${i + 1}`,
      year: 2021,
      religion: Religion.ISLAM,
      gender: (i % 2 === 0 ? Gender.PRIA : Gender.WANITA),
      majorId: (i % 2 === 0 ? 1 : 2),
      statusRegister: "BARU",
      lecturerId: (i % 3 === 0  && lecturer[0].id) || (i % 4 === 0 && lecturer[1].id) || (i % 5 === 0 && lecturer[2].id) || lecturer[3].id,
    })
  }

  await prisma.student.createMany({
    data: students,
  })
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });