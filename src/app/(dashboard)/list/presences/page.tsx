import Pagination from "@/component/Pagination";
import PresenceStatus from "@/component/PresenceStatus";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { lecturerName } from "@/lib/utils";
import { AcademicClass, AcademicClassDetail, Course, Lecturer, Period, PresenceDetail, Prisma } from "@prisma/client";
import Image from "next/image";
import { redirect } from "next/navigation";

type AcademicClassDetailDataType = AcademicClassDetail
  & {
    academicClass: AcademicClass
    & { lecturer: Lecturer }
    & { course: Course }
    & { period: Period }
  }
  & {
    presence: PresenceDetail[]
  }

const PresenceListPage = async (
  { searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }
) => {
  const user = await getSession();
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  if (user?.roleType !== "STUDENT") {
    redirect('/list/classes')
  }

  const query: Prisma.AcademicClassDetailWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { academicClass: { name: { contains: value, mode: "insensitive" } } },
              { academicClass: { course: { name: { contains: value, mode: "insensitive" } } } },
            ]
            break;
          default:
            break;
        }
      }
    }
  };
  switch (user?.roleType) {
    case "STUDENT":
      query.student = {
        userId: user.userId,
      }
      break;
    default:
      break;
  }
  const [dataAcademicClass, dataPresence, dataTable, count] = await prisma.$transaction(async (tx: any) => {
    const dataAcademicClass = await tx.academicClassDetail.findMany({
      where: query,
      include: {
        academicClass: {
          include: {
            course: true,
            period: true,
            lecturer: true,
          }
        },
      },
      orderBy: [
        { academicClass: { period: { year: 'desc' } } },
        { academicClass: { period: { semesterType: 'asc', } } },
        { academicClass: { name: 'asc' } },
      ],
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    });
    const dataPresence = await tx.presenceDetail.findMany({
      where: {
        academicClassDetail: {
          student: {
            userId: user.userId,
          }
        }
      },
      include: {
        presence: true,
      },
      orderBy: [
        { presence: { weekNumber: 'asc' } }
      ]
    });
    const count = await tx.academicClassDetail.count({ where: query });

    const dataTable = dataAcademicClass.map((items: any) => {
      const presence = dataPresence.filter((element: any) => element.academicClassDetailId === items.id)
      return {
        ...items,
        presence: presence,
      }
    })

    return [dataAcademicClass, dataPresence, dataTable, count];
  });
  console.log(dataAcademicClass);
  console.log(dataPresence);
  console.log(dataTable);

  const columns = [
    {
      header: "Info",
      accessor: "info",
      className: "px-2 md:px-4",
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
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-4">
          <div className="flex flex-col col-span-5 items-start gap-2">
            <h3 className="font-semibold">Kelas : {item.academicClass.name}</h3>
            <h6 className="text-xs font-medium">{item.academicClass.period?.name}</h6>
            <div className="flex flex-col w-full md:w-80">
              <p className="text-xs text-gray-500">{item.academicClass.course.code}</p>
              <p className="text-xs text-gray-500 mb-1 truncate">{item.academicClass.course.name}</p>
              <p className="text-xs font-medium text-gray-800 truncate">
                {lecturerName(
                  {
                    frontTitle: item?.academicClass?.lecturer?.frontTitle,
                    name: item?.academicClass?.lecturer?.name,
                    backTitle: item?.academicClass?.lecturer.backTitle
                  }
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 md:hidden ">
            {/* <ModalAction>
              <div className="flex items-center gap-3">
                <Link href={`/list/classes/${item.id}`}>
                  <button className="w-7 h-7 flex items-center justify-center rounded-full bg-ternary">
                    <Image src="/icon/view.svg" alt="" width={20} height={20} />
                  </button>
                </Link>
                <FormContainer table="class" type="update" data={itemUpdate} />
                <FormContainer table="class" type="delete" id={item.id} />
              </div>
            </ModalAction> */}
          </div>
        </td>
        <td className="hidden md:table-cell">
          <div className="grid md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-16 gap-2">
            {item.presence.map((presenceItem: any) => (
              <PresenceStatus key={presenceItem.id} data={presenceItem} role={user?.roleType} />
            ))}
          </div>
        </td>
      </tr>
    );
  }


  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Presensi Kuliah</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary">
              <Image src="/create.png" alt="" width={14} height={14} />
            </button> */}
          </div>
        </div>
      </div>
      {/* BOTTOM */}
      <Table columns={columns} renderRow={renderRow} data={dataTable} />
      <Pagination count={count} page={p} />
    </div>
  )
}

export default PresenceListPage;