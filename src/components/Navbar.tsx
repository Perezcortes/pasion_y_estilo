'use client'

import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, User, LogOut, UserCircle, Settings, Calendar, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Anton, Oswald } from 'next/font/google'

// Configuración de fuentes
const barberFont = Oswald({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
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
      setScrolled(window.scrollY > 20)
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
    { name: 'CITAS', href: 'citas', special: true },
    { name: 'BLOG', href: '#blog' },
    { name: 'CONTACTO', href: 'contacto' },
  ]

  const mostrarMenuCliente = user?.rol === 'CLIENTE' || user?.rol === '1'

  return (
    <>
      {/* Backdrop blur effect */}
      <div 
        className={`fixed top-0 left-0 w-full h-20 z-40 transition-all duration-500 ${
          scrolled ? 'bg-black/20 backdrop-blur-md' : 'bg-transparent'
        }`}
      />
      
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${barberFont.variable} ${vintageFont.variable}`}
      >
        {/* Gradient border effect */}
        <div className={`absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent transition-opacity duration-500 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`} />
        
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo mejorado */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-blue-500 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                <Image 
                  src="/logo.png" 
                  alt="Logo" 
                  width={44} 
                  height={44} 
                  className="relative h-11 w-11 rounded-full border-2 border-white/20" 
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white text-xl font-bold tracking-wider font-barber leading-tight">
                  PASIÓN Y ESTILO
                </span>
                <span className="text-red-400/80 text-xs font-medium tracking-widest font-barber">
                  BARBERSHOP
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Navigation Links mejorados */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className={`relative px-4 py-2 mx-1 text-sm font-semibold uppercase tracking-wider transition-all duration-300 group font-barber ${
                    link.special 
                      ? 'text-white bg-gradient-to-r from-red-600 to-red-700 rounded-full hover:from-red-500 hover:to-red-600 shadow-lg hover:shadow-red-500/25' 
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {!link.special && (
                    <>
                      {/* Hover effect line */}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-blue-500 group-hover:w-full transition-all duration-300" />
                      {/* Glow effect */}
                      <span className="absolute inset-0 bg-white/5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </>
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* User Menu mejorado */}
          <div className="flex items-center space-x-4">
            {mostrarMenuCliente && user ? (
              <div className="relative" ref={menuRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSubmenuOpen(!submenuOpen)}
                  className="flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-full text-white transition-all duration-300 font-barber font-semibold uppercase tracking-wider border border-white/10 shadow-lg hover:shadow-xl"
                >
                  <div className="relative">
                    <UserCircle size={20} className="text-blue-400" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800" />
                  </div>
                  <span className="text-sm">{user.nombre.split(' ')[0]}</span>
                  <motion.div
                    animate={{ rotate: submenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {submenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-3 w-52 bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl py-2 z-50 overflow-hidden"
                    >
                      {/* Header del menú */}
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-white font-semibold text-sm font-barber">{user.nombre}</p>
                        <p className="text-gray-400 text-xs">{user.rol === 'CLIENTE' ? 'Cliente' : 'Usuario'}</p>
                      </div>
                      
                      {/* Menu items */}
                      {[
                        { icon: User, label: 'MI PERFIL', href: '/perfil' },
                        { icon: Calendar, label: 'MIS CITAS', href: '/citas' },
                        { icon: Settings, label: 'CONFIGURACIÓN', href: '/configuracion' }
                      ].map((item, index) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setSubmenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors duration-200 group"
                          >
                            <item.icon size={16} className="text-blue-400 group-hover:text-blue-300" />
                            <span className="font-barber font-medium">{item.label}</span>
                          </Link>
                        </motion.div>
                      ))}
                      
                      {/* Logout button */}
                      <div className="border-t border-white/10 mt-2 pt-2">
                        <motion.button
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 }}
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full transition-colors duration-200 group"
                        >
                          <LogOut size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                          <span className="font-barber font-medium">CERRAR SESIÓN</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-500 hover:to-blue-500 rounded-full text-white transition-all duration-300 font-barber font-semibold uppercase tracking-wider shadow-lg hover:shadow-xl border border-white/10"
                >
                  <User size={16} />
                  <span className="text-sm">INGRESAR</span>
                </Link>
              </motion.div>
            )}

            {/* Mobile menu button */}
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu} 
              className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu mejorado */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden bg-black/95 backdrop-blur-md border-t border-white/10 overflow-hidden"
            >
              <div className="px-6 py-6 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-lg transition-all duration-300 font-barber font-semibold uppercase tracking-wider ${
                        link.special
                          ? 'text-white bg-gradient-to-r from-red-600 to-red-700 text-center'
                          : 'text-white hover:bg-white/5 hover:translate-x-2'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                {/* User section en mobile */}
                <div className="pt-4 mt-4 border-t border-white/10">
                  {mostrarMenuCliente && user ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-center"
                    >
                      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-4 mb-3">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <UserCircle size={20} className="text-blue-400" />
                          <span className="text-white font-semibold font-barber">
                            ¡HOLA, {user.nombre.split(' ')[0].toUpperCase()}!
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs">Cliente activo</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Link
                        href="/login"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-500 hover:to-blue-500 rounded-lg transition-colors duration-300 font-barber font-semibold uppercase tracking-wider"
                        onClick={() => setIsOpen(false)}
                      >
                        <User size={16} />
                        <span>INGRESAR</span>
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}