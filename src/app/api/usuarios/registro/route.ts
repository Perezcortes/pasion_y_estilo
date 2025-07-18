// /src/app/api/usuarios/registro/route.ts
import { db } from '../../../../lib/mysql'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  try {
    const { nombre, correo, password, rol } = await request.json()

    // Validaciones básicas
    if (!nombre || !correo || !password) {
      return new Response(
        JSON.stringify({ success: false, error: 'Faltan datos obligatorios' }),
        { status: 400 }
      )
    }

    // Validar formato de correo simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(correo)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Correo inválido' }),
        { status: 400 }
      )
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insertar en la base de datos
    const [result] = await db.query(
      'INSERT INTO usuarios (nombre, correo, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, hashedPassword, rol || 'CLIENTE']
    )

    return new Response(
      JSON.stringify({ success: true, id: (result as any).insertId }),
      { status: 201 }
    )
  } catch (error: any) {
    // Detectar si correo ya existe (error de clave única)
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
