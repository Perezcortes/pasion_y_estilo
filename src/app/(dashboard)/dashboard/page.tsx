'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '../../hooks/useUser'
import Sidebar from '../../../components/Sidebar'
import DashboardContent from '../../../components/DashboardContent'
import { motion } from 'framer-motion'
import { fadeIn } from '../../../lib/motion'
import { FiCalendar, FiUsers, FiDollarSign, FiScissors } from 'react-icons/fi'
import { FiSun } from 'react-icons/fi'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const router = useRouter()
  const { user, loading } = useUser()

  const stats = [
    { title: 'Citas Hoy', value: '12', change: '+2', icon: <FiCalendar className="text-red-400" size={24} /> },
    { title: 'Clientes Activos', value: '84', change: '+5', icon: <FiUsers className="text-blue-400" size={24} /> },
    { title: 'Ingresos Hoy', value: '$1,850', change: '+$320', icon: <FiDollarSign className="text-purple-400" size={24} /> },
    { title: 'Servicios', value: '6', change: '', icon: <FiScissors className="text-white" size={24} /> }
  ]

  if (loading) return <div className="p-6 text-white">Cargando usuario...</div>
  if (!user) return null

  const isAdmin = user.rol === 'ADMIN'
  const greeting = isAdmin ? `Hola Admin, ${user.nombre}` : `Hola, ${user.nombre}`

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between h-16 px-6 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <FiSun className="text-yellow-400" />
            <h1 className="text-xl font-semibold text-white">
              {greeting}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {user.nombre.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-900/50">
          {isAdmin && activeTab === 'dashboard' ? (
            <>
              <motion.div
                variants={fadeIn('up', 'spring', 0.2, 1)}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              >
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/70 rounded-xl p-6 border border-gray-700 hover:border-purple-500/30 transition-all"
                  >
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

              <DashboardContent activeTab={activeTab} />
            </>
          ) : (
            <DashboardContent activeTab={activeTab} />
          )}
        </main>
      </div>
    </div>
  )
}