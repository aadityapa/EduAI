import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { isExternalUrl, resolvePostLoginDestination } from '@eduai/shared';

const protectedPrefixes = ['/dashboard', '/student', '/teacher', '/parent', '/admin'];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
  const isLoggedIn = !!req.auth;

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (pathname === '/login' && isLoggedIn && req.auth?.user) {
    const dest = resolvePostLoginDestination(req.auth.user.roles);
    if (isExternalUrl(dest)) {
      return NextResponse.redirect(dest);
    }
    return NextResponse.redirect(new URL(dest, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
