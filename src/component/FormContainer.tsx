import { prisma } from "@/lib/prisma";
import FormModal, { FormModalProps } from "./FormModal";
import { getSession } from "@/lib/session";

const FormContainer = async (
  { table, type, data, id }: FormModalProps
) => {
  let relatedData = {};
  if (type !== "delete") {
    switch (table) {
      case "role":
        const rolePermission = await prisma.permission.findMany({
          select: { id: true, name: true },
        });
        relatedData = { permissions: rolePermission };
        break;
      case "course":
        const majors = await prisma.major.findMany({
          select: { id: true, name: true },
        });
        const courseData = await prisma.course.findMany({
          select: { id: true, name: true },
        });
        const assessmentType = await prisma.assessment.findMany({
          select: { id: true, name: true },
        });
        relatedData = { majors: majors, courses: courseData, assessmentType: assessmentType };
        break;
      case "operator":
        const role = await prisma.role.findMany({
          select: { id: true, name: true },
        });
        relatedData = { role: role };
        break;
      case "operatorUser":
        const roleOperatorUser = await prisma.role.findMany({
          where: { roleType: "OPERATOR" },
          select: { id: true, name: true },
        });
        relatedData = { role: roleOperatorUser };
        break;
      case "lecturer":
        const majorLecturer = await prisma.major.findMany({
          select: { id: true, name: true },
        });
        relatedData = { majors: majorLecturer };
        break;
      case "lecturerUser":
        const majorLecturerUser = await prisma.major.findMany({
          select: { id: true, name: true },
        });
        const roleLecturerUser = await prisma.role.findMany({
          where: {
            OR: [
              { roleType: "LECTURER" },
              { roleType: "ADVISOR" },
            ]
          },
          select: { id: true, name: true },
        });
        relatedData = { majors: majorLecturerUser, role: roleLecturerUser };
        break;
      case "student":
        const majorstudent = await prisma.major.findMany({
          select: { id: true, name: true },
        });
        const lecturerstudent = await prisma.lecturer.findMany({
          where: {
            user: {
              role: {
                roleType: "ADVISOR"
              }
            }
          },
          select: { id: true, name: true },
        });
        const rolestudent = await prisma.role.findMany({
          where: {
            roleType: "STUDENT",
          },
          select: { id: true, name: true },
        });
        relatedData = { majors: majorstudent, role: rolestudent, lecturer: lecturerstudent };
        break;
      case "studentUser":
        const roleStudentUser = await prisma.role.findMany({
          where: {
            roleType: "STUDENT",
          },
          select: { id: true, name: true },
        });
        relatedData = { role: roleStudentUser, };
        break;
      case "reregistration":
        const periodReregister = await prisma.period.findMany({
          select: { id: true, name: true },
          orderBy: [
            {
              year: "desc"
            },
            {
              semesterType: "asc"
            }
          ]
        });
        relatedData = { period: periodReregister };
        break;
      case "reregistrationDetail":
        const students = await prisma.student.findMany({
          include: {
            major: true,
            lecturer: true,
          },
          orderBy: [
            {
              nim: 'asc'
            }
          ],
        });
        const lecturer = await prisma.lecturer.findMany({
          where: {
            user: {
              role: {
                roleType: "ADVISOR"
              }
            }
          },
          select: { id: true, name: true, frontTitle: true, backTitle: true }
        });
        const userRole = await getSession();
        relatedData = { students: students, lecturers: lecturer, role: userRole?.roleName };
        break;
      case "reregistrationStudent":
        const student = await prisma.student.findMany({
          include: {
            major: true,
            lecturer: true,
          },
        });
        const lecturers = await prisma.lecturer.findMany({
          where: {
            user: {
              role: {
                roleType: "ADVISOR"
              }
            }
          },
          select: { id: true, name: true, frontTitle: true, backTitle: true }
        });
        relatedData = { students: student, lecturers: lecturers };
        break;
      case "curriculum":
        const majorCurriculum = await prisma.major.findMany({
          select: { id: true, name: true },
        });
        relatedData = { majors: majorCurriculum };
        break;
      case "curriculumDetail":
        const semesterInt = Array.from({ length: 8 }, (_, i) => i + 1);
        const courseCurriculumDetail = await prisma.course.findMany({
          select: { id: true, name: true, code: true, majorId: true },
        });
        relatedData = { semesterInt: semesterInt, courses: courseCurriculumDetail };
        break;
      case "assessment":
        const gradeComponents = await prisma.gradeComponent.findMany({
          select: { id: true, name: true },
        });

        relatedData = { allGradeComponent: gradeComponents };
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} />
    </div>
  )
}

export default FormContainer;