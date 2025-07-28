'use client'

import { useEffect, useState } from 'react'
import { useUser } from '../app/hooks/useUser'
import { motion } from 'framer-motion'
import { fadeIn } from '../lib/motion'
import { toast } from 'react-hot-toast'
import { Search, Filter, ChevronDown, Loader2 } from 'lucide-react'

interface Appointment {
  id: number
  fecha: string
  hora: string
  estado: string
  codigo_reserva: string
  nombre_cliente?: string
  nombre_barbero?: string
  servicio?: string
}

const ESTADOS = {
  'PENDIENTE': 'pendiente',
  'CONFIRMADA': 'confirmada',
  'CANCELADA': 'cancelada',
  'COMPLETADA': 'completada',
  'NO_ASISTIO': 'no asistió'
} as const

type EstadoKeys = keyof typeof ESTADOS
type EstadoValues = typeof ESTADOS[EstadoKeys]

export default function AppointmentsView() {
  const { user } = useUser()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    barbero: '',
    estado: ''
  })
  const [barberos, setBarberos] = useState<string[]>([])

  useEffect(() => {
    if (user) {
      fetchAppointments()
      fetchBarberos()
    }
  }, [user])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token') || ''

      const res = await fetch('/api/citas', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) {
        throw new Error('Error al cargar citas')
      }

      const data = await res.json()
      setAppointments(data)
      setFilteredAppointments(data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
      toast.error('Error al cargar las citas')
    } finally {
      setLoading(false)
    }
  }

  const fetchBarberos = async () => {
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch('/api/barberos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) throw new Error('Error al cargar barberos')

      const data = await res.json()
      const barberoNames = data.map((b: any) => b.nombre)
      setBarberos(['Todos', ...barberoNames])
    } catch (error) {
      console.error('Error fetching barbers:', error)
      toast.error('Error al cargar la lista de barberos')
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }
    return new Date(dateString).toLocaleDateString('es-ES', options)
  }

  const formatStatus = (status: string) => {
    return ESTADOS[status as EstadoKeys] || status.toLowerCase()
  }

  const handleStatusChange = async (appointmentId: number, newStatus: EstadoKeys) => {
    try {
      setUpdatingStatus(appointmentId)
      const token = localStorage.getItem('token') || ''

      const res = await fetch(`/api/citas/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: newStatus })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Error al actualizar el estado')
      }

      // Actualizar el estado localmente
      setAppointments(prev => prev.map(app =>
        app.id === appointmentId ? { ...app, estado: newStatus } : app
      ))
      setFilteredAppointments(prev => prev.map(app =>
        app.id === appointmentId ? { ...app, estado: newStatus } : app
      ))

      toast.success('Estado actualizado correctamente')
    } catch (error: any) {
      console.error('Error updating status:', error)
      toast.error(error.message || 'Error al actualizar el estado')
    } finally {
      setUpdatingStatus(null)
    }
  }

  // Aplicar filtros y búsqueda
  useEffect(() => {
    let result = [...appointments]

    // Aplicar filtro de búsqueda
    if (searchTerm) {
      result = result.filter(app =>
        app.nombre_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.nombre_barbero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.servicio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.codigo_reserva.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Aplicar filtros
    if (filters.barbero && filters.barbero !== 'Todos') {
      result = result.filter(app => app.nombre_barbero === filters.barbero)
    }

    if (filters.estado) {
      result = result.filter(app => app.estado === filters.estado)
    }

    setFilteredAppointments(result)
  }, [searchTerm, filters, appointments])

  if (loading) {
    return (
      <motion.div
        variants={fadeIn('up', 'spring', 0.2, 1)}
        className="bg-gray-800/70 rounded-xl p-6 border border-gray-700"
      >
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={fadeIn('up', 'spring', 0.2, 1)}
      className="bg-gray-800/70 rounded-xl p-6 border border-gray-700"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-white">
          {user?.rol === 'ADMIN' ? 'Todas las Citas' : 'Mis Próximas Citas'}
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Barra de búsqueda */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar citas..."
              className="pl-9 pr-4 py-2 w-full bg-gray-700/50 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtros (solo para admin) */}
          {user?.rol === 'ADMIN' && (
            <>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  className="pl-9 pr-8 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  value={filters.barbero}
                  onChange={(e) => setFilters({ ...filters, barbero: e.target.value })}
                >
                  <option value="">Todos los barberos</option>
                  {barberos.map((barbero) => (
                    <option key={barbero} value={barbero}>
                      {barbero}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  className="pl-9 pr-8 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  value={filters.estado}
                  onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                >
                  <option value="">Todos los estados</option>
                  {Object.entries(ESTADOS).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </>
          )}
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <p className="text-gray-400 py-4 text-center">No se encontraron citas con los filtros aplicados</p>
      ) : (
        <div className="space-y-3">
          {filteredAppointments.map(appointment => (
            <div
              key={appointment.id}
              className="p-4 bg-gray-700/30 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex-1">
                <h3 className="font-medium text-white">
                  {user?.rol === 'ADMIN' ? appointment.nombre_cliente : 'Mi cita'}
                </h3>
                <p className="text-sm text-gray-300">
                  {appointment.servicio || 'Servicio no especificado'} • {formatDate(appointment.fecha)} a las {appointment.hora}
                  {user?.rol === 'ADMIN' && appointment.nombre_barbero && ` • ${appointment.nombre_barbero}`}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Código: {appointment.codigo_reserva}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {user?.rol === 'ADMIN' ? (
                  <select
                    className={`px-2 py-1 text-xs rounded-full appearance-none ${appointment.estado === 'CONFIRMADA' ? 'bg-green-900/30 text-green-400' :
                      appointment.estado === 'PENDIENTE' ? 'bg-yellow-900/30 text-yellow-400' :
                        appointment.estado === 'CANCELADA' ? 'bg-red-900/30 text-red-400' :
                          appointment.estado === 'COMPLETADA' ? 'bg-blue-900/30 text-blue-400' :
                            'bg-gray-900/30 text-gray-400'
                      }`}
                    value={appointment.estado}
                    onChange={(e) => handleStatusChange(appointment.id, e.target.value as EstadoKeys)}
                    disabled={updatingStatus === appointment.id}
                  >
                    {Object.entries(ESTADOS).map(([key, value]) => (
                      <option
                        key={key}
                        value={key}
                        className="bg-gray-800 text-white"
                      >
                        {updatingStatus === appointment.id && key === appointment.estado ?
                          'Actualizando...' : value}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className={`px-2 py-1 text-xs rounded-full ${appointment.estado === 'CONFIRMADA' ? 'bg-green-900/30 text-green-400' :
                    appointment.estado === 'PENDIENTE' ? 'bg-yellow-900/30 text-yellow-400' :
                      appointment.estado === 'CANCELADA' ? 'bg-red-900/30 text-red-400' :
                        appointment.estado === 'COMPLETADA' ? 'bg-blue-900/30 text-blue-400' :
                          'bg-gray-900/30 text-gray-400'
                    }`}>
                    {formatStatus(appointment.estado)}
                  </span>
                )}

                {updatingStatus === appointment.id && (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}