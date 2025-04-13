import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { role, teachersData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";


const ClassListPage = () => {
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Data Kelas</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary">
              <Image src="/create.png" alt="" width={14} height={14} />
            </button>
            {/* {role === "admin" && (
              <FormModal table="teacher" type="create" />
            )} */}
          </div>
        </div>
      </div>
      {/* LIST */}
      {/* <Table columns={columns} renderRow={renderRow} data={teachersData} /> */}
      {/* PAGINATION */}
      {/* <Pagination /> */}
    </div>
  )
}

export default ClassListPage;