import Announcements from "@/component/Announcements";
import BigCalendar from "@/component/BigCalendar";
import BigCalendarContainer from "@/component/BigCalendarContainer";
import { redirectDashboardByRole } from "@/lib/dal";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

const StudentPage = async () => {
  const dashboardByRole = await redirectDashboardByRole();
  if (dashboardByRole !== "student") {
    return redirect("/" + dashboardByRole);
  }
  const getSessionfunc = await getSession();
  return (
    <div className="p-4 flex flex-col md:flex-row gap-4">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        <div className="mt-4 bg-white rounded-md p-4 min-h-fit">
          <h1>Jadwal Perkuliahan</h1>
          <BigCalendarContainer type="studentId" id={getSessionfunc?.userId} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        {/* <EventCalender /> */}
        <Announcements />
      </div>
    </div >
  )
}

export default StudentPage;