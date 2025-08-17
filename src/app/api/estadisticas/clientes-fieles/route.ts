// src/app/api/estadisticas/clientes-fieles/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../lib/mysql'
import { getUserFromToken } from '../../../../lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken()
    
    // Verificar que sea admin
    if (!user || user.rol !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const periodo = searchParams.get('periodo') || 'mes' // mes, 3meses, 6meses, año
    const minCitas = parseInt(searchParams.get('minCitas') || '3')

    // Calcular fecha límite según el período
    let fechaLimite = ''
    switch (periodo) {
      case 'mes':
        fechaLimite = 'DATE_SUB(NOW(), INTERVAL 1 MONTH)'
        break
      case '3meses':
        fechaLimite = 'DATE_SUB(NOW(), INTERVAL 3 MONTH)'
        break
      case '6meses':
        fechaLimite = 'DATE_SUB(NOW(), INTERVAL 6 MONTH)'
        break
      case 'año':
        fechaLimite = 'DATE_SUB(NOW(), INTERVAL 1 YEAR)'
        break
      default:
        fechaLimite = 'DATE_SUB(NOW(), INTERVAL 1 MONTH)'
    }

    // Query principal para obtener estadísticas de clientes
    const query = `
      SELECT 
        u.id,
        u.nombre,
        u.correo,
        u.creado_en,
        
        -- Citas totales (históricamente)
        COUNT(c.id) as total_citas,
        
        -- Citas en el período seleccionado
        SUM(CASE WHEN c.fecha >= ${fechaLimite} THEN 1 ELSE 0 END) as citas_periodo,
        
        -- Citas por estado
        SUM(CASE WHEN c.estado = 'COMPLETADA' THEN 1 ELSE 0 END) as citas_completadas,
        SUM(CASE WHEN c.estado = 'CANCELADA' THEN 1 ELSE 0 END) as citas_canceladas,
        SUM(CASE WHEN c.estado = 'NO_ASISTIO' THEN 1 ELSE 0 END) as citas_no_asistio,
        
        -- Última cita
        MAX(c.fecha) as ultima_cita,
        
        -- Primera cita (cliente desde)
        MIN(c.fecha) as primera_cita,
        
        -- Citas en el último mes
        SUM(CASE WHEN c.fecha >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN 1 ELSE 0 END) as citas_ultimo_mes,
        
        -- Citas en los últimos 3 meses
        SUM(CASE WHEN c.fecha >= DATE_SUB(NOW(), INTERVAL 3 MONTH) THEN 1 ELSE 0 END) as citas_3_meses,
        
        -- Citas en los últimos 6 meses
        SUM(CASE WHEN c.fecha >= DATE_SUB(NOW(), INTERVAL 6 MONTH) THEN 1 ELSE 0 END) as citas_6_meses,
        
        -- Citas en el último año
        SUM(CASE WHEN c.fecha >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN 1 ELSE 0 END) as citas_1_año,
        
        -- Calcular días desde la última cita
        DATEDIFF(NOW(), MAX(c.fecha)) as dias_desde_ultima_cita,
        
        -- Frecuencia promedio (días entre citas)
        CASE 
          WHEN COUNT(c.id) > 1 THEN 
            DATEDIFF(MAX(c.fecha), MIN(c.fecha)) / (COUNT(c.id) - 1)
          ELSE NULL 
        END as frecuencia_promedio_dias
        
      FROM usuarios u
      LEFT JOIN citas c ON u.id = c.id_cliente
      WHERE u.rol = 'CLIENTE' AND u.estado = 'ACTIVO'
      GROUP BY u.id, u.nombre, u.correo, u.creado_en
      HAVING COUNT(c.id) >= ?
      ORDER BY citas_periodo DESC, total_citas DESC
    `

    const [clientes] = await db.query(query, [minCitas])

    // Agregar clasificaciones y recomendaciones
    const clientesConAnalisis = (clientes as any[]).map(cliente => {
      let clasificacion = 'Regular'
      let nivelFidelidad = 1
      let recomendaciones = []

      // Clasificar por nivel de fidelidad
      if (cliente.total_citas >= 20) {
        clasificacion = 'VIP'
        nivelFidelidad = 5
      } else if (cliente.total_citas >= 15) {
        clasificacion = 'Premium'
        nivelFidelidad = 4
      } else if (cliente.total_citas >= 10) {
        clasificacion = 'Frecuente'
        nivelFidelidad = 3
      } else if (cliente.total_citas >= 5) {
        clasificacion = 'Fiel'
        nivelFidelidad = 2
      }

      // Generar recomendaciones basadas en patrones
      if (cliente.citas_ultimo_mes >= 4) {
        recomendaciones.push('🏆 Cliente muy activo este mes - Candidato a descuento especial')
      }
      
      if (cliente.citas_3_meses >= 8) {
        recomendaciones.push('⭐ Cliente super fiel - Considerár programa VIP')
      }
      
      if (cliente.dias_desde_ultima_cita > 60 && cliente.total_citas >= 5) {
        recomendaciones.push('🎯 Cliente fiel ausente - Oferta de reactivación')
      }
      
      if (cliente.frecuencia_promedio_dias && cliente.frecuencia_promedio_dias <= 21) {
        recomendaciones.push('💎 Cliente de alta frecuencia - Regalo de fidelidad')
      }
      
      if (cliente.citas_completadas > 0 && cliente.citas_canceladas === 0 && cliente.citas_no_asistio === 0) {
        recomendaciones.push('✅ Cliente 100% confiable - Descuento por puntualidad')
      }

      return {
        ...cliente,
        clasificacion,
        nivelFidelidad,
        recomendaciones,
        // Calcular porcentaje de asistencia
        porcentajeAsistencia: cliente.total_citas > 0 
          ? Math.round((cliente.citas_completadas / cliente.total_citas) * 100)
          : 0
      }
    })

    // Estadísticas generales
    const estadisticasGenerales = {
      totalClientes: clientesConAnalisis.length,
      clientesVIP: clientesConAnalisis.filter(c => c.clasificacion === 'VIP').length,
      clientesPremium: clientesConAnalisis.filter(c => c.clasificacion === 'Premium').length,
      clientesFrecuentes: clientesConAnalisis.filter(c => c.clasificacion === 'Frecuente').length,
      clientesFieles: clientesConAnalisis.filter(c => c.clasificacion === 'Fiel').length,
      promedioCtasCliente: clientesConAnalisis.length > 0 
        ? Math.round(clientesConAnalisis.reduce((sum, c) => sum + c.total_citas, 0) / clientesConAnalisis.length)
        : 0
    }

    return NextResponse.json({
      success: true,
      clientes: clientesConAnalisis,
      estadisticas: estadisticasGenerales,
      filtros: {
        periodo,
        minCitas
      }
    })

  } catch (error) {
    console.error('Error al obtener estadísticas de clientes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}