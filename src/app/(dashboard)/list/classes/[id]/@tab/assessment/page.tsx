
import FormContainer from "@/component/FormContainer";
import ImportForm from "@/component/ImportForm";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { lecturerName } from "@/lib/utils";
import { AcademicClass, AcademicClassDetail, AssessmentDetail, Course, GradeComponent, Lecturer, Prisma, Student, } from "@prisma/client";

type AcademicClassDetailDataType = AcademicClassDetail
  & {
    academicClass: AcademicClass
    & { lecturer: Lecturer }
    & { course: Course }
  }
  & { student: Student }

// Tidak bisa menggunakan useState karena disini sudah menggunakan server component.
const ClassSingleTabAssessmentPage = async (
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

  const query: Prisma.KrsDetailWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { krs: { student: { name: { contains: value, mode: "insensitive" } } } },
              { krs: { student: { nim: { contains: value, mode: "insensitive" } } } }
            ]
            break;
          default:
            break;
        }
      }
    }
  };
  const [students, assessmentDetails, count] = await prisma.$transaction(async (prisma: any) => {
    const academicClass = await prisma.academicClass.findFirst({
      where: {
        id: id,
      },
      select: {
        academicClassDetail: true,
        course: {
          include: {
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
            }
          }
        }
      }
    });

    const enrolledStudents = academicClass?.academicClassDetail.map((detail: AcademicClassDetail) => detail.studentId) || [];
    const assessmentDetails = academicClass?.course.assessment?.assessmentDetail || [];
    const students = await prisma.krsDetail.findMany({
      where: {
        courseId: academicClass?.course?.id,
        krs: {
          student: {
            id: {
              in: enrolledStudents,
            }
          },
          reregister: {
            periodId: academicClass?.periodId,
          }
        },
        ...query,
      },
      include: {
        krs: {
          include: {
            student: {
              select: { id: true, name: true, nim: true }
            },
          }
        },
        krsGrade: {
          include: {
            assessmentDetail: {
              include: {
                grade: true,
              },
            }
          },
          orderBy: {
            assessmentDetail: { seq_number: 'desc' }
          }
        },
      },
      orderBy: [
        {
          krs: {
            student: {
              nim: 'asc'
            }
          }
        }
      ]
    });

    const count = await prisma.krsDetail.count({
      where: {
        courseId: academicClass?.course?.id,
        krs: {
          student: {
            id: {
              in: enrolledStudents,
            }
          },
          reregister: {
            periodId: academicClass?.periodId,
          }
        },
        ...query,
      },
    })

    const dataTransformed = [];
    for (const items of students) {
      dataTransformed.push(
        {
          ...items,
          finalScore: parseFloat(items.finalScore),
          weight: parseFloat(items.weight),
          krs: {
            ...items.krs,
            ipk: parseFloat(items.krs.ipk)
          },
        }
      )
    }
    return [dataTransformed, assessmentDetails, count];
  })

  const columnGrade = assessmentDetails.map((item: any) => (
    {
      header: `${item.grade.name} (${item.percentage}%)`,
      accessor: item.grade.name,
      className: "hidden md:table-cell w-8 text-[11px] lowercase"
    }
  ));


  const columns = [
    {
      header: "Mahasiswa",
      accessor: "mahasiswa",
      className: "px-2 md:px-4"
    },
    ...columnGrade,
    {
      header: 'nilai akhir',
      accessor: 'nilai akhir',
      className: "hidden md:table-cell w-24 text-[11px] lowercase"
    },
    {
      header: 'abs',
      accessor: 'abs',
      className: "hidden md:table-cell w-24 text-[11px] lowercase"
    },
    {
      header: 'Keterangan',
      accessor: 'keterangan',
      className: "hidden md:table-cell text-[11px]"
    },
    {
      header: 'Actions',
      accessor: 'actions',
      className: "hidden md:table-cell text-[11px]"
    },
  ];

  const renderRow = (item: any) => {

    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-4">
          <div className="flex flex-col col-span-5 items-start">
            <h3 className="text-sm font-semibold">{item.krs.student.name}</h3>
            <p className="text-xs text-gray-600">{item.krs.student.nim}</p>
          </div>
          <div className="flex items-center justify-end gap-2 md:hidden ">
          </div>
        </td>
        {item.krsGrade.map((grade: any) => (
          <td key={grade.id} className="hidden md:table-cell w-24">{grade.score || 0}</td>
        ))}
        <td className="hidden md:table-cell w-24">{item.finalScore || 0}</td>
        <td className="hidden md:table-cell w-24 text-xs">{item.gradeLetter || "TBC"}</td>
        <td className="hidden md:table-cell text-xs">{"-"}</td>
        <td className="hidden md:table-cell text-xs">
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <FormContainer table="krsGrade" type="update" id={item.id} data={item} />
            </div>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between md:mb-6">
        <h1 className="text-base font-semibold">Daftar Nilai Mata Kuliah</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="hidden md:flex items-center gap-4 self-end ">
            <a
              href={`/api/grade?academicClassId=${id}&template=true`}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium w-fit py-2 px-4 text-gray-900 bg-ternary/70 rounded-full cursor-pointer capitalize hover:bg-ternary"
            >
              Template Nilai
            </a>
            <a
              href={`/api/grade?academicClassId=${id}`}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium w-fit py-2 px-4 text-gray-900 bg-primary/70 rounded-full cursor-pointer capitalize hover:bg-primary"
            >
              Export
            </a>
            <ImportForm />
          </div>
        </div>
      </div>
      {/* BOTTOM */}
      <div className="block md:hidden font-semibold text-xs my-4 py-2 px-3 bg-amber-300 rounded-md">GUNAKAN TABLET/LAPTOP UNTUK MELAKUKAN PENILAIAN!</div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={students} />
      {/* PAGINATION */}
      <Pagination page={p} count={count || 0} />
    </div>
  )
}

export default ClassSingleTabAssessmentPage;