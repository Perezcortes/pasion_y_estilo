'use client'

import { motion } from 'framer-motion'
import { fadeIn, staggerContainer } from '../../../lib/motion'
import { Scissors } from 'lucide-react'

export default function TermsPage() {
  const terms = [
    {
      title: "Reservaciones y Cancelaciones",
      content: "Todas las reservaciones requieren un depósito no reembolsable del 50%. Cancelaciones con menos de 24 horas de anticipación incurrirán en el cobro total del servicio."
    },
    {
      title: "Política de Llegada Tarde",
      content: "Clientes con más de 15 minutos de retraso perderán su reservación y el depósito. Llegadas tardías podrán recibir servicio reducido para no afectar otras citas."
    },
    {
      title: "Garantía de Servicio",
      content: "Garantizamos nuestro trabajo por 7 días. Si no está satisfecho, ofrecemos ajustes gratuitos dentro de este período presentando su recibo original."
    },
    {
      title: "Política de Niños",
      content: "Atendemos niños mayores de 12 años. Menores de edad deben estar acompañados por un adulto responsable durante todo el servicio."
    },
    {
      title: "Productos y Alergias",
      content: "Informe a su barbero sobre alergias o condiciones médicas antes del servicio. No nos hacemos responsables por reacciones alérgicas no comunicadas."
    },
    {
      title: "Propinas",
      content: "Las propinas son apreciadas pero no obligatorias. El 100% de las propinas van directamente a su estilista."
    },
    {
      title: "Objetos de Valor",
      content: "No nos hacemos responsables por artículos personales perdidos o dañados dentro del establecimiento."
    },
    {
      title: "Comportamiento",
      content: "Reservamos el derecho de negar servicio a clientes bajo influencia de alcohol/drogas o comportamiento inapropiado."
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
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-purple-600">
          Términos y Condiciones
        </h1>
        <p className="text-base sm:text-lg text-gray-300">
          Por favor lea detenidamente nuestros términos de servicio
        </p>
      </motion.div>

      <div className="space-y-6 sm:space-y-10">
        {terms.map((term, index) => (
          <motion.div
            key={index}
            variants={fadeIn('up', 'spring', index * 0.1, 1)}
            className="bg-gray-900/80 p-5 sm:p-6 md:p-8 rounded-lg sm:rounded-xl border-l-4 border-blue-500"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-red-400 flex items-center gap-2">
              <Scissors className="w-5 h-5 text-red-400" />
              {term.title}
            </h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              {term.content}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={fadeIn('up', 'spring', 0.8, 1)}
        className="mt-12 sm:mt-16 p-5 sm:p-6 bg-gray-900 rounded-lg text-center"
      >
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">
          ¿Tienes preguntas sobre nuestros términos?
        </h3>
        <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
          Contáctanos en <span className="text-blue-400">contacto@barberia.com</span> o al <span className="text-blue-400">+52 953 123 4567</span>
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2 sm:px-6 sm:py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-red-500/30 text-sm sm:text-base"
        >
          Contactar Ahora
        </motion.button>
      </motion.div>
    </motion.main>
  )
}
