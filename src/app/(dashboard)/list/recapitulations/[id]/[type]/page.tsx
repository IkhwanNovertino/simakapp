import ButtonPdfDownload from "@/component/ButtonPdfDownload";
import FilterSearch from "@/component/FilterSearch";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { RecapitulationCardType } from "@/lib/datatype";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { previousPeriod } from "@/lib/utils";
import { CampusType, Krs, Major, Prisma, ReregisterDetail, SemesterStatus, SemesterType, Student } from "@prisma/client";
import { notFound } from "next/navigation";

// type RenderRowDataType = Krs & { student: Student & { major: Major } } | ReregisterDetail & { student: Student & { major: Major } } & { semesterStatus: SemesterStatus } & { campusType: CampusType };

async function dataTable({
  queryType, type, queryParams, periodId, p
}: {
  queryType: any,
  type: string,
  queryParams: { [key: string]: string | undefined },
  periodId: string,
  p: number

}): Promise<[data: { [key: string]: string | number | undefined }[], count: number]> {
  // const query: queryType = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            queryType.OR = [
              { student: { name: { contains: value, mode: "insensitive" } } },
              { student: { nim: { contains: value, mode: "insensitive" } } },
              { student: { major: { name: { contains: value, mode: "insensitive" } } } },
            ]
            break;
          case "filter":
            queryType.OR = [
              { student: { major: { id: parseInt(value) } } },
            ]
            break;
          default:
            break;
        }
      }
    }
  };


  const [data, count] = await prisma.$transaction(async (tx: any) => {
    let data = [];
    let count = 0;

    if (type === "studentsRegisteredKrs") {
      data = await tx.krs.findMany({
        where: {
          reregister: {
            periodId: periodId,
          },
          krsDetail: {
            some: {},
          },
          ...queryType,
        },
        select: {
          student: {
            select: {
              nim: true,
              name: true,
              major: true,
            }
          }
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
        orderBy: [
          { student: { nim: "desc" } }
        ],
      });
      count = await tx.krs.count({
        where: {
          reregister: {
            periodId: periodId,
          },
          krsDetail: {
            some: {},
          },
          ...queryType,
        },
      });
    }
    if (type === "studentsUnregisteredKrs") {
      data = await tx.krs.findMany({
        where: {
          reregister: {
            periodId: periodId,
          },
          krsDetail: {
            none: {},
          },
          ...queryType,
        },
        select: {
          student: {
            select: {
              nim: true,
              name: true,
              major: true,
            }
          }
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
        orderBy: [
          { student: { nim: "desc" } }
        ],
      });
      count = await tx.krs.count({
        where: {
          reregister: {
            periodId: periodId,
          },
          krsDetail: {
            none: {},
          },
          ...queryType,
        },
      });
    }
    if (type === "studentsTakingThesis") {
      data = await tx.krs.findMany({
        where: {
          reregister: {
            periodId: periodId,
          },
          krsDetail: {
            some: {
              course: {
                isSkripsi: true,
              },
            },
          },
          ...queryType,
        },
        select: {
          student: {
            select: {
              nim: true,
              name: true,
              major: true,
            }
          }
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
        orderBy: [
          { student: { nim: "desc" } }
        ],
      });
      count = await tx.krs.count({
        where: {
          reregister: {
            periodId: periodId,
          },
          krsDetail: {
            some: {
              course: {
                isSkripsi: true,
              },
            },
          },
          ...queryType,
        },
      });
    }
    if (type === "studentsExtendingThesis") {
      const currentPeriod = await tx.period.findUnique({
        where: {
          id: periodId,
        }
      });
      const getPrevPeriod = await previousPeriod({ semesterType: currentPeriod.semesterType, year: currentPeriod.year });
      const studentThesis = await tx.krs.findMany({
        where: {
          reregister: {
            periodId: periodId,
          },
          krsDetail: {
            some: {
              course: {
                isSkripsi: true,
              },
            },
          },
          ...queryType,
        },
        select: {
          studentId: true,
          student: {
            select: {
              nim: true,
              name: true,
              major: true,
            }
          }
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
        orderBy: [
          { student: { nim: "desc" } }
        ],
      });

      const studentPrevPeriod = await tx.krs.findMany({
        where: {
          reregister: {
            period: {
              semesterType: getPrevPeriod.semesterType,
              year: getPrevPeriod.year,
            },
          },
          krsDetail: {
            some: {
              course: {
                isSkripsi: true,
              },
            },
          },
        },
        select: {
          studentId: true,
        },
      });

      data = studentThesis.filter((student: any) => new Set(studentPrevPeriod.map((items: any) => items.studentId)).has(student.studentId));
      count = data.length;
    }
    if (type === "studentsTakingInternship") {
      data = await tx.krs.findMany({
        where: {
          reregister: {
            periodId: periodId,
          },
          krsDetail: {
            some: {
              course: {
                isPKL: true,
              },
            },
          },
          ...queryType,
        },
        select: {
          student: {
            select: {
              nim: true,
              name: true,
              major: true,
            }
          }
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
        orderBy: [
          { student: { nim: "desc" } }
        ],
      });
      count = await tx.krs.count({
        where: {
          reregister: {
            periodId: periodId,
          },
          krsDetail: {
            some: {
              course: {
                isPKL: true,
              },
            },
          },
          ...queryType,
        },
      });
    }
    if (type === "studentActiveInactive") {
      data = await tx.reregisterDetail.findMany({
        where: {
          reregister: {
            periodId: periodId,
          },
          ...queryType,
        },
        select: {
          student: {
            select: {
              nim: true,
              name: true,
              major: true,
            }
          },
          semesterStatus: true,
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
        orderBy: [
          { student: { nim: "desc" } }
        ],
      });
      count = await tx.reregisterDetail.count({
        where: {
          reregister: {
            periodId: periodId,
          },
          ...queryType,
        },
      });
    }
    if (type === "studentsRegularSore") {
      data = await tx.reregisterDetail.findMany({
        where: {
          reregister: {
            periodId: periodId,
          },
          ...queryType,
        },
        select: {
          student: {
            select: {
              nim: true,
              name: true,
              major: true,
            }
          },
          campusType: true,
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
        orderBy: [
          { campusType: "desc" },
          { student: { nim: "desc" } },
        ],
      });
      count = await tx.reregisterDetail.count({
        where: {
          reregister: {
            periodId: periodId,
          },
          ...queryType,
        },
      });
    }
    return [data, count];
  });
  return [data, count]
};

const RecapitulationDetailByCardPage = async (
  {
    searchParams, params
  }: {
    searchParams: Promise<{ [key: string]: string | undefined }>,
    params: Promise<{ id: string, type: RecapitulationCardType }>,
  }
) => {
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;
  const { id, type } = await params;
  ;
  const headingText: {
    [key: string]: string
  } = {
    studentsRegisteredKrs: "Daftar Mahasiswa yang Sudah KRS",
    studentsUnregisteredKrs: "Daftar Mahasiswa yang Belum KRS",
    studentsTakingThesis: "Daftar Mahasiswa Program TA",
    studentsExtendingThesis: "Daftar Mahasiswa Perpanjangan TA",
    studentsTakingInternship: "Daftar Mahasiswa Program PKL",
    studentActiveInactive: "Daftar Mahasiswa Aktif/non-aktif",
    studentsRegularSore: "Daftar Mahasiswa Reg.Pagi/Sore",
  }

  let data: any[] = [];
  let count: number = 0;

  switch (type) {
    case "studentsRegisteredKrs":
      const queryStudentsRegisteredKrs: Prisma.KrsWhereInput = {};
      [data, count] = await dataTable({
        queryType: queryStudentsRegisteredKrs,
        type: type,
        queryParams,
        periodId: id,
        p,
      })
      break;
    case "studentsUnregisteredKrs":
      const queryStudentsUnregisteredKrs: Prisma.KrsWhereInput = {};
      [data, count] = await dataTable({
        queryType: queryStudentsUnregisteredKrs,
        type: type,
        queryParams,
        periodId: id,
        p,
      })
      break;
    case "studentsTakingThesis":
      const queryStudentsTakingThesis: Prisma.KrsWhereInput = {};
      [data, count] = await dataTable({
        queryType: queryStudentsTakingThesis,
        type: type,
        queryParams,
        periodId: id,
        p,
      })
      break;
    case "studentsExtendingThesis":
      const queryStudentsExtendingThesis: Prisma.KrsWhereInput = {};
      [data, count] = await dataTable({
        queryType: queryStudentsExtendingThesis,
        type: type,
        queryParams,
        periodId: id,
        p,
      })
      break;
    case "studentsTakingInternship":
      const queryStudentsTakingInternship: Prisma.KrsWhereInput = {};
      [data, count] = await dataTable({
        queryType: queryStudentsTakingInternship,
        type: type,
        queryParams,
        periodId: id,
        p,
      })
      break;
    case "studentActiveInactive":
      const queryStudentActiveInactive: Prisma.ReregisterDetailWhereInput = {};
      [data, count] = await dataTable({
        queryType: queryStudentActiveInactive,
        type: type,
        queryParams,
        periodId: id,
        p,
      })
      break;
    case "studentsRegularSore":
      const queryStudentRegularSore: Prisma.ReregisterDetailWhereInput = {};
      [data, count] = await dataTable({
        queryType: queryStudentRegularSore,
        type: type,
        queryParams,
        periodId: id,
        p,
      })
      break;
    default:
      notFound();
  }

  let dataFilter = await prisma.major.findMany({ select: { id: true, name: true, } });
  dataFilter.unshift({ id: "all", name: "semua" })

  const columns = [
    {
      header: "Info",
      accessor: "info",
      className: "px-2 md:hidden"
    },
    {
      header: "NIM",
      accessor: "nim",
      className: "hidden md:table-cell md:px-4 md:",
    },
    {
      header: "Nama Mahasiswa",
      accessor: "nama mahasiswa",
      className: "hidden md:table-cell",
    },
    {
      header: "Program Studi",
      accessor: "program studi",
      className: "hidden md:table-cell",
    },
    ...(type === "studentActiveInactive" ?
      [
        {
          header: "Status",
          accessor: "status",
          className: "hidden md:table-cell",
        }
      ] : []
    ),
    ...(type === "studentsRegularSore" ?
      [
        {
          header: "Perkuliahan",
          accessor: "perkuliahan",
          className: "hidden md:table-cell",
        }
      ] : []
    )
  ];


  const renderRow = (item: any) => {

    const semesterStyle = ["p-1 rounded-lg"];
    if (type === "studentActiveInactive") {
      if ((item as ReregisterDetail & { semesterStatus: SemesterStatus }).semesterStatus === "NONAKTIF") semesterStyle.push("text-rose-500 bg-rose-100");
      if ((item as ReregisterDetail & { semesterStatus: SemesterStatus }).semesterStatus === "AKTIF") semesterStyle.push("text-green-500 bg-green-100");
      if ((item as ReregisterDetail & { semesterStatus: SemesterStatus }).semesterStatus === "CUTI") semesterStyle.push("text-amber-500 bg-amber-100");
      if ((item as ReregisterDetail & { semesterStatus: SemesterStatus }).semesterStatus === "MENGUNDURKAN_DIRI") semesterStyle.push("text-slate-600 bg-slate-100");
      if ((item as ReregisterDetail & { semesterStatus: SemesterStatus }).semesterStatus === "DO") semesterStyle.push("text-gray-500 bg-gray-200");
      if ((item as ReregisterDetail & { semesterStatus: SemesterStatus }).semesterStatus === "LULUS") semesterStyle.push("text-violet-600 bg-violet-100");
    }
    return (
      <tr
        key={item.student.nim}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="grid grid-cols-6 md:hidden py-4 px-2">
          <div className="flex flex-col col-span-5 items-start">
            <h3 className="font-semibold">{item?.student?.name}</h3>
            <p className="flex md:hidden text-xs text-gray-500">{item?.student?.nim ?? ""}</p>
            <p className="flex md:hidden text-xs text-gray-500">Prodi: {item?.student?.major?.name ?? ""}</p>
          </div>
        </td>
        <td className="hidden md:flex py-4 px-2 md:px-4">{item?.student?.nim || "-"}</td>
        <td className="hidden md:table-cell">{item?.student?.name || "-"}</td>
        <td className="hidden md:table-cell">{item?.student?.major?.name || "-"}</td>
        {type === "studentActiveInactive" && (
          <td className="hidden md:table-cell text-[10px] font-bold">
            <span className={semesterStyle.join(" ")}>
              {item.semesterStatus || "-"}
            </span>
          </td>
        )}
        {type === "studentsRegularSore" && (
          <td className="hidden md:table-cell">
            {(item.campusType === "BJM" && "BANJARMASIN") || (item.campusType === "BJB" && "BANJARBARU") || item.campusType}
          </td>
        )}
      </tr>
    );
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">{`${headingText[type]}`}</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
        </div>
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-start xl:justify-between">
        <FilterSearch data={dataFilter} />
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-4 self-end">
            <a
              href={`/api/excel?u=${id}&type=${type}`}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium w-fit py-2 px-4 text-gray-900 bg-primary/70 rounded-full cursor-pointer hover:bg-primary"
            >
              Export .xlsx
            </a>
            <ButtonPdfDownload id={id} type={type}>
              <div className={`w-fit h-fit py-2 px-4 text-xs text-gray-900 font-medium flex items-center justify-center rounded-full bg-primary`}>
                Export .pdf
              </div>
            </ButtonPdfDownload>
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  )
}

export default RecapitulationDetailByCardPage;