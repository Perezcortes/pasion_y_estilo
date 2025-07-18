'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '../../lib/utils'
import {
  Home,
  Users,
  CalendarDays,
  ShoppingBag,
  Settings,
  LogOut
} from 'lucide-react'

const navItems = [
  { label: 'Inicio', href: '/dashboard', icon: <Home size={18} /> },
  { label: 'Usuarios', href: '/dashboard/usuarios', icon: <Users size={18} /> },
  { label: 'Citas', href: '/dashboard/citas', icon: <CalendarDays size={18} /> },
  { label: 'Productos', href: '/dashboard/productos', icon: <ShoppingBag size={18} /> },
  { label: 'Configuración', href: '/dashboard/configuracion', icon: <Settings size={18} /> },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-800 p-4 border-r border-gray-700 hidden md:block">
      <h2 className="text-xl font-bold mb-6">Pasión y Estilo</h2>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md transition-colors',
              pathname === item.href
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
        <button
          className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 mt-8"
          onClick={() => {
            localStorage.removeItem('token')
            window.location.href = '/login'
          }}
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </nav>
    </aside>
  )
}
