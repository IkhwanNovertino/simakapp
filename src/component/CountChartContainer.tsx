import Image from "next/image";
import CountChart from "./CountChart";

interface CountChartContainerProps {
  type: "students" | "studentsBymajors" | "studentsRecapActive";
  title: string;
}



const CountChartContainer = ({ type, title }: CountChartContainerProps) => {
  const legendTitle: Record<typeof type, string[]> = {
    students: ["Boys", "Girls"],
    studentsBymajors: ["S.Informasi", "T.Informatika"],
    studentsRecapActive: ["Active", "Inactive"],
  }
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">{title}</h1>
        <Image src={"/moreDark.png"} alt="more-icon" width={20} height={20} className="" />
      </div>
      {/* CHART */}
      <CountChart valueA={45} valueB={60} />
      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="bg-ternary rounded-full w-5 h-5" />
          <h1 className="font-bold">1,234</h1>
          <h2 className="text-xs text-gray-400">{legendTitle[type][0]} (55%)</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="bg-secondary rounded-full w-5 h-5" />
          <h1 className="font-bold">1,200</h1>
          <h2 className="text-xs text-gray-400">{legendTitle[type][1]} (45%)</h2>
        </div>
      </div>
    </div>
  )
}

export default CountChartContainer;