import FormContainer from "@/component/FormContainer";
import ModalAction from "@/component/ModalAction";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Period, Prisma, Reregister } from "@prisma/client";

type ReregisterDataType = Reregister & { period: Period };

const ReregisterListPage = async (
  { searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }
) => {
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.ReregisterWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { name: { contains: value, mode: "insensitive" } },
            ]
            break;
          default:
            break;
        }
      }
    }
  };

  const [data, count] = await prisma.$transaction([
    prisma.reregister.findMany({
      where: query,
      include: {
        period: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.reregister.count({ where: query }),
  ]);

  const columns = [
    {
      header: "Info",
      accessor: "info",
      className: "px-4"
    },
    {
      header: "Periode Akademik",
      accessor: "periode akademik",
      className: "hidden md:table-cell",
    },
    {
      header: "Tahun",
      accessor: "tahun",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
      className: "hidden md:table-cell",
    },
  ];

  const renderRow = (item: ReregisterDataType) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        {item.name}
      </td>
      <td className="hidden md:table-cell">{item.period?.name || "-"}</td>
      <td className="hidden md:table-cell">{item.period?.year || "-"}</td>
      <td>
        <div className="flex items-center gap-2">
          <div className="md:hidden relative flex items-center justify-end gap-2">
            <ModalAction>
              <div className="flex items-center gap-3">
                <FormContainer table="reregistration" type="update" data={item} />
                <FormContainer table="reregistration" type="delete" id={item.id} />
              </div>
            </ModalAction>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <FormContainer table="reregistration" type="update" data={item} />
            <FormContainer table="reregistration" type="delete" id={item.id} />
          </div>
        </div>
      </td>
    </tr>
  );
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Herregistrasi</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <FormContainer table="reregistration" type="create" />
          </div>
        </div>
      </div>
      {/* BOTTOM */}
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  )
}

export default ReregisterListPage;