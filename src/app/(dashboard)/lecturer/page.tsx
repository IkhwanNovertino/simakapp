import Announcements from "@/component/Announcements";
import BigCalendar from "@/component/BigCalendar";
import EventCalender from "@/component/EventCalender";
import { redirectDashboardByRole } from "@/lib/dal";
import { redirect } from "next/navigation";

const LecturerPage = async () => {
  const dashboardByRole = await redirectDashboardByRole();
  if (dashboardByRole !== "lecturer") {
    return redirect("/" + dashboardByRole);
  }
  return (
    <div className="p-4 flex flex-col md:flex-row gap-4">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Jadwal Dosen</h1>
          <BigCalendar />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalender />
        <Announcements />
      </div>
    </div>
  )
}

export default LecturerPage;