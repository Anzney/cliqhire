import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log('🔒 Middleware running for path:', pathname)

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/forgot-password']
  const isPublicRoute = publicRoutes.includes(pathname)

  // Since we're using localStorage for tokens (client-side), 
  // we can't access them in middleware. The client-side AuthGuard 
  // will handle authentication checks and redirects.
  
  // For now, allow all routes and let the client-side handle auth
  // This is a simplified approach - in production you might want to
  // implement server-side session validation
  
  console.log('✅ Allowing access to:', pathname)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}
