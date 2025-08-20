import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json({ 
      message: 'Logout exitoso',
      success: true 
    })
    
    // Método 1: Usar delete
    response.cookies.delete({
      name: 'token',
      path: '/',
    })
    
    // Método 2: Establecer cookie vacía con fecha pasada (fallback)
    response.cookies.set('token', '', {
      httpOnly: true,
      path: '/',
      expires: new Date(0), // Fecha en el pasado
      maxAge: 0,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
    
    return response
    
  } catch (error) {
    console.error('Error en logout:', error)
    return NextResponse.json(
      { success: false, error: 'Error en logout' },
      { status: 500 }
    )
  }
}