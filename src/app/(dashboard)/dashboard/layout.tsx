import '../../globals.css' 
import { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}