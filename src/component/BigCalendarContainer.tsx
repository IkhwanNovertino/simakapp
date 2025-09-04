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
  });

  console.log('BIGCALENDARCONTAINER', dataRes);

  const data = dataRes.map((lesson: any) => ({
    title: lesson.name,
    start: lesson.startTime,
    end: lesson.endTime,
  }));

  const schedule = adjustScheduleToCurrentWeek(data);

  return (
    <div className="">
      <BigCalendar data={schedule} />
    </div>
  );
};

export default BigCalendarContainer;
