'use server';
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { LoginInputs } from "./formValidationSchema";
import { createSession, deleteSession } from "./session";
import { redirect } from "next/navigation";
import { createDbSession } from "./session-db";

export const login = async (state: { success: boolean, error: boolean, message: string }, data: LoginInputs) => {
  const user = await prisma.user.findUnique({
    where: { email: data.username },
    include: {
      role: true,
    }
  });

  if (!user) return { success: false, error: true, message: "username dan password salah" };
  if (!user?.isStatus) return { success: false, error: true, message: "akun user tidak aktif" };

  const checkPassword = await bcrypt.compare(data.password, user?.password as string);
  if (!checkPassword) return { success: false, error: true, message: "username dan password salah" };
  
  // setSession
  // await createSession({ userId: user.id, roleId: user.roleId! });
  await createDbSession({userId: user.id})

  // redirectr
  // switch (user.role?.roleType) {
  //   case "STUDENT":
  //     redirect('/student');
  //     break;
  //   case "LECTURER":
  //     redirect('/lecturer');
  //     break;
  //   case "ADVISOR":
  //     redirect('/lecturer');
  //     break;
  //   case "OPERATOR":
  //     redirect('/admin');
  //     break;
  //   default:
  //     break;
  // }
  return {success: true, error: false, message: "login sukses"}
}

export const logout = async () => {
  await deleteSession();
  redirect('/')
}