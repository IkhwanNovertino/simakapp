import "server-only";

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET as string;
const encodedKey = new TextEncoder().encode(secretKey);

export const encrypt = async (payload: {userId: string, roleId: number, expiresAt: Date}) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
};

export const decrypt = async (session: string | undefined = '') => {
  try {
    const { payload } = await jwtVerify(session, encodedKey, { algorithms: ["HS256"] });
    
    return payload;
  } catch (err: any) {
    console.log('Failed to verify session')
  }
}

export const createSession = async ({ userId, roleId }:{ userId: string, roleId: number}) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, roleId, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export const deleteSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}