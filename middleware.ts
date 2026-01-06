import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require authentication
const PROTECTED_PATHS = ['/dashboard', '/learn', '/practice', '/profile'];

// Paths for authentication that shouldn't be accessed when logged in
const AUTH_PATHS = ['/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/reset-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get auth data from cookies/localStorage equivalent
  const authData = request.cookies.get('learnsmartAuth')?.value;
  const isAuthenticated = !!authData;
  
  // Check if user is trying to access protected routes without auth
  const isProtectedPath = PROTECTED_PATHS.some(path => pathname.startsWith(path));
  const isAuthPath = AUTH_PATHS.some(path => pathname.startsWith(path));
  
  if (isProtectedPath && !isAuthenticated) {
    // Redirect to login if trying to access protected route without auth
    const loginUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  if (isAuthPath && isAuthenticated) {
    // Redirect to dashboard if trying to access auth pages while logged in
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }
  
  // Allow the request to continue for stream-select and other paths
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|images|fonts|styles).*)',
  ],
};