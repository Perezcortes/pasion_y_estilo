import { NextResponse } from 'next/server'
import { db } from '../../../../lib/mysql'
import { getUserFromToken } from '../../../../lib/auth'
import type { NextRequest } from 'next/server'


interface Context {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, context: Context) {
  const params = await context.params
  const { id } = params

  const data = await request.json()
  const user = await getUserFromToken()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { estado } = data

  if (!estado) {
    return NextResponse.json({ error: 'Estado es requerido' }, { status: 400 })
  }

  try {
    const [result] = await db.query(
      'UPDATE citas SET estado = ? WHERE id = ?',
      [estado, id]
    )

    const affectedRows = (result as { affectedRows?: number }).affectedRows

    if (!affectedRows || affectedRows === 0) {
      return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Estado actualizado correctamente' })
  } catch (error) {
    console.error('[ERROR_UPDATE_CITA]', error)
    return NextResponse.json({ error: 'Error al actualizar el estado' }, { status: 500 })
  }
}

export async function GET(request: NextRequest, context: Context) {
  const params = await context.params
  const { id } = params

  const user = await getUserFromToken()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const [cita] = await db.query('SELECT * FROM citas WHERE id = ?', [id])

    if (!cita || (cita as any[]).length === 0) {
      return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 })
    }

    return NextResponse.json((cita as any[])[0])
  } catch (error) {
    console.error('[ERROR_GET_CITA]', error)
    return NextResponse.json({ error: 'Error al obtener la cita' }, { status: 500 })
  }
}
