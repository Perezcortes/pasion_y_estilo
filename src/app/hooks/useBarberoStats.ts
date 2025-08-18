import { useState, useEffect } from 'react'

interface BarberoStats {
  resumen: {
    citasHoy: {
      total: number
      cambio: number
      cambioTexto: string
    }
    ingresosHoy: {
      total: number
      cambio: number
      cambioTexto: string
    }
    clientesUnicos: {
      total: number
      cambio: number
      cambioTexto: string
    }
  }
  serviciosPopulares: Array<{
    nombre: string
    cantidad: number
    porcentaje: number
    precio_promedio: number
    color: string
  }>
  historialSemanal: Array<{
    fecha: string
    fechaFormateada: string
    citas: number
    ingresos: number
    completadas: number
    pendientes: number
    canceladas: number
  }>
  proximasCitas: Array<{
    id: number
    fecha: string
    hora: string
    servicio: string
    precio: number
    estado: string
    cliente: {
      nombre: string
      telefono: string
      correo?: string
    }
  }>
}

export function useBarberoStats() {
  const [stats, setStats] = useState<BarberoStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/barberos/stats', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setStats(data)
    } catch (err) {
      console.error('Error fetching barbero stats:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setStats(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const refetch = () => {
    fetchStats()
  }

  return {
    stats,
    loading,
    error,
    refetch
  }
}