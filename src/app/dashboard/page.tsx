'use client'

import { motion } from 'framer-motion'
import { fadeIn } from '../../lib/motion'
import { FiCalendar, FiUsers, FiDollarSign, FiScissors, FiPieChart, FiSettings, FiLogOut } from 'react-icons/fi'
import { FaCut } from 'react-icons/fa';
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const router = useRouter()

  // Datos de ejemplo
  const stats = [
    { title: 'Citas Hoy', value: '12', change: '+2', icon: <FiCalendar className="text-red-400" size={24} /> },
    { title: 'Clientes Activos', value: '84', change: '+5', icon: <FiUsers className="text-blue-400" size={24} /> },
    { title: 'Ingresos Hoy', value: '$1,850', change: '+$320', icon: <FiDollarSign className="text-purple-400" size={24} /> },
    { title: 'Servicios', value: '6', change: '', icon: <FiScissors className="text-white" size={24} /> }
  ]

  const recentAppointments = [
    { id: 1, client: 'Juan Pérez', service: 'Corte Clásico', time: '10:00 AM', barber: 'Carlos', status: 'confirmada' },
    { id: 2, client: 'María García', service: 'Afeitado', time: '11:30 AM', barber: 'Luis', status: 'pendiente' },
    { id: 3, client: 'Roberto Sánchez', service: 'Corte + Barba', time: '2:00 PM', barber: 'Carlos', status: 'confirmada' },
    { id: 4, client: 'Ana Martínez', service: 'Tinte', time: '3:30 PM', barber: 'Elena', status: 'cancelada' }
  ]

  const handleLogout = () => {
    router.push('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden md:flex md:flex-shrink-0"
      >
        <div className="flex flex-col w-64 bg-gray-800 border-r border-gray-700">
          <div className="flex items-center justify-center h-16 px-4 bg-gray-900">
            <div className="flex items-center">
              <FaCut  className="text-red-500 mr-2" size={24} />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-600">
                Pasión y Estilo
              </span>
            </div>
          </div>
          <div className="flex flex-col flex-grow px-4 py-8 overflow-y-auto">
            <nav className="flex-1 space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition-all ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-red-600/30 to-purple-600/30 text-white border-l-4 border-red-500' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                <FiPieChart className="mr-3" />
                Resumen
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition-all ${activeTab === 'appointments' ? 'bg-gradient-to-r from-red-600/30 to-purple-600/30 text-white border-l-4 border-red-500' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                <FiCalendar className="mr-3" />
                Citas
              </button>
              <button
                onClick={() => setActiveTab('clients')}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition-all ${activeTab === 'clients' ? 'bg-gradient-to-r from-red-600/30 to-purple-600/30 text-white border-l-4 border-red-500' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                <FiUsers className="mr-3" />
                Clientes
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition-all ${activeTab === 'services' ? 'bg-gradient-to-r from-red-600/30 to-purple-600/30 text-white border-l-4 border-red-500' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                <FiScissors className="mr-3" />
                Servicios
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition-all ${activeTab === 'settings' ? 'bg-gradient-to-r from-red-600/30 to-purple-600/30 text-white border-l-4 border-red-500' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                <FiSettings className="mr-3" />
                Configuración
              </button>
            </nav>
            <div className="mt-auto">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-300 hover:text-white rounded-lg w-full hover:bg-gray-700 transition-all"
              >
                <FiLogOut className="mr-3" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contenido principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-white">Panel de Control</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700">
              <span className="sr-only">Notificaciones</span>
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </div>
            </button>
            <div className="relative">
              <button className="flex items-center space-x-2 focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  A
                </div>
                <span className="text-sm font-medium text-white hidden md:inline">Admin</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-900/50">
          {/* Estadísticas */}
          <motion.div
            variants={fadeIn('up', 'spring', 0.2, 1)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-800/70 rounded-xl p-6 border border-gray-700 hover:border-purple-500/30 transition-all">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                    {stat.change && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-900/30 text-green-400 mt-2">
                        {stat.change}
                      </span>
                    )}
                  </div>
                  <div className="h-12 w-12 rounded-full bg-gray-700/50 flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Citas recientes */}
          <motion.div
            variants={fadeIn('up', 'spring', 0.4, 1)}
            className="bg-gray-800/70 rounded-xl p-6 border border-gray-700 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Citas Recientes</h2>
              <button className="text-sm font-medium text-blue-400 hover:text-blue-300">
                Ver todas
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Servicio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Hora</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Barbero</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {recentAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{appointment.client}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{appointment.service}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{appointment.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{appointment.barber}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          appointment.status === 'confirmada' ? 'bg-green-900/30 text-green-400' :
                          appointment.status === 'pendiente' ? 'bg-yellow-900/30 text-yellow-400' :
                          'bg-red-900/30 text-red-400'
                        }`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Gráficos y más contenido */}
          <motion.div
            variants={fadeIn('up', 'spring', 0.6, 1)}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="bg-gray-800/70 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Ingresos Semanales</h3>
              <div className="h-64 bg-gray-700/30 rounded-lg flex items-center justify-center text-gray-400">
                Gráfico de ingresos (placeholder)
              </div>
            </div>
            <div className="bg-gray-800/70 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Servicios Populares</h3>
              <div className="h-64 bg-gray-700/30 rounded-lg flex items-center justify-center text-gray-400">
                Gráfico de servicios (placeholder)
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}