import { prisma } from "@/lib/prisma";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";
import BigCalendar from "./BigCalendar";
import { Prisma } from "@prisma/client";

const BigCalendarContainer = async ({
  type,
  id,
}: {
  type: "lecturerId" | "studentId";
  id: string;
}) => {

  const query: Prisma.ScheduleDetailWhereInput = {};
  switch (type) {
    case "lecturerId":
      query.academicClass = {
        lecturer: {
          userId: id,
        },
      };
      break;
    case "studentId":
      query.academicClass = {
        academicClassDetail: {
          some: {
            student: {
              userId: id,
            },
          },
        },
      };
      break;

    default:
      break;
  }
  const dataRes = await prisma.scheduleDetail.findMany({
    where: query,
    select: {
      academicClass: {
        select: {
          name: true,
          course: {
            select: {
              name: true,
              code: true,
            },
          },
          room: true,
        }
      },
      time: true,
      dayName: true,
    }
  });

  console.log('BIGCALENDARCONTAINER', dataRes);

  const data = dataRes.map((lesson: any) => ({
    title: `Kelas ${lesson.academicClass.name} | (${lesson.academicClass.course.code}) ${lesson.academicClass.course.name}`,
    start: lesson.time.timeStart,
    end: lesson.time.timeFinish,
    dayName: lesson.dayName,
  }));

  const schedule = adjustScheduleToCurrentWeek(data);
  console.log('schedule', schedule);


  return (
    <div className="h-[800px]">
      <BigCalendar data={schedule} />
    </div>
  );
};

export default BigCalendarContainer;
