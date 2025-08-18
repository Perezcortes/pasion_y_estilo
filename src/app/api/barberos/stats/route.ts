import { NextResponse } from 'next/server'
import { db } from '../../../../lib/mysql'
import { getUserFromToken } from '../../../../lib/auth'

export async function GET(req: Request) {
  try {
    const user = await getUserFromToken()

    if (!user || user.rol !== 'BARBERO') {
      return new NextResponse(JSON.stringify({ error: 'No autorizado' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    // Obtener el ID del barbero desde la tabla barberos usando el user.id
    const [barberoInfo]: any = await db.query(`
      SELECT id FROM barberos WHERE id_usuario = ? AND estado = 'ACTIVO'
    `, [user.id])

    if (!barberoInfo || barberoInfo.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Barbero no encontrado' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    const barberoId = barberoInfo[0].id
    const today = new Date().toISOString().split('T')[0]
    const currentMonth = new Date().toISOString().substring(0, 7)
    
    // Obtener fechas para comparaciones
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    const lastMonthStr = lastMonth.toISOString().substring(0, 7)

    // 1. Citas de hoy del barbero
    const [citasHoy]: any = await db.query(`
      SELECT COUNT(*) as total
      FROM citas 
      WHERE id_barbero = ? AND fecha = ? 
      AND estado IN ('PENDIENTE', 'CONFIRMADA', 'COMPLETADA')
    `, [barberoId, today])

    // 2. Citas de ayer para comparación
    const [citasAyer]: any = await db.query(`
      SELECT COUNT(*) as total
      FROM citas 
      WHERE id_barbero = ? AND fecha = ?
      AND estado IN ('PENDIENTE', 'CONFIRMADA', 'COMPLETADA')
    `, [barberoId, yesterdayStr])

    // 3. Ingresos del día de hoy
    const [ingresosHoy]: any = await db.query(`
      SELECT COALESCE(SUM(precio), 0) as total
      FROM citas 
      WHERE id_barbero = ? AND fecha = ? AND estado = 'COMPLETADA'
    `, [barberoId, today])

    // 4. Ingresos de ayer para comparación
    const [ingresosAyer]: any = await db.query(`
      SELECT COALESCE(SUM(precio), 0) as total
      FROM citas 
      WHERE id_barbero = ? AND fecha = ? AND estado = 'COMPLETADA'
    `, [barberoId, yesterdayStr])

    // 5. Total de clientes únicos atendidos
    const [clientesUnicos]: any = await db.query(`
      SELECT COUNT(DISTINCT id_cliente) as total
      FROM citas 
      WHERE id_barbero = ? AND estado = 'COMPLETADA'
    `, [barberoId])

    // 6. Clientes únicos este mes vs mes anterior
    const [clientesEsteMes]: any = await db.query(`
      SELECT COUNT(DISTINCT id_cliente) as total
      FROM citas 
      WHERE id_barbero = ? AND DATE_FORMAT(fecha, '%Y-%m') = ? 
      AND estado = 'COMPLETADA'
    `, [barberoId, currentMonth])

    const [clientesMesAnterior]: any = await db.query(`
      SELECT COUNT(DISTINCT id_cliente) as total
      FROM citas 
      WHERE id_barbero = ? AND DATE_FORMAT(fecha, '%Y-%m') = ? 
      AND estado = 'COMPLETADA'
    `, [barberoId, lastMonthStr])

    // 7. Servicios más solicitados por el barbero
    const [serviciosPopulares]: any = await db.query(`
      SELECT 
        servicio as nombre,
        COUNT(*) as cantidad,
        ROUND((COUNT(*) * 100.0 / (
          SELECT COUNT(*) FROM citas 
          WHERE id_barbero = ? AND estado = 'COMPLETADA'
        )), 2) as porcentaje,
        AVG(precio) as precio_promedio
      FROM citas 
      WHERE id_barbero = ? AND estado = 'COMPLETADA'
        AND servicio IS NOT NULL AND servicio != ''
      GROUP BY servicio
      ORDER BY cantidad DESC
      LIMIT 5
    `, [barberoId, barberoId])

    // 8. Historial de citas de los últimos 7 días
    const [historialSemanal]: any = await db.query(`
      SELECT 
        fecha,
        COUNT(*) as citas,
        COALESCE(SUM(CASE WHEN estado = 'COMPLETADA' THEN precio ELSE 0 END), 0) as ingresos,
        COUNT(CASE WHEN estado = 'COMPLETADA' THEN 1 END) as completadas,
        COUNT(CASE WHEN estado = 'PENDIENTE' THEN 1 END) as pendientes,
        COUNT(CASE WHEN estado = 'CANCELADA' THEN 1 END) as canceladas
      FROM citas 
      WHERE id_barbero = ? 
        AND fecha >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        AND fecha <= CURDATE()
      GROUP BY fecha
      ORDER BY fecha
    `, [barberoId])

    // 9. Próximas citas (hoy y mañana)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]

    const [proximasCitas]: any = await db.query(`
      SELECT 
        c.id,
        c.fecha,
        c.hora,
        c.servicio,
        c.precio,
        c.estado,
        c.telefono_cliente,
        c.correo_cliente,
        u.nombre as cliente_nombre
      FROM citas c
      JOIN usuarios u ON c.id_cliente = u.id
      WHERE c.id_barbero = ? 
        AND c.fecha IN (?, ?)
        AND c.estado IN ('PENDIENTE', 'CONFIRMADA')
      ORDER BY c.fecha, c.hora
      LIMIT 10
    `, [barberoId, today, tomorrowStr])

    // Convertir a números
    const citasHoyTotal = parseInt(citasHoy[0]?.total) || 0
    const citasAyerTotal = parseInt(citasAyer[0]?.total) || 0
    const ingresosHoyTotal = parseFloat(ingresosHoy[0]?.total) || 0
    const ingresosAyerTotal = parseFloat(ingresosAyer[0]?.total) || 0
    const clientesUnicosTotal = parseInt(clientesUnicos[0]?.total) || 0
    const clientesEsteMesTotal = parseInt(clientesEsteMes[0]?.total) || 0
    const clientesMesAnteriorTotal = parseInt(clientesMesAnterior[0]?.total) || 0

    // Calcular cambios
    const cambiosCitas = citasHoyTotal - citasAyerTotal
    const cambiosIngresos = ingresosHoyTotal - ingresosAyerTotal
    const cambiosClientes = clientesEsteMesTotal - clientesMesAnteriorTotal

    // Asignar colores a servicios
    const colores = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
    const serviciosConColores = serviciosPopulares.map((servicio: any, index: number) => ({
      nombre: servicio.nombre || 'Sin nombre',
      cantidad: parseInt(servicio.cantidad) || 0,
      porcentaje: parseFloat(servicio.porcentaje) || 0,
      precio_promedio: parseFloat(servicio.precio_promedio) || 0,
      color: colores[index % colores.length]
    }))

    // Preparar datos del historial semanal
    const historialFormateado = []
    for (let i = 6; i >= 0; i--) {
      const fecha = new Date()
      fecha.setDate(fecha.getDate() - i)
      const fechaStr = fecha.toISOString().split('T')[0]
      
      const dataDelDia = historialSemanal.find((h: any) => h.fecha === fechaStr)
      historialFormateado.push({
        fecha: fechaStr,
        fechaFormateada: fecha.toLocaleDateString('es-ES', { 
          month: 'short', 
          day: 'numeric' 
        }),
        citas: dataDelDia ? parseInt(dataDelDia.citas) : 0,
        ingresos: dataDelDia ? parseFloat(dataDelDia.ingresos) : 0,
        completadas: dataDelDia ? parseInt(dataDelDia.completadas) : 0,
        pendientes: dataDelDia ? parseInt(dataDelDia.pendientes) : 0,
        canceladas: dataDelDia ? parseInt(dataDelDia.canceladas) : 0
      })
    }

    const stats = {
      resumen: {
        citasHoy: {
          total: citasHoyTotal,
          cambio: cambiosCitas,
          cambioTexto: cambiosCitas > 0 ? `+${cambiosCitas}` : cambiosCitas.toString()
        },
        ingresosHoy: {
          total: ingresosHoyTotal,
          cambio: cambiosIngresos,
          cambioTexto: cambiosIngresos > 0 ? `+${cambiosIngresos.toFixed(2)}` : cambiosIngresos.toFixed(2)
        },
        clientesUnicos: {
          total: clientesUnicosTotal,
          cambio: cambiosClientes,
          cambioTexto: cambiosClientes > 0 ? `+${cambiosClientes}` : cambiosClientes.toString()
        }
      },
      serviciosPopulares: serviciosConColores,
      historialSemanal: historialFormateado,
      proximasCitas: proximasCitas.map((cita: any) => ({
        id: cita.id,
        fecha: cita.fecha,
        hora: cita.hora,
        servicio: cita.servicio,
        precio: parseFloat(cita.precio) || 0,
        estado: cita.estado,
        cliente: {
          nombre: cita.cliente_nombre,
          telefono: cita.telefono_cliente,
          correo: cita.correo_cliente
        }
      }))
    }

    return new NextResponse(JSON.stringify(stats), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })

  } catch (error) {
    console.error('[ERROR_GET_BARBERO_STATS]', error)
    return new NextResponse(JSON.stringify({ error: 'Error al obtener estadísticas del barbero' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}