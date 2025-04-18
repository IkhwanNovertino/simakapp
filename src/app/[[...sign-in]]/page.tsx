import LoginForm from "@/component/forms/LoginForm";
import { redirectDashboardByRole } from "@/lib/dal";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <LoginForm />
    </div>
  )
}

export default LoginPage;