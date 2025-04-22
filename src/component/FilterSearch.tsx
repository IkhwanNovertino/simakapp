"use client";

import { useRouter } from "next/navigation";
import React from "react";

const FilterSearch = ({ data }: { data: any }) => {
  const router = useRouter();

  const handleClik = (itemFilter: any) => {
    const params = new URLSearchParams(window.location.search);
    params.delete("page");
    params.set("filter", itemFilter);
    router.push(`${window.location.pathname}?${params}`);
  };
  const handleClikAll = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("filter");
    router.push(`${window.location.pathname}?${params}`);
  }
  return (
    <>
      <div className="flex items-end justify-between my-4">
        <div className="flex flex-row flex-wrap  gap-2 w-full md:w-auto">
          <div
            onClick={() => handleClikAll()}
            className="text-xs py-2 px-4 bg-gray-100 text-gray-900 rounded-full cursor-pointer capitalize"
          >
            {"Semua"}
          </div>
          {data.map((item: { name: string; id: string }) => (
            <div
              key={item.id}
              onClick={() => handleClik(item.id)}
              className="text-xs py-2 px-4 even:bg-primary-light odd:bg-secondary-light text-gray-900 rounded-full cursor-pointer capitalize"
            >
              {item.name || ""}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FilterSearch;
