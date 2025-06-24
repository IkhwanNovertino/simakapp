import BigCalendar from "@/component/BigCalendar";
import FormContainer from "@/component/FormContainer";
import ModalAction from "@/component/ModalAction";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import Image from "next/image";
import Link from "next/link";

interface Schedule {
  id: string;
  name: string;
  period?: string;
}

const ScheduleDetailPage = () => {

  const data: Schedule[] = [
    { id: "1", name: "Jadwal Kuliah Genap 2023/2024", period: "GENAP 2023/2024" },
    { id: "2", name: "Jadwal Kuliah Ganjil 2024/2025", period: "GANJIL 2024/2025" },
    // Add more sample data as needed
  ];

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Data Penjadwalan</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary">
            </button> */}
          </div>
        </div>
      </div>
      <div className="w-full mt-4 h-[900px]">
        <BigCalendar />
      </div>
    </div>
  )
}

export default ScheduleDetailPage;