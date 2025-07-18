'use client'

import { Facebook, Instagram, Mail, Phone, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Footer() {
  const socialLinks = [
    {
      icon: <Facebook className="hover:text-blue-500 transition" />,
      href: "https://facebook.com",
      label: "Facebook"
    },
    {
      icon: <Instagram className="hover:text-pink-500 transition" />,
      href: "https://instagram.com",
      label: "Instagram"
    },
    {
      icon: <Mail className="hover:text-indigo-400 transition" />,
      href: "mailto:contacto@pasionyestilo.com",
      label: "Email"
    }
  ]

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <footer className="bg-neutral-900 text-white py-16 px-6 md:px-8">
      <motion.div 
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={footerVariants}
      >
        <motion.div variants={itemVariants}>
          <h3 className="text-2xl font-bold mb-5">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-indigo-600">
              Pasión<span className="text-white">&</span>Estilo
            </span>
          </h3>
          <p className="text-gray-400 mb-4">
            La barbería de lujo que redefine la experiencia masculina con tecnología de vanguardia y atención personalizada.
          </p>
          <div className="flex gap-4 mt-6">
            {socialLinks.map((link, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href={link.href} 
                  target="_blank" 
                  aria-label={link.label}
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors duration-300"
                >
                  {link.icon}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h4 className="text-lg font-semibold mb-5 text-gray-200">Horario</h4>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-center gap-3">
              <Clock size={18} className="text-indigo-400" />
              Lunes - Viernes: 9:00 - 20:00
            </li>
            <li className="flex items-center gap-3">
              <Clock size={18} className="text-indigo-400" />
              Sábados: 10:00 - 18:00
            </li>
            <li className="flex items-center gap-3">
              <Clock size={18} className="text-indigo-400" />
              Domingos: Cerrado
            </li>
          </ul>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h4 className="text-lg font-semibold mb-5 text-gray-200">Contacto</h4>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-center gap-3">
              <MapPin size={18} className="text-indigo-400" />
              Av. Luxury 123, Ciudad Elegante
            </li>
            <li className="flex items-center gap-3 hover:text-white transition-colors">
              <Phone size={18} className="text-indigo-400" />
              +52 953 000 0000
            </li>
            <li className="flex items-center gap-3 hover:text-white transition-colors">
              <Mail size={18} className="text-indigo-400" />
              contacto@pasionyestilo.com
            </li>
          </ul>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h4 className="text-lg font-semibold mb-5 text-gray-200">Newsletter</h4>
          <p className="text-gray-400 mb-4">
            Suscríbete para recibir promociones exclusivas y consejos de estilo.
          </p>
          <form className="flex flex-col gap-3">
            <input 
              type="email" 
              placeholder="Tu email" 
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              required
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded transition-all duration-300"
            >
              Suscribirse
            </button>
          </form>
        </motion.div>
      </motion.div>

      <div className="max-w-7xl mx-auto border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()} Pasión y Estilo. Todos los derechos reservados. | 
          <Link href="/politica-privacidad" className="hover:text-gray-300 ml-2">Políticas de Privacidad</Link> | 
          <Link href="/terminos-y-condiciones" className="hover:text-gray-300 ml-2">Términos de Servicio</Link>
        </p>
      </div>
    </footer>
  )
}