import { NextResponse } from 'next/server'
import { db } from '../../../../lib/mysql'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

interface Seccion extends RowDataPacket {
  id: number
  nombre: string
  imagen_url: string
  tipo: string
  tiene_catalogo: boolean
}

interface ItemSeccion extends RowDataPacket {
  id: number
  seccion_id: number
  nombre: string
  descripcion: string
  precio: number | null
  imagen_url: string
  archivo_pdf: string | null
  es_destacado: boolean
}

export async function GET(request: Request) {
  try {
    // Extraer ID de la URL sin usar params
    const url = new URL(request.url)
    const pathSegments = url.pathname.split('/')
    const id = pathSegments[pathSegments.length - 1]

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de sección no proporcionado' },
        { status: 400 }
      )
    }

    const seccionId = Number(id)
    if (isNaN(seccionId)) {
      return NextResponse.json(
        { success: false, error: 'ID de sección no válido' },
        { status: 400 }
      )
    }

    // Consulta a la base de datos
    const [seccion] = await db.query<(Seccion & RowDataPacket)[]>(
      'SELECT * FROM secciones WHERE id = ?',
      [seccionId]
    )

    const [items] = await db.query<(ItemSeccion & RowDataPacket)[]>(
      `SELECT 
        id,
        seccion_id,
        nombre,
        descripcion,
        precio,
        imagen_url,
        archivo_pdf,
        es_destacado
      FROM items_seccion 
      WHERE seccion_id = ?
      ORDER BY nombre`,
      [seccionId]
    )

    if (!seccion?.length) {
      return NextResponse.json(
        { success: false, error: 'Sección no encontrada' },
        { status: 404 }
      )
    }

    // Formatear respuesta
    const response = {
      seccion: {
        id: seccion[0].id,
        nombre: seccion[0].nombre,
        imagen_url: seccion[0].imagen_url,
        tipo: seccion[0].tipo,
        tiene_catalogo: Boolean(seccion[0].tiene_catalogo)
      },
      items: items.map(item => ({
        id: item.id,
        nombre: item.nombre,
        descripcion: item.descripcion,
        precio: item.precio !== null ? Number(item.precio) : null,
        imagen_url: item.imagen_url,
        archivo_pdf: item.archivo_pdf,
        es_destacado: Boolean(item.es_destacado)
      }))
    }

    return NextResponse.json({ success: true, data: response })

  } catch (error) {
    console.error('Error en GET /api/secciones/[id]:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    // Extraer ID de la URL
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de sección no proporcionado' },
        { status: 400 }
      )
    }

    const seccionId = Number(id)
    if (isNaN(seccionId)) {
      return NextResponse.json(
        { success: false, error: 'ID de sección no válido' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { nombre, imagen_url, tipo, tiene_catalogo } = body

    if (!nombre) {
      return NextResponse.json(
        { success: false, error: 'Nombre es requerido' },
        { status: 400 }
      )
    }

    const [result] = await db.query<ResultSetHeader>(
      `UPDATE secciones 
       SET nombre = ?, imagen_url = ?, tipo = ?, tiene_catalogo = ? 
       WHERE id = ?`,
      [nombre, imagen_url, tipo || 'servicio', Boolean(tiene_catalogo), seccionId]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Sección no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error en PUT /api/secciones/[id]:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    // Extraer ID de la URL
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de sección no proporcionado' },
        { status: 400 }
      )
    }

    const seccionId = Number(id)
    if (isNaN(seccionId)) {
      return NextResponse.json(
        { success: false, error: 'ID de sección no válido' },
        { status: 400 }
      )
    }

    // Iniciar transacción
    await db.query('START TRANSACTION')

    try {
      // Eliminar items relacionados
      await db.query<ResultSetHeader>(
        'DELETE FROM items_seccion WHERE seccion_id = ?',
        [seccionId]
      )

      // Eliminar la sección
      const [result] = await db.query<ResultSetHeader>(
        'DELETE FROM secciones WHERE id = ?',
        [seccionId]
      )

      if (result.affectedRows === 0) {
        await db.query('ROLLBACK')
        return NextResponse.json(
          { success: false, error: 'Sección no encontrada' },
          { status: 404 }
        )
      }

      await db.query('COMMIT')
      return NextResponse.json({ success: true })

    } catch (error) {
      await db.query('ROLLBACK')
      throw error
    }

  } catch (error) {
    console.error('Error en DELETE /api/secciones/[id]:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}