export const role = "admin";

export const menuItems = [
  {
    title: "",
    items: [
      {
        icon: "/icon/dashboard.svg",
        label: "Dashboard",
        href: "/",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    title: "HAK AKSES",
    items: [
      {
        icon: "/icon/permission.svg",
        label: "Hak Akses",
        href: "/list/permissions",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/icon/role.svg",
        label: "Role",
        href: "/list/roles",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    title: "MENU MASTER",
    items: [

      {
        icon: "/icon/lecturer.svg",
        label: "Dosen",
        href: "/list/lecturers",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/icon/student.svg",
        label: "Mahasiswa",
        href: "/list/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/icon/operator.svg",
        label: "Operator",
        href: "/list/operators",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/icon/major.svg",
        label: "Program Studi",
        href: "/list/majors",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/icon/course.svg",
        label: "Mata Kuliah",
        href: "/list/courses",
        visible: ["admin"],
      },
      {
        icon: "/icon/room.svg",
        label: "Lokal",
        href: "/list/rooms",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/icon/class.svg",
        label: "Kelas",
        href: "/list/classes",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/icon/schedule.svg",
        label: "Jadwal",
        href: "/list/schedules",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/icon/attendance.svg",
        label: "Presensi",
        href: "/list/attendance",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/icon/krs.svg",
        label: "KRS",
        href: "/list/krs",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/icon/reregister.svg",
        label: "Her Registrasi",
        href: "/list/reregisters",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/icon/khs.svg",
        label: "KHS",
        href: "/list/khs",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/icon/transkip.svg",
        label: "Transkip",
        href: "/list/transkip",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/icon/event.svg",
        label: "Events",
        href: "/list/events",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/icon/announcement.svg",
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/icon/profile.svg",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/icon/setting.svg",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/icon/logout.svg",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

export const permissionDaata = [
  {
    id: 1,
    name: "create user",
    description: "modul untuk membuat data user"
  },
  {
    id: 2,
    name: "read user",
    description: "modul untuk menampilkan data user"
  },
  {
    id: 3,
    name: "update user",
    description: "modul untuk mengubah data user"
  },
  {
    id: 4,
    name: "update lecturer",
    description: "modul untuk mengubah data dosen"
  },
];

// Enum untuk StatusRegistrasi
export const StatusRegistrasi = [
  "BARU",
  "TRANSFER KREDIT",
  "RENIM",
  "PEROLEHAN KREDIT",
]

// YOU SHOULD CHANGE THE DATES OF THE EVENTS TO THE CURRENT DATE TO SEE THE EVENTS ON THE CALENDAR

export const calendarEvents = [
  {
    title: "Math",
    allDay: false,
    start: new Date(2024, 7, 12, 8, 0),
    end: new Date(2024, 7, 12, 8, 45),
  },
  {
    title: "English",
    allDay: false,
    start: new Date(2024, 7, 12, 9, 0),
    end: new Date(2024, 7, 12, 9, 45),
  },
  {
    title: "Biology",
    allDay: false,
    start: new Date(2024, 7, 12, 10, 0),
    end: new Date(2024, 7, 12, 10, 45),
  },
  {
    title: "Physics",
    allDay: false,
    start: new Date(2024, 7, 12, 11, 0),
    end: new Date(2024, 7, 12, 11, 45),
  },
  {
    title: "Chemistry",
    allDay: false,
    start: new Date(2024, 7, 12, 13, 0),
    end: new Date(2024, 7, 12, 13, 45),
  },
  {
    title: "History",
    allDay: false,
    start: new Date(2024, 7, 12, 14, 0),
    end: new Date(2024, 7, 12, 14, 45),
  },
  // Day 2
  {
    title: "English",
    allDay: false,
    start: new Date(2024, 7, 13, 9, 0),
    end: new Date(2024, 7, 13, 9, 45),
  },
  {
    title: "Biology",
    allDay: false,
    start: new Date(2024, 7, 13, 10, 0),
    end: new Date(2024, 7, 13, 10, 45),
  },
  {
    title: "Physics",
    allDay: false,
    start: new Date(2024, 7, 13, 11, 0),
    end: new Date(2024, 7, 13, 11, 45),
  },

  {
    title: "History",
    allDay: false,
    start: new Date(2024, 7, 13, 14, 0),
    end: new Date(2024, 7, 13, 14, 45),
  },
  // Day 3
  {
    title: "Math",
    allDay: false,
    start: new Date(2024, 7, 14, 8, 0),
    end: new Date(2024, 7, 14, 8, 45),
  },
  {
    title: "Biology",
    allDay: false,
    start: new Date(2024, 7, 14, 10, 0),
    end: new Date(2024, 7, 14, 10, 45),
  },

  {
    title: "Chemistry",
    allDay: false,
    start: new Date(2024, 7, 14, 13, 0),
    end: new Date(2024, 7, 14, 13, 45),
  },
  {
    title: "History",
    allDay: false,
    start: new Date(2024, 7, 14, 14, 0),
    end: new Date(2024, 7, 13, 14, 45),
  },
  // Day 4
  {
    title: "English",
    allDay: false,
    start: new Date(2024, 7, 15, 9, 0),
    end: new Date(2024, 7, 15, 9, 45),
  },
  {
    title: "Biology",
    allDay: false,
    start: new Date(2024, 7, 15, 10, 0),
    end: new Date(2024, 7, 15, 10, 45),
  },
  {
    title: "Physics",
    allDay: false,
    start: new Date(2024, 7, 15, 11, 0),
    end: new Date(2024, 7, 15, 11, 45),
  },

  {
    title: "History",
    allDay: false,
    start: new Date(2024, 7, 15, 14, 0),
    end: new Date(2024, 7, 15, 14, 45),
  },
  // Day 5
  {
    title: "Math",
    allDay: false,
    start: new Date(2024, 7, 16, 8, 0),
    end: new Date(2024, 7, 16, 8, 45),
  },
  {
    title: "English",
    allDay: false,
    start: new Date(2024, 7, 16, 9, 0),
    end: new Date(2024, 7, 16, 9, 45),
  },

  {
    title: "Physics",
    allDay: false,
    start: new Date(2024, 7, 16, 11, 0),
    end: new Date(2024, 7, 16, 11, 45),
  },
  {
    title: "Chemistry",
    allDay: false,
    start: new Date(2024, 7, 16, 13, 0),
    end: new Date(2024, 7, 16, 13, 45),
  },
  {
    title: "History",
    allDay: false,
    start: new Date(2024, 7, 16, 14, 0),
    end: new Date(2024, 7, 16, 14, 45),
  },
];

