import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { db } from '../../../../lib/mysql'
import { getUserFromToken } from '../../../../lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromToken()
    const userId = parseInt(params.id)

    // Verificar autenticación y autorización
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Solo permitir que el usuario edite su propio perfil (excepto admin)
    if (user.rol !== 'ADMIN' && user.id !== userId) {
      return NextResponse.json(
        { error: 'No tienes permisos para editar este perfil' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { nombre, correo, currentPassword, newPassword } = body

    // Validaciones básicas
    if (!nombre || !correo) {
      return NextResponse.json(
        { error: 'Nombre y correo son requeridos' },
        { status: 400 }
      )
    }

    // Verificar si el usuario existe
    const [userExists]: any = await db.query(
      'SELECT * FROM usuarios WHERE id = ? AND estado = "ACTIVO"',
      [userId]
    )

    if (!userExists || userExists.length === 0) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const existingUser = userExists[0]

    // Verificar si el correo ya existe en otro usuario
    const [emailExists]: any = await db.query(
      'SELECT id FROM usuarios WHERE correo = ? AND id != ? AND estado = "ACTIVO"',
      [correo, userId]
    )

    if (emailExists && emailExists.length > 0) {
      return NextResponse.json(
        { error: 'El correo ya está registrado por otro usuario' },
        { status: 400 }
      )
    }

    let updateQuery = 'UPDATE usuarios SET nombre = ?, correo = ?'
    let updateParams: any[] = [nombre, correo]

    // Si se proporciona nueva contraseña, verificar la actual y actualizar
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Debes proporcionar tu contraseña actual' },
          { status: 400 }
        )
      }

      // Verificar contraseña actual
      const isValidPassword = await bcrypt.compare(currentPassword, existingUser.password)
      
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'La contraseña actual es incorrecta' },
          { status: 400 }
        )
      }

      // Hashear nueva contraseña
      const hashedNewPassword = await bcrypt.hash(newPassword, 10)
      updateQuery += ', password = ?'
      updateParams.push(hashedNewPassword)
    }

    updateQuery += ' WHERE id = ?'
    updateParams.push(userId)

    // Ejecutar la actualización
    await db.query(updateQuery, updateParams)

    return NextResponse.json({
      message: 'Usuario actualizado correctamente',
      user: {
        id: userId,
        nombre,
        correo,
        rol: existingUser.rol
      }
    })

  } catch (error) {
    console.error('Error al actualizar usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id)
    
    const [user]: any = await db.query(
      `SELECT u.id, u.nombre, u.correo, u.rol, u.estado, u.creado_en,
              b.especialidad, b.experiencia
       FROM usuarios u
       LEFT JOIN barberos b ON u.id = b.id_usuario
       WHERE u.id = ? AND u.estado = "ACTIVO"`,
      [userId]
    )

    if (!user || user.length === 0) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(user[0])
  } catch (error) {
    console.error('Error al obtener usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}