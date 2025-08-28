import { redirect, RedirectType } from "next/navigation";

const RecapitulationDetailByPeriodPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {

  const { id } = await params;
  redirect(`/list/recapitulations/${id}/coursekrs`);
}

export default RecapitulationDetailByPeriodPage;