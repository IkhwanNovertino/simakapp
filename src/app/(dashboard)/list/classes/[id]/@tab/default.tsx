import { redirect } from "next/navigation";

const DefaultTab = async (
  {
    searchParams, params
  }: {
    searchParams: Promise<{ [key: string]: string | undefined }>,
    params: Promise<{ id: string }>
  }
) => {
  const { id } = await params;
  redirect(`/list/classes/${id}/student`)
}

export default DefaultTab;