import FilterSearch from "@/component/FilterSearch";
import FormContainer from "@/component/FormContainer";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Lecturer, Major, Prisma, Role, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type LecturerDataType = Lecturer & { user: User & { role: Role } } & { major: Major };



const LecturerListPage = async (
  { searchParams }: { searchParams: { [key: string]: string | undefined } }
) => {


  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.LecturerWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { name: { contains: value, mode: "insensitive" } },
            ]
            break;
          case "filter":
            query.majorId = parseInt(value)
            break;
          default:
            break;
        }
      }
    }
  };

  const [data, count, dataFilter] = await prisma.$transaction([
    prisma.lecturer.findMany({
      where: query,
      include: {
        user: {
          include: {
            role: {
              select: {
                name: true,
                id: true
              }
            },
          },
        },
        major: true
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.lecturer.count({ where: query }),
    prisma.major.findMany({
      select: { name: true, id: true }
    }),
  ]);

  const columns = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "NPK",
      accessor: "npk",
      className: "hidden md:table-cell",
    },
    {
      header: "NIDN",
      accessor: "nidn",
      className: "hidden md:table-cell",
    },
    {
      header: "Prodi",
      accessor: "prodi",
      className: "hidden md:table-cell",
    },
    {
      header: "Role",
      accessor: "role",
      className: "hidden lg:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
    },
  ];
  const renderRow = (item: LecturerDataType) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{`${item.frontTitle} ${item.name}, ${item.backTitle}`}</h3>
          <p className="text-xs text-gray-500">{item?.user.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.npk}</td>
      <td className="hidden md:table-cell">{item.nidn}</td>
      <td className="hidden md:table-cell uppercase">{item.major?.stringCode || "-"}</td>
      <td className="hidden lg:table-cell">{item.user?.role?.name || "-"}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/lecturers/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-ternary">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {/* <FormContainer table="lecturer" type="update" data={item} /> */}
          <FormContainer table="lecturer" type="delete" id={`${item.id}:${item.userId}`} />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Data Dosen</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <FormContainer table="lecturer" type="create" />
          </div>
        </div>
      </div>
      <FilterSearch data={dataFilter} />
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  )
}

export default LecturerListPage;