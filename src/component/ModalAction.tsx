'use client';

import Image from "next/image";
import { useState } from "react";


const ModalAction = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="bg-primary-light w-7 h-7 z-1 flex items-center justify-center rounded-full cursor-pointer md:hidden"
      >
        <Image src={"/icon/arrow.svg"} alt="notification-icon" width={18} height={18} className={`${open && "transform transition-transform duration-300 ease-linear"}`} />
      </button>

      {open && (
        <div className="px-4 py-3 z-10 rounded-md transition duration-1000 ease-linear">
          {children}
        </div>
      )}

    </div>
  )
}

export default ModalAction;