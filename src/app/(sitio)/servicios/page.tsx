'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Skeleton } from '../../../components/ui/skeleton'
import { motion, Variants } from 'framer-motion'
import { FiTarget, FiScissors, FiShoppingBag, FiStar } from 'react-icons/fi';
import styles from './styles.module.css'

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
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'servicio' | 'producto'>('todos')

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

  const seccionesFiltradas = secciones.filter(seccion => {
    if (filtroTipo === 'todos') return true
    return seccion.tipo === filtroTipo
  })

  // Animaciones mejoradas
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  }

  const item: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.backgroundPattern}></div>

      <div className={styles.container}>
        <div className={styles.maxWidth}>
          {/* Hero Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={headerVariants}
            className={styles.heroSection}
          >
            <motion.div className={`${styles.badge} ${styles.glass}`}>
              <span className={`${styles.inter}`} style={{ color: '#eeece6ff', fontSize: '0.875rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center' }}>
                <FiStar style={{ marginRight: '6px' }} />
                Experiencia Premium
              </span>
            </motion.div>

            <motion.h1 className={`${styles.heroTitle} ${styles.jolly}`}>
              <span style={{ display: 'block' }}>Nuestros</span>
              <span className={styles.gradientText}>Servicios y Productos</span>
            </motion.h1>

            <motion.p className={`${styles.heroDescription} ${styles.inter}`}>
              En <span className={styles.heroAccent}>Pasión y Estilo</span>, cada detalle está pensado para resaltar tu mejor versión.
              Desde cortes clásicos hasta tendencias modernas, ofrecemos una experiencia personalizada con identidad propia.
            </motion.p>

            <motion.div className={`${styles.heroSubtext} ${styles.inter}`}>
              <div className={styles.heroDivider}></div>
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Tu estilo comienza aquí</span>
              <div className={styles.heroDividerRight}></div>
            </motion.div>
          </motion.div>

          {/* Filtros */}
          <motion.div
            className={styles.filtersContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {[
              { key: 'todos', label: 'Todo', icon: <FiTarget size={18} /> },
              { key: 'servicio', label: 'Servicios', icon: <FiScissors size={18} /> },
              { key: 'producto', label: 'Productos', icon: <FiShoppingBag size={18} /> }
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setFiltroTipo(key as any)}
                className={`${styles.filterButton} ${styles.inter} ${filtroTipo === key ? styles.filterButtonActive : styles.filterButtonInactive
                  }`}
              >
                <span style={{ marginRight: '0.5rem', display: 'inline-flex', alignItems: 'center' }}>
                  {icon}
                </span>
                {label}
              </button>
            ))}
          </motion.div>

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={styles.errorContainer}
            >
              <div className={styles.errorIcon}>
                <div style={{ flexShrink: 0 }}>
                  <svg style={{ height: '1.5rem', width: '1.5rem', color: '#f87171' }} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className={styles.errorContent}>
                  <h3 className={styles.errorTitle}>Error al cargar</h3>
                  <p className={styles.errorMessage}>{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {loading ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className={styles.grid}
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
              className={styles.grid}
            >
              {seccionesFiltradas.length > 0 ? (
                seccionesFiltradas.map((seccion, index) => (
                  <motion.div
                    key={seccion.id}
                    variants={item}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <ServiceCard seccion={seccion} />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className={styles.emptyState}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className={styles.emptyContainer}>
                    <div className={styles.emptyIcon}>
                      <svg style={{ width: '2.5rem', height: '2.5rem', color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className={`${styles.emptyTitle} ${styles.inter}`}>No hay contenido disponible</h3>
                    <p className={`${styles.emptyDescription} ${styles.inter}`}>No se encontraron servicios o productos en este momento.</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </main>
  )
}

function ServiceCard({ seccion }: { seccion: Seccion }) {
  return (
    <Link href={`/servicios/${seccion.id}`} className={`${styles.w100} ${styles.h100}`} style={{ display: 'block' }}>
      <div className={styles.serviceCard}>
        {/* Image Container */}
        <div className={styles.imageContainer}>
          {seccion.imagen_url ? (
            <>
              <Image
                src={seccion.imagen_url}
                alt={seccion.nombre}
                fill
                className={styles.serviceImage}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={false}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent, transparent)',
                opacity: 0,
                transition: 'opacity 0.3s ease'
              }}></div>
            </>
          ) : (
            <div className={styles.imagePlaceholder}>
              <div className={styles.placeholderIcon}>
                <svg style={{ width: '2rem', height: '2rem', color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          )}

          {/* Overlay Badge */}
          <div className={styles.overlayBadge}>
            <span className={`${styles.badgeGlass} ${styles.glass} ${styles.inter}`}>
              <span className={styles.pulsingDot}></span>
              {seccion.tipo === 'servicio' ? (
                <>
                  <FiScissors size={14} style={{ marginRight: 4 }} />
                  Servicio
                </>
              ) : (
                <>
                  <FiShoppingBag size={14} style={{ marginRight: 4 }} />
                  Producto
                </>
              )}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className={styles.cardContent}>
          <h3 className={`${styles.cardTitle} ${styles.inter}`}>
            {seccion.nombre}
          </h3>

          <div className={styles.cardMeta}>
            <div className={`${styles.metaRow} ${styles.inter}`}>
              <div className={styles.metaIcon}>
                <svg style={{ width: '0.75rem', height: '0.75rem', color: '#d1d5db' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{seccion.tipo}</span>
            </div>

            <div className={styles.badgeContainer}>
              <span className={`${styles.badge} ${styles.badgeBlue} ${styles.inter}`}>
                {seccion.cantidad_items > 0
                  ? `${seccion.cantidad_items} ${seccion.tipo === 'servicio' ? 'servicios' : 'elementos'}`
                  : 'Próximamente'}
              </span>

              {seccion.tiene_catalogo && (
                <span className={`${styles.badge} ${styles.badgeGreen} ${styles.inter}`}>
                  📋 Catálogo
                </span>
              )}
            </div>

            <div className={`${styles.actionLink} ${styles.inter}`}>
              <span>Ver detalles</span>
              <svg style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <Skeleton className="aspect-[4/3] bg-gray-700/50" />
      <div className={styles.skeletonContent}>
        <Skeleton className="h-6 w-3/4 bg-gray-700/50" />
        <Skeleton className="h-4 w-1/2 bg-gray-700/50" />
        <div className={styles.skeletonFooter}>
          <Skeleton className="h-6 w-20 bg-gray-700/50" />
          <Skeleton className="h-6 w-16 bg-gray-700/50" />
        </div>
        <Skeleton className="h-4 w-24 bg-gray-700/50" />
      </div>
    </div>
  )
}