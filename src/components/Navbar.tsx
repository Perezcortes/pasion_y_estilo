'use client'

import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, User, LogOut, UserCircle, Settings, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Anton, Oswald } from 'next/font/google'

// Configuración de fuentes
const barberFont = Oswald({ 
  subsets: ['latin'],
  weight: '700',
  variable: '--font-barber'
})

const vintageFont = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-vintage'
})

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [submenuOpen, setSubmenuOpen] = useState(false)
  const { user, setUser } = useAuth()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setSubmenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    const nombre = user?.nombre
    localStorage.removeItem('nombre')
    localStorage.removeItem('rol')
    setUser(null)
    setSubmenuOpen(false)

    toast.success(`Hasta luego, ${nombre}`, {
      icon: '👋',
      duration: 3000,
    })

    window.location.href = '/'
  }

  const toggleMenu = () => setIsOpen(!isOpen)

  const navLinks = [
    { name: 'INICIO', href: '/' },
    { name: 'SERVICIOS', href: 'servicios' },
    { name: 'CITAS', href: 'citas' },
    { name: 'BLOG', href: '#blog' },
    { name: 'CONTACTO', href: 'contacto' },
  ]

  const mostrarMenuCliente = user?.rol === 'CLIENTE' || user?.rol === '1'

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur' : 'bg-transparent'
      } shadow-sm ${barberFont.variable} ${vintageFont.variable}`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Logo" width={40} height={40} className="h-10 w-10" />
          <span className={`text-white text-xl tracking-wider font-barber`}>
            PASION Y ESTILO
          </span>
        </Link>

        <div className="hidden md:flex space-x-8">
          {navLinks.map(link => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-white hover:text-red-500 transition-colors duration-200 uppercase tracking-wider font-vintage ${
                link.name === 'CITAS' ? 'text-red-500' : ''
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center ml-6">
          {mostrarMenuCliente && user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setSubmenuOpen(!submenuOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-700 to-blue-700 hover:from-red-600 hover:to-blue-600 rounded-full text-white transition-all duration-300 font-vintage uppercase tracking-wider"
              >
                <UserCircle size={18} />
                <span>{user.nombre.split(' ')[0]}</span>
              </button>

              <AnimatePresence>
                {submenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg py-2 z-50"
                  >
                    <Link
                      href="/perfil"
                      onClick={() => setSubmenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-gray-800"
                    >
                      <User size={16} /> MI PERFIL
                    </Link>
                    <Link
                      href="/citas"
                      onClick={() => setSubmenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-gray-800"
                    >
                      <Calendar size={16} /> CITAS
                    </Link>
                    <Link
                      href="/configuracion"
                      onClick={() => setSubmenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-gray-800"
                    >
                      <Settings size={16} /> CONFIGURACIÓN
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 w-full hover:bg-gray-800"
                    >
                      <LogOut size={16} /> CERRAR SESIÓN
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-700 to-blue-700 hover:from-red-600 hover:to-blue-600 rounded-full text-white transition-all duration-300 font-vintage uppercase tracking-wider"
            >
              <User size={16} />
              <span>INGRESAR</span>
            </Link>
          )}
        </div>

        <button onClick={toggleMenu} className="md:hidden text-white">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-black/95 backdrop-blur px-4 pt-4 pb-6"
          >
            {navLinks.map(link => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block text-white py-3 uppercase tracking-wider font-vintage ${
                  link.name === 'CITAS' ? 'text-red-500' : ''
                }`}
              >
                {link.name}
              </Link>
            ))}

            {mostrarMenuCliente && user ? (
              <div className={`mt-4 text-white font-semibold text-center font-barber`}>
                ¡HOLA, {user.nombre.split(' ')[0].toUpperCase()}!
              </div>
            ) : (
              <div className="mt-4">
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-red-700 to-blue-700 hover:from-red-600 hover:to-blue-600 rounded-lg transition-colors duration-300 font-vintage uppercase tracking-wider"
                  onClick={() => setIsOpen(false)}
                >
                  <User size={16} />
                  <span>INGRESAR</span>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}