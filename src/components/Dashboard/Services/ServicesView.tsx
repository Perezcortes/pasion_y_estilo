'use client'

import { useUser } from '../../../app/hooks/useUser'
import ServicesManagement from './ServicesManagement'

export default function ServicesView() {
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
      <h2 className="text-lg font-semibold text-white mb-4">Gestión de Servicios</h2>
      <div className="bg-gray-700/30 rounded-lg p-4 text-gray-400">
        Lista de servicios (contenido solo visible para administradores)
        <ServicesManagement />

      </div>
    </div>
  )
}