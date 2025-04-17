import "server-only";
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getDbSession } from '@/lib/session-db'
import { prisma } from './lib/prisma'
import { dashboardRouter } from './lib/utils'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // whitelist public routes
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // verifikasi session dari DB
  const session = await getDbSession()

  // If logged in and accessing sign-in page, redirect to dashboard
  if (session && pathname.startsWith('/sign-in')) {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { role: true },
    })
    const dashboardPathname = await dashboardRouter(user?.role?.roleType!);
    const dashboardPath = `/admin`
    return NextResponse.redirect(new URL(dashboardPath, req.url))
  }

  // If not logged in and accessing protected pages (not sign-in), redirect to sign-in
  if (!session && !pathname.startsWith('/sign-in')) {
    const signInUrl = req.nextUrl.clone()
    signInUrl.pathname = '/sign-in'
    return NextResponse.redirect(signInUrl)
  }

  // kirim header untuk downstream
  const res = NextResponse.next()
  res.headers.set('x-user-id', session?.userId!)
  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}