import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PATHS = ['/share-testimony'];

export function middleware(req: NextRequest) {
  const requiresAuth = PROTECTED_PATHS.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );
  if (!requiresAuth) {
    return NextResponse.next();
  }

  const token = req.cookies.get('authToken')?.value;

  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/share-testimony/:path*'],
};