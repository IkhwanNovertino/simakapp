import { exportAssessmentGrade } from "@/lib/excel/exportAssessmentGrade";
import { exportAssessmentTemplate } from "@/lib/excel/exportAssessmentTemplate";
import logger from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import renderPdf from "@/lib/renderPdf";
import { lecturerName } from "@/lib/utils";
import { SemesterType } from "@prisma/client";
import { error } from "console";
import { format } from "date-fns";
import { id, id as indonesianLocale, is } from "date-fns/locale";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('u');
    const type = searchParams.get('type');
  
    if (!type) {
      return new NextResponse('Terjadi Kesalahan...', { status: 400 });
    };
    if (!uid) {
      return new NextResponse('Terjadi Kesalahan...', { status: 400 });
    };

    let bufferFile;
    let bufferUint8Array;
    const date = format(new Date(), 'dd MMMM yyyy', { locale: indonesianLocale });

    switch (type) {
      case "assessment":
        const academicClass = await prisma.academicClass.findUnique({
          where: { id: uid },
          select: {
            id: true,
            name: true,
            course: {
              select: {
                id: true,
                name: true,
                major: {
                  select: {
                    name: true,
                  },
                },
                assessment: {
                  include: {
                    assessmentDetail: {
                      include: {
                        grade: true,
                      },
                      orderBy: {
                        seq_number: 'desc',
                      }
                    },
                  },
                },
              },
            },
            lecturer: {
              select: {
                name: true,
                frontTitle: true,
                backTitle: true,
              }
            },
            period: {
              select: {
                id: true,
                name: true,
              }
            },
            academicClassDetail: true,
          },
        });
        const assessmentDetail = academicClass?.course?.assessment?.assessmentDetail || [];
        const khsDetails = await prisma.khsDetail.findMany({
          where: {
            courseId: academicClass?.course?.id,
            khs: {
              student: {
                id: {
                  in: academicClass?.academicClassDetail.map((detail: any) => detail.studentId) || [],
                }
              },
              periodId: academicClass?.period?.id,
            },
          },
          include: {
            khs: {
              include: {
                student: {
                  select: { id: true, name: true, nim: true }
                },
              }
            },
            khsGrade: {
              include: {
                assessmentDetail: {
                  include: {
                    grade: true,
                  },
                },
              },
              orderBy: {
                assessmentDetail: { seq_number: 'desc' }
              },
            },
          },
          orderBy: [
            { khs: { student: { nim: 'asc' } } }
          ]
        });
        const lecturername = await lecturerName({
          frontTitle: academicClass?.lecturer?.frontTitle,
          name: academicClass?.lecturer?.name,
          backTitle: academicClass?.lecturer?.backTitle,
        });
        
        bufferFile = await renderPdf({
          type: type,
          data: {
            assessmentDetail,
            khsDetails,
            academicClass: {
              ...academicClass,
              lecturername: lecturername,
            },
            date,
          }
        })
        if (!bufferFile) {
          return new NextResponse('Terjadi Kesalahan...', { status: 400 });
        }
        bufferUint8Array = new Uint8Array(bufferFile)
        return new NextResponse(bufferUint8Array, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${type}.pdf`,
          },
        });
      case "krs":
        const krsStudent = await prisma.krs.findUnique({
          where: {
            id: uid,
          },
          select: {
            student: {
              select: {
                id: true,
                name: true,
                nim: true,
                major: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            reregister: {
              select: {
                id: true,
                period: {
                  select: {
                    id: true,
                    name: true,
                    semesterType: true,
                  },
                },
              },
            },
            maxSks: true,
            ips: true,
            lecturer: {
              select: {
                name: true,
                frontTitle: true,
                backTitle: true,
              },
            },
            krsDetail: {
              select: {
                course: {
                  select: {
                    id: true,
                    name: true,
                    sks: true,
                    code: true,
                  },
                },
                isAcc: true,
              },
            },
          },
        });
        const reregistrasiStudent = await prisma.reregisterDetail.findUnique({
          where: {
            reregisterId_studentId: {
              reregisterId: krsStudent?.reregister?.id,
              studentId: krsStudent.student?.id,
            },
          },
        });
        const lecturerNameKrs = await lecturerName({
          frontTitle: krsStudent?.lecturer?.frontTitle,
          name: krsStudent?.lecturer?.name,
          backTitle: krsStudent?.lecturer?.backTitle,
        });
        bufferFile = await renderPdf({
          type: type,
          data: {
            krsStudent: {
              ...krsStudent,
              ips: Number(krsStudent?.ips) || 0,
            },
            lecturerNameKrs,
            semester: reregistrasiStudent?.semester,
            date,
          }
        })
        if (!bufferFile) {
          return new NextResponse('Terjadi Kesalahan...', { status: 400 });
        }
        bufferUint8Array = new Uint8Array(bufferFile);
        return new NextResponse(bufferUint8Array, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${type}.pdf`,
          },
        });
      case "khs":
        const khsStudent = await prisma.khs.findUnique({
          where: {
            id: uid,
          },
          select: {
            student: {
              select: {
                id: true,
                name: true,
                nim: true,
                major: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            semester: true,
            period: {
              select: {
                name: true,
                semesterType: true,
              },
            },
            ips: true,
            maxSks: true,
          }
        });
        const queryPosition = khsStudent?.student?.major?.name === "Sistem Informasi" ? "KAPRODI SI" : "KAPRODI TI";
        const position = await prisma.position.findFirst({
          where: {
            positionName: {
              contains: queryPosition,
              mode: 'insensitive'
            },
          },
        });
        const khsDetail = await prisma.khsDetail.findMany({
          where: {
            khsId: uid,
            isLatest: true,
          },
          select: {
            course: {
              select: {
                code: true,
                name: true,
                sks: true,
              }
            },
            gradeLetter: true,
            weight: true,
          },
        });
        const totalSKS = khsDetail?.map((item: any) => item.course.sks)
          .reduce((acc: any, init: any) => acc + init, 0)
        const totalSKSxNAB = khsDetail?.map((item: any) => item.course.sks * item.weight)
          .reduce((acc: any, init: any) => acc + init, 0)
        
        bufferFile = await renderPdf({
          type: type,
          data: {
            khsStudent: {
              ...khsStudent,
              ips: Number(khsStudent?.ips) || 0,
            },
            khsDetail,
            totalSKS,
            totalSKSxNAB,
            position,
            date,
          }
        })
        if (!bufferFile) {
          return new NextResponse('Terjadi Kesalahan...', { status: 400 });
        }
        bufferUint8Array = new Uint8Array(bufferFile);
        return new NextResponse(bufferUint8Array, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${type}.pdf`,
          },
        });
      default:
        break;
    }
  } catch (err) {
    error(err);
    return new NextResponse('Someting wrong!', { status: 400 });
  }
  
}