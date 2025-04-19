'use server';
import { SignJWT } from "jose";
import { prisma } from "./prisma";
import { cookies } from "next/headers";

const SESSION_NAME = "session";

export const createSession = async (userId: string) => {
  const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  const sessionInsert = await prisma.session.create({
    data: {
      userId,
      expiresAt,
    },
  });

  const sessionId = sessionInsert.id;
  const cookieStore = await cookies();
  cookieStore.set(SESSION_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
    sameSite: "lax",
  });

  return true;
}

export const getSession = async () => {
  // Get session from cookie
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_NAME)?.value;
  if (!session) return null;

  // Get session from database
  const sessionData = await prisma.session.findUnique({
    where: { id: session },
    include: {
      user: {
        include: {
          role: true,
        }
      }
    },
  });

  if (!sessionData || sessionData.expiresAt.getTime() < Date.now()) return null;
  return {
    sessionId: sessionData.id,
    userId: sessionData.userId,
    roleId: sessionData.user.roleId,
    roleType: sessionData.user.role?.roleType,
  };
}

export const deleteSession = async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_NAME)?.value;
  if (session) {
    await prisma.session.delete({
      where: { id: session},
    })
  };
  cookieStore.delete(SESSION_NAME);
  return true;
}