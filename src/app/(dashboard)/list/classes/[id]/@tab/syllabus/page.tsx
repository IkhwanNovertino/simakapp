
import FormContainer from "@/component/FormContainer";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE, learningMethod } from "@/lib/setting";
import { lecturerName } from "@/lib/utils";
import { AcademicClass, AcademicClassDetail, Course, Lecturer, Presence, Prisma, Student, } from "@prisma/client";
import { duration } from "moment";
import Image from "next/image";

type PresenceDataType = Presence
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

  const query: Prisma.PresenceWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          // case "search":
          //   query.OR = [
          //     { student: { name: { contains: value, mode: "insensitive" } } },
          //     { student: { nim: { contains: value, mode: "insensitive" } } },
          //   ]
          //   break;
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
        course: true,
      }
    }),
    prisma.presence.findMany({
      where: {
        academicClassId: id,
        ...query,
      },
      orderBy: [
        { weekNumber: 'asc' },
      ],
    }),
    prisma.presence.count({
      where: {
        academicClassId: id,
        ...query,
      },
    }),
  ]);

  let dataPassToForm;
  dataPassToForm = {
    id: "",
    academicClassId: id,
    academicClass: dataAcademicClass,
    weekNumber: count + 1,
    date: new Date(),
    duration: "",
    learningMethod: [],
    lesson: "",
    lessonDetail: "",
  }

  const columns = [
    {
      header: "Info",
      accessor: "Info",
      className: "px-2 lg:hidden"
    },
    {
      header: "No.",
      accessor: "no.",
      className: "hidden lg:table-cell md:px-2"
    },
    {
      header: "Tanggal",
      accessor: "Tanggal",
      className: "hidden lg:table-cell",
    },
    {
      header: "Pokok Bahasan",
      accessor: "pokok bahasan",
      className: "hidden lg:table-cell",
    },
    {
      header: "Metode",
      accessor: "metode",
      className: "hidden lg:table-cell",
    },
    {
      header: "Waktu",
      accessor: "waktu",
      className: "hidden lg:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
      className: "hidden lg:table-cell",
    },
  ];

  const renderRow = (item: PresenceDataType) => {

    dataPassToForm = {
      id: item.id,
      academicClassId: item.academicClassId,
      academicClass: dataAcademicClass,
      weekNumber: item.weekNumber,
      date: item.date,
      duration: item.duration,
      lesson: item.lesson,
      lessonDetail: item.lessonDetail,
      learningMethod: item?.learningMethod === null ? [] : item?.learningMethod.split(",")
    }

    return (
      <tr
        key={item.id}
        className="border-b border-gray-300 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="grid grid-cols-6 lg:hidden py-4 px-2">
          {/* <div className="flex flex-col col-span-5 items-start">
            <h3 className="text-sm font-semibold">{item.student.name}</h3>
            <p className="text-xs text-gray-600">{item.student.nim}</p>
          </div>
          <div className="flex items-center justify-end gap-2 md:hidden ">
            <FormContainer table="classDetail" type="delete" id={item.id} />
          </div> */}
        </td>
        <td className="hidden lg:table-cell lg:px-2 lg:py-4">{item.weekNumber}</td>
        <td className="hidden lg:table-cell">{new Intl.DateTimeFormat("id-ID").format(item.date || Date.now())}</td>
        <td className="hidden lg:flex lg:flex-col lg:py-4 lg:w-[376px]">
          <h5 className="text-sm font-semibold">Pokok bahasan :</h5>
          <p className="text-sm font-light mb-2 tracking-wide">{item.lesson}</p>
          <h5 className="text-sm font-semibold">Sub pokok bahasan :</h5>
          <p className="text-sm font-light mb-2 tracking-wide">{item.lessonDetail}</p>
        </td>
        <td className="hidden lg:table-cell">
          <ul className="list-disc list-inside">
            {dataPassToForm.learningMethod.map((item: string) => (
              <li key={item} className="text-xs font-light">{item}</li>
            ))}
          </ul>
        </td>
        <td className="hidden lg:table-cell text-sm font-light">45 menit</td>
        <td>
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2">
              <FormContainer table="presence" type="update" data={dataPassToForm} />
              <FormContainer table="presence" type="delete" id={item.id} />
              <FormContainer table="presenceDetail" type="create" data={dataPassToForm}>
                <button className={`w-7 h-7 flex items-center justify-center rounded-full ${item.isActive ? "bg-primary-dark" : "bg-accent-dark"} `}>
                  <Image src="/icon/attendance-white.svg" alt="" width={18} height={18} />
                </button>
              </FormContainer>
            </div>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between md:mb-6">
        <h1 className="text-base font-semibold">Data Perkuliahan</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* <TableSearch /> */}
          <div className="flex items-center gap-4 self-end">
            <FormContainer table="presence" type="create" data={dataPassToForm} />
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