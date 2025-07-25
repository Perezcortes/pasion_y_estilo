'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

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

  useEffect(() => {
    const cargarSecciones = async () => {
      try {
        const res = await fetch('/api/secciones')
        const { data } = await res.json()
        
        if (data) {
          setSecciones(data)
        }
      } catch (error) {
        console.error('Error al cargar secciones:', error)
      } finally {
        setLoading(false)
      }
    }
    
    cargarSecciones()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-12">Nuestros Servicios y Productos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {secciones.map(seccion => (
          <Link 
            key={seccion.id} 
            href={`/servicios/${seccion.id}`}
            className="group block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
          >
            <div className="relative h-48 bg-gray-100">
              {seccion.imagen_url ? (
                <Image
                  src={seccion.imagen_url}
                  alt={seccion.nombre}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Sin imagen
                </div>
              )}
            </div>
            <div className="p-6 bg-white">
              <h2 className="text-xl font-semibold mb-2">{seccion.nombre}</h2>
              <p className="text-sm text-gray-600 capitalize">{seccion.tipo}</p>
              
              <p className="text-sm mt-2 text-gray-700">
                {seccion.cantidad_items > 0 
                  ? `${seccion.cantidad_items} ${seccion.tipo === 'servicio' ? 'servicios' : 'productos'} disponibles`
                  : `Sin ${seccion.tipo === 'servicio' ? 'servicios' : 'productos'} disponibles`}
              </p>

              {seccion.tiene_catalogo && (
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Catálogo disponible
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}