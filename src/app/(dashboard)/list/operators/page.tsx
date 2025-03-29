import FormContainer from "@/component/FormContainer";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { role, teachersData } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Operator, Prisma, Role, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { date } from "zod";

type OperatorDataType = Operator & { user: { role: Role } };

const OperatorListPage = async (
  { searchParams }: { searchParams: { [key: string]: string | undefined } }
) => {
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.OperatorWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { name: { contains: value, mode: "insensitive" } },
              { department: { contains: value, mode: "insensitive" } },
              {
                user: {
                  role: {
                    name: { contains: value, mode: "insensitive" }
                  }
                }
              }
            ]
            break;
          default:
            break;
        }
      }
    }
  };

  const [data, count] = await prisma.$transaction([
    prisma.operator.findMany({
      where: query,
      include: {
        user: {
          include: {
            role: { select: { name: true } }
          }
        }
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.operator.count({ where: query }),
  ]);

  console.log(data);


  const columns = [
    {
      header: "Nama Operator",
      accessor: "nama operator",
    },
    {
      header: "Bagian",
      accessor: "bagian",
      className: "hidden md:table-cell",
    },
    {
      header: "Role Pengguna",
      accessor: "role pengguna",
      className: "",
    },
    {
      header: "Actions",
      accessor: "action",
    },
  ];

  const renderRow = (item: OperatorDataType) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 py-4">
        {item.name}
      </td>
      <td className="hidden md:table-cell">{item.department || "-"}</td>
      <td className="flex">{item.user.role.name}</td>
      <td>
        <div className="flex items-center gap-2">
          <FormContainer table="operator" type="update" data={item} />
          <FormContainer table="operator" type="delete" id={`${item.id}:${item.userId}`} />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Data Operator</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <FormContainer table="operator" type="create" />
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

export default OperatorListPage;