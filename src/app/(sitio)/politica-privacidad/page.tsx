'use client'

import { motion } from 'framer-motion'
import { fadeIn, staggerContainer } from '../../../lib/motion'
import { Lock } from 'lucide-react'

export default function PrivacyPage() {
  const privacyPolicies = [
    {
      title: "Recopilación de Información",
      content: "Recopilamos información personal como nombre, correo electrónico, número de teléfono y preferencias de servicio cuando realiza una reservación o se registra en nuestro sistema."
    },
    {
      title: "Uso de la Información",
      content: "Utilizamos su información para gestionar reservaciones, personalizar su experiencia, enviar recordatorios de citas y, con su consentimiento, ofertas promocionales."
    },
    {
      title: "Protección de Datos",
      content: "Implementamos medidas de seguridad físicas, electrónicas y administrativas para proteger su información personal contra acceso no autorizado o divulgación."
    },
    {
      title: "Compartir Información",
      content: "No vendemos ni compartimos su información personal con terceros, excepto proveedores de servicios esenciales (como software de reservaciones) que cumplen con nuestra política de privacidad."
    },
    {
      title: "Derechos del Usuario",
      content: "Puede solicitar acceso, corrección o eliminación de sus datos personales en cualquier momento contactándonos directamente."
    },
    {
      title: "Cookies y Tecnologías Similares",
      content: "Nuestro sitio web utiliza cookies para mejorar la experiencia del usuario. Puede gestionar sus preferencias de cookies en la configuración de su navegador."
    },
    {
      title: "Menores de Edad",
      content: "No recopilamos intencionalmente información de menores de 13 años. Los servicios para menores deben ser gestionados por sus padres o tutores legales."
    },
    {
      title: "Cambios en la Política",
      content: "Nos reservamos el derecho de actualizar esta política. Los cambios significativos serán comunicados a nuestros clientes a través de nuestro sitio web o correo electrónico."
    }
  ]

  return (
    <motion.main
      variants={staggerContainer(0.1, 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20"
    >
      <motion.div
        variants={fadeIn('up', 'spring', 0.2, 1)}
        className="text-center mb-10 sm:mb-16"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          Política de Privacidad
        </h1>
        <p className="text-base sm:text-lg text-gray-300">
          Cómo protegemos y utilizamos su información personal
        </p>
      </motion.div>

      <div className="space-y-6 sm:space-y-10">
        {privacyPolicies.map((policy, index) => (
          <motion.div
            key={index}
            variants={fadeIn('up', 'spring', index * 0.1, 1)}
            className="bg-gray-900/80 p-5 sm:p-6 md:p-8 rounded-lg sm:rounded-xl border-l-4 border-red-500"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-purple-400 flex items-center">
              <Lock size={20} className="mr-2 sm:mr-3 text-purple-400" /> {/* ← reemplazo del emoji */}
              {policy.title}
            </h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              {policy.content}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={fadeIn('up', 'spring', 0.8, 1)}
        className="mt-12 sm:mt-16 p-5 sm:p-6 bg-gray-900 rounded-lg text-center"
      >
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">
          ¿Preguntas sobre tu privacidad?
        </h3>
        <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
          Nuestro equipo está disponible para aclarar cualquier duda en <span className="text-purple-400">privacidad@barberia.com</span>
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2 sm:px-6 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/30 text-sm sm:text-base"
        >
          Contactar al Oficial de Privacidad
        </motion.button>
      </motion.div>
    </motion.main>
  )
}