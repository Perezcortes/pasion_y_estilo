// middleware.ts (en root o src)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Solo proteger rutas que empiezan con /dashboard
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('token')?.value

    if (!token) {
      // No token → redirigir login
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { rol: string }

      if (decoded.rol === 'CLIENTE') {
        // Cliente no puede entrar al dashboard → redirigir home
        return NextResponse.redirect(new URL('/', request.url))
      }

      // Admin y empleado pueden pasar
      return NextResponse.next()

    } catch (e) {
      // Token inválido o expirado
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Para otras rutas no hacer nada
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
