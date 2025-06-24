import FormContainer from "@/component/FormContainer";
import ModalAction from "@/component/ModalAction";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { AcademicClass, Course, Lecturer, Major, Period, Prisma, Room } from "@prisma/client";
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
            query.name = { contains: value, mode: "insensitive" };
            break;
          // case "filter":
          //   query.majorId = parseInt(value)
          //   break;
          default:
            break;
        }
      }
    }
  };

  const [data, count, dataFilter] = await prisma.$transaction([
    prisma.academicClass.findMany({
      where: query,
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
      // orderBy: [
      //   { : "desc" },
      // ],
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.academicClass.count({ where: query }),
    prisma.major.findMany({
      select: { id: true, name: true }
    })
  ]);

  // contoh data yang dikirim ke form
  // const contohData = {
  //   periodId: period.id,
  //   periodName: period.name,
  //   courseId: "",
  //   lecturerId: "",
  //   roomId: "",
  //   name: "",
  // }

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
    //   periodId: period.id,
    //   periodName: period.name,
    //   courseId: "",
    //   lecturerId: "",
    //   roomId: "",
    //   name: "",
    // }
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-4">
          <div className="flex flex-col col-span-5 items-start gap-2">
            <h3 className="font-semibold">Kelas : {item.name}</h3>
            <div className="flex flex-col w-full md:w-36">
              <p className="text-xs text-gray-500">{item.course.code}</p>
              <p className="text-xs text-gray-500 truncate">{item.course.name}</p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 md:hidden ">
            <ModalAction>
              <div className="flex items-center gap-3">
                <FormContainer table="class" type="update" data={itemUpdate} />
                <FormContainer table="class" type="delete" id={item.id} />
              </div>
            </ModalAction>
          </div>
        </td>
        <td className="hidden md:table-cell md:w-36">
          <span className="truncate">{`${item.lecturer.frontTitle ? item.lecturer.frontTitle + " " : ""}${item.lecturer.name} ${item.lecturer.backTitle ? "," + item.lecturer.backTitle : ""}`}</span>
        </td>
        <td className="hidden md:table-cell">{item.room?.name}</td>
        <td className="hidden md:table-cell">{item.period?.name}</td>
        <td>
          <div className="hidden md:flex items-center gap-2">
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
            <FormContainer type="create" table="class" data={{ periodId: period.id, periodName: period.name }} />
          </div>
        </div>
      </div>
      <Table columns={columns} data={data} renderRow={renderRow} />
    </div>
  )
}

export default ClassListPage;