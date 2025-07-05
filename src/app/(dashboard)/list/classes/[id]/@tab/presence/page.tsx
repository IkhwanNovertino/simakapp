
import FormContainer from "@/component/FormContainer";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { lecturerName } from "@/lib/utils";
import { AcademicClass, AcademicClassDetail, Course, Lecturer, Prisma, Student, } from "@prisma/client";

type AcademicClassDetailDataType = AcademicClassDetail
  & {
    academicClass: AcademicClass
    & { lecturer: Lecturer }
    & { course: Course }
  }
  & { student: Student }

const ClassSingleTabStudentPage = async (
  {
    searchParams, params
  }: {
    searchParams: Promise<{ [key: string]: string | undefined }>,
    params: Promise<{ id: string }>
  }
) => {

  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;
  const { id } = await params;

  const query: Prisma.ReregisterDetailWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { student: { name: { contains: value, mode: "insensitive" } } },
              { student: { nim: { contains: value, mode: "insensitive" } } },
            ]
            break;
          default:
            break;
        }
      }
    }
  };

  const [dataAcademicClass, data, count] = await prisma.$transaction([
    prisma.academicClass.findFirst({
      where: {
        id: id,
      },
      include: {
        lecturer: true,
        course: true,
      }
    }),
    prisma.academicClassDetail.findMany({
      where: {
        academicClassId: id,
      },
      include: {
        student: true,
      },
      orderBy: [
        { student: { nim: 'asc' } },
      ],
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.academicClassDetail.count({
      where: {
        academicClassId: id,
      },
    }),
  ]);

  const columns = [
    {
      header: "Mahasiswa",
      accessor: "mahasiswa",
      className: "px-2 md:px-4"
    },
    {
      header: "Presensi Perkuliahan",
      accessor: "presensi perkuliahan",
      className: "hidden md:table-cell",
    },
  ];

  const renderRow = (item: AcademicClassDetailDataType) => {

    return (
      <tr
        key={item.studentId}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-4 lg:w-80">
          <div className="flex flex-col col-span-5 items-start w-full">
            <h3 className="text-sm font-semibold truncate">{item.student.name}</h3>
            <p className="text-xs text-gray-600">{item.student.nim}</p>
          </div>
          <div className="flex items-center justify-end gap-2 md:hidden ">
            <FormContainer table="classDetail" type="delete" id={item.id} />
          </div>
        </td>
        <td className="hidden md:table-cell">
          <div className="grid grid-cols-16 gap-2">
            <div className="bg-primary w-8 h-7 rounded-md flex justify-center items-center text-xs font-bold">H</div>
            <div className="bg-accent w-8 h-7 rounded-md flex justify-center items-center text-xs font-bold">A</div>
            <div className="bg-ternary w-8 h-7 rounded-md flex justify-center items-center text-xs font-bold">I</div>
            <div className="bg-secondary w-8 h-7 rounded-md flex justify-center items-center text-xs font-bold">S</div>
            <div className="bg-gray-300 w-8 h-7 rounded-md flex justify-center items-center text-xs font-bold">-</div>
            <div className="bg-gray-300 w-8 h-7 rounded-md flex justify-center items-center text-xs font-bold">-</div>
            <div className="bg-gray-300 w-8 h-7 rounded-md flex justify-center items-center text-xs font-bold">-</div>
            <div className="bg-gray-300 w-8 h-7 rounded-md flex justify-center items-center text-xs font-bold">-</div>
            <div className="bg-gray-300 w-8 h-7 rounded-md flex justify-center items-center text-xs font-bold">-</div>
            <div className="bg-gray-300 w-8 h-7 rounded-md flex justify-center items-center text-xs font-bold">-</div>
            <div className="bg-gray-300 w-8 h-7 rounded-md flex justify-center items-center text-xs font-bold">-</div>
            <div className="bg-gray-300 w-8 h-7 rounded-md flex justify-center items-center text-xs font-bold">-</div>
            <div className="bg-gray-300 w-8 h-7 rounded-md flex justify-center items-center text-xs font-bold">-</div>
            <div className="bg-gray-300 w-8 h-7 rounded-md flex justify-center items-center text-xs font-bold">-</div>
            <div className="bg-gray-300 w-8 h-7 rounded-md flex justify-center items-center text-xs font-bold">-</div>
            <div className="bg-gray-300 w-8 h-7 rounded-md flex justify-center items-center text-xs font-bold">-</div>
          </div>
        </td>
        {/* <td className="hidden md:flex">
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <FormContainer table="classDetail" type="delete" id={item.id} />
            </div>
          </div>
        </td> */}
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between md:mb-6">
        <h1 className="text-base font-semibold">Daftar Presensi</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <FormContainer table="classDetail" type="create" data={dataAcademicClass} />
          </div>
        </div>
      </div>
      {/* BOTTOM */}
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count || 0} />
    </div>
  )
}

export default ClassSingleTabStudentPage;