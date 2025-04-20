import Image from "next/image";
import HamburgerMenu from "./HamburgerMenu";
import SidebarContainer from "./SidebarContainer";

const Navbar = async () => {
  const sidebarContainerWrapper = await SidebarContainer();

  return (
    <div className="flex items-center justify-between p-4">
      {/* HAMBURGER MENU */}
      <HamburgerMenu sidebar={sidebarContainerWrapper} />

      {/* ICON AND USER */}
      <div className="flex items-center gap-6 w-full justify-end">
        {/* <div className="bg-white w-7 h-7 flex items-center justify-center rounded-full cursor-pointer">
          <Image src={"/message.png"} alt="notification-icon" width={20} height={20} />
        </div>
        <div className="bg-white relative w-7 h-7 flex items-center justify-center rounded-full cursor-pointer ">
          <Image src={"/announcement.png"} alt="announcement-icon" width={20} height={20} />
          <div className="bg-purple-500 absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center text-white rounded-full text-xs">1</div>
        </div> */}
        <div className="flex flex-col w-28 lg:w-fit">
          <span className="text-xs leading-3 font-medium text-right truncate text-ellipsis">November Ish</span>
          <span className="text-[10px] text-gray-500 text-right">Admin</span>
        </div>
        <div>
          <Image src={"/avatar.png"} alt="profile-icon" width={36} height={36} className="rounded-full" />
        </div>
      </div>
    </div>
  )
};

export default Navbar;