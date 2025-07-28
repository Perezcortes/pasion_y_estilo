'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Skeleton } from '../../../../components/ui/skeleton'

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

function ItemCard({ item }: { item: ItemSeccion }) {
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-gray-800 hover:bg-gray-750 h-full flex flex-col">
      <div className="relative aspect-square bg-gray-700 flex-shrink-0">
        {item.imagen_url ? (
          <Image
            src={item.imagen_url}
            alt={item.nombre}
            fill
            className="object-contain p-4"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            quality={85}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold mb-2 text-white">{item.nombre}</h3>
        {item.descripcion && (
          <p className="text-gray-300 mb-3 flex-grow">{item.descripcion}</p>
        )}
        
        <div className="flex justify-between items-center mt-auto pt-4">
          <span className="text-lg font-bold text-white">
            {item.precio !== null ? `$${item.precio.toFixed(2)}` : "Consultar precio"}
          </span>
          
          {item.archivo_pdf && (
            <a 
              href={item.archivo_pdf} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              Ver ficha
            </a>
          )}
        </div>
        
        {item.es_destacado && (
          <div className="mt-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-900 text-yellow-200">
              Destacado
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function ItemSkeleton() {
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800 h-full">
      <Skeleton className="aspect-square w-full bg-gray-700" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4 bg-gray-700" />
        <Skeleton className="h-4 w-full bg-gray-700" />
        <Skeleton className="h-4 w-2/3 bg-gray-700" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-6 w-16 bg-gray-700" />
          <Skeleton className="h-6 w-16 bg-gray-700" />
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
      <main className="min-h-screen pt-40 pb-12 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Skeleton className="h-6 w-32 bg-gray-800 mb-6" />
            <Skeleton className="h-10 w-3/4 bg-gray-800 mb-4" />
            <Skeleton className="aspect-video w-full bg-gray-800 rounded-lg" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ItemSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen pt-40 pb-12 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-900/50 border-l-4 border-red-500 p-4 mb-8 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-200">{error}</h3>
              </div>
            </div>
          </div>
          
          <Link 
            href="/servicios" 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Volver a servicios
          </Link>
        </div>

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Jolly+Lodger&display=swap');

          .jolly {
            font-family: 'Jolly Lodger', cursive;
            letter-spacing: 1px;
          }
        `}</style>
      </main>
    )
  }

  if (!seccion) {
    return (
      <main className="min-h-screen pt-40 pb-12 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4 jolly">Sección no encontrada</h1>
          <Link 
            href="/servicios" 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Volver a servicios
          </Link>
        </div>

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Jolly+Lodger&display=swap');

          .jolly {
            font-family: 'Jolly Lodger', cursive;
            letter-spacing: 1px;
          }
        `}</style>
      </main>
    )
  }

  const itemsDestacados = items.filter(item => item.es_destacado)
  const itemsNormales = items.filter(item => !item.es_destacado)

  return (
    <main className="min-h-screen pt-40 pb-12 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="mb-12">
          <Link 
            href="/servicios" 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Volver a todos los servicios
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 jolly">{seccion.nombre}</h1>
          
          {seccion.imagen_url && (
            <div className="relative aspect-video w-full max-w-4xl mx-auto rounded-lg overflow-hidden mb-8 bg-gray-800">
              <Image
                src={seccion.imagen_url}
                alt={seccion.nombre}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority
              />
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-800 text-gray-300 border border-gray-700 capitalize">
              <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {seccion.tipo === 'servicio' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                )}
              </svg>
              {seccion.tipo}
            </span>
            
            {seccion.tiene_catalogo && (
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-500 transition-colors">
                <svg className="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v6a1 1 0 102 0V8z" clipRule="evenodd" />
                </svg>
                Ver catálogo completo
              </button>
            )}
          </div>
        </div>

        {/* Items destacados */}
        {itemsDestacados.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 pb-2 border-b border-gray-800 jolly">Destacados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {itemsDestacados.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* Items normales */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 pb-2 border-b border-gray-800 jolly">
            {seccion.tipo === 'servicio' ? 'Nuestros Servicios' : 'Nuestros Productos'}
          </h2>
          
          {itemsNormales.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {itemsNormales.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800/50 rounded-lg">
              <svg
                className="mx-auto h-12 w-12 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-300">
                No hay {seccion.tipo === 'servicio' ? 'servicios' : 'productos'} disponibles
              </h3>
              <p className="mt-1 text-gray-500">
                Pronto agregaremos más {seccion.tipo === 'servicio' ? 'servicios' : 'productos'} a esta sección
              </p>
            </div>
          )}
        </section>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Jolly+Lodger&display=swap');

        .jolly {
          font-family: 'Jolly Lodger', cursive;
          letter-spacing: 1px;
        }
      `}</style>
    </main>
  )
}