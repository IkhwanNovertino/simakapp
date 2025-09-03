import FormContainer from "@/component/FormContainer";
import ModalAction from "@/component/ModalAction";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { canRoleCreateData, canRoleDeleteData, canRoleUpdateData, canRoleViewData } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { lecturerName } from "@/lib/utils";
import { Course, Khs, KhsDetail, Lecturer, Major, Period, Prisma, Reregister, Student } from "@prisma/client";
import { tr } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

type KhsDetailDataType = KhsDetail & { khs: Khs } & { course: Course };

const TranskipAdvisorDetailPage = async (
  {
    searchParams, params,
  }: {
    searchParams: { [key: string]: string | undefined },
    params: Promise<{ id: string }>,
  }
) => {

  const getSessionFunc = await getSession();
  if (!getSessionFunc || getSessionFunc.roleType !== "ADVISOR") {
    redirect("/");
  }

  const canCreateData = await canRoleCreateData("transkip");
  const canUpdateData = await canRoleUpdateData("transkip");
  const canDeleteData = await canRoleDeleteData("transkip");
  const canViewData = await canRoleViewData("transkip");

  const { id } = await params;
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.StudentWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { name: { contains: value, mode: "insensitive" } },
              { nim: { contains: value, mode: "insensitive" } },
            ]
            break;
          default:
            break;
        }
      }
    }
  };

  const [data, studentDetail] = await prisma.$transaction([
    prisma.khsDetail.findMany({
      where: {
        khs: {
          studentId: id,
        },
        isLatest: true,
      },
      select: {
        id: true,
        khs: {
          select: {
            semester: true,
          }
        },
        course: {
          select: {
            code: true,
            name: true,
            sks: true,
            isPKL: true,
            isSkripsi: true,
          }
        },
        weight: true,
        gradeLetter: true,
        status: true,
      },
      orderBy: [
        {
          khs: {
            semester: "asc"
          }
        },
        {
          course: {
            sks: "asc"
          }
        }
      ]
    }),
    prisma.student.findUnique({
      where: {
        id: id,
      },
      select: {
        name: true,
        nim: true,
        photo: true,
        year: true,
        statusRegister: true,
        major: {
          select: {
            name: true,
          },
        },
        lecturer: {
          select: {
            name: true,
            frontTitle: true,
            backTitle: true,
          }
        },
      },
    })
  ]);

  const columns = [
    {
      header: "Info",
      accessor: "info",
      className: "px-2 md:px-4"
    },
    {
      header: "Semester",
      accessor: "semester",
      className: "hidden md:table-cell",
    },
    {
      header: "SKS",
      accessor: "sks",
      className: "hidden md:table-cell",
    },
    {
      header: "Nilai",
      accessor: "Nilai",
      className: "hidden md:table-cell",
    },
    {
      header: "SKSxNilai",
      accessor: "sksxnilai",
      className: "hidden md:table-cell",
    },
  ];

  const renderRow = (item: KhsDetailDataType) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-4">
          <div className="flex flex-col col-span-5 items-start">
            <h3 className="font-semibold">{item?.course?.name || ""}</h3>
            <p className="text-xs font-medium text-gray-500">{item?.course?.code || ""}</p>
            <div className="flex gap-1 mt-1">
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 md:hidden ">
          </div>
        </td>
        <td className="hidden md:table-cell">{item?.khs?.semester || "-"}</td>
        <td className="hidden md:table-cell">{item?.course?.sks || "-"}</td>
        <td className="hidden md:table-cell">{item?.gradeLetter || "-"}</td>
        <td className="hidden md:table-cell">
          {(Number(item?.course?.sks) * Number(item.weight))}
        </td>
      </tr >
    )
  };
  return (
    <div className="flex-1 p-4 flex flex-col gap-4">
      {/* TOP */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* USER INFO CARD */}
        <div className="bg-primary py-6 px-4 rounded-md flex-1 flex gap-4 w-full lg:w-3/4">
          <div className="hidden md:inline md:w-1/4">
            <Image
              src={studentDetail?.photo ? `/api/avatar?file=${studentDetail?.photo}` : '/avatar.png'}
              alt=""
              width={144}
              height={144}
              className="w-36 h-36 rounded-full object-cover"
            />
          </div>
          <div className="w-full md:w-3/4 flex flex-col justify-between gap-4">
            <header>
              <h1 className="text-xl font-semibold">{studentDetail?.name || ""}</h1>
              <div className="h-0.5 w-full bg-gray-300" />
              <p className="text-sm text-slate-600 font-medium mt-1">
                {studentDetail.nim} | S1-{studentDetail.major.name}
              </p>
            </header>
            <div className="flex flex-col items-center justify-between gap-2 flex-wrap text-xs font-medium">
              <div className="w-full 2xl:w-1/3 md:gap-2 flex flex-col md:flex-row items-center">
                <span className="w-full font-semibold md:w-1/3">Dosen Wali</span>
                <span className="hidden md:flex">:</span>
                <span className="w-full font-bold text-gray-700">
                  {lecturerName(
                    {
                      frontTitle: studentDetail?.lecturer?.frontTitle,
                      name: studentDetail?.lecturer?.name,
                      backTitle: studentDetail.lecturer.backTitle,
                    }
                  )}
                </span>
              </div>
              <div className="w-full 2xl:w-1/3 md:gap-2 flex flex-col md:flex-row items-center">
                <span className="w-full font-semibold md:w-1/3">Thn. Masuk</span>
                <span className="hidden md:flex">:</span>
                <span className="w-full font-bold text-gray-700">{studentDetail.year}</span>
              </div>
              <div className="w-full 2xl:w-1/3 md:gap-2 flex flex-col md:flex-row items-center">
                <span className="w-full font-semibold md:w-1/3">Status Registrasi</span>
                <span className="hidden md:flex">:</span>
                <span className="w-full font-bold text-gray-700">{studentDetail.statusRegister}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white w-full lg:w-1/4 flex flex-col gap-4 p-4 rounded-md"></div>
      </div>
      {/* BOTTOM */}
      <div className="bg-white p-4 rounded-md flex-1 mt-0">
        {/* TOP */}
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-lg font-semibold">Transkip Nilai Sementara</h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />
          </div>
        </div>
        {/* BOTTOM */}
        {/* LIST */}
        <Table columns={columns} renderRow={renderRow} data={data} />
        {/* PAGINATION */}
      </div>
    </div>
  )
}

export default TranskipAdvisorDetailPage;