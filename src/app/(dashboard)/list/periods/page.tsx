import FormContainer from "@/component/FormContainer";
import TableSearch from "@/component/TableSearch";

const PeriodListPage = () => {
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Periode Akademik</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <FormContainer table="period" type="create" />
          </div>
        </div>
      </div>
      {/* BOTTOM */}
    </div>
  )
}

export default PeriodListPage;