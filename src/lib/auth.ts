'use server';

import bcrypt from "bcryptjs";
import { LoginInputs } from "./formValidationSchema";
import { prisma } from "./prisma";
import { createSession, deleteSession } from "./session";
import { redirect } from "next/navigation";

export const login = async (state: { success: boolean, error: boolean, message: string }, data: LoginInputs) => {
  const user = await prisma.user.findUnique({
    where: { email: data.username },
  });
  if (!user) return { success: false, error: true, message: "username dan password salah" };
  if (!user?.isStatus) return { success: false, error: true, message: "akun user tidak aktif" };

  const checkPassword = await bcrypt.compare(data.password, user?.password as string);
  if (!checkPassword) return { success: false, error: true, message: "username dan password salah" };

  // set session
  const session = await createSession(user.id);
  if (!session) return { success: false, error: true, message: "gagal membuat session" };

  return { success: true, error: false, message: "login sukses" };
}

export const logout = async () => {
  await deleteSession();
  redirect('/')
}