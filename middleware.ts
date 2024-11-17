import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow API routes and Next.js internal routes (_next/, favicon, etc.)
  if (
    pathname.startsWith('/api/auth') || // Allow next-auth API routes
    pathname.startsWith('/_next') || // Allow static files
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Redirect logic
  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!session && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

// Refined matcher to apply middleware only to app pages
export const config = {
  matcher: ['/', '/login', '/((?!api|_next|favicon.ico).*)'], // Refined routes to avoid API and static paths
};
