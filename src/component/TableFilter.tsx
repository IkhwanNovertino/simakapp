"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const TableFilter = ({ data }: { data: { id: string | number, name: string }[] }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleClik = (itemFilter: any) => {
    const params = new URLSearchParams(window.location.search);
    params.delete("page");
    params.set("filter", itemFilter);
    router.push(`${window.location.pathname}?${params}`);
    setOpen(false);
  };
  const handleClikAll = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("filter");
    router.push(`${window.location.pathname}?${params}`);
    setOpen(false);
  }
  return (
    <div className="relative">
      <button
        className={`w-8 h-8 flex items-center justify-center rounded-full bg-primary/50`}
        onClick={() => setOpen(!open)}
      >
        <Image src={`/icon/filter.svg`} alt={`icon-filter`} width={20} height={20} />
      </button>
      {open && (
        <div className="absolute top-10 right-0 bg-white shadow-xl rounded-md p-2 z-50 w-44">
          <div className="flex items-end justify-between my-3 w-full">
            <ul className="flex flex-col w-full text-sm font-medium ">
              <li className="border-b border-gray-200 py-2.5 cursor-pointer hover:bg-primary-light/50" onClick={() => handleClikAll()}>Semua</li>
              {data.map((item: { name: string; id: string | number }) => (
                <li
                  key={item.id}
                  className="truncate border-b border-gray-200 py-2.5 cursor-pointer hover:bg-primary-light/50"
                  onClick={() => handleClik(item.id)}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableFilter;
