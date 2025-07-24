import { NextResponse } from 'next/server'
import { db } from '../../../lib/mysql'
import { getUserFromToken } from '../../../lib/auth'

export async function GET() {
  const user = await getUserFromToken()

  if (!user || user.rol !== 'CLIENTE') {
    return new NextResponse('No autorizado', { status: 401 })
  }

  try {
    const [rows]: any = await db.query(`
      SELECT u.id AS id, u.nombre
      FROM barberos b
      JOIN usuarios u ON b.id_usuario = u.id
      WHERE b.estado = 'ACTIVO' AND u.estado = 'ACTIVO'
    `)

    return NextResponse.json(rows)
  } catch (error) {
    console.error('[ERROR_GET_BARBEROS]', error)
    return new NextResponse('Error al obtener barberos', { status: 500 })
  }
}