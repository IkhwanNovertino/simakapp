import { exportCourseTaken } from "@/lib/excel/exportCourseTaken";
import { exportStudentRegisteredKrs } from "@/lib/excel/exportStudentRegisteredKrs";
import { exportStudentTakingIntership } from "@/lib/excel/exportStudentTakingIntership";
import { exportStudentTakingThesis } from "@/lib/excel/exportStudentTakingThesis";
import { exportStudentUnregisteredKrs } from "@/lib/excel/exportStudentUnregisteredKrs";
import { prisma } from "@/lib/prisma";
import { error } from "console";
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
    const date = format(new Date(), 'dd MMMM yyyy', { locale: indonesianLocale });

    const dataPeriod = await prisma.period.findUnique({
      where: {
        id: uid,
      },
    });

    const dataMajor = await prisma.major.findMany({
      select: {id: true, name: true, stringCode: true}
    })

    switch (type) {
      case "coursekrs":

        const semesterQuery = dataPeriod?.semesterType === "GANJIL" ? [1, 3, 5, 7] : [2, 4, 6, 8];
        const coursesInCurriculumDetail = await prisma.curriculumDetail.findMany({
          where: {
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
        });
      
        const countCourseInKrsDetail = await prisma.krsDetail.count({
          where: {
            krs: {
              reregister: {
                period: {
                  id: uid,
                }
              }
            }
          }
        });
        let countCourseTaken = [];
        if (countCourseInKrsDetail >= 1) {
          countCourseTaken = await prisma.krsDetail.groupBy({
            by: ["courseId"],
            where: {
              krs: {
                reregister: {
                  period: {
                    id: uid,
                  },
                },
              },
            },
            _count: {
              courseId: true,
            },
          });
        };
      
        const dataFinal = coursesInCurriculumDetail.map((item: any) => {
          return {
            ...item,
            studentCount: countCourseTaken.find((items: any) => item.courseId === items.courseId)?._count?.courseId || 0,
          };
        });
        const dataCoursesByMajor = dataMajor.map((major: any) => {
          const course = dataFinal.filter((course: any) => course?.course?.majorId === major.id)
          return {major: major, courses: course}
        })
        
        bufferFile = await exportCourseTaken({
          data: {
            dataPeriod,
            dataCoursesByMajor: dataCoursesByMajor,
          }
        })
        return new NextResponse(bufferFile, {
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="REKAPITULASI MATA KULIAH (${dataPeriod?.name}).xlsx"`,
          },
        });
      case "studentsRegisteredKrs":
        const studentRegisteredKrs = await prisma.krs.findMany({
          where: {
            reregister: {
              periodId: uid,
            },
            krsDetail: {
              some: {},
            },
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
        });

        const dataStudentRegisteredKrs = dataMajor.map((major: any) => {
          const studentsRegisteredkrs = studentRegisteredKrs.filter((student: any) => student?.student?.major?.id === major?.id)
          return {major: major, students: studentsRegisteredkrs}
        })
        
        bufferFile = await exportStudentRegisteredKrs({
          data: {
            dataPeriod: dataPeriod,
            dataStudentByMajor: dataStudentRegisteredKrs,
          }
        })
        return new NextResponse(bufferFile, {
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="DAFTAR MAHASISWA SUDAH KRS (${dataPeriod?.name}).xlsx"`,
          },
        });
      case "studentsUnregisteredKrs":
        const studentUnregisteredKrs = await prisma.krs.findMany({
          where: {
            reregister: {
              periodId: uid,
            },
            krsDetail: {
              none: {},
            },
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
        });

        const dataStudentUnregisteredKrs = dataMajor.map((major: any) => {
          const studentsUnregisteredkrs = studentUnregisteredKrs.filter((student: any) => student?.student?.major?.id === major?.id)
          return {major: major, students: studentsUnregisteredkrs}
        })
        
        bufferFile = await exportStudentUnregisteredKrs({
          data: {
            dataPeriod: dataPeriod,
            dataStudentByMajor: dataStudentUnregisteredKrs,
          }
        })
        return new NextResponse(bufferFile, {
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="DAFTAR MAHASISWA BELUM KRS (${dataPeriod?.name}).xlsx"`,
          },
        });
      case "studentsTakingThesis":
        const studentsTakingThesis = await prisma.krs.findMany({
          where: {
            reregister: {
              periodId: uid,
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
            student: {
              select: {
                nim: true,
                name: true,
                major: true,
              }
            }
          },
        });

        const dataStudentsTakingThesis = dataMajor.map((major: any) => {
          const studentsTakingthesis = studentsTakingThesis.filter((student: any) => student?.student?.major?.id === major?.id)
          return {major: major, students: studentsTakingthesis}
        })
        
        bufferFile = await exportStudentTakingThesis({
          data: {
            dataPeriod: dataPeriod,
            dataStudentByMajor: dataStudentsTakingThesis,
          }
        })
        return new NextResponse(bufferFile, {
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="DAFTAR MAHASISWA MENGAMBIL TA (${dataPeriod?.name}).xlsx"`,
          },
        });
      case "studentsExtendingThesis":
        // BELUM DIEDIT SAMA SEPERTI STUDENTTAKINGTHESIS
        const studentsExtendingThesis = await prisma.krs.findMany({
          where: {
            reregister: {
              periodId: uid,
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
            student: {
              select: {
                nim: true,
                name: true,
                major: true,
              }
            }
          },
        });

        const dataStudentsExtendingThesis = dataMajor.map((major: any) => {
          const studentsExtendingthesis = studentsExtendingThesis.filter((student: any) => student?.student?.major?.id === major?.id)
          return {major: major, students: studentsExtendingthesis}
        })
        
        bufferFile = await exportStudentRegisteredKrs({
          data: {
            dataPeriod: dataPeriod,
            dataStudentByMajor: dataStudentsExtendingThesis,
          }
        })
        return new NextResponse(bufferFile, {
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="DAFTAR MAHASISWA PERPANJANGAN TA (${dataPeriod?.name}).xlsx"`,
          },
        });
      case "studentsTakingInternship":
        const studentsTakingInternship = await prisma.krs.findMany({
          where: {
            reregister: {
              periodId: uid,
            },
            krsDetail: {
              some: {
                course: {
                  isPKL: true,
                },
              },
            },
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
        });

        const dataStudentsTakingInternship = dataMajor.map((major: any) => {
          const studentsTakinginternship = studentsTakingInternship.filter((student: any) => student?.student?.major?.id === major?.id)
          return {major: major, students: studentsTakinginternship}
        })
        
        bufferFile = await exportStudentTakingIntership({
          data: {
            dataPeriod: dataPeriod,
            dataStudentByMajor: dataStudentsTakingInternship,
          }
        })
        return new NextResponse(bufferFile, {
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="DAFTAR MAHASISWA MENGAMBIL PKL (${dataPeriod?.name}).xlsx"`,
          },
        });
      default:
        return new NextResponse('Someting wrong!', { status: 400 });
    }
  } catch (err) {
    error(err);
    return new NextResponse('Someting wrong!', { status: 400 });
  }
  
}