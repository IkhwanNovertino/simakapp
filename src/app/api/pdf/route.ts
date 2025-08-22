import { exportAssessmentGrade } from "@/lib/excel/exportAssessmentGrade";
import { exportAssessmentTemplate } from "@/lib/excel/exportAssessmentTemplate";
import logger from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import renderPdf from "@/lib/renderPdf";
import { lecturerName } from "@/lib/utils";
import { format } from "date-fns";
import { id as indonesianLocale } from "date-fns/locale";
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
        const date = format(new Date(), 'dd MMMM yyyy', { locale: indonesianLocale });
        

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
    
      default:
        break;
    }
  } catch (err) {
    logger.error(err)
    return new NextResponse('Someting wrong!', { status: 400 });
  }
  
}