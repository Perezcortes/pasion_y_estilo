'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '../../hooks/useUser'
import { useDashboardStats } from '../../hooks/useDashboardStats'
import Sidebar from '../../../components/Dashboard/Sidebar'
import DashboardContent from '../../../components/Dashboard/DashboardContent'
import DashboardCharts from '../../../components/Dashboard/DashboardCharts' // Nuevo import
import { motion } from 'framer-motion'
import { fadeIn } from '../../../lib/motion'
import { FiCalendar, FiUsers, FiDollarSign, FiScissors, FiSun, FiBell, FiRefreshCw } from 'react-icons/fi'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const router = useRouter()
  const { user, loading: userLoading } = useUser()
  const { stats, loading: statsLoading, error: statsError, refetch } = useDashboardStats()

  // Restaurar el tab activo del localStorage al cargar
  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab')
    if (savedTab) {
      setActiveTab(savedTab)
    }
  }, [])

  // Preparar los datos de estadísticas
  const statsData = stats ? [
    { 
      title: 'Citas Hoy', 
      value: (stats.citasHoy.total || 0).toString(), 
      change: stats.citasHoy.cambioTexto || '', 
      icon: <FiCalendar className="text-red-400" size={20} />,
      color: 'from-red-500/20 to-red-600/20',
      borderColor: 'border-red-500/30'
    },
    { 
      title: 'Clientes Activos', 
      value: (stats.clientesActivos.total || 0).toString(), 
      change: stats.clientesActivos.cambioTexto || '', 
      icon: <FiUsers className="text-blue-400" size={20} />,
      color: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30'
    },
    { 
      title: 'Ingresos Totales', 
      value: `${(stats.ingresosTotales.total || 0).toLocaleString()}`, 
      change: stats.ingresosTotales.cambioTexto || '', 
      subtitle: `Hoy: ${(stats.ingresosTotales.ingresosHoy || 0).toFixed(2)}`,
      icon: <FiDollarSign className="text-purple-400" size={20} />,
      color: 'from-purple-500/20 to-purple-600/20',
      borderColor: 'border-purple-500/30'
    },
    { 
      title: 'Cortes', 
      value: (stats.servicios.total || 0).toString(), 
      change: stats.servicios.cambioTexto || '', 
      icon: <FiScissors className="text-green-400" size={20} />,
      color: 'from-green-500/20 to-green-600/20',
      borderColor: 'border-green-500/30'
    }
  ] : []

  if (userLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p>Cargando usuario...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const isAdmin = user.rol === 'ADMIN'
  const greeting = isAdmin ? `Hola Admin, ${user.nombre}` : `Hola, ${user.nombre}`

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header responsive */}
        <header className="flex items-center justify-between h-14 md:h-16 px-4 md:px-6 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center space-x-3 min-w-0 flex-1 ml-12 md:ml-0">
            <FiSun className="text-yellow-400 flex-shrink-0" size={18} />
            <h1 className="text-sm md:text-xl font-semibold text-white truncate">
              {greeting}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
            {/* Botón de actualizar estadísticas - solo para admin */}
            {isAdmin && activeTab === 'dashboard' && (
              <button
                onClick={refetch}
                disabled={statsLoading}
                className="hidden sm:flex p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700 disabled:opacity-50"
                title="Actualizar estadísticas"
              >
                <FiRefreshCw size={18} className={statsLoading ? 'animate-spin' : ''} />
              </button>
            )}
            
            {/* Notificaciones - oculto en móvil muy pequeño */}
            <button className="hidden sm:flex p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700">
              <FiBell size={18} />
            </button>
            
            {/* Avatar del usuario */}
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-red-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm md:text-base">
              {user.nombre.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Main content con padding responsivo */}
        <main className="flex-1 overflow-y-auto p-3 md:p-6 bg-gray-900/50">
          {isAdmin && activeTab === 'dashboard' ? (
            <>
              {/* Error de estadísticas */}
              {statsError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <div className="text-red-400">⚠️</div>
                    <span className="text-red-200">Error al cargar estadísticas: {statsError}</span>
                  </div>
                  <button
                    onClick={refetch}
                    className="text-red-200 hover:text-white text-sm underline"
                  >
                    Reintentar
                  </button>
                </motion.div>
              )}

              {/* Stats Cards - Grid responsivo mejorado */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8"
              >
                {statsLoading ? (
                  // Skeleton loading para las cards
                  Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-gray-800/50 rounded-xl p-3 md:p-6 border border-gray-700 animate-pulse"
                    >
                      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-between md:items-start">
                        <div className="flex-1 min-w-0">
                          <div className="h-4 bg-gray-700 rounded w-20 mb-2"></div>
                          <div className="h-6 bg-gray-700 rounded w-16 mb-2"></div>
                          <div className="h-3 bg-gray-700 rounded w-12"></div>
                        </div>
                        <div className="h-8 w-8 md:h-12 md:w-12 rounded-full bg-gray-700"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  statsData.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                      className={`bg-gradient-to-br ${stat.color} backdrop-blur-sm rounded-xl p-3 md:p-6 border ${stat.borderColor} hover:border-opacity-60 transition-all duration-300 hover:transform hover:scale-105`}
                    >
                      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-between md:items-start">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs md:text-sm font-medium text-gray-400 truncate">
                            {stat.title}
                          </p>
                          <p className="text-lg md:text-2xl font-bold text-white mt-1 md:mt-2 truncate">
                            {stat.value}
                          </p>
                          {stat.subtitle && (
                            <p className="text-xs text-gray-400 mt-1">
                              {stat.subtitle}
                            </p>
                          )}
                          {stat.change && (
                            <span className={`inline-flex items-center px-1.5 md:px-2 py-0.5 rounded text-xs font-medium mt-1 md:mt-2 ${
                              stat.change.startsWith('+') 
                                ? 'bg-green-900/30 text-green-400' 
                                : stat.change.startsWith('-')
                                ? 'bg-red-900/30 text-red-400'
                                : 'bg-gray-900/30 text-gray-400'
                            }`}>
                              {stat.change}
                            </span>
                          )}
                        </div>
                        
                        {/* Icono - ajustado para móvil */}
                        <div className="h-8 w-8 md:h-12 md:w-12 rounded-full bg-gray-700/50 flex items-center justify-center flex-shrink-0 self-end md:self-start">
                          {stat.icon}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>

              {/* Gráficos Interactivos - NUEVA SECCIÓN */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <DashboardCharts stats={stats} loading={statsLoading} />
              </motion.div>

              {/* Dashboard Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <DashboardContent activeTab={activeTab} />
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <DashboardContent activeTab={activeTab} />
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}