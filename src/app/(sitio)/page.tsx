'use client'

import { Parallax } from 'react-parallax'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Oswald, Bebas_Neue, Anton } from 'next/font/google'
import { useState, useEffect } from 'react'
import { Star, Scissors, Users, Award, Clock, Shield, Calendar, MessageCircle } from 'lucide-react'

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

interface Review {
  nombre_cliente: string
  mensaje: string
  calificacion: number
  fecha_creacion: string
}

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews')
        const data = await response.json()
        setReviews(data)
      } catch (error) {
        console.error('Error al cargar reseñas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const slides = [
    {
      id: 1,
      title: 'Pasión y Estilo',
      subtitle: 'Tu barbería de confianza',
      img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      cta: 'Reserva ahora',
      href: '/citas',
    },
    {
      id: 2,
      title: 'Cortes Clásicos',
      subtitle: 'Técnicas tradicionales con toque moderno',
      img: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      cta: 'Nuestros servicios',
      href: '/servicios',
    },
    {
      id: 3,
      title: 'Club de Fidelidad',
      subtitle: 'Beneficios exclusivos para clientes frecuentes',
      img: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      cta: 'Únete al club',
      href: '/registro',
    },
  ]

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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
          }`}
      />
    ))
  }

  const features = [
    {
      icon: <Scissors className="w-8 h-8" />,
      title: "Técnicas Clásicas",
      description: "Dominamos los estilos tradicionales con técnicas modernas para crear looks únicos",
      stats: "5+ años de experiencia"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Barberos Expertos",
      description: "Profesionales certificados con pasión por el arte barberil y atención personalizada",
      stats: "2 barberos especialistas"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Productos Premium",
      description: "Utilizamos productos de alta calidad para garantizar los mejores resultados",
      stats: "Marcas reconocidas mundialmente"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Horarios Flexibles",
      description: "Abiertos 7 días a la semana con citas disponibles en horarios convenientes",
      stats: "Lun-Dom: 9:00 AM - 8:00 PM"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Ambiente Seguro",
      description: "Instalaciones sanitizadas y protocolos de seguridad para tu tranquilidad",
      stats: "100% higienizado"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Satisfacción Garantizada",
      description: "Tu satisfacción es nuestra prioridad, si no quedas conforme, lo arreglamos",
      stats: "98% clientes satisfechos"
    }
  ]

  return (
    <main className={`bg-[#0a0a0a] text-white relative ${barberFont.variable} ${vintageFont.variable}`}>
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          renderBullet: (_, className) => {
            return `<span class="${className} bg-red-600 opacity-80 hover:opacity-100 transition-opacity duration-300"></span>`
          }
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        loop
        speed={1000}
        className="h-screen"
      >
        {slides.map(({ id, title, subtitle, img, cta, href }) => (
          <SwiperSlide key={id}>
            <Parallax
              bgImage={img}
              strength={500}
              bgImageStyle={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
                filter: 'brightness(0.6) contrast(1.1)'
              }}
            >
              <div className="h-screen w-full flex flex-col justify-center items-center text-center px-4 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-0" />

                <motion.div
                  className="relative z-10 max-w-4xl mx-auto"
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                >
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-4 tracking-tight leading-tight font-barber">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
                      {title}
                    </span>
                  </h1>
                  <p className="text-xl md:text-2xl lg:text-3xl font-light mb-8 text-gray-200 font-vintage">
                    {subtitle}
                  </p>

                  <Link href={href}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 bg-gradient-to-r from-red-700 to-blue-700 hover:from-red-600 hover:to-blue-600 text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-red-500/20"
                    >
                      {cta}
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            </Parallax>
          </SwiperSlide>
        ))}

        <div className="swiper-button-next after:text-red-500 hover:after:text-red-400" />
        <div className="swiper-button-prev after:text-red-500 hover:after:text-red-400" />
      </Swiper>

      {/* Sección de servicios mejorada */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-barber">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
              Por qué elegir Pasión y Estilo
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-vintage">
            Más que una barbería, somos artistas del cabello comprometidos con tu imagen
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-red-600 transition-all duration-300 group"
            >
              <div className="text-red-500 mb-4 group-hover:text-red-400 transition-colors duration-300">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white font-barber">{item.title}</h3>
              <p className="text-gray-400 font-vintage mb-4">{item.description}</p>
              <div className="text-sm text-red-400 font-medium">{item.stats}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sección de estadísticas */}
      <section className="py-16 bg-gradient-to-r from-red-900/20 to-blue-900/20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "100+", label: "Clientes Satisfechos" },
              { number: "5+", label: "Años de Experiencia" },
              { number: "2", label: "Barberos Expertos" },
              { number: "98%", label: "Satisfacción Garantizada" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-barber">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-blue-400">
                    {stat.number}
                  </span>
                </div>
                <p className="text-gray-300 font-vintage">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de servicios destacados */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-barber">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
              Servicios Estrella
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-vintage">
            Descubre nuestros servicios más populares y demandados
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Corte Clásico",
              price: "$150",
              description: "Corte tradicional con tijera y navaja, incluye lavado y peinado",
              duration: "45 min",
              popular: true
            },
            {
              name: "Barba Completa",
              price: "$100",
              description: "Recorte, perfilado y hidratación de barba con productos premium",
              duration: "30 min",
              popular: false
            },
            {
              name: "Corte + Barba",
              price: "$220",
              description: "Paquete completo: corte de cabello y arreglo de barba",
              duration: "60 min",
              popular: true
            }
          ].map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative bg-gray-800/50 p-8 rounded-xl border transition-all duration-300 group ${service.popular
                ? 'border-red-500 shadow-lg shadow-red-500/20'
                : 'border-gray-700 hover:border-red-600'
                }`}
            >
              {service.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-red-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    Más Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2 text-white font-barber">{service.name}</h3>
                <div className="text-3xl font-bold text-red-400 mb-4">{service.price}</div>
                <p className="text-gray-400 mb-4 font-vintage">{service.description}</p>
                <div className="text-sm text-blue-400 mb-6">⏱️ {service.duration}</div>

                <Link href="/citas">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 bg-gradient-to-r from-red-700 to-blue-700 hover:from-red-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300"
                  >
                    Reservar Cita
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/servicios">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border-2 border-red-600 text-red-400 hover:bg-red-600 hover:text-white font-medium rounded-full transition-all duration-300"
            >
              Ver Todos los Servicios
            </motion.button>
          </Link>
        </div>
      </section>

      {/* Sección sobre nosotros */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-barber">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
                  Nuestra Historia
                </span>
              </h2>
              <p className="text-gray-300 text-lg mb-6 font-vintage leading-relaxed">
                Pasión y Estilo nació del amor por el arte barberil tradicional. Con más de 5 años
                de experiencia, hemos perfeccionado técnicas clásicas combinándolas con tendencias modernas.
              </p>
              <p className="text-gray-300 text-lg mb-8 font-vintage leading-relaxed">
                Cada corte es una obra de arte personalizada. Nuestro compromiso es hacer que cada
                cliente se sienta único y confiado con su nuevo estilo.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2">100%</div>
                  <p className="text-gray-400 text-sm">Productos Premium</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
                  <p className="text-gray-400 text-sm">Reservas Online</p>
                </div>
              </div>

              <Link href="/contacto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-red-700 to-blue-700 hover:from-red-600 hover:to-blue-600 text-white font-medium rounded-full transition-all duration-300"
                >
                  Conoce Más
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src="/nuestra-historia.jpg"
                  alt="Barbería Pasión y Estilo"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-red-600 to-blue-600 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-blue-600 to-red-600 rounded-full opacity-20 blur-xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sección de proceso */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-barber">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
              Tu Experiencia Paso a Paso
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-vintage">
            Desde la reserva hasta el resultado final, cada paso está pensado para ti
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: "01",
              title: "Reserva",
              description: "Agenda tu cita online o por teléfono en el horario que mejor te convenga",
              icon: Calendar,
              colors: "from-blue-500 to-blue-700", // Azul para organización/tiempo
              glowColor: "shadow-blue-500/25"
            },
            {
              step: "02",
              title: "Consulta",
              description: "Conversamos sobre el estilo que deseas y te asesoramos profesionalmente",
              icon: MessageCircle,
              colors: "from-green-500 to-green-700", // Verde para comunicación/diálogo
              glowColor: "shadow-green-500/25"
            },
            {
              step: "03",
              title: "Servicio",
              description: "Disfrutas de un servicio premium con productos de alta calidad",
              icon: Scissors,
              colors: "from-red-500 to-red-700", // Rojo para acción/corte
              glowColor: "shadow-red-500/25"
            },
            {
              step: "04",
              title: "Resultado",
              description: "Sales con un look increíble y la confianza renovada",
              icon: Star,
              colors: "from-yellow-400 to-orange-500", // Dorado para éxito/premio
              glowColor: "shadow-yellow-500/25"
            }
          ].map((item, index) => {
            const IconComponent = item.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-red-600 to-blue-600"></div>
                )}

                {/* Contenedor del ícono con estilo profesional */}
                <div className="mb-4 flex justify-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.colors} rounded-full flex items-center justify-center shadow-lg ${item.glowColor} transform hover:scale-110 transition-all duration-300 hover:shadow-xl`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div className="text-4xl font-bold text-red-400 mb-2 font-barber">{item.step}</div>
                <h3 className="text-xl font-bold text-white mb-3 font-barber">{item.title}</h3>
                <p className="text-gray-400 font-vintage">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-red-900/30 to-blue-900/30 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 font-barber">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
                ¿Listo para tu Transformación?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 font-vintage">
              No esperes más para lucir increíble. Reserva tu cita hoy y descubre la diferencia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/citas">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-4 bg-gradient-to-r from-red-700 to-blue-700 hover:from-red-600 hover:to-blue-600 text-white text-lg font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-red-500/30"
                >
                  Reservar Ahora
                </motion.button>
              </Link>

              <Link href="/contacto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-4 border-2 border-red-600 text-red-400 hover:bg-red-600 hover:text-white text-lg font-bold rounded-full transition-all duration-300"
                >
                  Contáctanos
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sección de reseñas */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-barber">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
                Lo que dicen nuestros clientes
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-vintage">
              La satisfacción de nuestros clientes es nuestro mayor orgullo
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 animate-pulse"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-600 rounded-full mr-4"></div>
                    <div>
                      <div className="h-4 bg-gray-600 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-600 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-600 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-red-600 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-blue-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-lg">
                        {review.nombre_cliente.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{review.nombre_cliente}</h4>
                      <p className="text-gray-400 text-sm">{review.fecha_creacion}</p>
                    </div>
                  </div>

                  <div className="flex mb-3">
                    {renderStars(review.calificacion)}
                  </div>

                  <p className="text-gray-300 italic font-vintage leading-relaxed">
                    "{review.mensaje}"
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && reviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                Próximamente verás aquí las reseñas de nuestros clientes satisfechos
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/propinas">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-red-700 to-blue-700 hover:from-red-600 hover:to-blue-600 text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-red-500/20"
              >
                Deja tu reseña
              </motion.button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}