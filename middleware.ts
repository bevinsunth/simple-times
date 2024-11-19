import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getLoggedInUser } from './lib/server/appwrite';

// Add paths that need authentication
const protectedPaths = ['/sheet', '/reports'];

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(prefix =>
    path.startsWith(prefix)
  );

  // Get the token from session/cookie
  const user = await getLoggedInUser();

  console.log('user', user);

  // If the path is protected and there's no token, redirect to login
  if (isProtectedPath && !user) {
    const loginUrl = new URL('/login', request.url);
    // Add the current path as a "from" param to redirect back after login
    loginUrl.searchParams.set('from', path);
    return NextResponse.redirect(loginUrl);
  }

  // If the path is /login and user is already logged in, redirect to home
  if (path === '/login' && user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
