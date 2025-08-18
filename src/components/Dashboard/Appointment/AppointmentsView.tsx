'use client'

import { useEffect, useState } from 'react'
import { useUser } from '../../../app/hooks/useUser'
import { motion } from 'framer-motion'
import { fadeIn } from '../../../lib/motion'
import { toast } from 'react-hot-toast'
import {
  Search,
  Filter,
  ChevronDown,
  Loader2,
  X,
  Calendar,
  Clock,
  Phone,
  Mail,
  DollarSign,
  Receipt,
  CreditCard,
  UserPlus
} from 'lucide-react'
import AdminBookingModal from './AdminBookingModal'

interface Appointment {
  id: number
  fecha: string
  hora: string
  estado: string
  codigo_reserva: string
  nombre_cliente?: string
  correo_cliente?: string
  telefono_cliente?: string
  nombre_barbero?: string
  servicio?: string
  precio?: number
  forma_pago?: string
  folio_transferencia?: string
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

const ITEMS_PER_PAGE = 10

export default function AppointmentsView() {
  const { user } = useUser()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    barbero: '',
    estado: '',
    fecha: '',
    forma_pago: ''
  })
  const [barberos, setBarberos] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showTodayOnly, setShowTodayOnly] = useState(false)
  const [showAdminBookingModal, setShowAdminBookingModal] = useState(false)

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
      setCurrentPage(1)
    } catch (error: unknown) {
      console.error('Error fetching appointments:', error)
      const errorMessage = error instanceof Error
        ? error.message
        : 'Error al cargar las citas'
      toast.error(errorMessage)
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
    } catch (error: unknown) {
      console.error('Error fetching barbers:', error)
      const errorMessage = error instanceof Error
        ? error.message
        : 'Error al cargar la lista de barberos'
      toast.error(errorMessage)
    }
  }

  const isToday = (dateString: string) => {
    const today = new Date()
    const appointmentDate = new Date(dateString)

    return today.getFullYear() === appointmentDate.getFullYear() &&
      today.getMonth() === appointmentDate.getMonth() &&
      today.getDate() === appointmentDate.getDate()
  }

  const getTodayAppointments = () => {
    return appointments.filter(appointment => isToday(appointment.fecha))
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

      setAppointments(prev => prev.map(app =>
        app.id === appointmentId ? { ...app, estado: newStatus } : app
      ))
      setFilteredAppointments(prev => prev.map(app =>
        app.id === appointmentId ? { ...app, estado: newStatus } : app
      ))

      toast.success('Estado actualizado correctamente')
    } catch (error: unknown) {
      console.error('Error updating status:', error)
      const errorMessage = error instanceof Error
        ? error.message
        : 'Error al actualizar el estado'
      toast.error(errorMessage)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
    setFilters({ barbero: '', estado: '', fecha: '', forma_pago: '' })
    setShowTodayOnly(false)
  }

  const showOnlyTodayAppointments = () => {
    setShowTodayOnly(true)
    setFilters({ ...filters, fecha: 'hoy' })
  }

  const handleBookingSuccess = () => {
    fetchAppointments() // Recargar la lista de citas
    toast.success('¡Cita agendada exitosamente!')
  }

  // Aplicar filtros y búsqueda
  useEffect(() => {
    let result = [...appointments]

    if (searchTerm) {
      result = result.filter(app =>
        app.nombre_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.correo_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.telefono_cliente?.includes(searchTerm) ||
        app.nombre_barbero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.servicio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.codigo_reserva.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.folio_transferencia?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filters.barbero && filters.barbero !== 'Todos') {
      result = result.filter(app => app.nombre_barbero === filters.barbero)
    }

    if (filters.estado) {
      result = result.filter(app => app.estado === filters.estado)
    }

    if (filters.forma_pago) {
      result = result.filter(app => app.forma_pago === filters.forma_pago)
    }

    if (showTodayOnly || filters.fecha === 'hoy') {
      result = result.filter(app => isToday(app.fecha))
    }

    setFilteredAppointments(result)
    setCurrentPage(1)
  }, [searchTerm, filters, appointments, showTodayOnly])

  // Paginación
  const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE)
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const todayAppointmentsCount = getTodayAppointments().length

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

  const calculateTotalRevenue = (appointments: Appointment[]) => {
    return appointments
      .filter(appointment => appointment.estado === 'COMPLETADA')
      .reduce((sum, appointment) => {
        const precio = +(appointment.precio || 0) // El + convierte string a number
        return sum + precio
      }, 0)
  }

  return (
    <>
      <motion.div
        variants={fadeIn('up', 'spring', 0.2, 1)}
        className="bg-gray-800/70 rounded-xl p-6 border border-gray-700"
      >
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-semibold text-white">
              {user?.rol === 'ADMIN' ? 'Todas las Citas' :
                user?.rol === 'BARBERO' ? 'Mis Citas Programadas' : 'Mis Próximas Citas'}
            </h2>

            <div className="flex items-center gap-3">
              {(user?.rol === 'ADMIN' || user?.rol === 'BARBERO') && (
                <>
                  {/* Botón Agendar Cita */}
                  <button
                    onClick={() => setShowAdminBookingModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/20"
                  >
                    <UserPlus size={16} />
                    <span className="hidden sm:inline">Agendar Cita</span>
                    <span className="sm:hidden">Agendar</span>
                  </button>

                  <div className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                    <Calendar size={12} />
                    {todayAppointmentsCount} citas hoy
                  </div>
                  {todayAppointmentsCount > 0 && !showTodayOnly && (
                    <button
                      onClick={showOnlyTodayAppointments}
                      className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-xs hover:bg-green-900/50 transition-colors flex items-center gap-1"
                    >
                      <Clock size={12} />
                      Ver solo hoy
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, correo, teléfono, folio..."
                  className="pl-9 pr-4 py-2 w-full bg-gray-700/50 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Filtros */}
              {(user?.rol === 'ADMIN' || user?.rol === 'BARBERO') && (
                <>
                  <div className="relative flex-1 sm:flex-none sm:w-32">
                    <select
                      className="pl-3 pr-8 py-2 w-full bg-gray-700/50 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                      value={filters.fecha}
                      onChange={(e) => {
                        setFilters({ ...filters, fecha: e.target.value })
                        setShowTodayOnly(e.target.value === 'hoy')
                      }}
                    >
                      <option value="">Fechas</option>
                      <option value="hoy">Solo hoy</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="relative flex-1 sm:flex-none sm:w-32">
                    <select
                      className="pl-3 pr-8 py-2 w-full bg-gray-700/50 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                      value={filters.estado}
                      onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                    >
                      <option value="">Estados</option>
                      {Object.entries(ESTADOS).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="relative flex-1 sm:flex-none sm:w-32">
                    <select
                      className="pl-3 pr-8 py-2 w-full bg-gray-700/50 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                      value={filters.forma_pago}
                      onChange={(e) => setFilters({ ...filters, forma_pago: e.target.value })}
                    >
                      <option value="">Pagos</option>
                      <option value="establecimiento">Establecimiento</option>
                      <option value="transferencia">Transferencia</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </>
              )}

              {user?.rol === 'ADMIN' && (
                <div className="relative flex-1 sm:flex-none sm:w-40">
                  <select
                    className="pl-3 pr-8 py-2 w-full bg-gray-700/50 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    value={filters.barbero}
                    onChange={(e) => setFilters({ ...filters, barbero: e.target.value })}
                  >
                    <option value="">Barberos</option>
                    {barberos.map((barbero) => (
                      <option key={barbero} value={barbero}>
                        {barbero}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              )}
            </div>

            {(searchTerm || filters.barbero || filters.estado || filters.fecha || filters.forma_pago) && (
              <button
                onClick={clearSearch}
                className="self-end flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
              >
                <X size={14} /> Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Lista de citas mejorada */}
        {paginatedAppointments.length === 0 ? (
          <p className="text-gray-400 py-4 text-center">No se encontraron citas con los filtros aplicados</p>
        ) : (
          <>
            <div className="space-y-4 mb-4">
              {paginatedAppointments.map(appointment => {
                const isTodayAppointment = isToday(appointment.fecha)

                return (
                  <div
                    key={appointment.id}
                    className={`p-4 rounded-lg border transition-all duration-200 ${isTodayAppointment
                      ? 'bg-blue-900/20 border-blue-500/30 shadow-lg shadow-blue-500/10'
                      : 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50'
                      }`}
                  >
                    {/* Header con nombre y estado */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-white text-lg">
                          {user?.rol === 'CLIENTE'
                            ? 'Mi cita'
                            : appointment.nombre_cliente || 'Cliente no especificado'}
                        </h3>
                        {isTodayAppointment && (
                          <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Clock size={10} />
                            HOY
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {(user?.rol === 'ADMIN' || user?.rol === 'BARBERO') ? (
                          <select
                            className={`px-3 py-1 text-sm rounded-full border appearance-none ${appointment.estado === 'CONFIRMADA' ? 'bg-green-900/30 text-green-400 border-green-500/30' :
                              appointment.estado === 'PENDIENTE' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30' :
                                appointment.estado === 'CANCELADA' ? 'bg-red-900/30 text-red-400 border-red-500/30' :
                                  appointment.estado === 'COMPLETADA' ? 'bg-blue-900/30 text-blue-400 border-blue-500/30' :
                                    'bg-gray-900/30 text-gray-400 border-gray-500/30'
                              }`}
                            value={appointment.estado}
                            onChange={(e) => handleStatusChange(appointment.id, e.target.value as EstadoKeys)}
                            disabled={updatingStatus === appointment.id}
                          >
                            {Object.entries(ESTADOS).map(([key, value]) => (
                              <option key={key} value={key} className="bg-gray-800 text-white">
                                {updatingStatus === appointment.id && key === appointment.estado ?
                                  'Actualizando...' : value}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className={`px-3 py-1 text-sm rounded-full ${appointment.estado === 'CONFIRMADA' ? 'bg-green-900/30 text-green-400' :
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

                    {/* Información del cliente (solo para admin/barbero) */}
                    {(user?.rol === 'ADMIN' || user?.rol === 'BARBERO') && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 p-3 bg-gray-800/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-400 uppercase">Correo</p>
                            <p className="text-sm text-gray-300">{appointment.correo_cliente || 'No disponible'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-gray-400" />
                          <div>
                            <p className="text-xs text-rose-400 uppercase">Teléfono</p>
                            <p className="text-sm text-gray-300">{appointment.telefono_cliente || 'No disponible'}</p>
                          </div>
                        </div>
                        {appointment.folio_transferencia && (
                          <div className="flex items-center gap-2">
                            <Receipt size={14} className="text-gray-400" />
                            <div>
                              <p className="text-xs text-rose-400 uppercase">Folio Transferencia</p>
                              <p className="text-sm text-gray-300 font-mono">{appointment.folio_transferencia}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Información del servicio */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-400 uppercase">Fecha</p>
                          <p className="text-sm text-white font-medium">{formatDate(appointment.fecha)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-400 uppercase">Hora</p>
                          <p className="text-sm text-white font-medium">{appointment.hora}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <DollarSign size={14} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-400 uppercase">Servicio</p>
                          <p className="text-sm text-white font-medium">
                            {appointment.servicio || 'No especificado'}
                            {appointment.precio && (
                              <span className="text-green-400 ml-2">${appointment.precio}</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {user?.rol === 'ADMIN' && (
                        <div className="flex items-center gap-2">
                          <CreditCard size={14} className="text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-400 uppercase">Barbero</p>
                            <p className="text-sm text-white font-medium">{appointment.nombre_barbero || 'No asignado'}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Información de pago */}
                    {(user?.rol === 'ADMIN' || user?.rol === 'BARBERO') && appointment.forma_pago && (
                      <div className="mt-3 pt-3 border-t border-gray-600/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CreditCard size={14} className="text-gray-400" />
                            <span className="text-xs text-gray-400 uppercase">Forma de pago</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${appointment.forma_pago === 'establecimiento'
                            ? 'bg-purple-900/30 text-purple-400'
                            : 'bg-green-900/30 text-green-400'
                            }`}>
                            {appointment.forma_pago === 'establecimiento' ? 'En establecimiento' : 'Transferencia'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Código de reserva */}
                    <div className="mt-3 pt-3 border-t border-gray-600/50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 uppercase">Código de reserva</span>
                        <span className="text-sm text-blue-400 font-mono font-bold">
                          {appointment.codigo_reserva}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6 pt-4 border-t border-gray-600/50">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                >
                  Anterior
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                >
                  Siguiente
                </button>
              </div>
            )}

            {/* Resumen de estadísticas */}
            {(user?.rol === 'ADMIN' || user?.rol === 'BARBERO') && (
              <div className="mt-6 pt-4 border-t border-gray-600/50">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <p className="text-lg font-bold text-white">{filteredAppointments.length}</p>
                    <p className="text-xs text-gray-400 uppercase">Total citas</p>
                  </div>
                  <div className="bg-green-900/20 p-3 rounded-lg">
                    <p className="text-lg font-bold text-green-400">
                      {filteredAppointments.filter(a => a.estado === 'CONFIRMADA').length}
                    </p>
                    <p className="text-xs text-green-300 uppercase">Confirmadas</p>
                  </div>
                  <div className="bg-yellow-900/20 p-3 rounded-lg">
                    <p className="text-lg font-bold text-yellow-400">
                      {filteredAppointments.filter(a => a.estado === 'PENDIENTE').length}
                    </p>
                    <p className="text-xs text-yellow-300 uppercase">Pendientes</p>
                  </div>
                  <div className="bg-purple-900/20 p-3 rounded-lg">
                    <p className="text-lg font-bold text-purple-400">
                      {filteredAppointments.filter(a => a.estado === 'COMPLETADA').length}
                    </p>
                    <p className="text-xs text-purple-300 uppercase">Completadas</p>
                  </div>
                  <div className="bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-lg font-bold text-blue-400">
                      ${calculateTotalRevenue(filteredAppointments).toLocaleString()}
                    </p>
                    <p className="text-xs text-blue-300 uppercase">Ingresos reales</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Modal de Agendar Cita para Admin/Barbero */}
      <AdminBookingModal
        isOpen={showAdminBookingModal}
        onClose={() => setShowAdminBookingModal(false)}
        onSuccess={handleBookingSuccess}
      />
    </>
  )
}