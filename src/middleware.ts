import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const pathname = req.nextUrl.pathname;

  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/login' || pathname === '/admin/login';

  if (!isAdminRoute && !isLoginPage) {
    return NextResponse.next();
  }

  const user = token ? await verifyToken(token) : null;

  if (isAdminRoute && !user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isLoginPage && user) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};