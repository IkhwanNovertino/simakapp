import ButtonPdfDownload from "@/component/ButtonPdfDownload";
import FilterSearch from "@/component/FilterSearch";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { RecapitulationCardType } from "@/lib/datatype";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Krs, Major, Prisma, Reregister, Student } from "@prisma/client";

type RenderRowDataType = Krs & { student: Student & { major: Major } } | Reregister & { student: Student & { major: Major } };

async function dataTable<T>({
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
    studentsTakingThesis: "Daftar Mahasiswa yang Mengambil TA",
    studentsExtendingThesis: "Daftar Mahasiswa yang Perpanjangan TA",
    studentsTakingInternship: "Daftar Mahasiswa yang Mengambil PKL",
  }

  let data: any[] = [];
  let count: number = 0;


  if (type === "studentsRegisteredKrs") {
    const queryStudentsRegisteredKrs: Prisma.KrsWhereInput = {};
    [data, count] = await dataTable<Prisma.KrsWhereInput>({
      queryType: queryStudentsRegisteredKrs,
      type: "studentsRegisteredKrs",
      queryParams,
      periodId: id,
      p,
    })
  } else if (type === "studentsUnregisteredKrs") {
    const queryStudentsUnregisteredKrs: Prisma.KrsWhereInput = {};
    [data, count] = await dataTable<Prisma.KrsWhereInput>({
      queryType: queryStudentsUnregisteredKrs,
      type: "studentsUnregisteredKrs",
      queryParams,
      periodId: id,
      p,
    })
  }



  console.log('DATAAAA', data);
  console.log('COUNTTTT', count);


  let dataFilter = await prisma.major.findMany({ select: { id: true, name: true, } });
  dataFilter.unshift({ id: "all", name: "semua" })
  // const [data, count, dataFilter] = await prisma.$transaction(async (tx: any) => {
  //   let data = [];
  //   let count = 0;
  //   switch (type) {
  //     case "studentsRegisteredKrs":
  //       data = await tx.krs.findMany({
  //         where: {
  //           reregister: {
  //             periodId: id,
  //           },
  //           krsDetail: {
  //             some: {},
  //           },
  //           ...query,
  //         },
  //         select: {
  //           student: {
  //             select: {
  //               nim: true,
  //               name: true,
  //               major: true,
  //             }
  //           }
  //         },
  //         take: ITEM_PER_PAGE,
  //         skip: ITEM_PER_PAGE * (p - 1),
  //         orderBy: [
  //           { student: { nim: "desc" } }
  //         ],
  //       });
  //       count = await tx.krs.count({
  //         where: {
  //           reregister: {
  //             periodId: id,
  //           },
  //           krsDetail: {
  //             some: {},
  //           }
  //         }
  //       });
  //       break;

  //     default:
  //       data = [];
  //       count = 0;
  //       break;
  //   }
  //   return [data, count, dataFilter]
  // });

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
  ];

  const renderRow = (item: RenderRowDataType) => (
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
    </tr>
  );

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