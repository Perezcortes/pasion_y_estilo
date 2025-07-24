import { db } from '../../../lib/mysql'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rol = searchParams.get('rol') // filtro por rol: ADMIN, CLIENTE, BARBERO
    const estado = searchParams.get('estado') // ACTIVO, INACTIVO
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Query con LEFT JOIN para incluir info barbero si existe
    let baseQuery = `
      SELECT u.id, u.nombre, u.correo, u.rol, u.estado, u.creado_en,
             b.especialidad, b.experiencia
      FROM usuarios u
      LEFT JOIN barberos b ON u.id = b.id_usuario
      WHERE 1=1
    `
    const params: (string | number)[] = []

    if (rol) {
      baseQuery += ` AND u.rol = ?`
      params.push(rol)
    }
    if (estado) {
      baseQuery += ` AND u.estado = ?`
      params.push(estado)
    }

    baseQuery += ` ORDER BY u.creado_en DESC LIMIT ? OFFSET ?`
    params.push(limit, offset)

    const [rows] = await db.query(baseQuery, params)

    return new Response(JSON.stringify({ success: true, users: rows }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'Error al obtener usuarios' }),
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, nombre, correo, rol, estado, especialidad, experiencia } =
      await request.json()

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Falta id de usuario' }),
        { status: 400 }
      )
    }

    // Actualizar datos básicos de usuario
    const updateUserQuery = `
      UPDATE usuarios SET nombre = ?, correo = ?, rol = ?, estado = ?
      WHERE id = ?
    `
    await db.query(updateUserQuery, [nombre, correo, rol, estado, id])

    // Verificar si es barbero para actualizar o insertar
    if (rol === 'BARBERO') {
      // Revisar si ya tiene registro en barberos
      const [rows] = await db.query('SELECT id_usuario FROM barberos WHERE id_usuario = ?', [id])
      if ((rows as any).length > 0) {
        // Actualizar barbero
        await db.query(
          'UPDATE barberos SET especialidad = ?, experiencia = ? WHERE id_usuario = ?',
          [especialidad, experiencia, id]
        )
      } else {
        // Insertar barbero
        await db.query(
          'INSERT INTO barberos (id_usuario, especialidad, experiencia) VALUES (?, ?, ?)',
          [id, especialidad, experiencia]
        )
      }
    } else {
      // Si cambió de rol y ya no es barbero, eliminar registro en barberos si existe
      await db.query('DELETE FROM barberos WHERE id_usuario = ?', [id])
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'Error al actualizar usuario' }),
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Falta id de usuario' }),
        { status: 400 }
      )
    }

    // Primero eliminar de barberos si existe
    await db.query('DELETE FROM barberos WHERE id_usuario = ?', [id])
    
    // Luego eliminar de usuarios
    await db.query('DELETE FROM usuarios WHERE id = ?', [id])

    return new Response(JSON.stringify({ success: true }), {
      status: 200
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'Error al eliminar usuario' }),
      { status: 500 }
    )
  }
}