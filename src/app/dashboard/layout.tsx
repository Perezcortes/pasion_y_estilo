import type { Metadata } from 'next'
import DashboardWrapper from './DashboardWrapper'

export const metadata: Metadata = {
  title: 'Dashboard | Pasión y Estilo',
  description: 'Panel de control de la barbería',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardWrapper>{children}</DashboardWrapper>
}
