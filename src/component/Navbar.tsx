import Image from "next/image";
import HamburgerMenu from "./HamburgerMenu";
import SidebarContainer from "./SidebarContainer";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const Navbar = async () => {
  const sidebarContainerWrapper = await SidebarContainer();
  const getSessionFunc = await getSession();

  const user = await prisma.user.findUnique({
    where: { id: getSessionFunc?.userId },
    include: {
      operator: true,
      lecturer: true,
      student: true,
      role: true,
    },
  })

  const userProfile = {
    name: (user?.operator?.name || user?.student?.name || `${user?.lecturer?.frontTitle} ${user?.lecturer?.name}, ${user?.lecturer?.backTitle}`) || "User",
    role: user?.role?.name || "User",
    avatar: user?.student?.photo || user?.lecturer?.photo || "/avatar.png",
  }

  return (
    <div className="flex items-center justify-between p-4">
      {/* HAMBURGER MENU */}
      {/* <HamburgerMenu sidebar={sidebarContainerWrapper} /> */}
      <Link
        href={"/"}
        className="flex md:hidden items-center justify-center gap-2 mx-4"
      >
        <Image src={"/logo.png"} width={32} height={32} alt={"logo"} />
        <span className="text-sm font-semibold">STIMIK BANJARBARU</span>
      </Link>

      {/* ICON AND USER */}
      <div className="flex items-center gap-6 w-full justify-end">
        {/* <div className="bg-white w-7 h-7 flex items-center justify-center rounded-full cursor-pointer">
          <Image src={"/message.png"} alt="notification-icon" width={20} height={20} />
        </div>
        <div className="bg-white relative w-7 h-7 flex items-center justify-center rounded-full cursor-pointer ">
          <Image src={"/announcement.png"} alt="announcement-icon" width={20} height={20} />
          <div className="bg-purple-500 absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center text-white rounded-full text-xs">1</div>
        </div> */}
        <div className="md:hidden">
          <HamburgerMenu sidebar={sidebarContainerWrapper} userProfile={userProfile} />
        </div>
        <div className="hidden md:flex items-center gap-6">
          <div className="flex flex-col lg:w-fit">
            <span className="text-xs leading-3 font-medium text-right">{userProfile.name}</span>
            <span className="text-[10px] text-gray-500 text-right">{userProfile.role}</span>
          </div>
          <div>
            <Image src={userProfile.avatar} alt="profile-icon" width={36} height={36} className="rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
};

export default Navbar;