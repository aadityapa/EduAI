import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getDashboardRoute } from '@eduai/shared';

const protectedPrefixes = ['/dashboard', '/student', '/teacher', '/parent', '/admin'];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
  const isLoggedIn = !!req.auth;

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (pathname === '/login' && isLoggedIn && req.auth?.user) {
    return NextResponse.redirect(new URL(getDashboardRoute(req.auth.user.roles), req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
