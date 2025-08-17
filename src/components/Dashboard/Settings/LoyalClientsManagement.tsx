'use client'

import { useState, useEffect } from 'react'

interface Cliente {
  id: number
  nombre: string
  correo: string
  total_citas: number
  citas_periodo: number
  citas_completadas: number
  citas_canceladas: number
  citas_no_asistio: number
  ultima_cita: string
  primera_cita: string
  citas_ultimo_mes: number
  citas_3_meses: number
  citas_6_meses: number
  citas_1_año: number
  dias_desde_ultima_cita: number
  frecuencia_promedio_dias: number
  clasificacion: string
  nivelFidelidad: number
  recomendaciones: string[]
  porcentajeAsistencia: number
}

interface Estadisticas {
  totalClientes: number
  clientesVIP: number
  clientesPremium: number
  clientesFrecuentes: number
  clientesFieles: number
  promedioCtasCliente: number
}

export default function LoyalClientsManagement() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null)
  const [loading, setLoading] = useState(true)
  const [periodo, setPeriodo] = useState('mes')
  const [minCitas, setMinCitas] = useState(3)
  const [filtroClasificacion, setFiltroClasificacion] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/estadisticas/clientes-fieles?periodo=${periodo}&minCitas=${minCitas}`
      )
      const data = await response.json()
      
      if (data.success) {
        setClientes(data.clientes)
        setEstadisticas(data.estadisticas)
      }
    } catch (error) {
      console.error('Error al cargar datos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [periodo, minCitas])

  const clientesFiltrados = clientes.filter(cliente => 
    filtroClasificacion === '' || cliente.clasificacion === filtroClasificacion
  )

  const formatearFecha = (fecha: string) => {
    return fecha ? new Date(fecha).toLocaleDateString('es-MX') : 'N/A'
  }

  const getNivelColor = (nivel: number) => {
    switch (nivel) {
      case 5: return 'bg-purple-500'
      case 4: return 'bg-gold bg-yellow-500'
      case 3: return 'bg-blue-500'
      case 2: return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-800/70 rounded-xl p-6 border border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-600 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-600 rounded w-5/6"></div>
            <div className="h-4 bg-gray-600 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas generales */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-gray-800/70 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-white">{estadisticas.totalClientes}</div>
            <div className="text-sm text-gray-400">Total Clientes</div>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-500/50">
            <div className="text-2xl font-bold text-purple-200">{estadisticas.clientesVIP}</div>
            <div className="text-sm text-purple-300">VIP (20+ citas)</div>
          </div>
          <div className="bg-yellow-900/50 rounded-lg p-4 border border-yellow-500/50">
            <div className="text-2xl font-bold text-yellow-200">{estadisticas.clientesPremium}</div>
            <div className="text-sm text-yellow-300">Premium (15+ citas)</div>
          </div>
          <div className="bg-blue-900/50 rounded-lg p-4 border border-blue-500/50">
            <div className="text-2xl font-bold text-blue-200">{estadisticas.clientesFrecuentes}</div>
            <div className="text-sm text-blue-300">Frecuentes (10+ citas)</div>
          </div>
          <div className="bg-green-900/50 rounded-lg p-4 border border-green-500/50">
            <div className="text-2xl font-bold text-green-200">{estadisticas.clientesFieles}</div>
            <div className="text-sm text-green-300">Fieles (5+ citas)</div>
          </div>
          <div className="bg-gray-800/70 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-white">{estadisticas.promedioCtasCliente}</div>
            <div className="text-sm text-gray-400">Promedio citas</div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-gray-800/70 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Filtros de Análisis</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Período de análisis
            </label>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="mes">Último mes</option>
              <option value="3meses">Últimos 3 meses</option>
              <option value="6meses">Últimos 6 meses</option>
              <option value="año">Último año</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mínimo de citas
            </label>
            <input
              type="number"
              value={minCitas}
              onChange={(e) => setMinCitas(parseInt(e.target.value) || 1)}
              min="1"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filtrar por clasificación
            </label>
            <select
              value={filtroClasificacion}
              onChange={(e) => setFiltroClasificacion(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="VIP">VIP</option>
              <option value="Premium">Premium</option>
              <option value="Frecuente">Frecuente</option>
              <option value="Fiel">Fiel</option>
              <option value="Regular">Regular</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchData}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de clientes */}
      <div className="bg-gray-800/70 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Clientes Fieles ({clientesFiltrados.length})
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3 px-2 text-gray-300 font-medium">Cliente</th>
                <th className="text-center py-3 px-2 text-gray-300 font-medium">Clasificación</th>
                <th className="text-center py-3 px-2 text-gray-300 font-medium">Total Citas</th>
                <th className="text-center py-3 px-2 text-gray-300 font-medium">Período</th>
                <th className="text-center py-3 px-2 text-gray-300 font-medium">Asistencia</th>
                <th className="text-center py-3 px-2 text-gray-300 font-medium">Última Cita</th>
                <th className="text-left py-3 px-2 text-gray-300 font-medium">Recomendaciones</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map((cliente) => (
                <tr key={cliente.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                  <td className="py-3 px-2">
                    <div>
                      <div className="text-white font-medium">{cliente.nombre}</div>
                      <div className="text-gray-400 text-xs">{cliente.correo}</div>
                      <div className="text-gray-500 text-xs">
                        Cliente desde: {formatearFecha(cliente.primera_cita)}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getNivelColor(cliente.nivelFidelidad)}`}>
                      {cliente.clasificacion}
                    </span>
                    <div className="text-gray-400 text-xs mt-1">
                      Nivel {cliente.nivelFidelidad}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="text-white font-bold text-lg">{cliente.total_citas}</div>
                    <div className="text-gray-400 text-xs">
                      {cliente.frecuencia_promedio_dias 
                        ? `Cada ${Math.round(cliente.frecuencia_promedio_dias)} días`
                        : 'N/A'
                      }
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="text-blue-300 font-bold">{cliente.citas_periodo}</div>
                    <div className="text-gray-400 text-xs">en {periodo}</div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className={`font-bold ${cliente.porcentajeAsistencia >= 90 ? 'text-green-400' : cliente.porcentajeAsistencia >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {cliente.porcentajeAsistencia}%
                    </div>
                    <div className="text-gray-400 text-xs">
                      {cliente.citas_completadas}/{cliente.total_citas}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="text-white">{formatearFecha(cliente.ultima_cita)}</div>
                    <div className={`text-xs ${cliente.dias_desde_ultima_cita > 60 ? 'text-red-400' : cliente.dias_desde_ultima_cita > 30 ? 'text-yellow-400' : 'text-green-400'}`}>
                      Hace {cliente.dias_desde_ultima_cita} días
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="space-y-1">
                      {cliente.recomendaciones.length > 0 ? (
                        cliente.recomendaciones.map((recomendacion, index) => (
                          <div key={index} className="text-xs bg-blue-900/30 text-blue-200 px-2 py-1 rounded">
                            {recomendacion}
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-500 text-xs">Sin recomendaciones</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {clientesFiltrados.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No se encontraron clientes con los filtros seleccionados
          </div>
        )}
      </div>
    </div>
  )
}