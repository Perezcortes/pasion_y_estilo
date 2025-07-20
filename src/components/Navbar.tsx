'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, User, LogOut, UserCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [nombreCliente, setNombreCliente] = useState<string | null>(null)
  const [submenuOpen, setSubmenuOpen] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    const nombre = localStorage.getItem('nombre')
    const rol = localStorage.getItem('rol')

    if (rol === '1' && nombre) {
      setNombreCliente(nombre)
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
    localStorage.removeItem('token')
    localStorage.removeItem('nombre')
    localStorage.removeItem('rol')
    window.location.href = '/' // O puedes usar router.push('/')
  }

  const toggleMenu = () => setIsOpen(!isOpen)

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Citas', href: '#citas' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contacto', href: '#contacto' },
  ]

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur' : 'bg-transparent'} shadow-sm`}>
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <span className="text-white font-bold text-xl">Pasión y Estilo</span>
        </Link>

        <div className="hidden md:flex space-x-6">
          {navLinks.map(link => (
            <Link key={link.name} href={link.href} className="text-white hover:text-indigo-400 transition-colors duration-200">
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center ml-6">
          {nombreCliente ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setSubmenuOpen(!submenuOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white transition-all duration-300"
              >
                <UserCircle size={20} />
                <span>{nombreCliente}</span>
              </button>

              {submenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link
                    href="/perfil"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    onClick={() => setSubmenuOpen(false)}
                  >
                    <User size={16} />
                    Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 w-full hover:bg-gray-100"
                  >
                    <LogOut size={16} />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white transition-all duration-300"
            >
              <User size={18} />
              <span>Ingresar</span>
            </Link>
          )}
        </div>

        <button onClick={toggleMenu} className="md:hidden text-white">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-black/90 backdrop-blur px-4 pt-4 pb-6"
          >
            {navLinks.map(link => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-white py-2"
              >
                {link.name}
              </Link>
            ))}

            {nombreCliente ? (
              <div className="mt-4 text-white font-semibold text-center">
                ¡Hola, {nombreCliente}!
              </div>
            ) : (
              <div className="mt-4">
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <User size={18} />
                  <span>Ingresar</span>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
