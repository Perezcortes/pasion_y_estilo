'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Oswald, Anton } from 'next/font/google'
import {
  Calendar as CalendarIcon,
  Clock,
  Scissors,
  User,
  AlertTriangle,
  CreditCard,
  Phone,
  DollarSign,
  Receipt,
  MapPin
} from 'lucide-react'
import { useUser } from '../../hooks/useUser'
import PaymentCard from '../../../components/PaymentCard'

const barberFont = Oswald({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-barber'
})

const vintageFont = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-vintage'
})

interface Barbero {
  id: number
  nombre: string
  foto?: string
  especialidad?: string
}

interface Servicio {
  id: number
  nombre: string
  precio: number
  descripcion?: string
  duracion?: number
}

interface CitaAgendada {
  id: number
  fecha: string
  hora: string
  barbero: string
  codigo: string
  servicio: string
  precio: number
  telefono: string
  forma_pago: string
  folio_transferencia?: string
}

export default function AgendarCitaPage() {
  const { user } = useUser()
  const router = useRouter()

  // Estados del formulario
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [barberoId, setBarberoId] = useState('')
  const [servicioId, setServicioId] = useState('')
  const [telefono, setTelefono] = useState('')
  const [formaPago, setFormaPago] = useState('')
  const [folioTransferencia, setFolioTransferencia] = useState('')

  // Estados de datos
  const [barberos, setBarberos] = useState<Barbero[]>([])
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [loading, setLoading] = useState(false)
  const [citaAgendada, setCitaAgendada] = useState<CitaAgendada | null>(null)
  const [horasDisponibles, setHorasDisponibles] = useState<string[]>([])
  const [mensajeHorario, setMensajeHorario] = useState('')

  // Servicio seleccionado
  const servicioSeleccionado = servicios.find(s => s.id === Number(servicioId))

  // Obtener lista de barberos
  useEffect(() => {
    const fetchBarberos = async () => {
      try {
        const token = localStorage.getItem('token') || ''
        const res = await fetch('/api/barberos', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Error al cargar barberos')
        }

        const data = await res.json()
        setBarberos(data)
      } catch (error: any) {
        console.error('Error al cargar barberos:', error)
        toast.error(error.message || 'Error al cargar la lista de barberos')
      }
    }
    fetchBarberos()
  }, [])

  // Obtener lista de servicios
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const token = localStorage.getItem('token') || ''
        const res = await fetch('/api/secciones?tipo=servicio', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Error al cargar servicios')
        }

        const data = await res.json()
        setServicios(data)
      } catch (error: any) {
        console.error('Error al cargar servicios:', error)
        toast.error(error.message || 'Error al cargar la lista de servicios')
      }
    }
    fetchServicios()
  }, [])

  // Obtener horarios disponibles cuando cambia fecha o barbero
  useEffect(() => {
    if (fecha && barberoId) {
      fetchHorariosDisponibles()
    } else {
      setHorasDisponibles([])
      setMensajeHorario('')
    }
  }, [fecha, barberoId])

  // Función para formatear fecha correctamente sin problemas de zona horaria
  const formatTicketDate = (dateString: string) => {
    // Crear fecha local sin conversión UTC
    const [year, month, day] = dateString.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))

    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Función para obtener el día de la semana correctamente
  const getDayOfWeek = (dateString: string) => {
    const [year, month, day] = dateString.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))

    return date.toLocaleDateString('es-ES', { weekday: 'long' })
  }

  const [esOpcional, setEsOpcional] = useState(false)


  // Corregir la función fetchHorariosDisponibles
  const fetchHorariosDisponibles = async () => {
    try {
      const token = localStorage.getItem('token') || ''
      //('Solicitando horarios para fecha:', fecha, 'barbero:', barberoId)

      const res = await fetch(`/api/horarios?fecha=${fecha}&barbero=${barberoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Error al obtener horarios')
      }

      const data = await res.json()
      //console.log('Respuesta del API:', data)

      if (data.mensaje) {
        setMensajeHorario(data.mensaje)
        setHorasDisponibles(data.horarios || [])
        setEsOpcional(data.esOpcional || false)
        return
      }

      // Usar nuestra función local para obtener el día correcto
      const dayName = getDayOfWeek(fecha)
      setHorasDisponibles(data.horarios || [])
      setEsOpcional(data.esOpcional || false)
      setMensajeHorario(`Horarios disponibles para ${dayName}`)

    } catch (error: unknown) {
      console.error('Error al obtener horarios:', error)

      // Manejar el error correctamente
      const errorMessage = error instanceof Error
        ? error.message
        : 'Error al cargar horarios disponibles'

      toast.error(errorMessage)
      setHorasDisponibles([])
      setMensajeHorario('')
      setEsOpcional(false)
    }
  }

  const handleAgendar = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error('Debes iniciar sesión para agendar una cita', {
        icon: <AlertTriangle className="text-yellow-500" />,
        position: 'bottom-center',
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #e53e3e'
        }
      })
      return router.push('/login')
    }

    // Validar fecha seleccionada - corregido para evitar problemas de zona horaria
    const [year, month, day] = fecha.split('-')
    const selectedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      toast.error('No puedes agendar una cita en una fecha pasada')
      return
    }

    if (!hora || horasDisponibles.length === 0) {
      toast.error('Debes seleccionar una hora disponible')
      return
    }

    // Validaciones adicionales
    if (formaPago === 'transferencia' && !folioTransferencia) {
      toast.error('Debes proporcionar el folio de la transferencia')
      return
    }

    if (!telefono || telefono.length < 10) {
      toast.error('Debes proporcionar un número de teléfono válido')
      return
    }

    // ✅ NUEVA VALIDACIÓN: Confirmación extra para días opcionales (domingos)
    if (esOpcional) {
      const confirmacion = window.confirm(
        '⚠️ Has seleccionado un domingo (día opcional).\n\n' +
        'La disponibilidad puede variar. Te recomendamos contactar al barbero ' +
        'para confirmar que estará disponible en el horario seleccionado.\n\n' +
        '¿Deseas continuar con la reserva?'
      )

      if (!confirmacion) {
        return // El usuario canceló
      }
    }

    try {
      setLoading(true)

      const res = await fetch('/api/citas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          id_cliente: user.id,
          id_barbero: Number(barberoId),
          id_servicio: Number(servicioId),
          fecha,
          hora,
          telefono,
          forma_pago: formaPago,
          folio_transferencia: folioTransferencia || null
        })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'No se pudo agendar la cita')

      // Mostrar ticket de confirmación
      setCitaAgendada({
        id: data.id,
        fecha,
        hora,
        barbero: data.barbero || barberos.find(b => b.id === Number(barberoId))?.nombre || '',
        codigo: data.codigo_reserva,
        servicio: servicioSeleccionado?.nombre || '',
        precio: servicioSeleccionado?.precio || 0,
        telefono,
        forma_pago: formaPago,
        folio_transferencia: folioTransferencia || undefined
      })

      toast.success('Cita agendada correctamente. Revisa tu correo.', {
        position: 'bottom-center',
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #4ade80'
        }
      })

      // Resetear formulario
      setFecha('')
      setHora('')
      setBarberoId('')
      setServicioId('')
      setTelefono('')
      setFormaPago('')
      setFolioTransferencia('')
      setHorasDisponibles([])

    } catch (err: any) {
      toast.error(err.message || 'Error al agendar cita', {
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

  const isFormValid = () => {
    const basicFields = fecha && hora && barberoId && servicioId && telefono && formaPago
    const paymentValid = formaPago === 'establecimiento' || (formaPago === 'transferencia' && folioTransferencia)
    return basicFields && paymentValid
  }

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  }

  return (
    <main className={`bg-[#0a0a0a] text-white min-h-screen ${barberFont.variable} ${vintageFont.variable}`}>
      {/* Hero Section */}
      <section className="relative h-64 md:h-96 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center filter brightness-50 contrast-110"
          style={{ backgroundPosition: 'center 30%' }}
        />

        <motion.div
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight leading-tight font-barber">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
              Agenda tu Cita
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-vintage">
            Reserva con nuestros expertos barberos
          </p>
        </motion.div>
      </section>

      {/* Formulario y Ticket */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulario de Cita */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gray-900/50 p-8 rounded-xl border border-gray-700"
          >
            <h2 className="text-3xl font-bold mb-6 font-barber">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
                Reserva tu Turno
              </span>
            </h2>

            <form onSubmit={handleAgendar} className="space-y-6">
              {/* Teléfono */}
              <div>
                <label className="flex items-center gap-2 text-gray-300 mb-2 font-vintage">
                  <Phone size={18} /> Número de Teléfono *
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Ejemplo: 5551234567"
                  required
                />
              </div>

              {/* Servicio */}
              <div>
                <label className="flex items-center gap-2 text-gray-300 mb-2 font-vintage">
                  <Scissors size={18} /> Elige tu Servicio *
                </label>
                <select
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                  value={servicioId}
                  onChange={(e) => setServicioId(e.target.value)}
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
                    {servicioSeleccionado.descripcion && (
                      <p className="text-gray-400 text-sm mt-1">
                        {servicioSeleccionado.descripcion}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-300 mb-2 font-vintage">
                  <CalendarIcon size={18} /> Fecha *
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                  value={fecha}
                  onChange={(e) => {
                    const selectedDate = e.target.value
                    //console.log('Fecha seleccionada:', selectedDate)

                    setFecha(selectedDate)
                    setHora('') // Limpiar hora cuando cambie la fecha
                  }}
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
                <label className="flex items-center gap-2 text-gray-300 mb-2 font-vintage">
                  <User size={18} /> Selecciona tu Barbero *
                </label>
                <select
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                  value={barberoId}
                  onChange={(e) => {
                    setBarberoId(e.target.value)
                    setHora('')
                  }}
                  required
                >
                  <option value="">-- Selecciona un barbero --</option>
                  {barberos.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nombre} {b.especialidad && `- ${b.especialidad}`}
                    </option>
                  ))}
                </select>
              </div>

              {fecha && barberoId && (
                <div>
                  <label className="flex items-center gap-2 text-gray-300 mb-2 font-vintage">
                    <Clock size={18} /> Hora Disponible *
                  </label>

                  {/* Mensaje especial para días opcionales */}
                  {esOpcional && (
                    <div className="mb-3 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-400 mb-2">
                        <AlertTriangle size={18} />
                        <span className="font-semibold font-barber">Día Opcional - Domingo</span>
                      </div>
                      <p className="text-yellow-300 text-sm mb-2 font-vintage">
                        Los domingos la disponibilidad puede variar. Te recomendamos contactar
                        al barbero antes de tu cita para confirmar que estará disponible.
                      </p>
                      <div className="flex items-center gap-2 text-yellow-200 text-sm">
                        <Phone size={14} />
                        <span>Contacto: +52 953 186 1790</span>
                      </div>
                    </div>
                  )}

                  {mensajeHorario && (
                    <p className={`text-sm mb-2 font-vintage ${esOpcional ? 'text-yellow-400' : 'text-gray-400'
                      }`}>
                      {mensajeHorario}
                    </p>
                  )}

                  <select
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
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

                  {horasDisponibles.length === 0 && (
                    <p className="text-red-400 text-sm mt-1 font-vintage">
                      {mensajeHorario || 'No hay horarios disponibles para este día'}
                    </p>
                  )}
                </div>
              )}

              {/* Forma de Pago */}
              <div>
                <label className="flex items-center gap-2 text-gray-300 mb-2 font-vintage">
                  <CreditCard size={18} /> Forma de Pago *
                </label>
                <select
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                  value={formaPago}
                  onChange={(e) => setFormaPago(e.target.value)}
                  required
                >
                  <option value="">-- Selecciona forma de pago --</option>
                  <option value="establecimiento">Pago en establecimiento</option>
                  <option value="transferencia">Transferencia bancaria</option>
                </select>
              </div>

              {/* Tarjeta de información bancaria */}
              {formaPago === 'transferencia' && (
                <>
                  <PaymentCard />
                  <div>
                    <label className="flex items-center gap-2 text-gray-300 mb-2 font-vintage">
                      <Receipt size={18} /> Folio/Referencia de Transferencia *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                      value={folioTransferencia}
                      onChange={(e) => setFolioTransferencia(e.target.value)}
                      placeholder="Ingresa el folio o referencia de tu transferencia"
                      required
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      Este folio nos ayudará a identificar tu pago
                    </p>
                  </div>
                </>
              )}

              <motion.button
                type="submit"
                disabled={loading || !isFormValid()}
                whileHover={{ scale: loading ? 1 : 1.03 }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
                className={`w-full px-6 py-3 bg-gradient-to-r from-red-700 to-blue-700 hover:from-red-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/20 ${loading || !isFormValid() ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  'Confirmar Cita'
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Ticket de Confirmación o Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {citaAgendada ? (
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-xl border border-gray-700 shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-center font-barber text-red-500">
                  TU CITA ESTÁ CONFIRMADA
                </h2>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="text-red-500">
                      <CalendarIcon size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white font-barber">Fecha</h3>
                      <p className="text-gray-300 font-vintage">
                        {formatTicketDate(citaAgendada.fecha)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-red-500">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white font-barber">Hora</h3>
                      <p className="text-gray-300 font-vintage">{citaAgendada.hora}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-red-500">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white font-barber">Barbero</h3>
                      <p className="text-gray-300 font-vintage">{citaAgendada.barbero}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-red-500">
                      <Scissors size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white font-barber">Servicio</h3>
                      <p className="text-gray-300 font-vintage">{citaAgendada.servicio}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-red-500">
                      <DollarSign size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white font-barber">Precio</h3>
                      <p className="text-gray-300 font-vintage">${citaAgendada.precio}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-red-500">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white font-barber">Teléfono</h3>
                      <p className="text-gray-300 font-vintage">{citaAgendada.telefono}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-red-500">
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white font-barber">Forma de Pago</h3>
                      <p className="text-gray-300 font-vintage">
                        {citaAgendada.forma_pago === 'establecimiento' ? 'Pago en establecimiento' : 'Transferencia bancaria'}
                      </p>
                      {citaAgendada.folio_transferencia && (
                        <p className="text-blue-300 text-sm">
                          Folio: {citaAgendada.folio_transferencia}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-700">
                    <h3 className="text-xl font-semibold mb-2 text-center text-white font-barber">CÓDIGO DE RESERVA</h3>
                    <div className="bg-black text-center py-3 px-6 rounded-lg border-2 border-red-500">
                      <p className="text-3xl font-bold text-red-500 font-vintage">{citaAgendada.codigo}</p>
                    </div>
                    <p className="text-center text-gray-400 mt-3 font-vintage">
                      Presenta este código al llegar a la barbería
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-700">
                <h2 className="text-3xl font-bold mb-6 font-barber">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
                    Instrucciones
                  </span>
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="text-red-500 mt-1">
                      <CalendarIcon size={18} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white font-barber">Horario de Atención</h3>
                      <p className="text-gray-400 font-vintage">
                        Lunes a Viernes: 8:00 AM - 9:00 PM<br />
                        Sábados: 8:00 AM - 9:00 PM<br />
                        Domingos: Opcional (varía según disponibilidad)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="text-red-500 mt-1">
                      <AlertTriangle size={18} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white font-barber">Política de Cancelación</h3>
                      <p className="text-gray-400 font-vintage">
                        Por favor cancela con al menos 24 horas de anticipación (Consulta a tu barbero).
                      </p>
                    </div>
                  </div>

                  {!user && (
                    <div className="pt-4 border-t border-gray-700">
                      <p className="text-yellow-400 font-vintage">
                        * Debes iniciar sesión para agendar una cita
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  )
}