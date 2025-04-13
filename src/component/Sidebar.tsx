'use client';
import { role } from "@/lib/data";
// import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
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
        icon: "/icon/reregister.svg",
        label: "Her Registrasi",
        href: "/list/reregisters",
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


const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className="mt-4 text-sm">
      {menuItems.map(el => (
        <div className="flex flex-col gap-2" key={el.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {el.title}
          </span>

          {
            el.items.map(item => {
              return (
                <Link
                  className={`flex items-center justify-center lg:justify-start gap-4 text-gray-400 py-2 md:px-2 rounded-md hover:bg-primary-light/50 ${pathname === item.href ? "md:bg-primary-light " : ""}`}
                  href={item.href}
                  key={item.href}
                >
                  <Image src={item.icon} width={20} height={20} alt={item.label} />
                  <span className={`hidden lg:block ${pathname === item.href ? "text-black font-semibold" : ""}`}>{item.label}</span>
                </Link>
              )
            })
          }
        </div>
      ))
      }
    </div >
  )
}

export default Sidebar