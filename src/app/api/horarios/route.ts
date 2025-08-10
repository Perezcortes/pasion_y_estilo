import { NextResponse } from 'next/server'
import { db } from '../../../lib/mysql'
import { getUserFromToken } from '../../../lib/auth'

export async function GET(req: Request) {
  const user = await getUserFromToken()

  if (!user) {
    return new NextResponse(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }

  try {
    const { searchParams } = new URL(req.url)
    const fecha = searchParams.get('fecha')
    const id_barbero = searchParams.get('barbero')

    console.log('Parámetros recibidos:', { fecha, id_barbero })

    if (!fecha || !id_barbero) {
      return new NextResponse(JSON.stringify({ error: 'Faltan parámetros: fecha y barbero son requeridos' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    // Validar formato de fecha
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return new NextResponse(JSON.stringify({ error: 'Formato de fecha inválido. Use YYYY-MM-DD' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    // Convertir id_barbero a número
    const barberoId = Number(id_barbero)
    if (isNaN(barberoId)) {
      return new NextResponse(JSON.stringify({ error: 'ID de barbero inválido' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    // CORRECCIÓN: Obtener día de la semana correctamente sin problemas de zona horaria
    const [year, month, day] = fecha.split('-').map(Number)
    const fechaLocal = new Date(year, month - 1, day)
    const diaSemana = fechaLocal.getDay()
    
    const diasNombre = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    const nombreDia = diasNombre[diaSemana]
    
    console.log('Fecha procesada:', {
      fechaOriginal: fecha,
      fechaLocal: fechaLocal.toDateString(),
      diaSemana,
      nombreDia
    })

    // Verificar que la fecha no sea en el pasado
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    fechaLocal.setHours(0, 0, 0, 0)

    if (fechaLocal < hoy) {
      return new NextResponse(JSON.stringify({
        horarios: [],
        mensaje: 'No puedes seleccionar una fecha pasada',
        esOpcional: false,
        dia: nombreDia
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    // Consultar horarios disponibles para el barbero en ese día (INCLUYE es_opcional)
    const [horarios]: any = await db.query(`
      SELECT 
        hora_inicio, 
        hora_fin,
        es_opcional,
        disponible
      FROM horarios
      WHERE id_barbero = ?
        AND dia_semana = ?
        AND disponible = 1
      ORDER BY hora_inicio
    `, [barberoId, diaSemana])

    console.log('Horarios encontrados en BD:', horarios)

    // Si no hay horarios para cualquier día
    if (horarios.length === 0) {
      return new NextResponse(JSON.stringify({
        horarios: [],
        mensaje: `${nombreDia} no está disponible para este barbero`,
        esOpcional: false,
        dia: nombreDia
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    const horario = horarios[0]
    const esOpcional = horario.es_opcional === 1

    // Obtener citas existentes para esa fecha y barbero (por hora exacta)
    const [citas]: any = await db.query(`
      SELECT TIME_FORMAT(hora, '%H:%i') as hora_formateada
      FROM citas 
      WHERE id_barbero = ? AND fecha = ? 
      AND estado IN ('PENDIENTE', 'CONFIRMADA')
    `, [barberoId, fecha])

    console.log('Citas ocupadas encontradas:', citas)

    const horasOcupadas = citas.map((c: any) => c.hora_formateada)

    // Generar horas disponibles cada 1 hora
    const horasDisponibles: string[] = []
    
    const [startHour] = horario.hora_inicio.split(':').map(Number)
    const [endHour] = horario.hora_fin.split(':').map(Number)

    console.log('Procesando horario:', { startHour, endHour })

    for (let currentHour = startHour; currentHour < endHour; currentHour++) {
      const horaFormateada = `${currentHour.toString().padStart(2, '0')}:00`
      
      // Verificar si la hora no está ocupada
      const horaOcupada = horasOcupadas.includes(horaFormateada)
      
      console.log(`Hora ${horaFormateada}: ${horaOcupada ? 'OCUPADA' : 'DISPONIBLE'}`)
      
      if (!horaOcupada) {
        horasDisponibles.push(horaFormateada)
      }
    }

    console.log('Horas disponibles finales:', horasDisponibles)

    // Preparar mensaje según si es día opcional
    let mensaje = `Horarios disponibles para ${nombreDia}`
    
    if (esOpcional) {
      mensaje = `${nombreDia} - Día opcional. Contacta al barbero para confirmar disponibilidad`
    }

    return new NextResponse(JSON.stringify({
      horarios: horasDisponibles,
      mensaje,
      esOpcional,
      dia: nombreDia,
      citasOcupadas: horasOcupadas
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })

  } catch (error) {
    console.error('[ERROR_GET_HORARIOS]', error)
    return new NextResponse(JSON.stringify({ error: 'Error al obtener horarios' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}