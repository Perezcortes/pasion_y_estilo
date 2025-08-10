'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, Clock, User, Scissors, MapPin, Phone, AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface Appointment {
  id: number
  fecha: string
  hora: string
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'COMPLETADA' | 'CANCELADA'
  codigo_reserva: string
  servicio: string
  nombre_barbero: string
  creado_en: string
}

interface AppointmentsHistoryProps {
  isOpen: boolean
  onClose: () => void
  userId: number
}

const estadoColors = {
  PENDIENTE: 'text-yellow-400 bg-yellow-400/20',
  CONFIRMADA: 'text-blue-400 bg-blue-400/20',
  COMPLETADA: 'text-green-400 bg-green-400/20',
  CANCELADA: 'text-red-400 bg-red-400/20'
}

const estadoIcons = {
  PENDIENTE: AlertCircle,
  CONFIRMADA: CheckCircle,
  COMPLETADA: CheckCircle,
  CANCELADA: XCircle
}

export default function AppointmentsHistory({ isOpen, onClose, userId }: AppointmentsHistoryProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && userId) {
      fetchAppointments()
    }
  }, [isOpen, userId])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/citas')
      
      if (!response.ok) {
        throw new Error('Error al cargar las citas')
      }

      const data = await response.json()
      
      // Ordenar por fecha más reciente primero
      const sortedAppointments = data.sort((a: Appointment, b: Appointment) => {
        const dateA = new Date(`${a.fecha}T${a.hora}`)
        const dateB = new Date(`${b.fecha}T${b.hora}`)
        return dateB.getTime() - dateA.getTime()
      })
      
      setAppointments(sortedAppointments)
    } catch (error: any) {
      console.error('Error:', error)
      setError(error.message || 'Error al cargar las citas')
      toast.error('Error al cargar el historial de citas')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5) // HH:MM
  }

  const getRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Hoy'
    if (diffDays === 1) return 'Mañana'
    if (diffDays === -1) return 'Ayer'
    if (diffDays > 0) return `En ${diffDays} días`
    if (diffDays < 0) return `Hace ${Math.abs(diffDays)} días`
    
    return formatDate(dateString)
  }

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
        <Calendar className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">No hay citas registradas</h3>
      <p className="text-gray-400 mb-6">Aún no has agendado ninguna cita con nosotros.</p>
      <button
        onClick={onClose}
        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
      >
        Agendar mi primera cita
      </button>
    </div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl mx-4 bg-gray-900 rounded-xl border border-white/10 shadow-2xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <Calendar size={20} className="text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Mis Citas</h2>
                  <p className="text-gray-400 text-sm">Historial de citas agendadas</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                  <span className="ml-2 text-gray-400">Cargando citas...</span>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Error al cargar</h3>
                  <p className="text-gray-400 mb-4">{error}</p>
                  <button
                    onClick={fetchAppointments}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Intentar de nuevo
                  </button>
                </div>
              ) : appointments.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment, index) => {
                    const IconComponent = estadoIcons[appointment.estado]
                    
                    return (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600/20 rounded-lg">
                              <Scissors size={16} className="text-blue-400" />
                            </div>
                            <div>
                              <h3 className="text-white font-semibold">{appointment.servicio}</h3>
                              <p className="text-gray-400 text-sm">#{appointment.codigo_reserva}</p>
                            </div>
                          </div>
                          
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${estadoColors[appointment.estado]}`}>
                            <IconComponent size={12} />
                            {appointment.estado}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar size={14} className="text-gray-400" />
                              <span className="text-gray-300">{formatDate(appointment.fecha)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock size={14} className="text-gray-400" />
                              <span className="text-gray-300">{formatTime(appointment.hora)}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <User size={14} className="text-gray-400" />
                              <span className="text-gray-300">{appointment.nombre_barbero}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {getRelativeDate(appointment.fecha)}
                            </div>
                          </div>
                        </div>

                        {/* Información adicional para citas próximas */}
                        {appointment.estado === 'CONFIRMADA' && new Date(`${appointment.fecha}T${appointment.hora}`) > new Date() && (
                          <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <div className="flex items-center gap-2 text-sm text-blue-400">
                              <AlertCircle size={14} />
                              <span className="font-medium">Cita próxima confirmada</span>
                            </div>
                            <p className="text-xs text-blue-300 mt-1">
                              Recuerda llegar 10 minutos antes de tu cita.
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {appointments.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-gray-800/50">
                <div className="text-center">
                  <p className="text-gray-400 text-sm">
                    Total de citas: <span className="text-white font-semibold">{appointments.length}</span>
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}