'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { FiTrendingUp, FiUsers, FiDollarSign, FiCalendar, FiClock } from 'react-icons/fi'

interface BarberoChartsProps {
  stats: {
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
  } | null
  loading: boolean
}

// Función helper para formatear moneda
const formatCurrency = (value: any): string => {
  const num = Number(value) || 0
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num)
}

// Función helper para formatear números
const formatNumber = (value: any): string => {
  const num = Number(value) || 0
  return num.toLocaleString('es-CL')
}

export default function BarberoCharts({ stats, loading }: BarberoChartsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-48 bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No se pudieron cargar las estadísticas</p>
      </div>
    )
  }

  const totalIngresosSemana = stats.historialSemanal.reduce((acc, day) => acc + day.ingresos, 0)
  const totalCitasSemana = stats.historialSemanal.reduce((acc, day) => acc + day.citas, 0)
  const promedioIngresosDay = totalIngresosSemana / 7
  const promedioCitasDay = Math.round(totalCitasSemana / 7)

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <FiTrendingUp className="mr-2" />
          Mi Panel de Control
        </h2>
        <div className="text-sm text-gray-400">
          Datos en tiempo real
        </div>
      </div>

      {/* Cards de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FiCalendar className="text-blue-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Citas Hoy</p>
                <p className="text-2xl font-bold text-blue-400">{stats.resumen.citasHoy.total}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xs px-2 py-1 rounded-full ${
                stats.resumen.citasHoy.cambio >= 0 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {stats.resumen.citasHoy.cambioTexto}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-sm rounded-xl p-4 border border-green-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <FiDollarSign className="text-green-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Ingresos Hoy</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(stats.resumen.ingresosHoy.total)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xs px-2 py-1 rounded-full ${
                stats.resumen.ingresosHoy.cambio >= 0 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {formatCurrency(stats.resumen.ingresosHoy.cambio)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <FiUsers className="text-purple-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Clientes Únicos</p>
                <p className="text-2xl font-bold text-purple-400">{stats.resumen.clientesUnicos.total}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xs px-2 py-1 rounded-full ${
                stats.resumen.clientesUnicos.cambio >= 0 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {stats.resumen.clientesUnicos.cambioTexto}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Historial semanal - Ingresos */}
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-sm rounded-xl p-6 border border-green-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <FiDollarSign className="text-green-400" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Ingresos de la Semana</h3>
                <p className="text-sm text-gray-400">Últimos 7 días</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-green-400">
                {formatCurrency(totalIngresosSemana)}
              </p>
              <p className="text-xs text-gray-400">Total semanal</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.historialSemanal}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="fechaFormateada" 
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
                formatter={(value: any) => [formatCurrency(value), 'Ingresos']}
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
        </div>

        {/* Historial semanal - Citas */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FiCalendar className="text-blue-400" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Citas de la Semana</h3>
                <p className="text-sm text-gray-400">Por estado</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-blue-400">{totalCitasSemana}</p>
              <p className="text-xs text-gray-400">Total semanal</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.historialSemanal}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="fechaFormateada" 
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
              />
              <Line
                type="monotone"
                dataKey="completadas"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="pendientes"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="canceladas"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="flex justify-center space-x-4 mt-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-0.5 bg-green-400 mr-2"></div>
              <span className="text-gray-400">Completadas</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-0.5 bg-yellow-400 mr-2"></div>
              <span className="text-gray-400">Pendientes</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-0.5 bg-red-400 mr-2"></div>
              <span className="text-gray-400">Canceladas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos secundarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Servicios populares */}
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <FiTrendingUp className="text-purple-400" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Mis Servicios Populares</h3>
              <p className="text-sm text-gray-400">Distribución por tipo</p>
            </div>
          </div>

          {stats.serviciosPopulares.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={stats.serviciosPopulares}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="porcentaje"
                  >
                    {stats.serviciosPopulares.map((entry, index) => (
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
                      `${Number(value).toFixed(1)}% (${props.payload.cantidad} citas)`, 
                      'Porcentaje'
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="grid grid-cols-1 gap-2 mt-4 max-h-32 overflow-y-auto">
                {stats.serviciosPopulares.map((service, index) => (
                  <div key={index} className="flex items-center justify-between text-xs bg-gray-800/30 rounded p-2">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                        style={{ backgroundColor: service.color }}
                      ></div>
                      <span className="text-gray-300 truncate">{service.nombre}</span>
                    </div>
                    <div className="text-right ml-2">
                      <div className="text-white font-medium">{Number(service.porcentaje).toFixed(1)}%</div>
                      <div className="text-gray-400">({formatNumber(service.cantidad)} citas)</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <div className="text-gray-400 text-sm">No hay datos de servicios</div>
                <div className="text-gray-500 text-xs mt-1">Completa algunas citas para ver estadísticas</div>
              </div>
            </div>
          )}
        </div>

        {/* Próximas citas */}
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <FiClock className="text-orange-400" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Próximas Citas</h3>
              <p className="text-sm text-gray-400">Hoy y mañana</p>
            </div>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {stats.proximasCitas.length > 0 ? (
              stats.proximasCitas.map((cita) => (
                <div key={cita.id} className="p-3 bg-gray-800/30 rounded-lg border-l-4 border-orange-400">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-white text-sm">{cita.cliente.nombre}</h4>
                      <p className="text-xs text-gray-400">{cita.servicio}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      cita.estado === 'CONFIRMADA' ? 'bg-green-900/30 text-green-400' :
                      cita.estado === 'PENDIENTE' ? 'bg-yellow-900/30 text-yellow-400' :
                      'bg-red-900/30 text-red-400'
                    }`}>
                      {cita.estado}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-300">
                        {new Date(cita.fecha).toLocaleDateString('es-ES', { 
                          weekday: 'short', 
                          day: 'numeric',
                          month: 'short' 
                        })}
                      </span>
                      <span className="text-orange-400 font-medium">{cita.hora}</span>
                    </div>
                    <span className="text-green-400 font-medium">
                      {formatCurrency(cita.precio)}
                    </span>
                  </div>
                  
                  {cita.cliente.telefono && (
                    <div className="mt-2 pt-2 border-t border-gray-700/50">
                      <p className="text-xs text-gray-400">📞 {cita.cliente.telefono}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-sm">No tienes citas próximas</div>
                <div className="text-gray-500 text-xs mt-1">¡Disfruta tu tiempo libre!</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resumen rápido */}
      <div className="mt-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <FiTrendingUp className="mr-2 text-gray-400" />
          Resumen de Rendimiento
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{promedioCitasDay}</div>
            <div className="text-sm text-gray-400">Citas promedio/día</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {formatCurrency(promedioIngresosDay)}
            </div>
            <div className="text-sm text-gray-400">Ingresos promedio/día</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {stats.serviciosPopulares.length}
            </div>
            <div className="text-sm text-gray-400">Servicios diferentes</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">
              {stats.proximasCitas.length}
            </div>
            <div className="text-sm text-gray-400">Citas pendientes</div>
          </div>
        </div>
      </div>
    </div>
  )
}