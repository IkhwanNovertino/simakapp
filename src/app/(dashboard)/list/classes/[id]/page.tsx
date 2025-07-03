
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

const ClassSinglePage = async (
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
      header: "Actions",
      accessor: "action",
      className: "hidden md:table-cell",
    },
  ];

  const renderRow = (item: AcademicClassDetailDataType) => {

    return (
      <tr
        key={item.studentId}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-4">
          <div className="flex flex-col col-span-5 items-start">
            <h3 className="text-sm font-semibold">{item.student.name}</h3>
            <p className="text-xs text-gray-600">{item.student.nim}</p>
          </div>
          <div className="flex items-center justify-end gap-2 md:hidden ">
            <FormContainer table="classDetail" type="delete" id={item.id} />
          </div>
        </td>
        <td>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <FormContainer table="classDetail" type="delete" id={item.id} />
            </div>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="flex-1 p-4 flex flex-col gap-4">
      {/* TOP */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* USER INFO CARD */}
        <div className="bg-primary py-6 px-8 rounded-md flex-1 flex gap-4 w-full lg:w-3/4">
          <div className="w-full md:w-3/4 flex flex-col justify-between gap-4">
            <header>
              <h1 className="text-xl font-semibold">{dataAcademicClass?.course?.name || ""} </h1>
              <div className="h-0.5 w-full bg-gray-300" />
              <p className="text-sm text-slate-600 font-medium mt-1">
                {dataAcademicClass?.course?.code} | Kelas {dataAcademicClass.name}
              </p>
            </header>
            <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
              <div className="w-full 2xl:w-1/3 gap-2 flex items-center">
                <span className="basis-32">Dosen Pengampu</span>
                <span>:</span>
                <span>
                  {lecturerName(
                    {
                      frontTitle: dataAcademicClass?.lecturer?.frontTitle,
                      name: dataAcademicClass?.lecturer?.name,
                      backTitle: dataAcademicClass.lecturer.backTitle
                    }
                  )}
                </span>
              </div>
              <div className="w-full 2xl:w-1/3 gap-2 flex items-center">
                <span className="basis-32">Thn. Akad</span>
                <span >:</span>
                <span>GANJIL 2023/2024</span>
              </div>
              <div className="w-full 2xl:w-1/3 gap-2 flex items-center">
                <span className="basis-32">Semester</span>
                <span>:</span>
                <span>3</span>
              </div>
              <div className="w-full 2xl:w-1/3 gap-2 flex items-center">
                <span className="basis-32">Jadwal</span>
                <span>:</span>
                <span>Rabu, 09:40 - 11:20</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white w-full lg:w-1/4 flex flex-col gap-4 p-4 rounded-md"></div>
      </div>
      {/* BOTTOM */}
      <div className="bg-white p-4 rounded-md flex-1 mt-0">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between md:mb-6">
          <h1 className="text-base font-semibold">Data Peserta Mata Kuliah</h1>
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
    </div>
  )
}

export default ClassSinglePage;