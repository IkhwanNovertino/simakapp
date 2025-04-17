import Announcements from "@/component/Announcements";
import BigCalendar from "@/component/BigCalendar";
import CountChart from "@/component/CountChart";
import EventCalender from "@/component/EventCalender";
import UserCard from "@/component/UserCard";

const StudentPage = () => {
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

        {/* BOTTOM CHART */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Student&apos;s Schedule</h1>
          {/* <BigCalendar /> */}
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