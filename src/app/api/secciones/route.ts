import { NextResponse } from 'next/server'
import { db } from '../../../lib/mysql'
import { RowDataPacket } from 'mysql2'

interface SeccionDB extends RowDataPacket {
  id: number
  nombre: string
  imagen_url: string
  tipo: string
  tiene_catalogo: boolean
  cantidad_items: number
}

export async function GET() {
  try {
    // Usa type assertion con RowDataPacket
    const [results] = await db.query<(SeccionDB & RowDataPacket)[]>(`
      SELECT 
        s.id,
        s.nombre,
        s.imagen_url,
        s.tipo,
        s.tiene_catalogo,
        COUNT(i.id) AS cantidad_items
      FROM secciones s
      LEFT JOIN items_seccion i ON s.id = i.seccion_id
      GROUP BY s.id
      ORDER BY s.nombre
    `)

    // Mapeo seguro de resultados
    const secciones = Array.isArray(results) 
      ? results.map(row => ({
          id: row.id,
          nombre: row.nombre,
          imagen_url: row.imagen_url,
          tipo: row.tipo,
          tiene_catalogo: Boolean(row.tiene_catalogo),
          cantidad_items: Number(row.cantidad_items)
        }))
      : []

    return NextResponse.json({ 
      success: true, 
      data: secciones 
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Error al obtener secciones' 
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { nombre, imagen_url, tipo, tiene_catalogo } = await request.json()
    
    if (!nombre) {
      return NextResponse.json({ 
        success: false, 
        error: 'Nombre es requerido' 
      }, { status: 400 })
    }

    const [result] = await db.query(
      'INSERT INTO secciones (nombre, imagen_url, tipo, tiene_catalogo) VALUES (?, ?, ?, ?)',
      [nombre, imagen_url, tipo || 'servicio', Boolean(tiene_catalogo)]
    )

    return NextResponse.json({ 
      success: true, 
      data: { 
        id: (result as any).insertId, 
        nombre, 
        imagen_url, 
        tipo, 
        tiene_catalogo: Boolean(tiene_catalogo)
      }
    }, { status: 201 })
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ 
        success: false, 
        error: 'Esta sección ya existe' 
      }, { status: 409 })
    }
    return NextResponse.json({ 
      success: false, 
      error: 'Error al crear sección' 
    }, { status: 500 })
  }
}