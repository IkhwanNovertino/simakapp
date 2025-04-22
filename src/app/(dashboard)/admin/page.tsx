import Announcements from "@/component/Announcements";
import CountChart from "@/component/CountChart";
import EventCalender from "@/component/EventCalender";
import UserCard from "@/component/UserCard";
import { redirectDashboardByRole } from "@/lib/dal";
import { redirect } from "next/navigation";

const AdminPage = async () => {
  const dashboardByRole = await redirectDashboardByRole();
  if (dashboardByRole !== "admin") {
    return redirect("/" + dashboardByRole);
  }

  return (
    <div className="p-4 flex flex-col md:flex-row gap-4">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARD */}
        <div className="flex justify-between flex-wrap gap-4">
          <UserCard type="Students" />
          <UserCard type="Teachers" />
          <UserCard type="Parents" />
          <UserCard type="Staff" />
        </div>
        {/* MIDDLE CHART */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/2 h-[450px]">
            <CountChart title="Mahasiswa/i" />
          </div>
          <div className="w-full lg:w-1/2 h-[450px]">
            <CountChart title="Program Studi" />
          </div>
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

export default AdminPage;