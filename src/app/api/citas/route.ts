import { NextResponse } from 'next/server'
import { db } from '../../../lib/mysql'
import { getUserFromToken } from '../../../lib/auth'

export async function GET(req: Request) {
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
    let query = ''
    let params: any[] = []

    if (user.rol === 'CLIENTE') {
      query = `
        SELECT c.*, u.nombre as nombre_barbero, b.especialidad as servicio
        FROM citas c
        JOIN barberos b ON c.id_barbero = b.id
        JOIN usuarios u ON b.id_usuario = u.id
        WHERE c.id_cliente = ? AND c.estado != 'CANCELADA'
        ORDER BY c.fecha DESC, c.hora DESC
      `
      params = [user.id]
    } else if (user.rol === 'BARBERO') {
      // Buscar el ID del barbero asociado a este usuario
      const [barbero]: any = await db.query(
        `SELECT id FROM barberos WHERE id_usuario = ?`,
        [user.id]
      )
      
      if (barbero.length === 0) {
        return new NextResponse(JSON.stringify({ error: 'No eres un barbero registrado' }), {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        })
      }

      query = `
        SELECT c.*, u.nombre as nombre_cliente, c.servicio
        FROM citas c
        JOIN usuarios u ON c.id_cliente = u.id
        WHERE c.id_barbero = ? AND c.estado != 'CANCELADA'
        ORDER BY c.fecha DESC, c.hora DESC
      `
      params = [barbero[0].id]
    } else if (user.rol === 'ADMIN') {
      query = `
        SELECT c.*, 
          cliente.nombre as nombre_cliente,
          barbero.nombre as nombre_barbero,
          c.servicio
        FROM citas c
        JOIN usuarios cliente ON c.id_cliente = cliente.id
        JOIN barberos b ON c.id_barbero = b.id
        JOIN usuarios barbero ON b.id_usuario = barbero.id
        ORDER BY c.fecha DESC, c.hora DESC
      `
    }

    const [rows]: any = await db.query(query, params)
    return new NextResponse(JSON.stringify(rows), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    console.error('[ERROR_GET_CITAS]', error)
    return new NextResponse(JSON.stringify({ error: 'Error al obtener citas' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}

export async function POST(req: Request) {
  const user = await getUserFromToken()

  if (!user || user.rol !== 'CLIENTE') {
    return new NextResponse(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }

  try {
    const { id_barbero, fecha, hora, servicio } = await req.json()

    // Validaciones básicas
    if (!id_barbero || !fecha || !hora) {
      return new NextResponse(JSON.stringify({ error: 'Datos incompletos' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    // Validar formato de fecha (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return new NextResponse(JSON.stringify({ error: 'Formato de fecha inválido. Use YYYY-MM-DD' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    // Validar formato de hora (HH:MM)
    if (!/^\d{2}:\d{2}$/.test(hora)) {
      return new NextResponse(JSON.stringify({ error: 'Formato de hora inválido. Use HH:MM' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    // Verificar que el barbero exista y esté activo
    const [barbero]: any = await db.query(
      `SELECT b.id, u.nombre 
       FROM barberos b
       JOIN usuarios u ON b.id_usuario = u.id
       WHERE b.id = ? AND b.estado = 'ACTIVO' AND u.estado = 'ACTIVO'`,
      [id_barbero]
    )

    if (barbero.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Barbero no disponible' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    // Verificar que la fecha no sea en el pasado
    const fechaCita = new Date(`${fecha}T${hora}`)
    if (fechaCita < new Date()) {
      return new NextResponse(JSON.stringify({ error: 'No se pueden agendar citas en el pasado' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    // Verificar disponibilidad (cada hora exacta)
    const horaRedondeada = hora.split(':')[0] + ':00' // Redondear a hora exacta
    
    const [citaExistente]: any = await db.query(
      `SELECT id FROM citas 
       WHERE id_barbero = ? AND fecha = ? AND (
         hora = ? OR 
         hora = ? OR
         hora LIKE '${hora.split(':')[0]}:%'
       )
       AND estado IN ('PENDIENTE', 'CONFIRMADA')`,
      [id_barbero, fecha, hora, horaRedondeada]
    )

    if (citaExistente.length > 0) {
      return new NextResponse(JSON.stringify({ error: 'El barbero ya tiene una cita en ese horario' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    // Generar código de reserva único
    const codigo_reserva = `PE-${Math.floor(1000 + Math.random() * 9000)}`

    // Crear la cita
    const [result]: any = await db.query(
      `INSERT INTO citas 
       (id_cliente, id_barbero, fecha, hora, estado, codigo_reserva, servicio) 
       VALUES (?, ?, ?, ?, 'PENDIENTE', ?, ?)`,
      [user.id, id_barbero, fecha, hora, codigo_reserva, servicio || 'Corte general']
    )

    return new NextResponse(JSON.stringify({
      id: result.insertId,
      message: 'Cita agendada exitosamente',
      codigo_reserva,
      barbero: barbero[0].nombre,
      servicio: servicio || 'Corte general'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })

  } catch (error) {
    console.error('[ERROR_POST_CITAS]', error)
    return new NextResponse(JSON.stringify({ error: 'Error al agendar cita' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}