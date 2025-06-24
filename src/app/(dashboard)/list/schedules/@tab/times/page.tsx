import FormContainer from "@/component/FormContainer";
import ModalAction from "@/component/ModalAction";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";

interface Schedule {
  id: string;
  timeStart: string;
  timeFinish: string;
}

const TimeListPage = () => {

  const data: Schedule[] = [
    { id: "1", timeStart: "08:00", timeFinish: "10:00" },
    { id: "2", timeStart: "10:00", timeFinish: "12:00" },
    // Add more sample data as needed
  ];

  const columns = [
    {
      header: "Info",
      accessor: "info",
      className: "px-2 md:px-4"
    },
    {
      header: "Actions",
      accessor: "action",
      className: "hidden md:table-cell",
    },
  ];

  const renderRow = (item: Schedule) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
    >
      <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-4">
        <div className="flex flex-col col-span-5 items-start">
          <h3 className="font-semibold">{item.timeStart} - {item.timeFinish}</h3>
        </div>
        <div className="flex items-center justify-end gap-2 md:hidden ">
          <ModalAction>
            <div className="flex items-center gap-3">
              <FormContainer table="period" type="update" data={item} />
              <FormContainer table="period" type="delete" id={item.id} />
            </div>
          </ModalAction>
        </div>
      </td>
      <td>
        <div className="hidden md:flex items-center gap-2">
          <FormContainer table="period" type="update" data={item} />
          <FormContainer table="period" type="delete" id={item.id} />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Data Waktu Pelajaran</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary">
            </button> */}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      {/* <Pagination page={p} count={count} /> */}
    </div>
  )
}

export default TimeListPage;