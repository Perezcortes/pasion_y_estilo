import { NextResponse } from 'next/server'
import { db } from '../../../../lib/mysql'
import { getUserFromToken } from '../../../../lib/auth'

export async function GET(req: Request) {
  try {
    const user = await getUserFromToken()

    if (!user || user.rol !== 'ADMIN') {
      return new NextResponse(JSON.stringify({ error: 'No autorizado' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    // Consulta para obtener los servicios más populares basados en las citas completadas
    const [serviciosPopulares]: any = await db.query(`
      SELECT 
        c.servicio as nombre,
        COUNT(*) as cantidad,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM citas WHERE estado = 'COMPLETADA')), 2) as porcentaje,
        AVG(c.precio) as precio_promedio
      FROM citas c 
      WHERE c.estado = 'COMPLETADA'
        AND c.servicio IS NOT NULL 
        AND c.servicio != ''
      GROUP BY c.servicio
      ORDER BY cantidad DESC
      LIMIT 6
    `)

    // Si no hay servicios, devolver datos por defecto
    if (!serviciosPopulares || serviciosPopulares.length === 0) {
      return new NextResponse(JSON.stringify({
        serviciosPopulares: [
          { nombre: 'Sin datos', cantidad: 0, porcentaje: 0, precio_promedio: 0 }
        ],
        totalCitas: 0,
        ingresosTotales: 0
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    // Obtener totales para contexto adicional
    const [totales]: any = await db.query(`
      SELECT 
        COUNT(*) as total_citas,
        COALESCE(SUM(precio), 0) as ingresos_totales
      FROM citas 
      WHERE estado = 'COMPLETADA'
    `)

    // Asignar colores dinámicamente
    const colores = [
      '#ef4444', // rojo
      '#3b82f6', // azul  
      '#10b981', // verde
      '#f59e0b', // amarillo
      '#8b5cf6', // púrpura
      '#f97316'  // naranja
    ]

    const serviciosConColores = serviciosPopulares.map((servicio: any, index: number) => ({
      nombre: servicio.nombre,
      cantidad: parseInt(servicio.cantidad),
      porcentaje: parseFloat(servicio.porcentaje),
      precio_promedio: parseFloat(servicio.precio_promedio || 0),
      color: colores[index % colores.length]
    }))

    const response = {
      serviciosPopulares: serviciosConColores,
      totalCitas: parseInt(totales[0]?.total_citas || 0),
      ingresosTotales: parseFloat(totales[0]?.ingresos_totales || 0)
    }

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })

  } catch (error) {
    console.error('[ERROR_GET_SERVICES_STATS]', error)
    return new NextResponse(JSON.stringify({ error: 'Error al obtener estadísticas de servicios' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}