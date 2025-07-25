'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

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
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      <div className="relative h-48 bg-gray-100">
        {item.imagen_url ? (
          <Image
            src={item.imagen_url}
            alt={item.nombre}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Sin imagen
          </div>
        )}
      </div>
      <div className="p-6 bg-white">
        <h3 className="text-lg font-semibold mb-2">{item.nombre}</h3>
        {item.descripcion && (
          <p className="text-gray-600 mb-3 line-clamp-2">{item.descripcion}</p>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-bold">
            {item.precio !== null ? `$${item.precio.toFixed(2)}` : "Consultar precio"}
          </span>
          
          {item.archivo_pdf && (
            <a 
              href={item.archivo_pdf} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
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
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Destacado
            </span>
          </div>
        )}
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
        const res = await fetch(`/api/secciones/${params.id}`)
        const data = await res.json()
        
        if (data?.success) {
          setSeccion(data.data.seccion)
          setItems(data.data.items)
        } else {
          setError(data?.error || 'No se pudo cargar la sección')
        }
      } catch (err) {
        setError('Error al cargar los datos')
        console.error('Error:', err)
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
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">{error}</h1>
        <Link href="/servicios" className="text-blue-600 hover:underline">
          Volver a servicios
        </Link>
      </div>
    )
  }

  if (!seccion) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Sección no encontrada</h1>
        <Link href="/servicios" className="text-blue-600 hover:underline">
          Volver a servicios
        </Link>
      </div>
    )
  }

  const itemsDestacados = items.filter(item => item.es_destacado)
  const itemsNormales = items.filter(item => !item.es_destacado)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <Link href="/servicios" className="text-blue-600 hover:underline mb-4 inline-block">
          &larr; Volver a todos los servicios
        </Link>
        
        <h1 className="text-3xl font-bold mb-4">{seccion.nombre}</h1>
        
        {seccion.imagen_url && (
          <div className="relative h-64 w-full rounded-lg overflow-hidden mb-6">
            <Image
              src={seccion.imagen_url}
              alt={seccion.nombre}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between mb-6">
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 capitalize">
            {seccion.tipo}
          </span>
          
          {seccion.tiene_catalogo && (
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              <svg className="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v6a1 1 0 102 0V8z" clipRule="evenodd" />
              </svg>
              Ver catálogo completo
            </button>
          )}
        </div>
      </div>

      {itemsDestacados.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itemsDestacados.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-6">
          {seccion.tipo === 'servicio' ? 'Nuestros Servicios' : 'Nuestros Productos'}
        </h2>
        
        {itemsNormales.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itemsNormales.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No hay {seccion.tipo === 'servicio' ? 'servicios' : 'productos'} disponibles
          </p>
        )}
      </div>
    </div>
  )
}