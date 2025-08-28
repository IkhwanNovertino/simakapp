import { redirect } from "next/navigation";

const DefaultTab = async (
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  redirect(`/list/recapitulations/${id}/coursekrs`)
}

export default DefaultTab;