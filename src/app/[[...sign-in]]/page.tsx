import LoginForm from "@/component/forms/LoginForm";
import { prisma } from "@/lib/prisma";
import { getDbSession } from "@/lib/session-db";
import { dashboardRouter } from "@/lib/utils";
import { redirect } from "next/navigation";

const LoginPage = async () => {

  // const session = await getDbSession();
  // if (session) {
  //   const user = await prisma.user.findUnique({
  //     where: { id: session.userId },
  //     include: { role: true }
  //   })

  //   if (user) {
  //     const dashboardPathname = await dashboardRouter(user?.role?.roleType!)
  //     redirect(`${dashboardPathname}`);
  //   }
  // }
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <LoginForm />
    </div>
  )
}

export default LoginPage;