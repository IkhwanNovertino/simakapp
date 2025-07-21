
import FormContainer from "@/component/FormContainer";
import FormCourseKrs from "@/component/FormCourseKrs";
import ModalAction from "@/component/ModalAction";
import Table from "@/component/Table";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { Course, KrsDetail, } from "@prisma/client";
import Image from "next/image";

type KrsDetailDataType = KrsDetail & { course: Course };

const KRSDetailPage = async (
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const user = await getSession();

  const dataKRSRaw = await prisma.krs.findUnique({
    where: {
      id: id,
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
      },
      krsDetail: {
        include: {
          course: true,
        }
      },
    }
  });


  const dataKRS = {
    ...dataKRSRaw,
    ipk: dataKRSRaw?.ipk ? parseFloat(dataKRSRaw.ipk.toString()) : 0,
    krsDetail: dataKRSRaw?.krsDetail.map((item: any) => (
      {
        ...item,
        finalScore: item.finalScore ? parseFloat(item.finalScore.toString()) : 0,
        weight: item.weight ? parseFloat(item.weight.toString()) : 0,
      }
    ))
  }

  const dataReregistrasi = await prisma.reregisterDetail.findUnique({
    where: {
      reregisterId_studentId: {
        reregisterId: dataKRS.reregisterId,
        studentId: dataKRS.studentId,
      },
    },
  });

  const totalSKS = dataKRS?.krsDetail
    .map((item: any) => item.course.sks)
    .reduce((acc: any, init: any) => acc + init, 0);

  const dataPassToForm = {
    id: dataKRS.id,
    student: dataKRS?.student,
    krsDetail: dataKRS?.krsDetail || [],
    semester: dataKRS?.reregister?.period?.semesterType,
    sisaSKS: parseInt(dataKRS?.maxSks.slice(-2)) - totalSKS,
    maxSKS: parseInt(dataKRS?.maxSks.slice(-2)),
  }

  const columns = [
    {
      header: "Kode",
      accessor: "kode",
      className: "px-4 hidden md:table-cell",
    },
    {
      header: "Mata Kuliah",
      accessor: "mata kuliah",
      className: "px-2 md:px-0",
    },
    {
      header: "SKS",
      accessor: "sks",
      className: "hidden md:table-cell",
    },
    {
      header: "Status",
      accessor: "status",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
      className: "hidden md:table-cell p-4",
    },
  ];

  const renderRow = (item: KrsDetailDataType) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="hidden md:table-cell p-4">{item?.course?.code}</td>
        <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-0">
          <div className="flex flex-col col-span-5 items-start">
            <p className="text-xs text-gray-500 md:hidden">{item?.course?.code}</p>
            <h3 className="font-semibold md:font-normal">{item?.course?.name}</h3>
            <p className="text-xs text-gray-500 md:hidden">{item?.course?.sks} sks</p>
            <span className={`p-1 rounded-lg text-[9px] font-bold self-start md:hidden ${item.isAcc ? "text-green-500 bg-green-100" : "text-gray-500 bg-gray-200"}`}>
              {item?.isAcc ? "ACC" : "Pending"}
            </span>
          </div>
          <div className="flex items-center justify-end gap-2 md:hidden ">
            <ModalAction>
              <div className="flex items-center gap-3">
                {user?.roleType !== "STUDENT" && <FormCourseKrs id={item.id} isAcc={item.isAcc} />}
                <FormContainer table="krsDetail" type="delete" id={item.id} />
              </div>
            </ModalAction>
          </div>
        </td>
        <td className="hidden md:table-cell">{item?.course?.sks}</td>
        <td className="hidden md:table-cell">
          <span className={`p-1 rounded-lg text-[10px] font-bold self-start ${item.isAcc ? "text-green-500 bg-green-100" : "text-gray-500 bg-gray-200"}`}>
            {item?.isAcc ? "ACC" : "Pending"}
          </span>
        </td>
        <td>
          <div className="hidden md:flex items-center gap-2">
            {user?.roleType !== "STUDENT" && <FormCourseKrs id={item.id} isAcc={item.isAcc} />}
            <FormContainer table="krsDetail" type="delete" id={item.id} />
          </div>
        </td>
      </tr>
    )
  }

  return (
    <div className="flex-1 p-4 flex flex-col gap-4">
      {/* TOP */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* USER INFO CARD */}
        <div className="bg-primary py-6 px-4 rounded-md flex-1 flex gap-4 w-full lg:w-3/4">
          <div className="hidden md:inline md:w-1/4">
            <Image
              src={dataKRS?.student?.photo ? `/api/avatar?file=${dataKRS?.student?.photo}` : '/avatar.png'}
              alt=""
              width={144}
              height={144}
              className="w-36 h-36 rounded-full object-cover"
            />
          </div>
          <div className="w-full md:w-3/4 flex flex-col justify-between gap-4">
            <header>
              <h1 className="text-xl font-semibold">{dataKRS?.student?.name || ""}</h1>
              <div className="h-0.5 w-full bg-gray-300" />
              <p className="text-sm text-slate-600 font-medium mt-1">
                {dataKRS.student.nim} | S1-{dataKRS.student.major.name}
              </p>
            </header>
            <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
              <div className="w-full 2xl:w-1/3 gap-2 flex items-center">
                <span className="basis-16">Semester</span>
                <span>:</span>
                <span>{dataReregistrasi.semester}</span>
              </div>
              <div className="w-full 2xl:w-1/3 gap-2 flex items-center">
                <span className="basis-16">Thn. Akad</span>
                <span >:</span>
                <span>{dataKRS.reregister?.period?.name}</span>
              </div>
              <div className="w-full 2xl:w-1/3 gap-2 flex items-center">
                <span className="basis-16">IPK</span>
                <span>:</span>
                <span>{dataKRS?.ipk?.toString() ?? 0}</span>
              </div>
              <div className="w-full 2xl:w-1/3 gap-2 flex items-center">
                <span className="basis-16">Max SKS</span>
                <span>:</span>
                <span>{dataKRS.maxSks}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white w-full lg:w-1/4 flex flex-col gap-4 p-4 rounded-md"></div>
      </div>
      {/* BOTTOM */}
      <div className="bg-white p-4 rounded-md flex-1 mt-0">
        <div className="flex">
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:justify-between">
            <h1 className="text-lg font-semibold">Kartu Rencana Studi</h1>
            <div className="flex items-center gap-4 self-end">
              <FormContainer type="create" table="krsDetail" data={dataPassToForm} />
            </div>
          </div>
        </div>
        <Table columns={columns} renderRow={renderRow} data={dataKRS.krsDetail || []} />
        <div className="flex items-center p-4 justify-center gap-8">
          <h1 className="text-sm font-bold">TOTAL SKS</h1>
          <h3 className="text-sm font-medium">{totalSKS}</h3>
        </div>
      </div>
    </div>
  )
}

export default KRSDetailPage;