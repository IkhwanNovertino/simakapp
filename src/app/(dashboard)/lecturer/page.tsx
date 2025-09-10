import Announcements from "@/component/Announcements";
import BigCalendarContainer from "@/component/BigCalendarContainer";
import EventCalender from "@/component/EventCalender";
import { redirectDashboardByRole } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

const LecturerPage = async () => {
  const dashboardByRole = await redirectDashboardByRole();
  if (dashboardByRole !== "lecturer") {
    return redirect("/" + dashboardByRole);
  };
  const getSessionfunc = await getSession();
  const id = await prisma.lecturer.findunique({
    where: {
      userId: getSessionfunc?.userId,
    },
    select: {
      id: true,
    },
  });
  return (
    <div className="p-4 flex flex-col md:flex-row gap-4">
      {/* LEFT */}
      <div className="w-full lg:w-3/4 flex flex-col gap-8">
        <div className="mt-4 bg-white rounded-md p-4 min-h-fit">
          <h1>Jadwal Dosen</h1>
          <BigCalendarContainer type="lecturerId" id={id} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/4 flex flex-col gap-8">
        <EventCalender />
        <Announcements />
      </div>
    </div>
  )
}

export default LecturerPage;