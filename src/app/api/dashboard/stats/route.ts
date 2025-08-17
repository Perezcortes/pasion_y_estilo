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

    const today = new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD
    const currentMonth = new Date().toISOString().substring(0, 7) // Formato YYYY-MM

    // 1. Citas de hoy
    const [citasHoy]: any = await db.query(`
      SELECT COUNT(*) as total
      FROM citas 
      WHERE fecha = ? AND estado IN ('PENDIENTE', 'CONFIRMADA', 'COMPLETADA')
    `, [today])

    // 2. Clientes activos (usuarios con rol CLIENTE y estado ACTIVO)
    const [clientesActivos]: any = await db.query(`
      SELECT COUNT(*) as total
      FROM usuarios 
      WHERE rol = 'CLIENTE' AND estado = 'ACTIVO'
    `)

    // 3. Ingresos TOTALES (todas las citas completadas)
    const [ingresosTotales]: any = await db.query(`
      SELECT COALESCE(SUM(precio), 0) as total
      FROM citas 
      WHERE estado = 'COMPLETADA'
    `)

    // 4. Ingresos de HOY para comparación
    const [ingresosHoy]: any = await db.query(`
      SELECT COALESCE(SUM(precio), 0) as total
      FROM citas 
      WHERE fecha = ? AND estado = 'COMPLETADA'
    `, [today])

    // 5. Servicios disponibles
    const [servicios]: any = await db.query(`
      SELECT COUNT(*) as total
      FROM items_seccion i
      JOIN secciones s ON i.seccion_id = s.id
      WHERE s.tipo = 'servicio'
    `)

    // 6. Comparación con día anterior para calcular cambios
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    const [citasAyer]: any = await db.query(`
      SELECT COUNT(*) as total
      FROM citas 
      WHERE fecha = ? AND estado IN ('PENDIENTE', 'CONFIRMADA', 'COMPLETADA')
    `, [yesterdayStr])

    const [ingresosAyer]: any = await db.query(`
      SELECT COALESCE(SUM(precio), 0) as total
      FROM citas 
      WHERE fecha = ? AND estado = 'COMPLETADA'
    `, [yesterdayStr])

    // 7. Clientes nuevos este mes vs mes anterior
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    const lastMonthStr = lastMonth.toISOString().substring(0, 7)

    const [clientesEsteMes]: any = await db.query(`
      SELECT COUNT(*) as total
      FROM usuarios 
      WHERE rol = 'CLIENTE' AND DATE_FORMAT(creado_en, '%Y-%m') = ?
    `, [currentMonth])

    const [clientesMesAnterior]: any = await db.query(`
      SELECT COUNT(*) as total
      FROM usuarios 
      WHERE rol = 'CLIENTE' AND DATE_FORMAT(creado_en, '%Y-%m') = ?
    `, [lastMonthStr])

    // Convertir valores a números para asegurar que son numéricos
    const citasHoyTotal = parseInt(citasHoy[0].total) || 0
    const citasAyerTotal = parseInt(citasAyer[0].total) || 0
    const clientesActivosTotal = parseInt(clientesActivos[0].total) || 0
    const ingresosTotalesTotal = parseFloat(ingresosTotales[0].total) || 0
    const ingresosHoyTotal = parseFloat(ingresosHoy[0].total) || 0
    const ingresosAyerTotal = parseFloat(ingresosAyer[0].total) || 0
    const serviciosTotal = parseInt(servicios[0].total) || 0
    const clientesEsteMesTotal = parseInt(clientesEsteMes[0].total) || 0
    const clientesMesAnteriorTotal = parseInt(clientesMesAnterior[0].total) || 0

    // Calcular cambios
    const cambiosCitas = citasHoyTotal - citasAyerTotal
    const cambiosIngresos = ingresosHoyTotal - ingresosAyerTotal
    const cambiosClientes = clientesEsteMesTotal - clientesMesAnteriorTotal

    const stats = {
      citasHoy: {
        total: citasHoyTotal,
        cambio: cambiosCitas,
        cambioTexto: cambiosCitas > 0 ? `+${cambiosCitas}` : cambiosCitas.toString()
      },
      clientesActivos: {
        total: clientesActivosTotal,
        cambio: cambiosClientes,
        cambioTexto: cambiosClientes > 0 ? `+${cambiosClientes}` : cambiosClientes.toString()
      },
      // Aquí está el cambio principal: retornamos los ingresos TOTALES
      ingresosTotales: {
        total: ingresosTotalesTotal,
        cambio: cambiosIngresos, // Este es el cambio respecto a ayer
        cambioTexto: cambiosIngresos > 0 ? `+${cambiosIngresos.toFixed(2)}` : `${cambiosIngresos.toFixed(2)}`,
        ingresosHoy: ingresosHoyTotal // Ingresos específicos del día de hoy
      },
      servicios: {
        total: serviciosTotal,
        cambio: 0,
        cambioTexto: ''
      }
    }

    return new NextResponse(JSON.stringify(stats), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })

  } catch (error) {
    console.error('[ERROR_GET_DASHBOARD_STATS]', error)
    return new NextResponse(JSON.stringify({ error: 'Error al obtener estadísticas' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}