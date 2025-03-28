import Image from "next/image";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between p-4">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs  rounded-full ring-[1.5px] ring-gray-400 px-2">
        <Image src={"/search.png"} alt="search-icon" width={14} height={14} />
        <input type="text" placeholder="Search..." className="bg-transparent w-[200px] p-2 outline-none" />
      </div>

      {/* ICON AND USER */}
      <div className="flex items-center gap-6 w-full justify-end">
        <div className="bg-white w-7 h-7 flex items-center justify-center rounded-full cursor-pointer">
          <Image src={"/message.png"} alt="notification-icon" width={20} height={20} />
        </div>
        <div className="bg-white relative w-7 h-7 flex items-center justify-center rounded-full cursor-pointer ">
          <Image src={"/announcement.png"} alt="announcement-icon" width={20} height={20} />
          <div className="bg-purple-500 absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center text-white rounded-full text-xs">1</div>
        </div>
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