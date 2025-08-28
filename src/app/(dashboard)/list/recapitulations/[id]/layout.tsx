import TabNavigation from "@/component/TabNavigationCourse";
import { prisma } from "@/lib/prisma";
import { lecturerName } from "@/lib/utils";

const RecapitulationDetailLayout = async (
  {
    tab,
    params
  }: {
    tab: React.ReactNode,
    params: Promise<{ id: string }>
  }
) => {

  const { id } = await params;

  const tabs = [
    { href: `/list/recapitulations/${id}/coursekrs`, label: "MK Rencana Studi" },
    { href: `/list/recapitulations/${id}/student`, label: "Mahasiswa" },
  ];

  return (
    <div className="flex-1 p-4 flex flex-col gap-4">
      <div className="bg-white rounded-md flex-1 mt-0">
        <div className="w-full">
          <TabNavigation tabs={tabs} />
        </div>
        {tab}
      </div>
    </div>
  )
}

export default RecapitulationDetailLayout;