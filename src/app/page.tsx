'use client'

import { Parallax } from 'react-parallax'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { motion } from 'framer-motion'

export default function Home() {
  const slides = [
    {
      id: 1,
      title: 'Pasión y Estilo',
      subtitle: 'Tu barbería futurista',
      img: '/slider/slide1.jpg',
      cta: 'Reserva ahora'
    },
    {
      id: 2,
      title: 'Cortes con Tecnología',
      subtitle: 'Experiencia moderna y única',
      img: '/slider/slide2.jpg',
      cta: 'Nuestros servicios'
    },
    {
      id: 3,
      title: 'Fidelidad y Premios',
      subtitle: 'Porque tu estilo merece reconocimiento',
      img: '/slider/slide3.jpg',
      cta: 'Únete al club'
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
    <main className="bg-[#0f0f0f] text-white relative">
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
            return `<span class="${className} bg-indigo-500 opacity-80 hover:opacity-100 transition-opacity duration-300"></span>`
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
        {slides.map(({ id, title, subtitle, img, cta }) => (
          <SwiperSlide key={id}>
            <Parallax
              bgImage={img}
              strength={500}
              bgImageStyle={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
                filter: 'brightness(0.7)'
              }}
            >
              <div className="h-screen w-full flex flex-col justify-center items-center text-center px-4 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-0" />

                <motion.div
                  className="relative z-10 max-w-4xl mx-auto"
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                >
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-4 tracking-tight leading-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-indigo-600">
                      {title}
                    </span>
                  </h1>
                  <p className="text-xl md:text-2xl lg:text-3xl font-light mb-8 text-gray-300">
                    {subtitle}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-indigo-500/30"
                  >
                    {cta}
                  </motion.button>
                </motion.div>
              </div>
            </Parallax>
          </SwiperSlide>
        ))}

        <div className="swiper-button-next after:text-indigo-400 hover:after:text-indigo-300" />
        <div className="swiper-button-prev after:text-indigo-400 hover:after:text-indigo-300" />
      </Swiper>

      {/* Sección de bienvenida debajo del slider */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-indigo-600">
              Bienvenido a la Excelencia
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Descubre la nueva era del cuidado masculino donde tradición y tecnología se fusionan para ofrecerte una experiencia única.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Tecnología de Vanguardia",
              description: "Equipamiento de última generación para resultados perfectos",
              icon: "💈"
            },
            {
              title: "Estilistas Expertos",
              description: "Profesionales certificados con años de experiencia",
              icon: "✂️"
            },
            {
              title: "Productos Premium",
              description: "Línea exclusiva de productos para el cuidado masculino",
              icon: "🧴"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-indigo-500 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-2xl font-bold mb-2 text-white">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  )
}
