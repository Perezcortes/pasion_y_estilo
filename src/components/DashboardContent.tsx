'use client'

import { useUser } from '../app/hooks/useUser'
import DashboardView from './DashboardView'
import AppointmentsView from './AppointmentsView'
import ClientsView from './ClientsView'
import ServicesView from './ServicesView'
import SettingsView from './SettingsView'

export default function DashboardContent({ activeTab }: { activeTab: string }) {
  const { user } = useUser()

  if (!user) return null

  // Verificación de permisos
  if (
    (activeTab === 'clients' && user.rol !== 'ADMIN') ||
    (activeTab === 'services' && user.rol !== 'ADMIN') ||
    (activeTab === 'settings' && user.rol !== 'ADMIN')
  ) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400">
        No tienes permisos para ver esta sección
      </div>
    )
  }

  switch (activeTab) {
    case 'dashboard':
      return <DashboardView />
    case 'appointments':
      return <AppointmentsView />
    case 'clients':
      return <ClientsView />
    case 'services':
      return <ServicesView />
    case 'settings':
      return <SettingsView />
    default:
      return <DashboardView />
  }
}