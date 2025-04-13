import FormContainer from "@/component/FormContainer";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Major, Prisma } from "@prisma/client";
import Image from "next/image";

type MajorDataType = Major;

const MajorListPage = async (
  { searchParams }: { searchParams: { [key: string]: string | undefined } }
) => {

  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.MajorWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { stringCode: { contains: value, mode: "insensitive" } },
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
    prisma.major.findMany({
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.major.count({ where: query }),
  ]);

  const renderRow = (item: MajorDataType) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-100 text-sm hover:bg-ternary-light"
    >
      <td className="hidden md:table-cell md:px-4">{item.stringCode}</td>
      <td className="flex items-center gap-4 p-4 md:px-0">{item.name}</td>
      <td>
        <div className="flex items-center gap-2">
          <FormContainer table="major" type="update" data={item} />
          <FormContainer table="major" type="delete" id={item.id} />
        </div>
      </td>
    </tr>
  );

  const columns = [
    {
      header: "Kode Program Studi",
      accessor: "kode program studi",
      className: "hidden md:table-cell md:px-4",
    },
    {
      header: "Program Studi",
      accessor: "program studi",
      className: "px-4 md:px-0"
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
        <h1 className="hidden md:block text-lg font-semibold">Program Studi</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <FormContainer table="major" type="create" />
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

export default MajorListPage;