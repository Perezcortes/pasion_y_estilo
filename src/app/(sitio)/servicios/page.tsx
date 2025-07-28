'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Skeleton } from '../../../components/ui/skeleton'
import { motion } from 'framer-motion'
import './styles.css'

interface Seccion {
  id: number
  nombre: string
  imagen_url: string
  tipo: string
  tiene_catalogo: boolean
  cantidad_items: number
}

export default function ServiciosPage() {
  const [secciones, setSecciones] = useState<Seccion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cargarSecciones = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/secciones')

        if (!res.ok) {
          throw new Error('No se pudieron cargar las secciones')
        }

        const { data } = await res.json()

        if (data && Array.isArray(data)) {
          setSecciones(data)
        } else {
          throw new Error('Formato de datos inesperado')
        }
      } catch (error) {
        console.error('Error al cargar secciones:', error)
        setError(error instanceof Error ? error.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    cargarSecciones()
  }, [])

  // Animaciones
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <main className="min-h-screen pt-40 pb-12 bg-gray-900">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Jolly+Lodger&display=swap');

        .jolly {
          font-family: 'Jolly Lodger', cursive;
          letter-spacing: 1px;
        }
      `}</style>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, x: -100 },
            visible: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.8, ease: 'easeOut' }
            }
          }}
          className="text-center mb-16 pt-6"
        >
          <motion.h1
            className="text-4xl md:text-5xl jolly text-white drop-shadow-lg tracking-wide mb-6 overflow-hidden whitespace-nowrap border-r-4 border-yellow-400 pr-2 animate-typing"
          >
            Nuestros servicios y productos
          </motion.h1>


          <motion.p
            className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            En <span className="text-yellow-400 font-semibold">Pasión y Estilo</span>, cada detalle está pensado para resaltar tu mejor versión. Desde cortes clásicos hasta tendencias modernas, ofrecemos mucho más que estética: una experiencia personalizada con identidad propia.
          </motion.p>

          <motion.p
            className="text-base text-gray-400 max-w-xl mx-auto mt-4 italic"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            🔹 Explora nuestras categorías y descubre lo que hace única a tu barbería de confianza. Tu estilo comienza aquí.
          </motion.p>
        </motion.div>

        {/* Manejo de errores */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900 border-l-4 border-red-500 p-4 mb-8 rounded-lg"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Contenido principal */}
        {loading ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {[...Array(8)].map((_, i) => (
              <motion.div key={i} variants={item}>
                <SkeletonCard />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {secciones.length > 0 ? (
              secciones.map((seccion, index) => (
                <motion.div
                  key={seccion.id}
                  variants={item}
                  custom={index}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ServiceCard seccion={seccion} />
                </motion.div>
              ))
            ) : (
              <motion.div
                className="col-span-full text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <svg
                  className="mx-auto h-12 w-12 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-white germania">No hay secciones disponibles</h3>
                <p className="mt-1 text-gray-400">No se encontraron servicios o productos en este momento.</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </main>
  )
}

function ServiceCard({ seccion }: { seccion: Seccion }) {
  return (
    <Link
      href={`/servicios/${seccion.id}`}
      className="group flex flex-col h-full rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 bg-gray-800 hover:-translate-y-1 border border-gray-700"
    >
      {/* Contenedor de imagen */}
      <div className="relative aspect-[4/3] bg-gray-700 overflow-hidden">
        {seccion.imagen_url ? (
          <Image
            src={seccion.imagen_url}
            alt={seccion.nombre}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-600">
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Contenido de la tarjeta */}
      <div className="flex-1 p-5 flex flex-col">
        <motion.h3
          className="text-lg font-semibold text-white mb-2 line-clamp-2 germania"
          whileHover={{ color: "#f8d226ff" }}
          transition={{ duration: 0.3 }}
        >
          {seccion.nombre}
        </motion.h3>

        <div className="mt-auto">
          <div className="flex items-center text-sm text-gray-300 mb-3">
            <svg
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {seccion.tipo === 'servicio' ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              )}
            </svg>
            <span className="capitalize">{seccion.tipo}</span>
          </div>

          <div className="flex justify-between items-center">
            <motion.span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200"
              whileHover={{ scale: 1.05 }}
            >
              {seccion.cantidad_items > 0
                ? `${seccion.cantidad_items} ${seccion.tipo === 'servicio' ? 'servicios' : 'elementos'}`
                : 'Próximamente'}
            </motion.span>

            {seccion.tiene_catalogo && (
              <motion.span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200"
                whileHover={{ scale: 1.05 }}
              >
                Catálogo
              </motion.span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

function SkeletonCard() {
  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden shadow-sm bg-gray-800 border border-gray-700">
      <Skeleton className="aspect-[4/3] bg-gray-700" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4 bg-gray-700" />
        <Skeleton className="h-4 w-1/2 bg-gray-700" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-6 w-16 bg-gray-700" />
          <Skeleton className="h-6 w-16 bg-gray-700" />
        </div>
      </div>
    </div>
  )
}