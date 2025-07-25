import { NextResponse } from 'next/server'
import { db } from '../../../../lib/mysql'
import { ResultSetHeader } from 'mysql2'

export async function DELETE(request: Request) {
  try {
    // Extraer ID desde la URL
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    if (!id || id === 'undefined') {
      return NextResponse.json(
        { success: false, error: 'ID no proporcionado' },
        { status: 400 }
      )
    }

    const itemId = parseInt(id, 10)
    if (isNaN(itemId)) {
      return NextResponse.json(
        { success: false, error: 'ID inválido' },
        { status: 400 }
      )
    }

    const [existingItem] = await db.query<any[]>(
      'SELECT seccion_id FROM items_seccion WHERE id = ?',
      [itemId]
    )

    if (!existingItem || existingItem.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Item no encontrado' },
        { status: 404 }
      )
    }

    const seccionId = existingItem[0].seccion_id

    const [result] = await db.query<ResultSetHeader>(
      'DELETE FROM items_seccion WHERE id = ?',
      [itemId]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'No se pudo eliminar el item' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, seccion_id: seccionId })

  } catch (error) {
    console.error('Error en DELETE /api/items/[id]:', error)
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    )
  }
}
