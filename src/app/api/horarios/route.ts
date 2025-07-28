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

    // Obtener día de la semana (0=Domingo, 1=Lunes...)
    const diaSemana = new Date(fecha).getDay()

    // Consultar horarios disponibles para el barbero en ese día
    const [horarios]: any = await db.query(`
      SELECT 
        hora_inicio, 
        hora_fin
      FROM horarios
      WHERE id_barbero = ?
        AND dia_semana = ?
        AND disponible = 1
      ORDER BY hora_inicio
    `, [barberoId, diaSemana])

    // Si es domingo y no hay horario disponible
    if (diaSemana === 0 && horarios.length === 0) {
      return new NextResponse(JSON.stringify({
        horarios: [],
        citasOcupadas: [],
        mensaje: 'La barbería no trabaja regularmente los domingos'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    // Obtener citas existentes para esa fecha y barbero (por hora exacta)
    const [citas]: any = await db.query(`
      SELECT SUBSTRING(hora, 1, 2) as hora 
      FROM citas 
      WHERE id_barbero = ? AND fecha = ? 
      AND estado IN ('PENDIENTE', 'CONFIRMADA')
      GROUP BY SUBSTRING(hora, 1, 2)
    `, [barberoId, fecha])

    // Generar horas disponibles cada 1 hora
    const horasDisponibles: string[] = []
    horarios.forEach((horario: any) => {
      const [startHour] = horario.hora_inicio.split(':').map(Number)
      const [endHour] = horario.hora_fin.split(':').map(Number)

      for (let currentHour = startHour; currentHour < endHour; currentHour++) {
        const horaStr = `${currentHour.toString().padStart(2, '0')}:00`
        
        // Verificar si la hora no está ocupada
        if (!citas.some((c: any) => c.hora === currentHour.toString().padStart(2, '0'))) {
          horasDisponibles.push(horaStr)
        }
      }
    })

    return new NextResponse(JSON.stringify({
      horarios: horasDisponibles,
      dia: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][diaSemana],
      citasOcupadas: citas.map((c: any) => `${c.hora}:00`)
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