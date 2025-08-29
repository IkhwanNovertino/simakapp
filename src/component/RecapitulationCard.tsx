import { RecapitulationCardType } from "@/lib/datatype";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { NextRequest } from "next/server";

interface RecapitulationCardProptypes {
  periodId: string
  type: RecapitulationCardType,
  label: string,
};



const RecapitulationCard = async ({ periodId, type, label }: RecapitulationCardProptypes) => {
  const period = await prisma.period.findUnique({
    where: {
      id: periodId,
    }
  });
  const studentsKrs = await prisma.krs.findMany({
    where: {
      reregister: {
        periodId: periodId,
      },
    },
    include: {
      krsDetail: true,
    }
  })
  const yearOfPeriod = period?.name.split(" ")[1];
  let totalStudents: number = 0;

  switch (type) {
    case "studentsRegisteredKrs":
      totalStudents = studentsKrs.filter((student: any) => student.krsDetail.length > 0).length;
      break;
    case "studentsUnregisteredKrs":
      totalStudents = studentsKrs.filter((student: any) => student.krsDetail.length < 1).length;
      break;
    case "studentsTakingThesis":
      totalStudents = totalStudents = await prisma.krs.count({
        where: {
          reregister: {
            periodId: periodId,
          },
          krsDetail: {
            some: {
              course: {
                isSkripsi: true,
              }
            }
          }
        },
      });
      break;
    case "studentsExtendingThesis":
      // Belum diedit
      totalStudents = studentsKrs.filter((student: any) => student.krsDetail.length < 1).length;
      break;
    case "studentsTakingInternship":
      totalStudents = await prisma.krs.count({
        where: {
          reregister: {
            periodId: periodId,
          },
          krsDetail: {
            some: {
              course: {
                isPKL: true,
              }
            }
          }
        }
      })
      break;

    default:
      break;
  }

  return (
    <Link
      href={`/list/recapitulations/${periodId}/${type}`}
      className="p-4 odd:bg-primary even:bg-secondary rounded-2xl flex-1 min-w-[130px]"
    >
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-green-600 bg-white px-2 py-1 rounded-full">{yearOfPeriod}</span>
        <Image src={"/more.png"} alt="more-icon" width={20} height={20} className="" />
      </div>
      <h1 className="text-xl font-semibold my-2">{totalStudents}</h1>
      <h2 className="text-sm capitalize font-medium text-gray-500">{label}</h2>
    </Link>
  )
}

export default RecapitulationCard;