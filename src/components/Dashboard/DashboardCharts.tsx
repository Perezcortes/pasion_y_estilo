'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { FiTrendingUp, FiUsers, FiDollarSign, FiCalendar } from 'react-icons/fi'

// Hook para obtener estadísticas de servicios (debes crearlo en tu carpeta hooks)
import { useServicesStats } from '../../app/hooks/useServicesStats'

interface DashboardChartsProps {
  stats: {
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
  } | null
  loading: boolean
}

export default function DashboardCharts({ stats, loading }: DashboardChartsProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [clientsData, setClientsData] = useState<any[]>([])
  const [revenueData, setRevenueData] = useState<any[]>([])
  
  // Hook para obtener datos reales de servicios populares
  const { servicesStats, loading: servicesLoading, error: servicesError, refetch: refetchServices } = useServicesStats()

  // Generar datos simulados para los gráficos (en un caso real, estos vendrían de tu API)
  useEffect(() => {
    if (!stats) return

    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    const today = new Date()
    
    // Datos de clientes (simulados con tendencia creciente)
    const clientsChartData = Array.from({ length: days }, (_, i) => {
      const date = new Date(today)
      date.setDate(date.getDate() - (days - 1 - i))
      
      const baseClients = Math.max(0, stats.clientesActivos.total - (days - i) * 2)
      const randomVariation = Math.floor(Math.random() * 10) - 5
      
      return {
        fecha: date.toLocaleDateString('es-ES', { 
          month: 'short', 
          day: 'numeric' 
        }),
        clientes: Math.max(0, baseClients + randomVariation),
        nuevos: Math.floor(Math.random() * 3) + 1
      }
    })

    // Datos de ingresos (simulados con variación realista)
    const revenueChartData = Array.from({ length: days }, (_, i) => {
      const date = new Date(today)
      date.setDate(date.getDate() - (days - 1 - i))
      
      // Simular ingresos con patrón semanal (más altos en fin de semana)
      const dayOfWeek = date.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      const baseRevenue = isWeekend ? 800 : 500
      const randomVariation = Math.floor(Math.random() * 400) - 200
      
      return {
        fecha: date.toLocaleDateString('es-ES', { 
          month: 'short', 
          day: 'numeric' 
        }),
        ingresos: Math.max(0, baseRevenue + randomVariation),
        citas: Math.floor(Math.random() * 15) + 5
      }
    })

    setClientsData(clientsChartData)
    setRevenueData(revenueChartData)
  }, [stats, timeRange])

  // Datos para gráfico de distribución de servicios - AHORA CON DATOS REALES
  const servicesData = servicesStats?.serviciosPopulares.map(servicio => ({
    name: servicio.nombre,
    value: servicio.porcentaje,
    cantidad: servicio.cantidad,
    precio_promedio: servicio.precio_promedio,
    color: servicio.color
  })) || [
    { name: 'Sin datos', value: 100, cantidad: 0, precio_promedio: 0, color: '#6b7280' }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Skeleton de gráficos */}
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="mb-8">
      {/* Controles de tiempo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl font-bold text-white mb-4 sm:mb-0 flex items-center">
          <FiTrendingUp className="mr-2" />
          Análisis Temporal
        </h2>
        
        <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                timeRange === range
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {range === '7d' ? '7 días' : range === '30d' ? '30 días' : '90 días'}
            </button>
          ))}
        </div>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de Clientes */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FiUsers className="text-blue-400" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Clientes Activos</h3>
                <p className="text-sm text-gray-400">Tendencia en el tiempo</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-400">
                {stats?.clientesActivos.total || 0}
              </p>
              <p className="text-xs text-gray-400">Total actual</p>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={clientsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="fecha" 
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Line
                type="monotone"
                dataKey="clientes"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="nuevos"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
          
          <div className="flex justify-center space-x-6 mt-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-0.5 bg-blue-400 mr-2"></div>
              <span className="text-gray-400">Clientes Totales</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-0.5 bg-green-400 mr-2" style={{background: 'repeating-linear-gradient(to right, #10b981 0, #10b981 3px, transparent 3px, transparent 8px)'}}></div>
              <span className="text-gray-400">Nuevos Clientes</span>
            </div>
          </div>
        </div>

        {/* Gráfico de Ingresos */}
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-sm rounded-xl p-6 border border-green-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <FiDollarSign className="text-green-400" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Ingresos Diarios</h3>
                <p className="text-sm text-gray-400">Evolución de ventas</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-400">
                ${(stats?.ingresosTotales.ingresosHoy || 0).toFixed(2)}
              </p>
              <p className="text-xs text-gray-400">Hoy</p>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="fecha" 
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
                labelStyle={{ color: '#9ca3af' }}
                formatter={(value: any) => [`$${value}`, 'Ingresos']}
              />
              <Bar
                dataKey="ingresos"
                fill="url(#greenGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
          
          <div className="flex justify-center items-center mt-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded mr-2 opacity-80"></div>
              <span className="text-gray-400">Ingresos por día</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos secundarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribución de servicios */}
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <FiCalendar className="text-purple-400" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Servicios Populares</h3>
                <p className="text-sm text-gray-400">Distribución por tipo</p>
              </div>
            </div>
            {servicesError && (
              <button
                onClick={refetchServices}
                className="text-xs text-red-400 hover:text-red-300 underline"
                title="Recargar datos"
              >
                ↻ Reintentar
              </button>
            )}
          </div>
          
          {servicesLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={servicesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {servicesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                    formatter={(value: any, name, props) => [
                      `${value}% (${props.payload.cantidad} citas)`, 
                      'Porcentaje'
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="grid grid-cols-1 gap-2 mt-4 max-h-24 overflow-y-auto">
                {servicesData.map((service, index) => (
                  <div key={index} className="flex items-center justify-between text-xs bg-gray-800/30 rounded p-2">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                        style={{ backgroundColor: service.color }}
                      ></div>
                      <span className="text-gray-300 truncate">{service.name}</span>
                    </div>
                    <div className="text-right ml-2">
                      <div className="text-white font-medium">{service.value.toFixed(1)}%</div>
                      <div className="text-gray-400">({service.cantidad} citas)</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Métricas adicionales */}
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <FiTrendingUp className="text-orange-400" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Resumen Rápido</h3>
              <p className="text-sm text-gray-400">Métricas clave</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Promedio ingresos/día</span>
              <span className="text-white font-semibold">
                ${(revenueData.reduce((acc, day) => acc + day.ingresos, 0) / revenueData.length).toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Promedio citas/día</span>
              <span className="text-white font-semibold">
                {Math.round(revenueData.reduce((acc, day) => acc + day.citas, 0) / revenueData.length)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Crecimiento clientes</span>
              <span className={`font-semibold ${
                (stats?.clientesActivos.cambio || 0) >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {stats?.clientesActivos.cambioTexto || '0'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Total servicios</span>
              <span className="text-white font-semibold">
                {stats?.servicios.total || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}