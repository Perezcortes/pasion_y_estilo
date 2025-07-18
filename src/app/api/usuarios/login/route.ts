import { db } from '../../../../lib/mysql'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro'

export async function POST(request: Request) {
  try {
    const { correo, password } = await request.json()

    if (!correo || !password) {
      return new Response(JSON.stringify({ success: false, error: 'Faltan datos' }), { status: 400 })
    }

    const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo])
    const usuarios = rows as any[]

    if (usuarios.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'Usuario no encontrado' }), { status: 404 })
    }

    const usuario = usuarios[0]

    const validPassword = await bcrypt.compare(password, usuario.password)

    if (!validPassword) {
      return new Response(JSON.stringify({ success: false, error: 'Contraseña incorrecta' }), { status: 401 })
    }

    // Generar JWT
    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: '4h' }
    )

    return new Response(JSON.stringify({ success: true, token }), { status: 200 })

  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: 'Error del servidor' }), { status: 500 })
  }
}
