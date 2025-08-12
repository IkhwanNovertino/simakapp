
import Table from "@/component/Table";
import { prisma } from "@/lib/prisma";
import { AnnouncementKhs, Course, KhsDetail } from "@prisma/client";
import Image from "next/image";

type KhsDetailDataType = KhsDetail & { course: Course };

const KHSDetailPage = async (
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  // const dataKhs = await prisma.khs.findUnique({
  //   where: {
  //     id: id,
  //   },
  //   include: {
  //     khsDetail: {
  //       include: {
  //         course: true,
  //         khsGrade: {
  //           include: {
  //             assessmentDetail: {
  //               include: {
  //                 grade: true,
  //               }
  //             }
  //           }
  //         }
  //       }
  //     },
  //     student: true,
  //     period: true,
  //   }
  // });
  // const dataKhsDetailAcc = dataKhs.khsDetail.map((items: any) => items.isLatest === true);

  // const cekStatusAnnouncement = dataKhsDetailAcc.filter((item: any) => item.status === AnnouncementKhs.DRAFT);

  // let khs;
  // let totalSKS;
  // let totalSKSxNAB;
  // let limitSKS;

  // if (cekStatusAnnouncement.length === 0) {
  //   khs = {
  //     ...dataKhs,
  //     ips: Number(dataKhs?.ips),
  //     khsDetail: dataKhs.khsDetail.map((items: KhsDetail) => ({
  //       ...items,
  //       finalScore: Number(items.finalScore),
  //       weight: Number(items.weight),
  //     })),
  //   };
  //   totalSKS = khs?.khsDetail
  //     .map((item: any) => item.course.sks)
  //     .reduce((acc: any, init: any) => acc + init, 0);
  //   totalSKSxNAB = khs?.khsDetail
  //     .map((item: any) => item.course.sks * item.weight)
  //     .reduce((acc: any, init: any) => acc + init, 0);
  //   // ipk = Number(totalSKSxNAB / totalSKS).toFixed(2);
  //   limitSKS = `${dataKhs.maxSks - 1} - ${dataKhs.maxSks}`;
  // } else {
  //   khs = {
  //     ...dataKhs,
  //     ips: 0,
  //     khsDetail: dataKhs.khsDetail.map((items: KhsDetail) => ({
  //       ...items,
  //       gradeLetter: "E",
  //       finalScore: 0,
  //       weight: 0,
  //     })),
  //   };
  //   totalSKS = khs?.khsDetail
  //     .map((item: any) => item.course.sks)
  //     .reduce((acc: any, init: any) => acc + init, 0);
  //   totalSKSxNAB = 0;
  //   limitSKS = 0
  // }

  const [student, khs, khsDetail, totalSKS, totalSKSxNAB, limitSKS] = await prisma.$transaction(async (prisma: any) => {
    let khs = await prisma.khs.findUnique({
      where: {
        id: id,
      },
      select: {
        student: {
          include: {
            major: true,
          }
        },
        semester: true,
        period: true,
        ips: true,
        maxSks: true,
        isRPL: true,
      }
    });
    khs = {
      ...khs,
      ips: Number(khs.ips)
    }
    const student = khs?.student;

    const khsDetailRaw = await prisma.khsDetail.findMany({
      where: {
        khsId: id,
        isLatest: true,
      },
      include: {
        course: true,
      }
    })
    let khsDetail;
    let totalSKS = 0;
    let totalSKSxNAB = 0;
    let limitSKS = `0`;
    if (khsDetailRaw.filter((el: any) => (el.status === AnnouncementKhs.DRAFT || el.status === AnnouncementKhs.SUBMITTED)).length === 0) {
      khsDetail = khsDetailRaw.map((items: any) => ({
        ...items,
        finalScore: Number(items.finalScore),
        weight: Number(items.weight),
      }))
      totalSKS = khsDetailRaw
        .map((item: any) => item.course.sks)
        .reduce((acc: any, init: any) => acc + init, 0);
      totalSKSxNAB = khsDetailRaw
        .map((item: any) => item.course.sks * item.weight)
        .reduce((acc: any, init: any) => acc + init, 0);
      limitSKS = `${khs.maxSks - 1} - ${khs.maxSks}`;
    } else {
      khsDetail = khsDetailRaw.map((items: any) => ({
        ...items,
        finalScore: 0,
        weight: 0,
        gradeLetter: "E",
      }))
      khs.ips = 0
    }

    return [student, khs, khsDetail, totalSKS, totalSKSxNAB, limitSKS]
  })

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
      header: "NAB",
      accessor: "nab",
      className: "hidden md:table-cell",
    },
    {
      header: "SKSxNAB",
      accessor: "sksxnab",
      className: "hidden md:table-cell",
    },
  ];

  const renderRow = (item: KhsDetailDataType) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="hidden md:table-cell p-4 md:w-2/10">{item?.course?.code}</td>
        <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-0 md:w-5/10">
          <div className="flex flex-col col-span-5 items-start">
            <p className="text-xs text-gray-500 md:hidden">{item?.course?.code}</p>
            <h3 className="font-semibold md:font-normal">{item?.course?.name}</h3>
            <p className="text-xs text-gray-500 md:hidden">{item?.course?.sks} sks</p>
          </div>
        </td>
        <td className="hidden md:table-cell md:w-1/10">{item?.course?.sks}</td>
        <td className="hidden md:table-cell md:w-1/10">
          {item?.gradeLetter}
        </td>
        <td className="hidden md:table-cell md:w-1/10">
          {(Number(item?.course?.sks) * Number(item.weight))}
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
              src={student?.photo ? `/api/avatar?file=${student?.photo}` : '/avatar.png'}
              alt=""
              width={144}
              height={144}
              className="w-36 h-36 rounded-full object-cover"
            />
          </div>
          <div className="w-full md:w-3/4 flex flex-col justify-between gap-4">
            <header>
              <h1 className="text-xl font-semibold">{student?.name || ""}</h1>
              <div className="h-0.5 w-full bg-gray-300" />
              <p className="text-sm text-slate-600 font-medium mt-1">
                {student.nim} | S1-{student.major.name}
              </p>
            </header>
            <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
              <div className="w-full 2xl:w-1/3 gap-2 flex items-center">
                <span className="basis-16">Semester</span>
                <span>:</span>
                <span>{khs.semester}</span>
              </div>
              <div className="w-full 2xl:w-1/3 gap-2 flex items-center">
                <span className="basis-16">Thn. Akad</span>
                <span >:</span>
                <span>{khs.period?.name}</span>
              </div>
              <div className="w-full 2xl:w-1/3 gap-2 flex items-center">
                <span className="basis-16">IPK</span>
                <span>:</span>
                <span>{khs?.ips ?? 0}</span>
              </div>
              <div className="w-full 2xl:w-1/3 gap-2 flex items-center">
                <span className="basis-16">Max SKS</span>
                <span>:</span>
                <span>{khs.maxSks ?? 0}</span>
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
            <h1 className="text-lg font-semibold">Kartu Hasil Studi</h1>
          </div>
        </div>
        <Table columns={columns} renderRow={renderRow} data={khsDetail} />
        {khs.isRPL === false && (
          <div className="mt-4">
            <div className="flex items-center p-2 mx-2 justify-start gap-8">
              <h1 className="text-sm font-bold md:w-40">Jumlah SKS</h1>
              <h3 className="text-sm font-medium">{totalSKS}</h3>
            </div>
            <div className="flex items-center p-2 mx-2 justify-start gap-8">
              <h1 className="text-sm font-bold md:w-40">Jumlah SKSxNAB</h1>
              <h3 className="text-sm font-medium">{totalSKSxNAB}</h3>
            </div>
            <div className="flex items-center p-2 mx-2 justify-start gap-8">
              <h1 className="text-sm font-bold md:w-40">IPK</h1>
              <h3 className="text-sm font-medium">{khs.ips}</h3>
            </div>
            <div className="flex items-center p-2 mx-2 justify-start gap-8">
              <h1 className="text-sm font-bold md:w-40">max. SKS</h1>
              <h3 className="text-sm font-medium">{limitSKS}</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default KHSDetailPage;