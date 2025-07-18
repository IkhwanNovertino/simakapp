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
    { pathname: "students", name: "student", nama: "mahasiswa" },
    { pathname: "operators", name: "operator", nama: "operator" },
    { pathname: "positions", name: "position", nama: "jabatan" },
    { pathname: "majors", name: "major", nama: "program studi" },
    { pathname: "reregistrations", name: "reregistration", nama: "herregistrasi" },
    { pathname: "curriculums", name: "curruculum", nama: "kurikulum" },
    { pathname: "courses", name: "course", nama: "mata kuliah" },
    { pathname: "rooms", name: "room", nama: "ruangan" },
    { pathname: "krs", name: "krs", nama: "krs" },
    { pathname: "schedules", name: "schedule", nama: "jadwal" },
    { pathname: "classes", name: "class", nama: "kelas" },
    { pathname: "khs", name: "khs", nama: "khs" },
    { pathname: "presences", name: "presence", nama: "presensi" },
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

  // Curriculum
  const kurikulumSI = await prisma.curriculum.create({
    data: {
      name: "KURIKULUM SI",
      majorId: 1,
      startDate: new Date(),
      endDate: new Date(),
      isActive: true,
    }
  });
  const kurikulumTI = await prisma.curriculum.create({
    data: {
      name: "KURIKULUM TI",
      majorId: 2,
      startDate: new Date(),
      endDate: new Date(),
      isActive: true,
    }
  });

  const courseOld = [
    // TI
    { code: "SKB-T016", name: "Pengolahan Citra", sks: 3, prodi: "TI", courseType: "WAJIB", isPKL: false, isSkripsi: false, assessment: "REGULER", predecessor: null },
    { code: "SKB-T027", name: "Grafika Komputer", sks: 3, prodi: "TI", courseType: "WAJIB", isPKL: false, isSkripsi: false, assessment: "REGULER", predecessor: null },
    { code: "IKB-T004", name: "Dasar-Dasar Pemrograman", sks: 3, prodi: "TI", courseType: "WAJIB", isPKL: false, isSkripsi: false, assessment: "REGULER", predecessor: null },
    { code: "SKB-T024", name: "Pemrosesan Data Terdistribusi (PDT)", sks: 3, prodi: "TI", courseType: "WAJIB", isPKL: false, isSkripsi: false, assessment: "REGULER", predecessor: null },
    { code: "SKK-T010", name: "Logika Informatika", sks: 3, prodi: "TI", courseType: "WAJIB", isPKL: false, isSkripsi: false, assessment: "REGULER", predecessor: null },
    // SI
    { code: "SKB-S020", name: "Manajemen Kualitas Software (Pilihan PSI)", isPKL: false, isSkripsi: false, prodi: "SI", courseType: "PILIHAN", sks: 3, assessment: "REGULER", predecessor: null },
    { code: "IBB-S001", name: "Kepemimpinan", isPKL: false, isSkripsi: false, prodi: "SI", courseType: "WAJIB", sks: 2, assessment: "REGULER", predecessor: null },
    { code: "IKB-S012", name: "Infrastrcture TI : Sistem Operasi", isPKL: false, isSkripsi: false, prodi: "SI", courseType: "WAJIB", sks: 3, assessment: "REGULER", predecessor: null },
    { code: "IKB-S034", name: "Logika (Berfikir Kritis, Analitis)", isPKL: false, isSkripsi: false, prodi: "SI", courseType: "WAJIB", sks: 3, assessment: "REGULER", predecessor: null },
    { code: "SKB-S029", name: "Komputasi Awan (Pilihan PBB)", isPKL: false, isSkripsi: false, prodi: "SI", courseType: "WAJIB", sks: 3, assessment: "REGULER", predecessor: null },
  ];
  const courseSI = [
    {
      code: "SB-ISI-007", name: "Pengantar Teknologi Informasi", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:1, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISI-028", name:"Pendidikan Kewarganegaraan dan Antikorupsi", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:1, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISI-030", name:"Bahasa Inggris", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:1, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISI-001", name:"Konsep Sistem Informasi", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:2, smt:1, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISI-014", name:"Dasar Pemrograman", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:1, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISI-029", name:"Bahasa Indonesia", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:1, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISO-007", name:"Human Resource Management", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:1, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISI-003", name:"Konsep Basis Data", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:2, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISI-021", name:"Etika Profesi dan Profesionalisme", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:2, smt:2, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISI-026", name:"Pendidikan Agama", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:2, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISI-002", name:"Sistem Informasi Manajemen", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:2, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISI-005", name:"Sistem Operasi", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:2, 
      assessment: "REGULER", predecessor: "IKB-S012"
    },
    { code: "SB-ISI-023", name:"Statistika dan Probabilitas", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:2, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISI-027", name:"Pendidikan Pancasila dan NKRI", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:2, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISI-004", name:"Sistem Basis Data", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:3, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISI-015", name:"Transformasi Digital", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:3, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISI-020", name:"Kepemimpinan dan Manajemen Organisasi", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:3, 
      assessment: "REGULER", predecessor: "IBB-S001"
    },
    { code: "SB-ISO-004", name:"Computational Thinking", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:3, 
      assessment: "REGULER", predecessor: "IKB-S034"
    },
    { code: "SB-ISPB1-002", name:"Pengantar Bisnis (PBMB)", 
      isPKL:false, isSkripsi: false, courseType: "PILIHAN",	sks:3, smt:3, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISPS1-004", name:"Analisis & Desain Proses Bisnis (Pemodelan Bisnis) (PSI)", 
      isPKL:false, isSkripsi: false, courseType: "PILIHAN",	sks:3, smt:3, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISI-006", name:"Jaringan komputer", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:3, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISI-016", name:"Pemrograman Berbasis Objek", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:3, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISO-003", name:"Komunikasi dan Negosiasi", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:3, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISPB2-001", name:"Komunikasi Bisnis (PBMB)", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:3, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISPS2-003", name:"Sistem Penunjang Keputusan (PSI)", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:3, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISI-010", name:"Analisa dan Perancangan Sistem Informasi", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:4, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISI-018", name:"Keamanan Jaringan", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:4, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISO-002", name:"IOT (Internet of Things)", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:4, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISO-008", name:"Enterprise Architecture", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:4, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISPS2-005", name:"Data Mining (PSI)", 
      isPKL:false, isSkripsi: false, courseType: "PILIHAN",	sks:3, smt:4, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISI-017", name:"Pemrograman Berbasis Web", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:4, smt:4, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISI-022", name:"Metodologi Penelitian dan Penulisan Ilmiah", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:2, smt:4, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISO-005", name:"User Experience/Interface", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:4, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISPS1-002", name:"Teknologi & Administrator Basis Data (PSI)", 
      isPKL:false, isSkripsi: false, courseType: "PILIHAN",	sks:3, smt:4, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISI-008", name:"Manajemen Proyek Sistem Informasi", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:5, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISI-011", name:"Software Testing dan Quality Assurance", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:2, smt:5, 
      assessment: "REGULER", predecessor: "SKB-S020"
    },
    { code: "SB-ISI-013", name:"Audit Sistem Informasi", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:5, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISO-006", name:"Pemrograman Aplikasi Bergerak", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:5, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISPB1-003", name:"Startup Digital (PBMB)", 
      isPKL:false, isSkripsi: false, courseType: "PILIHAN",	sks:3, smt:5, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISPS1-001", name:"Implementasi Perangkat Lunak (Deployment, Testing, Adoption) (PSI)", 
      isPKL:false, isSkripsi: false, courseType: "PILIHAN",	sks:3, smt:5, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISI-009", name:"Proyek Perangkat lunak", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:5, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISI-012", name:"Tata Kelola Teknologi Informasi", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:5, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISI-019", name:"Keamanan Sistem Informasi", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:2, smt:5, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISO-009", name:"Interaksi Manusia dan Komputer", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:2, smt:5, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISPB2-006", name:"E-Commerce(PBMB)", 
      isPKL:false, isSkripsi: false, courseType: "PILIHAN",	sks:3, smt:5, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISPS2-006", name:"Artificial Intelligence (PSI)", 
      isPKL:false, isSkripsi: false, courseType: "PILIHAN",	sks:3, smt:5, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISO-101", name:"Big Data", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:6, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISO-103", name:"Matematika Diskrit", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:6, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISO-105", name:"Analitik dan Visualisasi Data", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:6, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISO-107", name:"Cloud Computing", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:6, 
      assessment: "REGULER", predecessor: "SKB-S029"
    },
    { code: "SB-ISO-109", name:"Kreatif Digital", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:6, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISO-001", name:"Technopreneurship", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:6, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISO-102", name:"Business Intelegence", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:6, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISO-104", name:"Sistem Rekomendasi", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:2, smt:6, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISO-106", name:"Machine Learning", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:6, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISO-108", name:"E-Marketing", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:6, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ISI-025", name:"Praktek Kerja Lapangan", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:3, smt:7, 
      assessment: "PRAKTIKUM", predecessor: ""
    },
    { code: "SB-ISI-024", name:"Tugas Akhir", 
      isPKL:false, isSkripsi: false, courseType: "WAJIB",	sks:6, smt:8, 
      assessment: "TUGAS AKHIR", predecessor: ""
    },
  ];
  const courseTI = [
    // Matkul Baru 
    { code: "SB-ITI-016", name: "Pendidikan Kewarganegaraan dan Antikorupsi", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB", 
      sks: 3, smt: 1
      , assessment: "REGULER", predecessor: "" 
    },
    { code: "SB-ITI-006", name: "Algoritma Pemrograman", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:1, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITI-014", name: "Pendidikan Agama", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:1, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITI-009", name: "Pengenalan Pemrograman", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:1, 
      assessment: "REGULER", predecessor: "IKB-T004"
    },
    { code: "SB-ITI-023", name: "Statistika dan Probabilitas", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:1, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITI-002", name: "Hukum dan Kebijakan Teknologi Informasi", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:2,	smt:1, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITO-004", name: "Kalkulus", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:1, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITI-024", name: "Logika Matematika", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:2, 
      assessment: "REGULER", predecessor: "SKK-T010"
    },
    { code: "SB-ITI-001", name: "Etika dan Profesi", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:2,	smt:2, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITI-017", name: "Bahasa Indonesia", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:2, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITI-015", name: "Pendidikan Pancasila dan NKRI", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:2, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITO-003", name: "Aljabar Linier", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:2, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITI-005", name: "Struktur Data", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:2, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITI-022", name: "Basis Data", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:2, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITI-029", name: "Big Data", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:3, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITI-012", name: "Jaringan Komputer", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:3, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITJN-006",name: "Komunikasi Data (Konsentrasi JN)", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:3, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITSC-001",name: "Computer Vision (Konsentrasi SC)", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:3, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITI-027", name: "Kompleksitas Algoritma", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:3, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITO-002", name: "Matematika Diskrit", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:3, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITI-018", name: "Organisasi dan Arsitektur Komputer", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:3, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITI-021", name: "Sistem Operasi", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:3, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITI-020", name: "Human-Computer Interaction", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:3, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITI-007", name: "Keamanan Data dan Informasi", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:4, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITI-025", name: "Cloud Computing", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:4, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITSC-002",name: "Expert System (Konsentrasi SC)", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:4, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITI-013", name: "Pemrograman Berorientasi Objek", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:4, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITO-001", name: "Mikrokontroller", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:4, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITI-010", name: "Pembelajaran Mesin (Machine Learning)", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:4, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITI-011", name: "Kecerdasan Buatan (AI)", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:4, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITSC-005",name: "Sistem Penunjang Keputusan (Konsentrasi SC)", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:4, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITI-032", name: "Pengolahan Citra Digital", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:4, 
      assessment: "REGULER", predecessor: "SKB-T016"
    },
    { code: "SB-ITI-019", name: "Komputasi Paralel dan Terdistribusi", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:5, 
      assessment: "REGULER", predecessor: "SKB-T024"
    },
    { code: "SB-ITO-005", name: "Technopreneurship", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:5, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITI-031", name: "Internet of Things", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:5, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITI-033", name: "Tata Tulis Ilmiah (Metodologi Penelitian)", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:2,	smt:5, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITI-003", name: "Manajemen Proyek Teknologi Informasi", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:5, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITI-026", name: "Pemrograman Berbasis Platform", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:4,	smt:5, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITSC-004",name: "Data Mining (Konsentrasi SC)", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:5, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITI-008", name: "Analisis dan Desain Perangkat Lunak", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:5, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITO-106", name: "StartUp Digital", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:6, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITO-110", name: "Studi Kelayakan Bisnis", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:6, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITO-109", name: "Komunikasi Bisnis", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:6, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITO-108", name: "E-Marketing", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:6, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITO-107", name: "E-Commerce", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:6, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITO-101", name: "Mobile Computing", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:6, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITO-105", name: "Kreatif Digital", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:6, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITI-004", name: "Proyek Prangkat Lunak", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:6, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITO-102", name: "Pengantar Teknologi Informasi", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:6, 
      assessment: "REGULER", predecessor: ""
    },
    { code: "SB-ITO-103", name: "Grafika dan Animasi Komputer", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:6, 
      assessment: "REGULER", predecessor: "SKB-T027"
    },
    { code: "SB-ITI-028", name: "Praktek Kerja Lapangan", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:3,	smt:7, 
      assessment: "PRAKTIKUM", predecessor: ""
    },
    { code: "SB-ITI-030", name: "Tugas Akhir", 
      isPKL:false, isSkripsi:false, courseType: "WAJIB",	
      sks:6,	smt:8, 
      assessment: "TUGAS AKHIR", predecessor: ""
    },
  ]

  // course
  for (const course of courseOld) {
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
  for (const si of courseSI) {
    await prisma.course.create({
      data: {
        code: si.code,
        name: si.name,
        sks: si.sks,
        major: {
          connect: {
            id: 1
          }
        },
        courseType: si.courseType,
        isPKL: si.isPKL,
        isSkripsi: si.isSkripsi,
        assessment: {
          connect: {
            name: si.assessment,
          }
        },
      }
    });

    await prisma.curriculumDetail.create({
      data: {
        curriculum: {
          connect: {
            id: kurikulumSI.id,
          }
        },
        course: {
          connect: {
            code: si.code
          }
        },
        semester: si.smt,
      }
    })
  };
  for (const ti of courseTI) {
    await prisma.course.create({
      data: {
        code: ti.code,
        name: ti.name,
        sks: ti.sks,
        major: {
          connect: {
            id: 2
          }
        },
        courseType: ti.courseType,
        isPKL: ti.isPKL,
        isSkripsi: ti.isSkripsi,
        assessment: {
          connect: {
            name: ti.assessment,
          }
        },
      }
    });
    await prisma.curriculumDetail.create({
      data: {
        curriculum: {
          connect: {
            id: kurikulumTI.id,
          }
        },
        course: {
          connect: {
            code: ti.code
          }
        },
        semester: ti.smt,
      }
    })
  };
  

  // create curriculum detail
  await prisma.curriculumDetail.createMany({
    data: [

    ]
  })

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
        isActive: period.name === "GANJIL 2023/2024" ? true : false
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
      nim: `310121${i % 2 === 0 ? '01' : '02'}210${i}`,
      name: `Student${i + 1}`,
      year: 2021,
      religion: Religion.ISLAM,
      gender: (i % 2 === 0 ? Gender.PRIA : Gender.WANITA),
      majorId: (i % 2 === 0 ? 1 : 2),
      statusRegister: "BARU",
      lecturerId: (i % 3 === 0  && lecturer[0].id) || (i % 4 === 0 && lecturer[1].id) || (i % 5 === 0 && lecturer[2].id) || lecturer[3].id,
    })
  };
  for (let i = 0; i < 10; i++) {
    students.push({
      nim: `310122${i % 2 === 0 ? '01' : '02'}220${i}`,
      name: `Student1${i + 1}`,
      year: 2022,
      religion: Religion.ISLAM,
      gender: (i % 2 === 0 ? Gender.PRIA : Gender.WANITA),
      majorId: (i % 2 === 0 ? 1 : 2),
      statusRegister: "BARU",
      lecturerId: (i % 3 === 0  && lecturer[0].id) || (i % 4 === 0 && lecturer[1].id) || (i % 5 === 0 && lecturer[2].id) || lecturer[3].id,
    })
  };

  for (let i = 0; i < 10; i++) {
    students.push({
      nim: `310123${i % 2 === 0 ? '01' : '02'}230${i}`,
      name: `Student2${i + 1}`,
      year: 2023,
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