import Announcements from "@/component/Announcements";
import CountChart from "@/component/CountChart";
import EventCalender from "@/component/EventCalender";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import UserCard from "@/component/UserCard";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Period, Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type PeriodDataType = Period;
const RecapDetailPage = async (
  {
    searchParams, params
  }: {
    searchParams: Promise<{ [key: string]: string | undefined }>,
    params: Promise<{ id: string }>
  }
) => {
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const { id } = await params;

  const dataPeriod = await prisma.period.findUnique({
    where: {
      id: id,
    },
  });

  return (
    // <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
    //   {/* TOP */}
    //   <div className="flex items-center justify-between">
    //     <h1 className="hidden md:block text-lg font-semibold">Rekapitulasi/Laporan</h1>
    //     <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
    //     </div>
    //   </div>
    // </div>
    <div className="p-4 flex flex-col md:flex-row gap-4">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARD */}
        <div className="flex justify-between flex-wrap gap-4">
          <UserCard type="Students" />
          <UserCard type="Teachers" />
          <UserCard type="Parents" />
          <UserCard type="Staff" />
        </div>
        {/* MIDDLE CHART */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/2 h-[450px]">
            <CountChart title="Mahasiswa/i" />
          </div>
          <div className="w-full lg:w-1/2 h-[450px]">
            <CountChart title="Program Studi" />
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalender />
        <Announcements />
      </div>
    </div>
  )
}

export default RecapDetailPage;