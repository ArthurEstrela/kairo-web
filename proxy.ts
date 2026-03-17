import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Redirect /login and /register → /public/login and /public/register
// so users can use the shorter URLs
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/login') {
    return NextResponse.redirect(new URL('/public/login', request.url))
  }
  if (pathname === '/register') {
    return NextResponse.redirect(new URL('/public/register', request.url))
  }
  if (pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/dashboard/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/register', '/dashboard'],
}
