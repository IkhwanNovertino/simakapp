
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
    const dataPeriod = await prisma.period.findUnique({
      where: {
        id: uid,
      },
    });

    const dataMajor = await prisma.major.findMany({
      select: {id: true, name: true, stringCode: true}
    })

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
                code: true,
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
            'Content-Disposition': `attachment; filename=DAFTAR NILAI (${academicClass?.course?.code}) ${academicClass?.course?.name} - KELAS ${academicClass?.name}.pdf`,
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
            'Content-Disposition': `attachment; filename=${krsStudent?.student?.nim} (${type}-${krsStudent?.reregister?.period?.name}).pdf`,
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
            'Content-Disposition': `attachment; filename=${khsStudent?.student?.nim} (${type}-${khsStudent?.period?.name}).pdf`,
          },
        });
      case "reregister":
        const [reregisterId, studentId] = uid.split(':');
        const reregister = await prisma.reregisterDetail.findUnique({
          where: {
            reregisterId_studentId: {
              reregisterId: reregisterId,
              studentId: studentId,
            },
          },
          select: {
            semester: true,
            campusType: true,
            reregister: {
              select: {
                period: {
                  select: {
                    name: true,
                    semesterType: true,
                    year: true,
                  }
                }
              },
            },
            student: {
              select: {
                nim: true,
                name: true,
                major: {
                  select: { name: true }
                },
                placeOfBirth: true,
                birthday: true,
                address: true,
                domicile: true,
                email: true,
                hp: true,
                guardianName: true,
                guardianNIK: true,
                guardianHp: true,
                guardianJob: true,
                guardianAddress: true,
                motherName: true,
                motherNIK: true,
              },
            }
          },
        });
        bufferFile = await renderPdf({
          type: type,
          data: {
            reregister: {
              ...reregister,
              student: {
                ...reregister?.student,
                birthday: reregister?.student?.birthday ? format(reregister.student.birthday, 'dd/MM/yyyy') : '',
              },
              campusType: (reregister?.campusType === "BJB" && 'BANJARBARU') || (reregister?.campusType === "BJM" && 'BANJARMASIN') || reregister?.campusType,
            },
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
            'Content-Disposition': `attachment; filename=${reregister?.student?.nim}(${type}-${reregister?.reregister?.period?.name}).pdf`,
          },
        });
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

        bufferFile = await renderPdf({
          type: type,
          data: {
            dataPeriod,
            dataCoursesByMajor,
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
            'Content-Disposition': `attachment; filename=REKAPITULASI MATA KULIAH (${dataPeriod?.name}).pdf`,
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

        bufferFile = await renderPdf({
          type: type,
          data: {
            dataPeriod,
            dataStudentRegisteredKrs,
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
            'Content-Disposition': `attachment; filename=DAFTAR MAHASISWA SUDAH KRS (${dataPeriod?.name}).pdf`,
          },
        });
      case "studentsUnregisteredKrs":
        const studentsUnregisteredKrs = await prisma.krs.findMany({
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

        const dataStudentsUnregisteredKrs = dataMajor.map((major: any) => {
          const studentsUnregisteredkrs = studentsUnregisteredKrs.filter((student: any) => student?.student?.major?.id === major?.id)
          return {major: major, students: studentsUnregisteredkrs}
        })

        console.log('DATA STUDENTUNREGIST', dataStudentsUnregisteredKrs);
        

        bufferFile = await renderPdf({
          type: type,
          data: {
            dataPeriod,
            dataStudentsUnregisteredKrs,
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
            'Content-Disposition': `attachment; filename=DAFTAR MAHASISWA BELUM KRS (${dataPeriod?.name}).pdf`,
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

        bufferFile = await renderPdf({
          type: type,
          data: {
            dataPeriod,
            dataStudentsTakingThesis,
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
            'Content-Disposition': `attachment; filename=DAFTAR MAHASISWA MENGAMBIL TA (${dataPeriod?.name}).pdf`,
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

        bufferFile = await renderPdf({
          type: type,
          data: {
            dataPeriod,
            dataStudentsExtendingThesis,
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
            'Content-Disposition': `attachment; filename=DAFTAR MAHASISWA SUDAH KRS (${dataPeriod?.name}).pdf`,
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

        bufferFile = await renderPdf({
          type: type,
          data: {
            dataPeriod,
            dataStudentsTakingInternship,
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
            'Content-Disposition': `attachment; filename=DAFTAR MAHASISWA MENGAMBIL PKL (${dataPeriod?.name}).pdf`,
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