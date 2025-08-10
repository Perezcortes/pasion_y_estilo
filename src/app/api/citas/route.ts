import { NextResponse, NextRequest } from 'next/server'
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
    // Verificar si hay parámetro clienteId para filtrar (usado por los modales)
    const url = new URL(req.url)
    const clienteId = url.searchParams.get('clienteId')

    let query = ''
    let params: any[] = []

    if (clienteId) {
      // Filtro específico por cliente (usado por el modal de historial)
      query = `
        SELECT c.*, 
          u.nombre as nombre_cliente,
          u.correo as correo_cliente,
          barbero.nombre as nombre_barbero,
          c.servicio,
          c.telefono_cliente,
          c.forma_pago,
          c.folio_transferencia,
          c.precio
        FROM citas c
        JOIN usuarios u ON c.id_cliente = u.id
        JOIN barberos b ON c.id_barbero = b.id
        JOIN usuarios barbero ON b.id_usuario = barbero.id
        WHERE c.id_cliente = ?
        ORDER BY c.fecha DESC, c.hora DESC
      `
      params = [parseInt(clienteId)]
    } else if (user.rol === 'CLIENTE') {
      query = `
        SELECT c.*, 
          u.nombre as nombre_barbero, 
          b.especialidad as servicio,
          c.telefono_cliente,
          c.forma_pago,
          c.folio_transferencia,
          c.precio
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
        SELECT c.*, 
          u.nombre as nombre_cliente,
          u.correo as correo_cliente,
          c.servicio,
          c.telefono_cliente,
          c.forma_pago,
          c.folio_transferencia,
          c.precio
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
          cliente.correo as correo_cliente,
          barbero.nombre as nombre_barbero,
          c.servicio,
          c.telefono_cliente,
          c.forma_pago,
          c.folio_transferencia,
          c.precio
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
    const { 
      id_barbero, 
      id_servicio,
      fecha, 
      hora, 
      telefono,
      forma_pago,
      folio_transferencia
    } = await req.json()

    // Validaciones básicas
    if (!id_barbero || !id_servicio || !fecha || !hora || !telefono || !forma_pago) {
      return new NextResponse(JSON.stringify({ error: 'Datos incompletos' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    // Validar teléfono (mínimo 10 dígitos)
    if (telefono.length < 10) {
      return new NextResponse(JSON.stringify({ error: 'El teléfono debe tener al menos 10 dígitos' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    // Validar forma de pago
    if (!['establecimiento', 'transferencia'].includes(forma_pago)) {
      return new NextResponse(JSON.stringify({ error: 'Forma de pago inválida' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    // Si es transferencia, validar folio
    if (forma_pago === 'transferencia' && !folio_transferencia) {
      return new NextResponse(JSON.stringify({ error: 'Folio de transferencia requerido' }), {
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

    // Verificar que el servicio exista
    const [servicio]: any = await db.query(
      `SELECT nombre, precio FROM items_seccion WHERE id = ?`,
      [id_servicio]
    )

    if (servicio.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Servicio no encontrado' }), {
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

    // Verificar disponibilidad
    const [citaExistente]: any = await db.query(
      `SELECT id FROM citas 
       WHERE id_barbero = ? AND fecha = ? AND hora = ?
       AND estado IN ('PENDIENTE', 'CONFIRMADA')`,
      [id_barbero, fecha, hora]
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

    // Crear la cita con todos los datos nuevos
    const [result]: any = await db.query(
      `INSERT INTO citas 
       (id_cliente, id_barbero, fecha, hora, estado, codigo_reserva, servicio, 
        telefono_cliente, correo_cliente, forma_pago, folio_transferencia, precio) 
       VALUES (?, ?, ?, ?, 'PENDIENTE', ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id, 
        id_barbero, 
        fecha, 
        hora, 
        codigo_reserva, 
        servicio[0].nombre,
        telefono,
        user.correo,
        forma_pago,
        folio_transferencia || null,
        servicio[0].precio
      ]
    )

    return new NextResponse(JSON.stringify({
      id: result.insertId,
      message: 'Cita agendada exitosamente',
      codigo_reserva,
      barbero: barbero[0].nombre,
      servicio: servicio[0].nombre,
      precio: servicio[0].precio,
      forma_pago,
      folio_transferencia: folio_transferencia || null
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