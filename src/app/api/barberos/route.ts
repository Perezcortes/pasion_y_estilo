import { NextResponse } from 'next/server'
import { db } from '../../../lib/mysql'
import { getUserFromToken } from '../../../lib/auth'

export async function GET(req: Request) {
  try {
    const user = await getUserFromToken()

    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'Inicia sesión' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    // Consulta corregida para obtener barberos activos
    const [barberos]: any = await db.query(`
      SELECT 
        b.id,
        u.nombre,
        b.especialidad,
        b.experiencia
      FROM barberos b
      JOIN usuarios u ON b.id_usuario = u.id
      WHERE b.estado = 'ACTIVO'
      AND u.estado = 'ACTIVO'
      ORDER BY u.nombre ASC
    `)

    return new NextResponse(JSON.stringify(barberos), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })

  } catch (error) {
    console.error('[ERROR_GET_BARBEROS]', error)
    return new NextResponse(JSON.stringify({ error: 'Error al obtener barberos' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}