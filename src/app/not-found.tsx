'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Scissors, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Fondo con efecto de degradado */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-indigo-900/10 to-black z-0" />
      
      {/* Patrón de fondo sutil */}
      <div className="absolute inset-0 opacity-5 z-0" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54 20H40V6h-4v14H6v4h30v14h4V24h14v-4z\' fill=\'%23ffffff\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
      }} />

      <motion.div 
        className="relative z-10 text-center max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative w-20 h-20">
            <Image
              src="/logo.png"
              alt="Pasión y Estilo Barbería"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Icono de tijeras animado */}
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            y: [0, -10, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut"
          }}
          className="mb-6"
        >
          <Scissors className="w-16 h-16 mx-auto text-indigo-400" />
        </motion.div>

        {/* Texto principal */}
        <h1 className="text-6xl md:text-8xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-6">¡Ups! Página no encontrada</h2>
        <p className="text-lg text-gray-300 mb-8">
          Parece que lo que buscabas ya no está disponible. Pero no te preocupes, 
          podemos llevarte de vuelta.
        </p>

        {/* Botón para volver al inicio */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-indigo-500/30"
          >
            <ArrowLeft size={18} />
            Volver al inicio
          </Link>
        </motion.div>

        {/* Enlaces rápidos */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {[
            { name: 'Servicios', href: '#servicios' },
            { name: 'Citas', href: '#citas' },
            { name: 'Blog', href: '#blog' },
            { name: 'Contacto', href: '#contacto' }
          ].map((link, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={link.href}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-300"
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Efecto de esquinas decorativas */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-indigo-400 opacity-30 z-0" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-indigo-400 opacity-30 z-0" />
    </div>
  )
}