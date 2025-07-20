// components/Sidebar.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiPieChart, FiCalendar, FiUsers, FiScissors, FiSettings, FiLogOut } from 'react-icons/fi'
import { FaCut } from 'react-icons/fa'
import * as jwtDecode from 'jwt-decode'

type Role = 'ADMIN' | 'BARBERO' | 'CLIENTE'

type DecodedToken = {
  id: number
  nombre: string
  rol: Role
}

export default function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const [rol, setRol] = useState<Role | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = (jwtDecode as any).default(token) as DecodedToken
        setRol(decoded.rol)
      } catch {
        setRol(null)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <div className="flex flex-col w-64 bg-gray-800 border-r border-gray-700">
      <div className="flex items-center justify-center h-16 px-4 bg-gray-900">
        <FaCut className="text-red-500 mr-2" size={24} />
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-600">
          Pasión y Estilo
        </span>
      </div>
      <div className="flex flex-col flex-grow px-4 py-8 overflow-y-auto">
        <nav className="flex-1 space-y-2">
          <SidebarButton label="Resumen" tab="dashboard" icon={<FiPieChart />} activeTab={activeTab} setActiveTab={setActiveTab} />
          {(rol === 'ADMIN' || rol === 'BARBERO') && (
            <SidebarButton label="Citas" tab="appointments" icon={<FiCalendar />} activeTab={activeTab} setActiveTab={setActiveTab} />
          )}
          {rol === 'ADMIN' && (
            <>
              <SidebarButton label="Clientes" tab="clients" icon={<FiUsers />} activeTab={activeTab} setActiveTab={setActiveTab} />
              <SidebarButton label="Servicios" tab="services" icon={<FiScissors />} activeTab={activeTab} setActiveTab={setActiveTab} />
            </>
          )}
          <SidebarButton label="Configuración" tab="settings" icon={<FiSettings />} activeTab={activeTab} setActiveTab={setActiveTab} />
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
  )
}

function SidebarButton({
  label,
  tab,
  icon,
  activeTab,
  setActiveTab
}: {
  label: string
  tab: string
  icon: React.ReactNode
  activeTab: string
  setActiveTab: (tab: string) => void
}) {
  const isActive = activeTab === tab
  return (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition-all ${
        isActive
          ? 'bg-gradient-to-r from-red-600/30 to-purple-600/30 text-white border-l-4 border-red-500'
          : 'text-gray-300 hover:bg-gray-700'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
  )
}
