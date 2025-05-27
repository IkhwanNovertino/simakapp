import TabNavigationCourse from "@/component/TabNavigationCourse";
import React from "react";

export default async function CourseLayout({
  tab,
}: Readonly<{
  tab: React.ReactNode;
}>) {

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0">
      <TabNavigationCourse />
      <div className="mt-2">{tab}</div>
    </div>
  );
}