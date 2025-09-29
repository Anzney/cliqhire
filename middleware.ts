import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/forgot-password']
  const isPublicRoute = publicRoutes.includes(pathname)

  // Since we're using localStorage for tokens (client-side), 
  // we can't access them in middleware. The client-side AuthGuard 
  // will handle authentication checks and redirects.
  
  // For now, allow all routes and let the client-side handle auth
  // This is a simplified approach - in production you might want to
  // implement server-side session validation
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/ (all Next.js internal assets: server, static, image, etc.)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/|favicon.ico|.*\\.).*)',
  ],
}
