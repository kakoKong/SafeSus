import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const ALLOWED_PATHS = new Set(['/', '/favicon.ico', '/manifest.json']);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    ALLOWED_PATHS.has(pathname) ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/images')
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = '/';
  url.search = '';

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!api|_next|static|images|favicon.ico|manifest.json).*)'],
};

