// /src/app/api/usuarios/registro/route.ts
import { db } from '../../../../lib/mysql'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  try {
    const { nombre, correo, password, rol, especialidad, experiencia } = await request.json()

    // Validaciones básicas
    if (!nombre || !correo || !password) {
      return new Response(
        JSON.stringify({ success: false, error: 'Faltan datos obligatorios' }),
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(correo)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Correo inválido' }),
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Insertar en la tabla usuarios
    const [result] = await db.query(
      'INSERT INTO usuarios (nombre, correo, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, hashedPassword, rol || 'CLIENTE']
    )

    const userId = (result as any).insertId

    // Si también es barbero, lo insertamos en la tabla barberos
    if (rol === 'BARBERO') {
      await db.query(
        'INSERT INTO barberos (id_usuario, especialidad, experiencia) VALUES (?, ?, ?)',
        [userId, especialidad || null, experiencia || null]
      )
    }

    return new Response(JSON.stringify({ success: true, id: userId }), {
      status: 201
    })
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return new Response(
        JSON.stringify({ success: false, error: 'Correo ya registrado' }),
        { status: 409 }
      )
    }
    return new Response(
      JSON.stringify({ success: false, error: 'Error del servidor' }),
      { status: 500 }
    )
  }
}
