import FormContainer from "@/component/FormContainer";
import ModalAction from "@/component/ModalAction";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Course, CurriculumDetail, Prisma } from "@prisma/client";

type RecapKRS = CurriculumDetail & { course: Course };

const RecapKRSPage = async (
  { searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }
) => {
  const user = await getSession();

  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.KrsWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              {
                student: {
                  name: { contains: value, mode: "insensitive" }
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

  const [data, dataCountcourse, count] = await prisma.$transaction([
    prisma.curriculumDetail.findMany({
      where: {
        curriculum: {
          isActive: true,
        },
      },
      include: {
        course: true,
        curriculum: true,
      },
      orderBy: [
        { curriculum: { major: { name: "asc" } } },
        { semester: "asc" },
      ],
      take: 15,
      skip: 15 * (p - 1),
    }),
    prisma.krsDetail.groupBy({
      by: ["courseId"],
      where: {
        krs: {
          reregister: {
            period: {
              name: "GANJIL 2020/2021"
            },
          },
        },
      },
      _count: {
        courseId: true,
      },
    }),
    prisma.curriculumDetail.count({
      where: {
        curriculum: {
          isActive: true,
        },
      },
    }),
  ]);

  console.log('DAATA', dataCountcourse);


  const columns = [
    {
      header: "Info",
      accessor: "info",
      className: "px-2 md:px-4",
    },
    {
      header: "SKS",
      accessor: "sks",
      className: "hidden md:table-cell",
    },
    {
      header: "Semester",
      accessor: "semerster",
      className: "hidden md:table-cell",
    },
    {
      header: "Jumlah Mahasiswa",
      accessor: "jumlah mahasiswa",
      className: "hidden md:table-cell",
    },
  ];

  const renderRow = (item: RecapKRS) => {

    const countCourse = dataCountcourse.find((items: any) => item.courseId === items.courseId);

    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-4">
          <div className="flex flex-col col-span-5 items-start">
            <p className="hidden md:flex text-xs text-gray-500">{item?.course?.code ?? ""}</p>
            <h3 className="font-semibold">{item?.course?.name ?? ""}</h3>
          </div>
          <div className="flex items-center justify-end gap-2 md:hidden ">
          </div>
        </td>
        <td className="hidden md:table-cell">{item?.course?.sks ?? ""}</td>
        <td className="hidden md:table-cell">{item.semester ?? ""}</td>
        <td className="hidden md:table-cell text-center">
          {countCourse ? countCourse._count.courseId : 0}
        </td>
      </tr >
    )
  }
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Daftar Mata Kuliah yang Diambil</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {/* {canCreateData && (<FormContainer table="major" type="create" />)} */}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data || []} />
      <Pagination page={p} count={count} />
    </div>
  )
}

export default RecapKRSPage;