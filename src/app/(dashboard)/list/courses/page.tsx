import FilterSearch from "@/component/FilterSearch";
import FormContainer from "@/component/FormContainer";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { role, teachersData } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Course, Major, Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type CourseDataType = Course & { major: Major };

const columns = [
  {
    header: "Mata Kuliah",
    accessor: "mata kuliah",
    className: "px-4",
  },
  {
    header: "Kode",
    accessor: "kode",
    className: "hidden md:table-cell",
  },
  {
    header: "SKS",
    accessor: "sks",
    className: "hidden md:table-cell",
  },
  {
    header: "Program Studi",
    accessor: "program studi",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const CourseListPage = async (
  { searchParams }: { searchParams: { [key: string]: string | undefined } }
) => {

  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.CourseWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { code: { contains: value, mode: "insensitive" } },
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
    prisma.course.findMany({
      where: query,
      include: {
        major: {
          select: {
            id: true,
            name: true
          }
        }
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.course.count({ where: query }),
    prisma.major.findMany({
      select: { id: true, name: true }
    })
  ]);


  const renderRow = (item: CourseDataType) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center p-4">{item.name}</td>
      <td className="hidden md:table-cell">{item.code}</td>
      <td className="hidden lg:table-cell">{item.sks}</td>
      <td className="hidden lg:table-cell lg:capitalize">{item.major?.name}</td>
      <td>
        <div className="flex items-center gap-2">
          <FormContainer table="course" type="update" data={item} />
          <FormContainer table="course" type="delete" id={item.id} />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Data Mata Kuliah</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <FormContainer table="course" type="create" />
          </div>
        </div>
      </div>
      {/* filter badge */}
      <FilterSearch data={dataFilter} />
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  )
}

export default CourseListPage;