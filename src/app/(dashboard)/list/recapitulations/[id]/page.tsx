import ButtonPdfDownload from "@/component/ButtonPdfDownload";
import FilterSearch from "@/component/FilterSearch";
import Pagination from "@/component/Pagination";
import RecapitulationCard from "@/component/RecapitulationCard";
import RecapitulationCountChartContainer from "@/component/RecapitulationCountChartContainer";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { prisma } from "@/lib/prisma";
import { Course, CurriculumDetail, Prisma } from "@prisma/client";

type RecapitulationCourseInKrs = CurriculumDetail & { course: Course } & { studentCount: number };
const RecapitulationDetailByPeriodPage = async ({
  searchParams, params
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>,
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.CurriculumDetailWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { course: { name: { contains: value, mode: "insensitive" } } },
              { course: { code: { contains: value, mode: "insensitive" } } },
            ]
            break;
          case "filter":
            query.OR = [
              { course: { majorId: parseInt(value) } },
            ]
            break;

          default:
            break;
        }
      }
    }
  };

  const [periodForQuery, data, count, dataFilter, dataMajor] = await prisma.$transaction(async (tx: any) => {
    const periodForQuery = await tx.period.findUnique({
      where: {
        id: id,
      },
    });
    const semesterQuery = periodForQuery?.semesterType === "GANJIL" ? [1, 3, 5, 7] : [2, 4, 6, 8];
    const data = await tx.curriculumDetail.findMany({
      where: {
        ...query,
        semester: { in: semesterQuery },
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
      take: 8,
      skip: 8 * (p - 1),
    });
    const count = await tx.curriculumDetail.count({
      where: {
        ...query,
        semester: { in: semesterQuery },
        curriculum: {
          isActive: true,
        },
      },
    });

    const countCourseInKrsDetail = await tx.krsDetail.count({
      where: {
        krs: {
          reregister: {
            period: {
              id: id,
            }
          }
        }
      }
    });
    let countCourseTaken = [];
    if (countCourseInKrsDetail >= 1) {
      countCourseTaken = await tx.krsDetail.groupBy({
        by: ["courseId"],
        where: {
          krs: {
            reregister: {
              period: {
                id: id,
              },
            },
          },
        },
        _count: {
          courseId: true,
        },
      });
    };

    const dataFinal = data.map((item: any) => {
      return {
        ...item,
        studentCount: countCourseTaken.find((items: any) => item.courseId === items.courseId)?._count?.courseId || 0,
      };
    });

    const dataFilter = await tx.major.findMany({ select: { id: true, name: true } });
    dataFilter.unshift({ id: "all", name: "Semua" })
    const dataMajor = await tx.major.findMany({ select: { id: true, name: true } });

    return [periodForQuery, dataFinal, count, dataFilter, dataMajor]
  });

  const columns = [
    {
      header: "Info",
      accessor: "info",
      className: "px-2 md:px-4",
    },
    {
      header: "SKS",
      accessor: "sks",
      className: "hidden xl:table-cell",
    },
    {
      header: "Semester",
      accessor: "semerster",
      className: "hidden xl:table-cell",
    },
    {
      header: "Peserta",
      accessor: "peserta",
      className: "hidden xl:table-cell",
    },
  ];

  const renderRow = (item: RecapitulationCourseInKrs) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-4">
          <div className="flex flex-col col-span-6 items-start">
            <p className="flex text-xs text-gray-500">{item?.course?.code ?? ""}</p>
            <h3 className="font-semibold">{item?.course?.name ?? ""}</h3>
            <p className="flex xl:hidden text-xs text-gray-500">{'MK semester: ' + item.semester} | {'SKS: ' + item?.course?.sks}  </p>
            <p className="flex xl:hidden text-xs text-gray-500">{'Peserta: ' + item.studentCount + " Mahasiswa"}</p>
          </div>
        </td>
        <td className="hidden xl:table-cell">{item?.course?.sks ?? ""}</td>
        <td className="hidden xl:table-cell">{item.semester ?? ""}</td>
        <td className="hidden xl:table-cell">
          {item?.studentCount} Mahasiswa
        </td>
      </tr >
    )
  };

  return (
    <div className="p-4 flex flex-col md:flex-row gap-4">
      {/* LEFT */}
      <div className="w-full order-2 md:order-1 md:w-2/3 flex flex-col gap-4">
        <div className="hidden md:flex bg-white p-4 rounded-xl flex-1 mt-0 ">
          <h1 className="text-lg font-semibold">REKAPITULASI/LAPORAN PERIODE {periodForQuery?.name}</h1>
        </div>
        {/* MIDDLE CHART */}
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
          {/* COUNT CHART */}
          <div className="w-full  h-[380px]">
            <RecapitulationCountChartContainer type="studentsRegularSore" periodId={id} title={"Data Mahasiswa"} />
          </div>
          {dataMajor.map((items: any) => (
            <div key={items.id} className="w-full h-[380px]">
              <RecapitulationCountChartContainer type="studentActiveInactive" periodId={id} title={items.name} />
            </div>
          ))}

        </div>
        <div className="bg-white p-4 rounded-md flex-1 mt-0">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
            <h1 className="text-lg font-semibold">Daftar Mata Kuliah yang Diambil</h1>
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <TableSearch />
            </div>
          </div>
          <div className="flex flex-col xl:flex-row items-center justify-start xl:justify-between">
            <FilterSearch data={dataFilter} />
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-4 self-end">
                <a
                  href={`/api/excel?u=${id}&type=coursekrs`}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium w-fit py-2 px-4 text-gray-900 bg-primary/70 rounded-full cursor-pointer hover:bg-primary"
                >
                  Export .xlsx
                </a>
                <ButtonPdfDownload id={id} type="coursekrs">
                  <div className={`w-fit h-fit py-2 px-4 text-xs text-gray-900 font-medium flex items-center justify-center rounded-full bg-primary`}>
                    Export .pdf
                  </div>
                </ButtonPdfDownload>
              </div>
            </div>
          </div>
          <Table columns={columns} renderRow={renderRow} data={data || []} />
          <Pagination page={p} count={count} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full order-1 md:order-2 md:w-1/3 flex flex-col gap-8">
        <div className="flex flex-col justify-between flex-wrap gap-4">
          <RecapitulationCard periodId={id} type={"studentsRegisteredKrs"} label="Mahasiswa Sudah KRS" />
          <RecapitulationCard periodId={id} type={"studentsUnregisteredKrs"} label="Mahasiswa Belum KRS" />
          <RecapitulationCard periodId={id} type={"studentsTakingThesis"} label="Mahasiswa Mengambil TA" />
          <RecapitulationCard periodId={id} type={"studentsExtendingThesis"} label="Mahasiswa Perpanjangan TA" />
          <RecapitulationCard periodId={id} type={"studentsTakingInternship"} label="Mahasiswa Mengambil PKL" />
        </div>
      </div>
    </div>
  )
}

export default RecapitulationDetailByPeriodPage;