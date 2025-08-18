'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Calendar,
  Clock,
  User,
  Scissors,
  Phone,
  Mail,
  CreditCard,
  Receipt,
  AlertTriangle,
  Loader2,
  UserPlus
} from 'lucide-react'

interface Barbero {
  id: number
  nombre: string
  especialidad?: string
}

interface Servicio {
  id: number
  nombre: string
  precio: number
  descripcion?: string
}

interface AdminBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AdminBookingModal({ isOpen, onClose, onSuccess }: AdminBookingModalProps) {
  const [loading, setLoading] = useState(false)
  const [barberos, setBarberos] = useState<Barbero[]>([])
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [horasDisponibles, setHorasDisponibles] = useState<string[]>([])
  const [mensajeHorario, setMensajeHorario] = useState('')
  const [esOpcional, setEsOpcional] = useState(false)

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombreCliente: '',
    correoCliente: '',
    telefonoCliente: '',
    barberoId: '',
    servicioId: '',
    fecha: '',
    hora: '',
    formaPago: '',
    folioTransferencia: ''
  })

  const servicioSeleccionado = servicios.find(s => s.id === Number(formData.servicioId))

  // Cargar datos iniciales
  useEffect(() => {
    if (isOpen) {
      fetchBarberos()
      fetchServicios()
      resetForm()
    }
  }, [isOpen])

  // Obtener horarios disponibles cuando cambia fecha o barbero
  useEffect(() => {
    if (formData.fecha && formData.barberoId) {
      fetchHorariosDisponibles()
    } else {
      setHorasDisponibles([])
      setMensajeHorario('')
      setEsOpcional(false)
    }
  }, [formData.fecha, formData.barberoId])

  const fetchBarberos = async () => {
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch('/api/barberos', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) throw new Error('Error al cargar barberos')

      const data = await res.json()
      setBarberos(data)
    } catch (error: any) {
      console.error('Error al cargar barberos:', error)
      toast.error('Error al cargar la lista de barberos')
    }
  }

  const fetchServicios = async () => {
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch('/api/secciones?tipo=servicio', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) throw new Error('Error al cargar servicios')

      const data = await res.json()
      setServicios(data)
    } catch (error: any) {
      console.error('Error al cargar servicios:', error)
      toast.error('Error al cargar la lista de servicios')
    }
  }

  const fetchHorariosDisponibles = async () => {
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch(`/api/horarios?fecha=${formData.fecha}&barbero=${formData.barberoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) throw new Error('Error al obtener horarios')

      const data = await res.json()
      setHorasDisponibles(data.horarios || [])
      setMensajeHorario(data.mensaje || '')
      setEsOpcional(data.esOpcional || false)
    } catch (error: any) {
      console.error('Error al obtener horarios:', error)
      toast.error('Error al cargar horarios disponibles')
      setHorasDisponibles([])
      setMensajeHorario('')
      setEsOpcional(false)
    }
  }

  const resetForm = () => {
    setFormData({
      nombreCliente: '',
      correoCliente: '',
      telefonoCliente: '',
      barberoId: '',
      servicioId: '',
      fecha: '',
      hora: '',
      formaPago: '',
      folioTransferencia: ''
    })
    setHorasDisponibles([])
    setMensajeHorario('')
    setEsOpcional(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Limpiar hora cuando cambie fecha o barbero
    if (field === 'fecha' || field === 'barberoId') {
      setFormData(prev => ({
        ...prev,
        hora: ''
      }))
    }
  }

  const validateForm = () => {
    const { nombreCliente, correoCliente, telefonoCliente, barberoId, servicioId, fecha, hora, formaPago } = formData

    if (!nombreCliente.trim()) {
      toast.error('El nombre del cliente es requerido')
      return false
    }

    if (!correoCliente.trim() || !correoCliente.includes('@')) {
      toast.error('El correo del cliente es requerido y debe ser válido')
      return false
    }

    if (!telefonoCliente.trim() || telefonoCliente.length < 10) {
      toast.error('El teléfono debe tener al menos 10 dígitos')
      return false
    }

    if (!barberoId || !servicioId || !fecha || !hora || !formaPago) {
      toast.error('Todos los campos son requeridos')
      return false
    }

    if (formaPago === 'transferencia' && !formData.folioTransferencia.trim()) {
      toast.error('El folio de transferencia es requerido')
      return false
    }

    // Validar fecha no sea en el pasado
    const [year, month, day] = fecha.split('-')
    const selectedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      toast.error('No puedes agendar una cita en una fecha pasada')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    // Confirmación extra para días opcionales
    if (esOpcional) {
      const confirmacion = window.confirm(
        '⚠️ Has seleccionado un domingo (día opcional).\n\n' +
        'La disponibilidad puede variar. Te recomendamos contactar al barbero ' +
        'para confirmar que estará disponible en el horario seleccionado.\n\n' +
        '¿Deseas continuar con la reserva?'
      )

      if (!confirmacion) return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('token') || ''

      const response = await fetch('/api/citas/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre_cliente: formData.nombreCliente,
          correo_cliente: formData.correoCliente,
          telefono_cliente: formData.telefonoCliente,
          id_barbero: Number(formData.barberoId),
          id_servicio: Number(formData.servicioId),
          fecha: formData.fecha,
          hora: formData.hora,
          forma_pago: formData.formaPago,
          folio_transferencia: formData.folioTransferencia || null
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al agendar la cita')
      }

      toast.success(
        `Cita agendada exitosamente. Código: ${data.codigo_reserva}`,
        {
          duration: 5000,
          position: 'bottom-center',
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #4ade80'
          }
        }
      )

      onSuccess()
      onClose()
      resetForm()

    } catch (error: any) {
      console.error('Error al agendar cita:', error)
      toast.error(error.message || 'Error al agendar la cita', {
        position: 'bottom-center',
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #e53e3e'
        }
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <UserPlus className="h-6 w-6 text-blue-500" />
                  <h2 className="text-xl font-bold text-white">
                    Agendar Cita para Cliente
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Información del Cliente */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-500" />
                      Información del Cliente
                    </h3>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nombre del cliente"
                      value={formData.nombreCliente}
                      onChange={(e) => handleInputChange('nombreCliente', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-300 mb-2">
                      <Mail size={16} />
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="correo@ejemplo.com"
                      value={formData.correoCliente}
                      onChange={(e) => handleInputChange('correoCliente', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-300 mb-2">
                      <Phone size={16} />
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="5551234567"
                      value={formData.telefonoCliente}
                      onChange={(e) => handleInputChange('telefonoCliente', e.target.value)}
                      required
                    />
                  </div>

                  {/* Información de la Cita */}
                  <div className="md:col-span-2 mt-4">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-500" />
                      Información de la Cita
                    </h3>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-300 mb-2">
                      <Scissors size={16} />
                      Servicio *
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.servicioId}
                      onChange={(e) => handleInputChange('servicioId', e.target.value)}
                      required
                    >
                      <option value="">-- Selecciona un servicio --</option>
                      {servicios.map((servicio) => (
                        <option key={servicio.id} value={servicio.id}>
                          {servicio.nombre} - ${servicio.precio}
                        </option>
                      ))}
                    </select>
                    {servicioSeleccionado && (
                      <div className="mt-2 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-300">Precio del servicio:</span>
                          <span className="text-blue-300 font-bold text-lg">
                            ${servicioSeleccionado.precio}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-300 mb-2">
                      <User size={16} />
                      Barbero *
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.barberoId}
                      onChange={(e) => handleInputChange('barberoId', e.target.value)}
                      required
                    >
                      <option value="">-- Selecciona un barbero --</option>
                      {barberos.map((barbero) => (
                        <option key={barbero.id} value={barbero.id}>
                          {barbero.nombre} {barbero.especialidad && `- ${barbero.especialidad}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-300 mb-2">
                      <Calendar size={16} />
                      Fecha *
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.fecha}
                      onChange={(e) => handleInputChange('fecha', e.target.value)}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      max={(() => {
                        const maxDate = new Date()
                        maxDate.setDate(maxDate.getDate() + 30)
                        return maxDate.toISOString().split('T')[0]
                      })()}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-300 mb-2">
                      <Clock size={16} />
                      Hora *
                    </label>

                    {/* Mensaje especial para días opcionales */}
                    {esOpcional && (
                      <div className="mb-3 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                        <div className="flex items-center gap-2 text-yellow-400 mb-2">
                          <AlertTriangle size={16} />
                          <span className="font-semibold">Día Opcional - Domingo</span>
                        </div>
                        <p className="text-yellow-300 text-sm">
                          Los domingos la disponibilidad puede variar. Te recomendamos contactar
                          al barbero antes de confirmar la cita.
                        </p>
                      </div>
                    )}

                    {mensajeHorario && (
                      <p className={`text-sm mb-2 ${esOpcional ? 'text-yellow-400' : 'text-gray-400'}`}>
                        {mensajeHorario}
                      </p>
                    )}

                    <select
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.hora}
                      onChange={(e) => handleInputChange('hora', e.target.value)}
                      required
                      disabled={horasDisponibles.length === 0}
                    >
                      <option value="">-- Selecciona una hora --</option>
                      {horasDisponibles.map((hora) => (
                        <option key={hora} value={hora}>
                          {hora} {esOpcional ? '(Confirmar disponibilidad)' : ''}
                        </option>
                      ))}
                    </select>

                    {horasDisponibles.length === 0 && formData.fecha && formData.barberoId && (
                      <p className="text-red-400 text-sm mt-1">
                        No hay horarios disponibles para este día
                      </p>
                    )}
                  </div>

                  {/* Información de Pago */}
                  <div className="md:col-span-2 mt-4">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-purple-500" />
                      Información de Pago
                    </h3>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-300 mb-2">
                      <CreditCard size={16} />
                      Forma de Pago *
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.formaPago}
                      onChange={(e) => handleInputChange('formaPago', e.target.value)}
                      required
                    >
                      <option value="">-- Selecciona forma de pago --</option>
                      <option value="establecimiento">Pago en establecimiento</option>
                      <option value="transferencia">Transferencia bancaria</option>
                    </select>
                  </div>

                  {formData.formaPago === 'transferencia' && (
                    <div>
                      <label className="flex items-center gap-2 text-gray-300 mb-2">
                        <Receipt size={16} />
                        Folio de Transferencia *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Folio o referencia de transferencia"
                        value={formData.folioTransferencia}
                        onChange={(e) => handleInputChange('folioTransferencia', e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {/* Botones */}
                  <div className="md:col-span-2 flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/20 ${
                        loading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="animate-spin h-5 w-5" />
                          Agendando...
                        </span>
                      ) : (
                        'Confirmar Cita'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}