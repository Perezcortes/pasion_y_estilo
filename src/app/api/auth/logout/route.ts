import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ message: 'Logout exitoso' })
  response.cookies.set('token', '', { path: '/', maxAge: 0 }) // borra cookie
  return response
}
