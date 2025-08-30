'use client'

import { Facebook, Instagram, Mail, Phone, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Footer() {
  const socialLinks = [
    {
      icon: <Facebook className="hover:text-blue-500 transition" />,
      href: "https://www.facebook.com/share/1B3XsPEhgj/",
      label: "Facebook"
    },
    {
      icon: <Instagram className="hover:text-pink-500 transition" />,
      href: "https://www.instagram.com/pasionyestilo_2020?igsh=MWpwd2hueXk0bGxxOA==",
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
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={footerVariants}
      >
        <motion.div variants={itemVariants} className="md:col-span-1">
          <h3 className="text-2xl font-bold mb-5">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-indigo-600">
              Pasión<span className="text-white">&</span>Estilo
            </span>
          </h3>
          <p className="text-gray-400 mb-6">
            La barbería de lujo que redefine la experiencia masculina con tecnología de vanguardia y atención personalizada.
          </p>
          <div className="flex gap-4">
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
                  className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors duration-300"
                >
                  {link.icon}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h4 className="text-xl font-semibold mb-6 text-gray-200">Horario</h4>
          <ul className="space-y-4 text-gray-400">
            <li className="flex items-center gap-3">
              <Clock size={20} className="text-indigo-400" />
              <span>Lunes - Viernes: 8:00 - 21:00</span>
            </li>
            <li className="flex items-center gap-3">
              <Clock size={20} className="text-indigo-400" />
              <span>Sábados: 8:00 - 21:00</span>
            </li>
            <li className="flex items-center gap-3">
              <Clock size={20} className="text-indigo-400" />
              <span>Domingos: Varia el horario</span>
            </li>
          </ul>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h4 className="text-xl font-semibold mb-6 text-gray-200">Contacto</h4>
          <ul className="space-y-4 text-gray-400">
            <li className="flex items-center gap-3">
              <MapPin size={20} className="text-indigo-400" />
              <span>Calle 16 de Septiembre Huajuapan de León</span>
            </li>
            <li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
              <Phone size={20} className="text-indigo-400" />
              <span>+52 953 186 1790</span>
            </li>
            <li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
              <Mail size={20} className="text-indigo-400" />
              <span>contacto@pasionyestilo.com</span>
            </li>
          </ul>
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