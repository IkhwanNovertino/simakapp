
import FormContainer from "@/component/FormContainer";
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

  const query: Prisma.ReregisterDetailWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { student: { name: { contains: value, mode: "insensitive" } } },
              { student: { nim: { contains: value, mode: "insensitive" } } },
            ]
            break;
          default:
            break;
        }
      }
    }
  };

  const [dataAcademicClass, dataKrs, dataAssessment, data, count] = await prisma.$transaction(async (prisma: any) => {
    const dataAcademicClass = await prisma.academicClass.findFirst({
      where: {
        id: id,
      },
      include: {
        lecturer: true,
        course: true,
      }
    });

    const dataAssessment = await prisma.assessmentDetail.findMany({
      where: {
        assessmentId: dataAcademicClass.course.assessmentId,
      },
      include: {
        grade: true,
      },
      orderBy: [
        { grade: { name: 'asc' } },
      ]
    });
    const data = await prisma.academicClassDetail.findMany({
      where: {
        academicClassId: id,
      },
      include: {
        student: {
          select: { id: true, name: true, nim: true }
        },
      },
      orderBy: [
        { student: { nim: 'asc' } },
      ],
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    });
    const arrStudent = new Set(data.map((item: AcademicClassDetailDataType) => item.studentId));

    const dataKrs = await prisma.krsDetail.findMany({
      where: {
        courseId: dataAcademicClass?.courseId,
        krs: {
          student: {
            id: {
              in: Array.from(arrStudent),
            }
          },
          reregister: {
            periodId: dataAcademicClass?.periodId,
          }
        },
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
              }
            }
          }
        },
      }
    })
    const count = await prisma.academicClassDetail.count({
      where: {
        academicClassId: id,
      },
    });
    return [dataAcademicClass, dataKrs, dataAssessment, data, count];
  });

  const columnGrade = dataAssessment.map((item: any) => (
    {
      header: `${item.grade.name} (${item.percentage}%)`,
      accessor: item.grade.name,
      className: "hidden md:table-cell w-24 px-4 text-[11px] lowercase"
    }
  ));


  const columns = [
    {
      header: "Mahasiswa",
      accessor: "mahasiswa",
      className: "px-2 md:px-4"
    },
    {
      header: 'Penilaian',
      accessor: 'penilaian',
      className: "hidden md:table-cell px-4"
    },
    {
      header: 'abs',
      accessor: 'abs',
      className: "hidden md:table-cell px-4"
    },
  ];

  const renderRow = (item: AcademicClassDetailDataType) => {

    return (
      <tr
        key={item.studentId}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-4">
          <div className="flex flex-col col-span-5 items-start">
            <h3 className="text-sm font-semibold">{item.student.name}</h3>
            <p className="text-xs text-gray-600">{item.student.nim}</p>
          </div>
          <div className="flex items-center justify-end gap-2 md:hidden ">
          </div>
        </td>
        <td className="hidden md:table-cell"></td>
        <td className="hidden md:table-cell"></td>
        <td className="hidden md:table-cell"></td>
        <td className="hidden md:table-cell"></td>
        <td className="hidden md:table-cell"></td>
        <td className="hidden md:table-cell"></td>
        <td className="hidden md:table-cell"></td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between md:mb-6">
        <h1 className="text-base font-semibold">Daftar Nilai Mata Kuliah</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {/* <FormContainer table="classDetail" type="create" data={dataAcademicClass} /> */}
          </div>
        </div>
      </div>
      {/* BOTTOM */}
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count || 0} />
    </div>
  )
}

export default ClassSingleTabAssessmentPage;