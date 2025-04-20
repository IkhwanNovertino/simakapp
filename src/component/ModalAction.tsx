'use client';

import Image from "next/image";
import { useState } from "react";


const ModalAction = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="absolute right-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="bg-primary-light w-8 h-8 relative flex items-center justify-center rounded-full cursor-pointer md:hidden"
      >
        <Image src={"/icon/arrow.svg"} alt="notification-icon" width={21} height={21} className={`${open && "transform rotate-y-180 transition-transform duration-300 ease-linear"}`} />
      </button>

      {open && (
        <div className="absolute z-20 -top-3.5 right-9 bg-primary-light p-4 rounded-md transition duration-1000 ease-linear">
          {children}
        </div>
      )}

    </div>
  )
}

export default ModalAction;