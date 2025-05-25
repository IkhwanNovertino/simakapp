import FormContainer from "@/component/FormContainer";
import TableSearch from "@/component/TableSearch";

const AssesmentListPage = async () => {
  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Bentuk Penilaian</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <FormContainer table="assessment" type="create" />
          </div>
        </div>
      </div>
      {/* filter badge */}
      {/* <FilterSearch data={dataFilter} /> */}
      {/* LIST */}
      {/* <Table columns={columns} renderRow={renderRow} data={data} /> */}
      {/* PAGINATION */}
      {/* <Pagination page={p} count={count} /> */}
    </div>
  )
}

export default AssesmentListPage;