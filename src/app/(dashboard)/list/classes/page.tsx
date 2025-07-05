import FilterSearch from "@/component/FilterSearch";
import FormContainer from "@/component/FormContainer";
import ModalAction from "@/component/ModalAction";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { lecturerName } from "@/lib/utils";
import { AcademicClass, Course, Lecturer, Major, Period, Prisma, Room } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type AcademicClassDataType = AcademicClass & { course: Course & { major: Major } } & { lecturer: Lecturer } & { room: Room } & { period: Period };

const ClassListPage = async (
  { searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }
) => {

  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const period = await prisma.period.findFirst({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
    },
  });

  const query: Prisma.AcademicClassWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { name: { contains: value, mode: "insensitive" } },
              { period: { name: { contains: value, mode: "insensitive" } } },
              { course: { name: { contains: value, mode: "insensitive" } } },
              { course: { code: { contains: value, mode: "insensitive" } } },
            ]
            break;
          case "filter":
            query.OR = [
              { course: { majorId: parseInt(value) } }
            ]
            break;
          default:
            break;
        }
      }
    }
  };

  const [data, count, dataFilter] = await prisma.$transaction([
    prisma.academicClass.findMany({
      where: {
        ...query,
        // course: { majorId: 1 },
      },
      include: {
        course: {
          include: {
            major: true,
          }
        },
        period: true,
        lecturer: true,
        room: true,
      },
      orderBy: [
        { period: { year: "desc" } },
        { period: { semesterType: "asc" } },
        { name: 'asc' },
      ],
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.academicClass.count({ where: query }),
    prisma.major.findMany({
      select: { id: true, name: true }
    })
  ]);

  dataFilter.unshift({ id: "all", name: "Semua" })


  const columns = [
    {
      header: "Info",
      accessor: "info",
      className: "px-2 md:px-4",
    },
    {
      header: "Dosen Pengampu",
      accessor: "lecturer",
      className: "hidden md:table-cell",
    },
    {
      header: "Ruang",
      accessor: "room",
      className: "hidden md:table-cell",
    },
    {
      header: "Periode",
      accessor: "period",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
      className: "hidden md:table-cell",
    },
  ];

  const renderRow = (item: AcademicClassDataType) => {
    const itemUpdate = {
      id: item.id,
      name: item.name,
      courseId: item.course.id,
      course: item.course,
      lecturerId: item.lecturer.id,
      roomId: item.room.id,
      periodId: item.period.id,
      periodName: item.period.name,
      semester: item.semester,
    }
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-4">
          <div className="flex flex-col col-span-5 items-start gap-2">
            <h3 className="font-semibold">Kelas : {item.name}</h3>
            <div className="flex flex-col w-full md:w-44">
              <p className="text-sm text-gray-500">{item.course.code}</p>
              <p className="text-sm text-gray-500 truncate">{item.course.name}</p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 md:hidden ">
            <ModalAction>
              <div className="flex items-center gap-3">
                <Link href={`/list/classes/${item.id}`}>
                  <button className="w-7 h-7 flex items-center justify-center rounded-full bg-ternary">
                    <Image src="/icon/view.svg" alt="" width={20} height={20} />
                  </button>
                </Link>
                <FormContainer table="class" type="update" data={itemUpdate} />
                <FormContainer table="class" type="delete" id={item.id} />
              </div>
            </ModalAction>
          </div>
        </td>
        <td className="hidden md:table-cell md:w-36 pr-2">
          <p className="truncate">
            {lecturerName(
              {
                frontTitle: item?.lecturer?.frontTitle,
                name: item?.lecturer?.name,
                backTitle: item.lecturer.backTitle
              }
            )}
          </p>
        </td>
        <td className="hidden md:table-cell">{item.room?.name}</td>
        <td className="hidden md:table-cell">{item.period?.name}</td>
        <td>
          <div className="hidden md:flex items-center gap-2">
            <Link href={`/list/classes/${item.id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-ternary">
                <Image src="/icon/view.svg" alt="" width={20} height={20} />
              </button>
            </Link>
            <FormContainer table="class" type="update" data={itemUpdate} />
            <FormContainer table="class" type="delete" id={item.id} />
          </div>
        </td>
      </tr>
    );
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Data Kelas</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <FormContainer type="create" table="class" data={{ periodId: period?.id, periodName: period?.name }} />
          </div>
        </div>
      </div>
      <FilterSearch data={dataFilter} />
      <Table columns={columns} data={data} renderRow={renderRow} />
      <Pagination count={count} page={p} />
    </div>
  )
}

export default ClassListPage;