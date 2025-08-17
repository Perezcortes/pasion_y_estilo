'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FiCalendar, FiUsers, FiScissors, FiPieChart, FiSettings, FiLogOut, FiUser, FiMenu, FiX } from 'react-icons/fi'
import { FaCut } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useUser } from '../../app/hooks/useUser'
import { NavItem } from '../../types/types'
import { useState, useEffect } from 'react'
import ProfileDashboard from '../Profile/ProfileDashboard'

const navItems: NavItem[] = [
  {
    name: 'Resumen',
    icon: <FiPieChart className="mr-3" />,
    tab: 'dashboard',
    allowedRoles: ['ADMIN', 'BARBERO']
  },
  {
    name: 'Citas',
    icon: <FiCalendar className="mr-3" />,
    tab: 'appointments',
    allowedRoles: ['ADMIN', 'BARBERO']
  },
  {
    name: 'Clientes',
    icon: <FiUsers className="mr-3" />,
    tab: 'clients',
    allowedRoles: ['ADMIN']
  },
  {
    name: 'Servicios',
    icon: <FiScissors className="mr-3" />,
    tab: 'services',
    allowedRoles: ['ADMIN']
  },
  {
    name: 'Configuración',
    icon: <FiSettings className="mr-3" />,
    tab: 'settings',
    allowedRoles: ['ADMIN']
  }
]

export default function Sidebar({ 
  activeTab, 
  setActiveTab 
}: { 
  activeTab: string, 
  setActiveTab: (tab: string) => void 
}) {
  const { user } = useUser()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  // Persistir el tab activo en localStorage
  useEffect(() => {
    if (activeTab) {
      localStorage.setItem('activeTab', activeTab)
    }
  }, [activeTab])

  // Restaurar el tab activo al cargar
  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab')
    if (savedTab && savedTab !== activeTab) {
      setActiveTab(savedTab)
    }
  }, [setActiveTab, activeTab])

  if (!user) return null

  const filteredNavItems = navItems.filter(item => 
    item.allowedRoles.includes(user.rol)
  )

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setIsMobileMenuOpen(false) // Cerrar menú móvil al seleccionar
  }

  const handleLogout = async () => {
    localStorage.removeItem('activeTab') // Limpiar tab guardado al cerrar sesión
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  // Componente de navegación reutilizable
  const Navigation = () => (
    <>
      <nav className="flex-1 space-y-2">
        {filteredNavItems.map((item) => (
          <button
            key={item.tab}
            onClick={() => handleTabChange(item.tab)}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition-all ${
              activeTab === item.tab 
                ? 'bg-gradient-to-r from-red-600/30 to-purple-600/30 text-white border-l-4 border-red-500' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </nav>
      <div className="mt-auto">
        <button
          onClick={() => {
            setIsProfileModalOpen(true)
            setIsMobileMenuOpen(false)
          }}
          className="flex items-center px-4 py-3 text-sm font-medium text-gray-300 hover:text-white rounded-lg w-full hover:bg-gray-700 transition-all mb-2"
        >
          <FiUser className="mr-3" />
          Mi Perfil
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-3 text-sm font-medium text-gray-300 hover:text-white rounded-lg w-full hover:bg-gray-700 transition-all"
        >
          <FiLogOut className="mr-3" />
          Cerrar Sesión
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Botón hamburguesa para móviles */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Overlay para móviles */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar móvil */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="md:hidden fixed left-0 top-0 z-50 h-full"
          >
            <div className="flex flex-col w-64 h-full bg-gray-800 border-r border-gray-700">
              <div className="flex items-center justify-center h-16 px-4 bg-gray-900">
                <div className="flex items-center">
                  <FaCut className="text-red-500 mr-2" size={24} />
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-600">
                    Panel - Barberia
                  </span>
                </div>
              </div>
              <div className="flex flex-col flex-grow px-4 py-8 overflow-y-auto">
                <Navigation />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar desktop */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden md:flex md:flex-shrink-0"
      >
        <div className="flex flex-col w-64 bg-gray-800 border-r border-gray-700">
          <div className="flex items-center justify-center h-16 px-4 bg-gray-900">
            <div className="flex items-center">
              <FaCut className="text-red-500 mr-2" size={24} />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-600">
                Panel - Barberia
              </span>
            </div>
          </div>
          <div className="flex flex-col flex-grow px-4 py-8 overflow-y-auto">
            <Navigation />
          </div>
        </div>
      </motion.div>

      {/* Modal de perfil */}
      <ProfileDashboard
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  )
}