// /api/citas/[id]/route.ts
import { NextResponse } from 'next/server'
import { db } from '../../../../lib/mysql'
import { getUserFromToken } from '../../../../lib/auth'
import type { NextRequest } from 'next/server'

interface Context {
  params: { id: string }
}

export async function GET(request: NextRequest, context: Context) {
  const { id } = context.params
  const user = await getUserFromToken()

  if (!user) {
    return new NextResponse(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }

  try {
    const [cita]: any = await db.query('SELECT * FROM citas WHERE id = ?', [id])

    if (!cita || cita.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Cita no encontrada' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    return new NextResponse(JSON.stringify(cita[0]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    console.error('[ERROR_GET_CITA]', error)
    return new NextResponse(JSON.stringify({ error: 'Error al obtener la cita' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}

export async function PUT(request: NextRequest, context: Context) {
  const { id } = context.params
  const user = await getUserFromToken()

  if (!user || !['ADMIN', 'BARBERO'].includes(user.rol)) {
    return new NextResponse(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }

  try {
    const { estado } = await request.json()
    const citaId = parseInt(id)

    if (!citaId || isNaN(citaId)) {
      return new NextResponse(JSON.stringify({ error: 'ID de cita inválido' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    // Validar estado
    const estadosValidos = ['PENDIENTE', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA', 'NO_ASISTIO']
    if (!estadosValidos.includes(estado)) {
      return new NextResponse(JSON.stringify({ error: 'Estado inválido' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    // Verificar que la cita existe
    const [cita]: any = await db.query(
      `SELECT c.*, b.id_usuario as barbero_usuario_id 
       FROM citas c 
       JOIN barberos b ON c.id_barbero = b.id 
       WHERE c.id = ?`,
      [citaId]
    )

    if (cita.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Cita no encontrada' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    // Si es barbero, verificar que sea su cita
    if (user.rol === 'BARBERO' && cita[0].barbero_usuario_id !== user.id) {
      return new NextResponse(JSON.stringify({ error: 'No puedes modificar citas de otros barberos' }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    // Actualizar estado
    await db.query(
      `UPDATE citas SET estado = ?, actualizado_en = NOW() WHERE id = ?`,
      [estado, citaId]
    )

    return new NextResponse(JSON.stringify({
      success: true,
      message: 'Estado actualizado correctamente',
      id: citaId,
      nuevo_estado: estado
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })

  } catch (error) {
    console.error('[ERROR_PUT_CITA]', error)
    return new NextResponse(JSON.stringify({ error: 'Error al actualizar la cita' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  const { id } = context.params
  const user = await getUserFromToken()

  if (!user) {
    return new NextResponse(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }

  try {
    const citaId = parseInt(id)

    if (!citaId || isNaN(citaId)) {
      return new NextResponse(JSON.stringify({ error: 'ID de cita inválido' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    // Verificar que la cita existe y pertenece al usuario (si es cliente)
    let query = `SELECT c.*, b.id_usuario as barbero_usuario_id 
                 FROM citas c 
                 JOIN barberos b ON c.id_barbero = b.id 
                 WHERE c.id = ?`
    let queryParams: any[] = [citaId]

    if (user.rol === 'CLIENTE') {
      query += ` AND c.id_cliente = ?`
      queryParams.push(user.id)
    } else if (user.rol === 'BARBERO') {
      // Los barberos solo pueden cancelar sus propias citas
      query += ` AND b.id_usuario = ?`
      queryParams.push(user.id)
    }
    // Los ADMIN pueden cancelar cualquier cita

    const [cita]: any = await db.query(query, queryParams)

    if (cita.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Cita no encontrada o no autorizado' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    // Marcar como cancelada en lugar de eliminar
    await db.query(
      `UPDATE citas SET estado = 'CANCELADA', actualizado_en = NOW() WHERE id = ?`,
      [citaId]
    )

    return new NextResponse(JSON.stringify({
      success: true,
      message: 'Cita cancelada correctamente',
      id: citaId
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })

  } catch (error) {
    console.error('[ERROR_DELETE_CITA]', error)
    return new NextResponse(JSON.stringify({ error: 'Error al cancelar la cita' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}