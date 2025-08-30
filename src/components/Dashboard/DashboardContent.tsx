'use client'

import { useUser } from '../../app/hooks/useUser'
import DashboardView from './DashboardView'
import AppointmentsView from './Appointment/AppointmentsView'
import ClientsView from './ClientsView'
import ServicesView from './Services/ServicesView'
import SettingsView from './Settings/SettingsView'

export default function DashboardContent({ activeTab }: { activeTab: string }) {
  const { user } = useUser()

  if (!user) return null

  // Verificación de permisos
  if (
    (activeTab === 'clients' && user.rol !== 'ADMIN') ||
    (activeTab === 'services' && user.rol !== 'ADMIN') ||
    (activeTab === 'settings' && user.rol !== 'ADMIN' && user.rol !== 'BARBERO')
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