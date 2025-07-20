export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const { rol } = decoded

    // Control de acceso a /dashboard
    if (request.nextUrl.pathname === '/dashboard') {
      if (rol === 'CLIENTE') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    // Puedes agregar más rutas protegidas según el rol
    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (rol !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/dashboard', '/admin/:path*'], // Protege rutas adicionales aquí
}
