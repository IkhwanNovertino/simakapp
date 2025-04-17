import Announcements from "@/component/Announcements";
import BigCalendar from "@/component/BigCalendar";
import CountChart from "@/component/CountChart";
import EventCalender from "@/component/EventCalender";
import UserCard from "@/component/UserCard";
import { prisma } from "@/lib/prisma";
import { getDbSession } from "@/lib/session-db";
import { dashboardRouter } from "@/lib/utils";
import { redirect } from "next/navigation";

const AdminPage = async () => {
  // const session = await getDbSession()

  // // If not authenticated, send to sign-in
  // if (!session) {
  //   redirect('/sign-in')
  // }

  // // Fetch user's role
  // const user = await prisma.user.findUnique({
  //   where: { id: session.userId },
  //   include: { role: true },
  // })

  // if (user) {
  //   const dashboardPathname = await dashboardRouter(user?.role?.roleType!)
  //   redirect(`${dashboardPathname}`);
  // }


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
          {/* ATTENDANCE CHART */}
          {/* <div className="w-full lg:w-2/3 h-[450px]"> */}
          {/* <AttandanceChart /> */}
          {/* </div> */}
        </div>

        {/* BOTTOM CHART */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Student&apos;s Schedule</h1>
          <BigCalendar />
        </div>
        {/* <div className="w-full h-[500px]"> */}
        {/* <FinanceChart /> */}
        {/* </div> */}
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