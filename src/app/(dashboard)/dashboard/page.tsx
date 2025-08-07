'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '../../hooks/useUser'
import Sidebar from '../../../components/Dashboard/Sidebar'
import DashboardContent from '../../../components/Dashboard/DashboardContent'
import { motion } from 'framer-motion'
import { fadeIn } from '../../../lib/motion'
import { FiCalendar, FiUsers, FiDollarSign, FiScissors, FiSun, FiBell } from 'react-icons/fi'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const router = useRouter()
  const { user, loading } = useUser()

  // Restaurar el tab activo del localStorage al cargar
  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab')
    if (savedTab) {
      setActiveTab(savedTab)
    }
  }, [])

  const stats = [
    { 
      title: 'Citas Hoy', 
      value: '12', 
      change: '+2', 
      icon: <FiCalendar className="text-red-400" size={20} />,
      color: 'from-red-500/20 to-red-600/20',
      borderColor: 'border-red-500/30'
    },
    { 
      title: 'Clientes Activos', 
      value: '84', 
      change: '+5', 
      icon: <FiUsers className="text-blue-400" size={20} />,
      color: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30'
    },
    { 
      title: 'Ingresos Hoy', 
      value: '$1,850', 
      change: '+$320', 
      icon: <FiDollarSign className="text-purple-400" size={20} />,
      color: 'from-purple-500/20 to-purple-600/20',
      borderColor: 'border-purple-500/30'
    },
    { 
      title: 'Servicios', 
      value: '6', 
      change: '', 
      icon: <FiScissors className="text-green-400" size={20} />,
      color: 'from-green-500/20 to-green-600/20',
      borderColor: 'border-green-500/30'
    }
  ]

  if (loading) {
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
              {/* Stats Cards - Grid responsivo mejorado */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8"
              >
                {stats.map((stat, index) => (
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
                        {stat.change && (
                          <span className="inline-flex items-center px-1.5 md:px-2 py-0.5 rounded text-xs font-medium bg-green-900/30 text-green-400 mt-1 md:mt-2">
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
                ))}
              </motion.div>

              {/* Dashboard Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
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