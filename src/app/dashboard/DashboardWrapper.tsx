'use client'

import { AuthProvider } from '../../context/AuthContext'
import { SidebarProvider } from '../../context/SidebarContext'

export default function DashboardWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-gray-900 text-gray-100">
          {children}
        </div>
      </SidebarProvider>
    </AuthProvider>
  )
}
