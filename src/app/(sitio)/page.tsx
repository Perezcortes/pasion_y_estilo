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

export default function Home() {
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

      {/* Sección de bienvenida */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-barber">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
              Arte y Tradición Barbera
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-vintage">
            Donde cada corte cuenta una historia y cada cliente es una obra de arte.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Técnicas Clásicas",
              description: "Dominamos los estilos tradicionales y modernos",
              icon: "💈"
            },
            {
              title: "Barberos Expertos",
              description: "Profesionales con años de experiencia en el arte barberil",
              icon: "✂️"
            },
            {
              title: "Productos Artesanales",
              description: "Línea exclusiva de productos para el cabello y barba",
              icon: "🧴"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-red-600 transition-all duration-300 group"
            >
              <div className="text-4xl mb-4 group-hover:text-red-500 transition-colors duration-300">{item.icon}</div>
              <h3 className="text-2xl font-bold mb-2 text-white font-barber">{item.title}</h3>
              <p className="text-gray-400 font-vintage">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sección de galería */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center font-barber">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
              Nuestros Trabajos
            </span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <motion.div
                key={item}
                whileHover={{ scale: 1.03 }}
                className="overflow-hidden rounded-lg shadow-lg"
              >
                <img
                  src={`/gallery/work-${item}.jpg`}
                  alt={`Trabajo de barbería ${item}`}
                  className="w-full h-48 md:h-64 object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}