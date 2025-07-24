'use client'

import { useUser } from '../app/hooks/useUser'
import ClientsManagement from './ClientsManagement' 

export default function ClientsView() {
  const { user } = useUser()

  if (user?.rol !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center h-64 text-red-400">
        No tienes permisos para ver esta sección
      </div>
    )
  }

  return (
    <div className="bg-gray-800/70 rounded-xl p-6 border border-gray-700">
      <h2 className="text-lg font-semibold text-white mb-4">Gestión de Clientes</h2>
      {/* Aquí va el componente que muestra la tabla y formularios */}
      <ClientsManagement />
    </div>
  )
}
