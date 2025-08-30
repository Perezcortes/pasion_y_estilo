'use client'

import { motion } from 'framer-motion'
import { Oswald, Anton } from 'next/font/google'
import { 
  FaWhatsapp, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock,
  FaInstagram,
  FaFacebookF,
  FaTiktok
} from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

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

type FormData = {
  name: string
  email: string
  phone: string
  message: string
}

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut" as const
    }
  }
}

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/contacto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Mensaje enviado con éxito', {
          position: 'bottom-center',
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #e53e3e'
          }
        })
        reset()
      } else {
        throw new Error('Error al enviar el mensaje')
      }
    } catch (error) {
      toast.error('Error al enviar el mensaje', {
        position: 'bottom-center',
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #e53e3e'
        }
      })
      console.error(error)
    }
  }

  return (
    <main className={`bg-[#0a0a0a] text-white min-h-screen ${barberFont.variable} ${vintageFont.variable}`}>
      {/* Hero Section */}
      <section className="relative h-96 md:h-screen/2 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('/slider/slide2.jpg')] bg-cover bg-center filter brightness-50 contrast-110"
          style={{ backgroundPosition: 'center 30%' }}
        />

        <motion.div
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 tracking-tight leading-tight font-barber">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
              Contacto
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-vintage">
            Estamos aquí para atenderte y responder todas tus preguntas
          </p>
        </motion.div>
      </section>

      {/* Contact Content */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gray-900/50 p-8 rounded-xl border border-gray-700"
          >
            <h2 className="text-3xl font-bold mb-6 font-barber">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
                Envíanos un mensaje
              </span>
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-300 mb-2 font-vintage">Nombre</label>
                <input
                  id="name"
                  type="text"
                  {...register('name', { required: 'Este campo es requerido' })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                />
                {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-gray-300 mb-2 font-vintage">Email</label>
                  <input
                    id="email"
                    type="email"
                    {...register('email', {
                      required: 'Este campo es requerido',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email inválido'
                      }
                    })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                  />
                  {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-gray-300 mb-2 font-vintage">Teléfono</label>
                  <input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-300 mb-2 font-vintage">Mensaje</label>
                <textarea
                  id="message"
                  rows={5}
                  {...register('message', { required: 'Este campo es requerido' })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                ></textarea>
                {errors.message && <p className="mt-1 text-red-500 text-sm">{errors.message.message}</p>}
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-700 to-blue-700 hover:from-red-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/20"
              >
                Enviar Mensaje
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold mb-6 font-barber">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
                  Información de Contacto
                </span>
              </h2>
              <p className="text-gray-300 mb-8 font-vintage">
                Estamos disponibles para responder tus preguntas y agendar citas. No dudes en contactarnos por cualquier medio.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="text-red-600 mt-1">
                  <FaWhatsapp className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white font-barber">WhatsApp</h3>
                  <a
                    href="https://wa.me/9531861790"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-red-500 transition-colors font-vintage"
                  >
                    +52 953 186 1790
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-red-600 mt-1">
                  <FaEnvelope className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white font-barber">Email</h3>
                  <a
                    href="mailto:contacto@barberia.com"
                    className="text-gray-400 hover:text-red-500 transition-colors font-vintage"
                  >
                    contacto@barberia.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-red-600 mt-1">
                  <FaMapMarkerAlt className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white font-barber">Dirección</h3>
                  <p className="text-gray-400 font-vintage">
                    Calle 16 de septiembre #6,<br />
                    Colonia Centro, Huajuapan de León
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-red-600 mt-1">
                  <FaClock className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white font-barber">Horario</h3>
                  <p className="text-gray-400 font-vintage">
                    Lunes a Viernes: 8:00 AM - 9:00 PM<br />
                    Sábados: 8:00 AM - 9:00 PM<br />
                    Domingos: Varia el horario
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-xl font-semibold mb-4 text-white font-barber">Redes Sociales</h3>
              <div className="flex gap-4">
                {[
                  { name: 'Instagram', icon: <FaInstagram className="text-xl" />, url: 'https://www.instagram.com/pasionyestilo_2020?igsh=MWpwd2hueXk0bGxxOA==' },
                  { name: 'Facebook', icon: <FaFacebookF className="text-xl" />, url: 'https://www.facebook.com/share/1B3XsPEhgj/' },
                  { name: 'TikTok', icon: <FaTiktok className="text-xl" />, url: 'https://www.facebook.com/share/1B3XsPEhgj/' }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3 }}
                    className="bg-gray-800 hover:bg-gray-700 border border-gray-700 w-12 h-12 rounded-full flex items-center justify-center text-red-500 hover:text-red-400 transition-colors duration-300"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center font-barber">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
              Ubicación
            </span>
          </h2>

          <div className="rounded-xl overflow-hidden border border-gray-700 shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!4v1753671819714!6m8!1m7!1szccXpkPt1inWJVKkDS1EqQ!2m2!1d17.80895392231129!2d-97.7771466822283!3f167.40939071553498!4f-9.127429858537269!5f0.7820865974627469"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full filter grayscale-50 contrast-110 brightness-90"
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  )
}