import { role } from "@/lib/data";
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

  // course
  const courseData = [
    // SI
    {code: "SB-ISI-027", name: "Pendidikan Pancasila dan NKRI", sks: 3, prodi: "Sistem Informasi"},
    {code: "SB-ISI-017", name: "Pemrograman Berbasis Web", sks: 4, prodi: "Sistem Informasi"},
    {code: "SB-ISI-003", name: "Konsep Basis Data", sks: 3, prodi: "Sistem Informasi"},
    {code: "SB-ISI-010", name: "Analisa dan Perancangan Sistem Informasi", sks: 3, prodi: "Sistem Informasi"},
    {code: "SB-ISO-005", name: "User Experience/Interface", sks: 3, prodi: "Sistem Informasi"},
    {code: "SB-ISO-002", name: "IOT (Internet of Things)", sks: 3, prodi: "Sistem Informasi"},
    { code: "SB-ISPS2-005", name: "Data Mining (PSI)", sks: 3, prodi: "Sistem Informasi" },
    // TI
    { code: "SB-ITI-007", name: "Keamanan Data dan Informasi", sks: 3, prodi: "Teknik Informatika" },
    { code: "SB-ITI-025", name: "Cloud Computing", sks: 3, prodi: "Teknik Informatika" },
    { code: "SB-ITI-010", name: "Pembelajaran Mesin (Machine Learning)", sks: 3, prodi: "Teknik Informatika" },
    { code: "SB-ITI-011", name: "Kecerdasan Buatan (AI)", sks: 3, prodi: "Teknik Informatika" },
    { code: "SB-ITO-101", name: "Mobile Computing", sks: 3, prodi: "Teknik Informatika" },
    { code: "SB-ITO-001", name: "Mikrokontroller", sks: 3, prodi: "Teknik Informatika" },
    { code: "SB-ITSC-002", name: "Expert System (Konsentrasi SC)", sks: 4, prodi: "Teknik Informatika" },
    { code: "SB-ITSC-005", name: "Sistem Penunjang Keputusan (Konsentrasi SC)", sks: 3, prodi: "Teknik Informatika" },
  ]

  for (const course of courseData) {
    await prisma.course.create({
      data: {
        name: course.name,
        code: course.code,
        sks: course.sks,
        major: {
          connect: {
            id: course.prodi === "Sistem Informasi" ? 1 : 2,
          }
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