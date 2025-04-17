import 'server-only'
import { cookies } from 'next/headers'
import { prisma } from './prisma'

const COOKIE_NAME = 'sessionId'
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

export interface DbSession {
  id: string;
  userId: string;
  expiresAt: Date;
  roleId?: number;
}

// Buat session baru di DB & simpan cookie
export async function createDbSession({userId}: {userId: string}) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await prisma.session.create({
    data: { userId, expiresAt },
  })

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, session.id, {
    ...COOKIE_OPTIONS,
    expires: expiresAt,
  });

  return session;
  // const session = await prisma.session.create({
  //   data: { userId, expiresAt },
  // })
  // await cookies().set(COOKIE_NAME, session.id, {
  //   ...COOKIE_OPTIONS,
  //   expires: expiresAt,
  // })
  // return session
}

// Ambil session dari cookie + DB, validasi expiration
export async function getDbSession() {
  const sessionId = (await cookies()).get(COOKIE_NAME)?.value;
  if (!sessionId) return null

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: { select: { id: true, roleId: true } } },
  });
  
  if (!session || session.expiresAt.getTime() < Date.now()) {
    // otomatis hapus jika kadaluarsa
    if (session) await prisma.session.delete({ where: { id: session.id } })
    return null
  }
  return { id: session.id, userId: session.user.id, expiresAt: session.expiresAt, roleId: session.user.roleId! }
}

// Hapus session (logout)
export async function deleteDbSession() {
  const sessionId = (await cookies()).get(COOKIE_NAME)?.value
  const cookiesStore = await cookies();
  if (sessionId) {
    await prisma.session.delete({
      where: { id: sessionId }
    });
    cookiesStore.delete(COOKIE_NAME);
    
  }
}