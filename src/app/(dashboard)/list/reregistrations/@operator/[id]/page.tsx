
import FormContainer from "@/component/FormContainer";
import ModalAction from "@/component/ModalAction";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Major, Prisma, Reregister, ReregisterDetail, Student } from "@prisma/client";

type ReregisterDetailDataType = ReregisterDetail & { student: Student & { major: Major } } & { reregister: Reregister };

const ReregisterSinglePage = async (
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
              { reregisterId: id },
            ]
            break;
          default:
            break;
        }
      }
    }
  };
  const dataReregis = await prisma.reregister.findUnique({
    where: { id: id },
    include: { period: true },
  });
  const dataCreate = {
    reregisterId: dataReregis.id,
    name: dataReregis.name,
    semesterType: dataReregis.period.semesterType,
    year: dataReregis.period.year,
  }

  const [data, count] = await prisma.$transaction([
    prisma.reregisterDetail.findMany({
      where: {
        OR: [
          { reregisterId: id, },
          query,
        ],
      },
      include: {
        student: {
          include: {
            major: true,
          }
        },
        reregister: {
          include: {
            period: true,
          }
        }
      },
      orderBy: [
        {
          student: {
            nim: "desc"
          }
        }
      ],
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.reregisterDetail.count({
      where: {
        OR: [
          { reregisterId: id, },
          query,
        ],
      },
    }),
  ]);

  const columns = [
    {
      header: "Info",
      accessor: "info",
      className: "px-4"
    },
    {
      header: "Angkatan",
      accessor: "angkatan",
      className: "hidden md:table-cell",
    },
    {
      header: "Prodi",
      accessor: "prodi",
      className: "hidden md:table-cell",
    },
    {
      header: "Pembayaran",
      accessor: "pembayaran",
      className: "hidden md:table-cell",
    },
    {
      header: "Status",
      accessor: "status",
      className: "hidden md:table-cell",
    },
    {
      header: "isSubmited",
      accessor: "isSubmited",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
      className: "hidden md:table-cell",
    },
  ];

  const renderRow = (item: ReregisterDetailDataType) => {
    const paymentStyle = ["p-1 rounded-lg"];
    const semesterStyle = ["p-1 rounded-lg"];
    if (item.paymentStatus === "BELUM_LUNAS") paymentStyle.push("text-red-700 bg-red-100");
    if (item.paymentStatus === "LUNAS") paymentStyle.push("text-lime-500 bg-lime-100");
    if (item.semesterStatus === "NONAKTIF") semesterStyle.push("text-rose-500 bg-rose-100");
    if (item.semesterStatus === "AKTIF") semesterStyle.push("text-green-500 bg-green-100");
    if (item.semesterStatus === "CUTI") semesterStyle.push("text-amber-500 bg-amber-100");
    if (item.semesterStatus === "MENGUNDURKAN_DIRI") semesterStyle.push("text-slate-600 bg-slate-100");
    if (item.semesterStatus === "DO") semesterStyle.push("text-gray-500 bg-gray-200");
    if (item.semesterStatus === "LULUS") semesterStyle.push("text-violet-600 bg-violet-100");

    return (
      <tr
        key={item.studentId}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
      >
        <td className="flex items-center gap-4 p-4">
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold">{item.student.name}</h3>
            <p className="text-xs text-gray-600">{item.student.nim}</p>
            <p className="text-xs text-gray-400">{`Semester ${item.semester || 0}`}</p>
          </div>
        </td>
        <td className="hidden md:table-cell text-sm font-medium">{item.student.year || 2000}</td>
        <td className="hidden md:table-cell text-sm font-medium">{item.student.major.name}</td>
        <td className={`hidden md:table-cell text-[10px] font-bold`}>
          <span className={paymentStyle.join(" ")}>
            {item.paymentStatus}
          </span>
        </td>
        <td className="hidden md:table-cell text-[10px] font-bold">
          <span className={semesterStyle.join(" ")}>
            {item.semesterStatus}
          </span>
        </td>
        <td className="hidden md:table-cell text-[10px] font-bold">
          <span className={item.isStatusForm ? "p-1 rounded-lg bg-emerald-100 text-emerald-500" : "p-1 rounded-lg bg-red-100 text-red-700"}>
            {item.isStatusForm ? "Telah Diisi" : "Belum Diisi"}
          </span>
        </td>
        <td>
          <div className="flex items-center gap-2">
            <div className="md:hidden relative flex items-center justify-end gap-2">
              <ModalAction>
                <div className="flex items-center gap-3">
                  <FormContainer table="reregistrationDetail" type="update" data={item} />
                  <FormContainer table="reregistrationDetail" type="delete" id={`${item.reregisterId}:${item.studentId}`} />
                </div>
              </ModalAction>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <FormContainer table="reregistrationDetail" type="update" data={item} />
              <FormContainer table="reregistrationDetail" type="delete" id={`${item.reregisterId}:${item.studentId}`} />
            </div>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold"> {dataCreate?.name}</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <FormContainer table="reregistrationCreateAll" type="createMany" data={dataCreate} />
            <FormContainer table="reregistrationDetail" type="create" data={dataCreate} />
          </div>
        </div>
      </div>
      {/* BOTTOM */}
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  )
}

export default ReregisterSinglePage;