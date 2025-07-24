import '../../globals.css' 
import { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
