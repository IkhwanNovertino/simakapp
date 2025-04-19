'use server';
import { jwtVerify, SignJWT } from "jose";
import { prisma } from "./prisma";
import { cookies } from "next/headers";

const SESSION_NAME = "session";

const encrypt = async (sessionId: string) => {
  const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
  const jwt = await new SignJWT({ sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2d")
    .sign(secret);
  return jwt;
}

export const decrypt = async (token: string) => {
  const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
  const { payload } = await jwtVerify(token, secret, {
    algorithms: ["HS256"],
  });
  
  return payload.sessionId;
}

export const createSession = async (userId: string) => {
  const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  const sessionInsert = await prisma.session.create({
    data: {
      userId,
      expiresAt,
    },
  });

  const sessionId = sessionInsert.id;
  const encryptedSession = await encrypt(sessionId);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_NAME, encryptedSession, {
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

  const decryptedSession = await decrypt(session);
  if (!decryptedSession) return null;

  // Get session from database
  const sessionData = await prisma.session.findUnique({
    where: { id: decryptedSession.toString() },
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
  const session = cookieStore.get(SESSION_NAME)?.value!;
  const decryptedSession = await decrypt(session);
  if (!decryptedSession) {
    console.log("Session not found");
    return null
  };

  if (session && decryptedSession) {
    await prisma.session.delete({
      where: { id: decryptedSession.toString() },
    })
  };
  cookieStore.delete(SESSION_NAME);
  return true;
}