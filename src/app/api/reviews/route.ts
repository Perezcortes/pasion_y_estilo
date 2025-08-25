// src/app/api/reviews/route.ts
import { NextResponse } from 'next/server'
import { db } from '../../../lib/mysql'

export async function GET() {
  try {
    const query = `
      SELECT 
        nombre_cliente,
        mensaje,
        calificacion,
        fecha_creacion
      FROM propinas 
      WHERE mensaje IS NOT NULL 
        AND mensaje != '' 
        AND calificacion >= 4
      ORDER BY fecha_creacion DESC 
      LIMIT 6
    `

    const [rows] = await db.execute(query)

    // Formatear las fechas
    const formattedReviews = (rows as any[]).map((review: any) => ({
      ...review,
      fecha_creacion: new Date(review.fecha_creacion).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }))

    return NextResponse.json(formattedReviews)
  } catch (error) {
    console.error('Error al obtener reseñas:', error)
    return NextResponse.json(
      { error: 'Error al obtener las reseñas' },
      { status: 500 }
    )
  }
}