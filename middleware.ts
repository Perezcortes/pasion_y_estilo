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
      // Clientes no pueden acceder a dashboard
      if (rol === 'CLIENTE') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    // Protege todas las rutas bajo /admin
    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (rol !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    // Si pasa todo, permite continuar
    return NextResponse.next()
  } catch (error) {
    // Token inválido o error -> redirige login
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'], // Protege dashboard y admin y sus subrutas
}

