'use client'

import { useState, useEffect } from 'react'

interface DashboardStats {
  citasHoy: {
    total: number
    cambio: number
    cambioTexto: string
  }
  clientesActivos: {
    total: number
    cambio: number
    cambioTexto: string
  }
  ingresosTotales: {
    total: number
    cambio: number
    cambioTexto: string
    ingresosHoy: number
  }
  servicios: {
    total: number
    cambio: number
    cambioTexto: string
  }
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard/stats')
      
      if (!response.ok) {
        throw new Error('Error al obtener estadísticas')
      }
      
      const data = await response.json()
      
      // Validar y sanitizar los datos recibidos basándose en la estructura de la API
      const sanitizedData: DashboardStats = {
        citasHoy: {
          total: Number(data.citasHoy?.total) || 0,
          cambio: Number(data.citasHoy?.cambio) || 0,
          cambioTexto: String(data.citasHoy?.cambioTexto) || ''
        },
        clientesActivos: {
          total: Number(data.clientesActivos?.total) || 0,
          cambio: Number(data.clientesActivos?.cambio) || 0,
          cambioTexto: String(data.clientesActivos?.cambioTexto) || ''
        },
        ingresosTotales: {
          total: Number(data.ingresosTotales?.total) || 0,
          cambio: Number(data.ingresosTotales?.cambio) || 0,
          cambioTexto: String(data.ingresosTotales?.cambioTexto) || '',
          ingresosHoy: Number(data.ingresosTotales?.ingresosHoy) || 0
        },
        servicios: {
          total: Number(data.servicios?.total) || 0,
          cambio: Number(data.servicios?.cambio) || 0,
          cambioTexto: String(data.servicios?.cambioTexto) || ''
        }
      }
      
      setStats(sanitizedData)
      setError(null)
    } catch (err) {
      console.error('Error fetching dashboard stats:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      
      // Establecer valores por defecto en caso de error
      setStats({
        citasHoy: { total: 0, cambio: 0, cambioTexto: '' },
        clientesActivos: { total: 0, cambio: 0, cambioTexto: '' },
        ingresosTotales: { total: 0, cambio: 0, cambioTexto: '', ingresosHoy: 0 },
        servicios: { total: 0, cambio: 0, cambioTexto: '' }
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    
    // Actualizar estadísticas cada 5 minutos
    const interval = setInterval(fetchStats, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  return { 
    stats, 
    loading, 
    error, 
    refetch: fetchStats 
  }
}