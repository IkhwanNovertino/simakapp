import { Location, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Permission
  const resourceData = [
    { pathname: "permissions", name: "permission", nama: "hak akses" },
    { pathname: "roles", name: "role", nama: "role" },
    { pathname: "users", name: "user", nama: "pengguna" },
    { pathname: "lecturers", name: "lecturer", nama: "dosen" },
    { pathname: "operators", name: "operator", nama: "operator" },
    { pathname: "students", name: "student", nama: "mahasiswa" },
    { pathname: "courses", name: "course", nama: "mata kuliah" },
    { pathname: "majors", name: "major", nama: "program studi" },
    { pathname: "rooms", name: "room", nama: "ruangan" },
    { pathname: "classes", name: "class", nama: "kelas" },
    { pathname: "krs", name: "ksr", nama: "krs" },
    { pathname: "schedules", name: "schedule", nama: "jadwal" },
    { pathname: "attendances", name: "attendance", nama: "presensi" },
    { pathname: "khs", name: "khr", nama: "khs" },
    { pathname: "herregistrations", name: "herregistration", nama: "herregistrasi" },
  ];

  const action = ["view", "create", "edit", "delete"];
  for (const resource of resourceData) {
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
  const roleName = ["admin", "dosen", "perwalian akademik", "finance", "akademik"]

  for (const element of roleName) {
    await prisma.role.create({
      data: {
        name: element,
        description: element,
      }
    })
  }

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
        }
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