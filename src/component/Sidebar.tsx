import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    title: "",
    items: [
      {
        icon: "/home.png",
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
        icon: "/setting.png",
        label: "Hak Akses",
        href: "/list/permissions",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/profile.png",
        label: "Role",
        href: "/roles",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    title: "MENU MASTER",
    items: [

      {
        icon: "/teacher.png",
        label: "Dosen",
        href: "/list/lecturers",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/student.png",
        label: "Mahasiswa",
        href: "/list/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/parent.png",
        label: "Operator",
        href: "/list/operators",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/subject.png",
        label: "Mata Kuliah",
        href: "/list/courses",
        visible: ["admin"],
      },
      {
        icon: "/class.png",
        label: "Lokal",
        href: "/list/rooms",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/class.png",
        label: "Kelas",
        href: "/list/classes",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/calendar.png",
        label: "Jadwal",
        href: "/list/schedules",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/attendance.png",
        label: "Presensi",
        href: "/list/attendance",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/exam.png",
        label: "KRS",
        href: "/list/krs",
        visible: ["admin", "teacher", "student", "parent"],
      },

      {
        icon: "/result.png",
        label: "KHS",
        href: "/list/khs",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/calendar.png",
        label: "Events",
        href: "/list/events",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin", "teacher", "student", "parent"],
      },
      // {
      //   icon: "/message.png",
      //   label: "Messages",
      //   href: "/list/messages",
      //   visible: ["admin", "teacher", "student", "parent"],
      // },

      // {
      //   icon: "/assignment.png",
      //   label: "Assignments",
      //   href: "/list/assignments",
      //   visible: ["admin", "teacher", "student", "parent"],
      // },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const Sidebar = () => {
  return (
    <div className="mt-4 text-sm">
      {menuItems.map(el => (
        <div className="flex flex-col gap-2" key={el.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {el.title}
          </span>
          {
            el.items.map(item => (
              <Link
                className="flex items-center justify-center lg:justify-start gap-4 text-gray-400 py-2 md:px-2 rounded-md hover:bg-primary-light"
                href={item.href}
                key={item.label}
              >
                <Image src={item.icon} width={20} height={20} alt={item.label} />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            ))
          }
        </div>
      ))}
    </div>
  )
}

export default Sidebar