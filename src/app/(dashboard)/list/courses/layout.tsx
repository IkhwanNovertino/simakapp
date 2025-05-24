import TabNavigationCourse from "@/component/TabNavigationCourse";
import React from "react";

export default async function CourseLayout({
  children, tab,
}: Readonly<{
  children: React.ReactNode;
  tab: React.ReactNode;
}>) {

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0">
      <TabNavigationCourse />
      <div className="mt-2">{tab}</div>
    </div>
  );
}