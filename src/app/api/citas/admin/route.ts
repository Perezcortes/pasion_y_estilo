import { NextResponse } from 'next/server'
import { db } from '../../../../lib/mysql'
import { getUserFromToken } from '../../../../lib/auth'

// Interfaz para el usuario con todos los campos necesarios
interface UserWithName {
  id: number
  nombre: string
  rol: string
  correo?: string
}

export async function POST(req: Request) {
  // Modificamos esta línea para manejar mejor el token desde el request
  let user: UserWithName | null = null
  
  // Primero intentar con getUserFromToken original
  const originalUser = await getUserFromToken()
  
  if (originalUser) {
    // Si getUserFromToken funciona, necesitamos obtener el nombre desde la BD
    try {
      const [usuarioBD]: any = await db.query(
        `SELECT id, nombre, correo, rol, estado FROM usuarios WHERE id = ? AND estado = 'ACTIVO'`,
        [originalUser.id]
      )
      
      if (usuarioBD.length > 0) {
        user = {
          id: usuarioBD[0].id,
          nombre: usuarioBD[0].nombre,
          rol: usuarioBD[0].rol,
          correo: usuarioBD[0].correo
        }
      }
    } catch (dbError) {
      console.error('Error fetching user from DB:', dbError)
    }
  }
  
  // Si no funciona, intentar obtener desde headers
  if (!user) {
    try {
      const authHeader = req.headers.get('authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        
        // Decodificar el token manualmente y obtener usuario de BD
        const jwt = require('jsonwebtoken')
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
        
        const [usuarioBD]: any = await db.query(
          `SELECT id, nombre, correo, rol, estado FROM usuarios WHERE id = ? AND estado = 'ACTIVO'`,
          [decoded.id]
        )
        
        if (usuarioBD.length > 0) {
          user = {
            id: usuarioBD[0].id,
            nombre: usuarioBD[0].nombre,
            rol: usuarioBD[0].rol,
            correo: usuarioBD[0].correo
          }
        }
      }
    } catch (tokenError) {
      console.error('Error processing token from headers:', tokenError)
    }
  }

  // Solo admin y barbero pueden usar este endpoint
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
    const { 
      nombre_cliente,
      correo_cliente,
      telefono_cliente,
      id_barbero, 
      id_servicio,
      fecha, 
      hora, 
      forma_pago,
      folio_transferencia
    } = await req.json()

    // Validaciones básicas
    if (!nombre_cliente || !correo_cliente || !telefono_cliente || !id_barbero || !id_servicio || !fecha || !hora || !forma_pago) {
      return new NextResponse(JSON.stringify({ error: 'Datos incompletos' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(correo_cliente)) {
      return new NextResponse(JSON.stringify({ error: 'Formato de correo inválido' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    // Validar teléfono (mínimo 10 dígitos)
    if (telefono_cliente.length < 10) {
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

    // Buscar si ya existe un cliente con ese correo, si no, crearlo como cliente temporal
    let clienteId = null
    
    const [clienteExistente]: any = await db.query(
      `SELECT id FROM usuarios WHERE correo = ? AND estado = 'ACTIVO'`,
      [correo_cliente]
    )

    if (clienteExistente.length > 0) {
      // El cliente ya existe
      clienteId = clienteExistente[0].id
      
      // Opcional: Actualizar el nombre si es diferente
      await db.query(
        `UPDATE usuarios SET nombre = ? WHERE id = ?`,
        [nombre_cliente, clienteId]
      )
    } else {
      // Crear un cliente temporal
      // Generar una contraseña temporal que el cliente puede cambiar después
      const tempPassword = `temp_${Date.now()}`
      
      // CORRECCIÓN: Usar los campos correctos según el esquema
      const [nuevoCliente]: any = await db.query(
        `INSERT INTO usuarios (nombre, correo, password, rol, estado, creado_en) 
         VALUES (?, ?, ?, 'CLIENTE', 'ACTIVO', NOW())`,
        [nombre_cliente, correo_cliente, tempPassword]
      )
      
      clienteId = nuevoCliente.insertId
    }

    // Generar código de reserva único
    const codigo_reserva = `PE-${Math.floor(1000 + Math.random() * 9000)}`

    // Crear la cita - el teléfono se guarda en la tabla citas
    const [result]: any = await db.query(
      `INSERT INTO citas 
       (id_cliente, id_barbero, fecha, hora, estado, codigo_reserva, servicio, 
        telefono_cliente, correo_cliente, forma_pago, folio_transferencia, precio) 
       VALUES (?, ?, ?, ?, 'CONFIRMADA', ?, ?, ?, ?, ?, ?, ?)`,
      [
        clienteId, 
        id_barbero, 
        fecha, 
        hora, 
        codigo_reserva, 
        servicio[0].nombre,
        telefono_cliente,
        correo_cliente,
        forma_pago,
        folio_transferencia || null,
        servicio[0].precio
      ]
    )

    // Log de la actividad para auditoría
    console.log(`[ADMIN_BOOKING] ${user.nombre} (${user.rol}) agendó cita para ${nombre_cliente} - Código: ${codigo_reserva}`)

    return new NextResponse(JSON.stringify({
      id: result.insertId,
      message: 'Cita agendada exitosamente por administrador',
      codigo_reserva,
      barbero: barbero[0].nombre,
      servicio: servicio[0].nombre,
      precio: servicio[0].precio,
      cliente: {
        nombre: nombre_cliente,
        correo: correo_cliente,
        telefono: telefono_cliente,
        id: clienteId
      },
      forma_pago,
      folio_transferencia: folio_transferencia || null,
      agendado_por: {
        nombre: user.nombre,
        rol: user.rol
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })

  } catch (error) {
    console.error('[ERROR_POST_ADMIN_CITAS]', error)
    return new NextResponse(JSON.stringify({ error: 'Error al agendar cita' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}