import { NextResponse } from 'next/server'
import { db } from '../../../lib/mysql'
import { RowDataPacket } from 'mysql2'

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

export async function GET() {
  try {
    const [results] = await db.query<(ItemSeccion & RowDataPacket)[]>(`
      SELECT * FROM items_seccion
      ORDER BY nombre
    `)

    const items = Array.isArray(results) 
      ? results.map(row => ({
          id: row.id,
          seccion_id: row.seccion_id,
          nombre: row.nombre,
          descripcion: row.descripcion,
          precio: row.precio !== null ? Number(row.precio) : null,
          imagen_url: row.imagen_url,
          archivo_pdf: row.archivo_pdf,
          es_destacado: Boolean(row.es_destacado)
        }))
      : []

    return NextResponse.json({ 
      success: true, 
      data: items 
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Error al obtener items' 
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { seccion_id, nombre, descripcion, precio, imagen_url, archivo_pdf, es_destacado } = await request.json()
    
    if (!seccion_id || !nombre) {
      return NextResponse.json({ success: false, error: 'Sección y nombre son requeridos' }, { status: 400 })
    }

    const [result] = await db.query(
      `INSERT INTO items_seccion 
      (seccion_id, nombre, descripcion, precio, imagen_url, archivo_pdf, es_destacado) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [seccion_id, nombre, descripcion, precio, imagen_url, archivo_pdf, es_destacado || false]
    )

    return NextResponse.json({ 
      success: true, 
      data: { id: (result as any).insertId, nombre, descripcion, precio }
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al crear item' }, { status: 500 })
  }
}