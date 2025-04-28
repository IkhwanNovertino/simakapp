import { Location, PrismaClient, RoleType } from "@prisma/client";
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

  const permissions = 72;

  // rolePermission
  for (let i = 1; i <= permissions; i++) {
    await prisma.rolePermission.create({
      data: {
        roleId: 1,
        permissionId: i,
      }
    })
  };
  // await prisma.rolePermission.createMany({
  //   data: [
  //     { roleId: 1, permissionId: 1 },
  //     { roleId: 1, permissionId: 2 },
  //     { roleId: 1, permissionId: 3 },
  //     { roleId: 1, permissionId: 4 },
  //     { roleId: 1, permissionId: 5 },
  //     { roleId: 1, permissionId: 6 },
  //     { roleId: 1, permissionId: 7 },
  //     { roleId: 1, permissionId: 8 },
  //     { roleId: 1, permissionId: 9 },
  //     { roleId: 1, permissionId: 10 },
  //     { roleId: 1, permissionId: 11 },
  //     { roleId: 1, permissionId: 12 },
  //     { roleId: 1, permissionId: 13 },
  //     { roleId: 1, permissionId: 14 },
  //     { roleId: 1, permissionId: 15 },
  //     { roleId: 1, permissionId: 16 },
  //     { roleId: 2, permissionId: 13 },
  //     { roleId: 2, permissionId: 17 },
  //     { roleId: 2, permissionId: 18 },
  //   ]
  // })

  // user
  const hashPassword = bcrypt.hashSync("admin", 10);
  await prisma.operator.create({
    data: {
      name: "operator1",
      department: "",
      user: {
        create: {
          email: "admin1@gmail.com",
          password: hashPassword,
          roleId: 1,
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