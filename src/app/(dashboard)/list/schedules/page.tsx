import TableSearch from "@/component/TableSearch";
import Image from "next/image";

const ScheduleListPage = () => {
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Data Penjadwalan</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary">
              <Image src="/create.png" alt="" width={14} height={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScheduleListPage;