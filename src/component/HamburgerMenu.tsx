'use client'
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const HamburgerMenu = ({ sidebar }: { sidebar: React.ReactNode }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  console.log(openSidebar);

  const pathname = usePathname();
  useEffect(() => {
    setOpenSidebar(false)
  }, [pathname])

  return (
    <div>
      <button
        className="bg-blue-100 w-8 h-8 relative flex items-center justify-center rounded-full cursor-pointer md:hidden"
        onClick={() => setOpenSidebar(!openSidebar)}
      >
        <Image src={"/icon/hamburgerMenu.svg"} alt="notification-icon" width={21} height={21} />
      </button>
      {
        openSidebar && (
          <div className="absolute z-20 w-2/3 left-2 mt-4 py-2 px-4 rounded-lg shadow-lg bg-neutral-50 md:hidden">
            {sidebar}
          </div>
        )
      }
    </div >


  )
}

export default HamburgerMenu;