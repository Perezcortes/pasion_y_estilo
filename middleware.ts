import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    // No hay token, redirige a login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const { rol } = decoded

    // Protege todas las rutas bajo /dashboard
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      // Solo ADMIN y BARBERO pueden acceder al dashboard
      if (rol !== 'ADMIN' && rol !== 'BARBERO') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    // Si tienes rutas específicas para admin solamente
    if (request.nextUrl.pathname.startsWith('/admin')) {
      // Solo ADMIN puede acceder a rutas /admin
      if (rol !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    // Si pasa todo, permite continuar
    return NextResponse.next()
  } catch (error) {
    console.error('Error en middleware:', error)
    // Token inválido o error -> redirige login
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'], // Protege dashboard y admin y sus subrutas
}