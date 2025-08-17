'use client'

import { useState, useEffect } from 'react'

interface ServicioPopular {
  nombre: string
  cantidad: number
  porcentaje: number
  precio_promedio: number
  color: string
}

interface ServicesStats {
  serviciosPopulares: ServicioPopular[]
  totalCitas: number
  ingresosTotales: number
}

export function useServicesStats() {
  const [servicesStats, setServicesStats] = useState<ServicesStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServicesStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard/services-stats')
      
      if (!response.ok) {
        throw new Error('Error al obtener estadísticas de servicios')
      }
      
      const data = await response.json()
      
      // Validar y sanitizar los datos recibidos
      const sanitizedData: ServicesStats = {
        serviciosPopulares: Array.isArray(data.serviciosPopulares) 
          ? data.serviciosPopulares.map((servicio: any) => ({
              nombre: String(servicio.nombre || 'Sin nombre'),
              cantidad: Number(servicio.cantidad) || 0,
              porcentaje: Number(servicio.porcentaje) || 0,
              precio_promedio: Number(servicio.precio_promedio) || 0,
              color: String(servicio.color || '#6b7280')
            }))
          : [],
        totalCitas: Number(data.totalCitas) || 0,
        ingresosTotales: Number(data.ingresosTotales) || 0
      }
      
      setServicesStats(sanitizedData)
      setError(null)
    } catch (err) {
      console.error('Error fetching services stats:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      
      // Establecer valores por defecto en caso de error
      setServicesStats({
        serviciosPopulares: [
          { nombre: 'Sin datos', cantidad: 0, porcentaje: 0, precio_promedio: 0, color: '#6b7280' }
        ],
        totalCitas: 0,
        ingresosTotales: 0
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServicesStats()
    
    // Actualizar estadísticas cada 10 minutos
    const interval = setInterval(fetchServicesStats, 10 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  return { 
    servicesStats, 
    loading, 
    error, 
    refetch: fetchServicesStats 
  }
}