import FormContainer from "@/component/FormContainer";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Prisma } from "@prisma/client";
import Image from "next/image";

type PermissionDataType = {
  id: number;
  name: string;
  description: string;
};



const PermissionListPage = async (
  { searchParams }: { searchParams: { [key: string]: string | undefined } }
) => {

  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.PermissionWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { name: { contains: value, mode: "insensitive" } },
              { description: { contains: value, mode: "insensitive" } },
            ]
            break;
          default:
            break;
        }
      }
    }
  };

  const [data, count] = await prisma.$transaction([
    prisma.permission.findMany({
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.permission.count({ where: query }),
  ]);

  const renderRow = (item: PermissionDataType) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-100 text-sm hover:bg-ternary-light"
    >
      <td className="flex items-center gap-4 p-4">{item.name}</td>
      <td className="hidden md:table-cell">{item.description}</td>
      <td>
        <div className="flex items-center gap-2">
          <FormContainer table="permission" type="update" data={item} />
          <FormContainer table="permission" type="delete" id={item.id} />
        </div>
      </td>
    </tr>
  );

  const columns = [
    {
      header: "Hak Akses",
      accessor: "hak akses",
      className: "pl-4",
    },
    {
      header: "Deskripsi",
      accessor: "deskripsi",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
    },
  ];

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Hak Akses Pengguna</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <FormContainer table="permission" type="create" />
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  )
}

export default PermissionListPage;