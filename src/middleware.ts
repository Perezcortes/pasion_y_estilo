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

    // Redirección según rol
    if (request.nextUrl.pathname === '/dashboard') {
      if (rol === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url))
      } else if (rol === 'BARBERO') {
        return NextResponse.redirect(new URL('/barbero', request.url))
      } else if (rol === 'CLIENTE') {
        return NextResponse.redirect(new URL('/cliente', request.url))
      }
    }

    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/dashboard'], // puedes agregar más rutas protegidas aquí
}
