'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Skeleton } from '../../../../components/ui/skeleton'
import { motion, Variants } from 'framer-motion'
import { FiTarget, FiScissors, FiShoppingBag, FiStar } from 'react-icons/fi';
import styles from './section-detail.module.css'

interface Seccion {
  id: number
  nombre: string
  imagen_url: string
  tipo: string
  tiene_catalogo: boolean
}

interface ItemSeccion {
  id: number
  nombre: string
  descripcion: string
  precio: number | null
  imagen_url: string
  archivo_pdf: string | null
  es_destacado: boolean
}

function ItemCard({ item, index }: { item: ItemSeccion; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={styles.itemCard}
    >
      {/* Background with gradient */}
      <div className={styles.cardBackground}></div>
      <div className={styles.cardOverlay}></div>

      {/* Destacado Badge */}
      {item.es_destacado && (
        <div className={styles.featuredBadge}>
          <div className={`${styles.featuredBadgeContent} ${styles.inter}`}>
            <svg style={{ width: '0.75rem', height: '0.75rem', marginRight: '0.25rem' }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Destacado
          </div>
        </div>
      )}

      <div className={styles.cardContent}>
        {/* Image Container */}
        <div className={styles.imageSection}>
          {item.imagen_url ? (
            <>
              <Image
                src={item.imagen_url}
                alt={item.nombre}
                fill
                className={styles.itemImage}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                quality={90}
              />
              <div className={styles.imageOverlay}></div>
            </>
          ) : (
            <div className={styles.imagePlaceholder}>
              <div className={styles.placeholderIcon}>
                <svg style={{ width: '2rem', height: '2rem', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={styles.contentSection}>
          <h3 className={`${styles.itemTitle} ${styles.inter}`}>
            {item.nombre}
          </h3>

          {item.descripcion && (
            <p className={`${styles.itemDescription} ${styles.inter}`}>
              {item.descripcion}
            </p>
          )}

          <div className={styles.priceSection}>
            {/* Price */}
            <div className={styles.priceRow}>
              <div className={styles.price}>
                <span className={`${styles.priceAmount} ${styles.inter}`}>
                  {item.precio !== null ? `$${item.precio.toFixed(2)}` : "Consultar"}
                </span>
                {item.precio !== null && (
                  <span className={`${styles.priceCurrency} ${styles.inter}`}>MXN</span>
                )}
              </div>

              {item.archivo_pdf && (
                <motion.a
                  href={item.archivo_pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${styles.pdfButton} ${styles.inter}`}
                >
                  <svg style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                  Ficha
                </motion.a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ItemSkeleton() {
  return (
    <div className={styles.skeletonCard}>
      <Skeleton className="aspect-square w-full bg-gray-700/50" />
      <div className={styles.skeletonContent}>
        <Skeleton className="h-6 w-3/4 bg-gray-700/50" />
        <Skeleton className="h-4 w-full bg-gray-700/50" />
        <Skeleton className="h-4 w-2/3 bg-gray-700/50" />
        <div className={styles.skeletonFooter}>
          <Skeleton className="h-8 w-20 bg-gray-700/50" />
          <Skeleton className="h-8 w-16 bg-gray-700/50" />
        </div>
        <div className={styles.skeletonButton}>
          <Skeleton className="h-10 w-full bg-gray-700/50" />
        </div>
      </div>
    </div>
  )
}

export default function SeccionDetallePage() {
  const params = useParams()
  const [seccion, setSeccion] = useState<Seccion | null>(null)
  const [items, setItems] = useState<ItemSeccion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/secciones/${params.id}`)

        if (!res.ok) {
          throw new Error('No se pudo cargar la sección')
        }

        const data = await res.json()

        if (data?.success) {
          setSeccion(data.data.seccion)
          setItems(data.data.items)
        } else {
          throw new Error(data?.error || 'Formato de datos inesperado')
        }
      } catch (err) {
        console.error('Error al cargar datos:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      cargarDatos()
    }
  }, [params.id])

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.maxWidth}>
            <div className={styles.mb4}>
              <Skeleton className="h-6 w-32 bg-gray-800/50 mb-6" />
              <Skeleton className="h-12 w-3/4 bg-gray-800/50 mb-4" />
              <Skeleton className="aspect-video w-full bg-gray-800/50 rounded-2xl" />
            </div>

            <div className={styles.grid}>
              {[...Array(8)].map((_, i) => (
                <ItemSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className={styles.main}>
        <div className={styles.backgroundPattern}></div>

        <div className={styles.container}>
          <div className={styles.errorState}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.errorContainer}
            >
              <div className={styles.errorIconContainer}>
                <svg style={{ height: '2.5rem', width: '2.5rem', color: '#f87171' }} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className={`${styles.errorTitle} ${styles.inter}`}>Error al cargar</h3>
              <p className={`${styles.errorMessage} ${styles.inter}`}>{error}</p>

              <Link href="/servicios" className={`${styles.errorButton} ${styles.inter}`}>
                <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Volver a servicios
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
    )
  }

  if (!seccion) {
    return (
      <main className={styles.main}>
        <div className={styles.backgroundPattern}></div>

        <div className={styles.container}>
          <div className={styles.errorState}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.errorContainer}
            >
              <div className={styles.emptyIcon}>
                <svg style={{ width: '2.5rem', height: '2.5rem', color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className={`${styles.errorTitle} ${styles.jolly}`} style={{ fontSize: '1.875rem' }}>Sección no encontrada</h1>
              <p className={`${styles.errorMessage} ${styles.inter}`}>La sección que buscas no existe o ha sido eliminada.</p>

              <Link href="/servicios" className={`${styles.errorButton} ${styles.inter}`}>
                <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Volver a servicios
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
    )
  }

  const itemsDestacados = items.filter(item => item.es_destacado)
  const itemsNormales = items.filter(item => !item.es_destacado)

  return (
    <main className={styles.main}>
      <div className={styles.backgroundPattern}></div>

      <div className={styles.container}>
        <div className={styles.maxWidth}>
          {/* Header Section */}
          <motion.div
            className={styles.headerSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Breadcrumb */}
            <Link href="/servicios" className={`${styles.breadcrumb} ${styles.inter}`}>
              <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Volver a todos los servicios
            </Link>

            {/* Title */}
            <div className={styles.titleContainer}>
              <motion.h1
                className={`${styles.mainTitle} ${styles.jolly}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <span className={styles.gradientText}>{seccion.nombre}</span>
              </motion.h1>

              {/* Image Hero */}
              {seccion.imagen_url && (
                <motion.div
                  className={styles.heroImage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <Image
                    src={seccion.imagen_url}
                    alt={seccion.nombre}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                    priority
                  />
                  <div className={styles.heroImageOverlay}></div>
                </motion.div>
              )}

              {/* Meta Info */}
              <motion.div
                className={styles.metaContainer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <span className={`${styles.typeBadge} ${styles.inter}`}>
                  {seccion.tipo === 'servicio' ? (
                    <FiScissors className={styles.typeIcon} />
                  ) : (
                    <FiShoppingBag className={styles.typeIcon} />
                  )}
                  {seccion.tipo === 'servicio' ? 'Servicio' : 'Producto'}
                </span>

                {seccion.tiene_catalogo && (
                  <motion.button
                    className={`${styles.catalogButton} ${styles.inter}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg style={{ marginLeft: '-0.25rem', marginRight: '0.5rem', height: '1.25rem', width: '1.25rem' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v6a1 1 0 102 0V8z" clipRule="evenodd" />
                    </svg>
                    Ver catálogo completo
                  </motion.button>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Featured Items */}
          {itemsDestacados.length > 0 && (
            <motion.section
              className={styles.section}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className={styles.sectionTitle}>
                <div className={`${styles.sectionDivider} ${styles.sectionDividerYellow}`}></div>
                <h2 className={`${styles.sectionTitleText} ${styles.jolly}`}>
                  <FiStar className={styles.featuredIcon} />
                  Destacados
                </h2>
                <div className={`${styles.sectionDivider} ${styles.sectionDividerYellow}`}></div>
              </div>

              <div className={styles.grid}>
                {itemsDestacados.map((item, index) => (
                  <ItemCard key={item.id} item={item} index={index} />
                ))}
              </div>
            </motion.section>
          )}

          {/* Regular Items */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <div className={styles.sectionTitle}>
              <div className={`${styles.sectionDivider} ${styles.sectionDividerBlue}`}></div>
              <h2 className={`${styles.sectionTitleText} ${styles.jolly}`}>
                {seccion.tipo === 'servicio' ? (
                  <>
                    <FiScissors className={styles.titleIcon} />
                    Nuestros Servicios
                  </>
                ) : (
                  <>
                    <FiShoppingBag className={styles.titleIcon} />
                    Nuestros Productos
                  </>
                )}
              </h2>
              <div className={`${styles.sectionDivider} ${styles.sectionDividerBlue}`}></div>
            </div>

            {itemsNormales.length > 0 ? (
              <div className={styles.grid}>
                {itemsNormales.map((item, index) => (
                  <ItemCard key={item.id} item={item} index={index + itemsDestacados.length} />
                ))}
              </div>
            ) : (
              <motion.div
                className={styles.emptyState}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <div className={styles.emptyContainer}>
                  <div className={styles.emptyIcon}>
                    <svg style={{ width: '2.5rem', height: '2.5rem', color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className={`${styles.emptyTitle} ${styles.inter}`}>
                    No hay {seccion.tipo === 'servicio' ? 'servicios' : 'productos'} disponibles
                  </h3>
                  <p className={`${styles.emptyDescription} ${styles.inter}`}>
                    Pronto agregaremos más {seccion.tipo === 'servicio' ? 'servicios' : 'productos'} a esta sección
                  </p>
                </div>
              </motion.div>
            )}
          </motion.section>
        </div>
      </div>
    </main>
  )
}