import { getSidebarItemsByRole } from "@/lib/dal";
import Sidebar from "./Sidebar";

const menuItems = [
  {
    title: "HAK AKSES",
    items: [
      {
        icon: "/icon/permission.svg",
        label: "Hak Akses",
        href: "/list/permissions",
      },
      {
        icon: "/icon/role.svg",
        label: "Role",
        href: "/list/roles",
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
      },
      {
        icon: "/icon/student.svg",
        label: "Mahasiswa",
        href: "/list/students",
      },
      {
        icon: "/icon/operator.svg",
        label: "Operator",
        href: "/list/operators",
      },
      {
        icon: "/icon/major.svg",
        label: "Program Studi",
        href: "/list/majors",
      },
      {
        icon: "/icon/course.svg",
        label: "Mata Kuliah",
        href: "/list/courses",
      },
      {
        icon: "/icon/room.svg",
        label: "Lokal/Ruangan",
        href: "/list/rooms",
      },
      {
        icon: "/icon/krs.svg",
        label: "KRS",
        href: "/list/krs",
      },
      {
        icon: "/icon/reregister.svg",
        label: "Her Registrasi",
        href: "/list/reregisters",
      },
      {
        icon: "/icon/khs.svg",
        label: "KHS",
        href: "/list/khs",
      },
      {
        icon: "/icon/transkip.svg",
        label: "Transkip",
        href: "/list/transkip",
      },
      {
        icon: "/icon/class.svg",
        label: "Kelas",
        href: "/list/classes",
      },
      {
        icon: "/icon/schedule.svg",
        label: "Jadwal",
        href: "/list/schedules",
      },
      {
        icon: "/icon/attendance.svg",
        label: "Presensi",
        href: "/list/attendance",
      },
      {
        icon: "/icon/event.svg",
        label: "Events",
        href: "/list/events",
      },
      {
        icon: "/icon/announcement.svg",
        label: "Announcements",
        href: "/list/announcements",
      },
    ],
  },
];

const SidebarContainer = async () => {
  const getMenuSidebarByRole = await getSidebarItemsByRole();
  if (!getMenuSidebarByRole) return null;

  const filteredMenuItems = menuItems.map((menu) => {
    return {
      ...menu,
      items: menu.items.filter((item) =>
        getMenuSidebarByRole.includes(item.href.split("/")[2])
      ),
    };
  });

  return (
    <>
      <Sidebar menuItems={filteredMenuItems} />
    </>
  )
}

export default SidebarContainer;