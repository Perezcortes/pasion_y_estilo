'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Oswald, Anton } from 'next/font/google'
import { Calendar as CalendarIcon, Clock, Scissors, User, AlertTriangle } from 'lucide-react'
import { useUser } from '../../hooks/useUser'

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

interface CitaAgendada {
  id: number
  fecha: string
  hora: string
  barbero: string
  codigo: string
  servicio: string
}

const serviciosDisponibles = [
  'Corte clásico',
  'Corte moderno',
  'Afeitado tradicional',
  'Arreglo de barba',
  'Corte y barba',
  'Tinte de cabello',
  'Peinado especial'
]

export default function AgendarCitaPage() {
  const { user } = useUser()
  const router = useRouter()

  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [barberoId, setBarberoId] = useState('')
  const [servicio, setServicio] = useState('')
  const [barberos, setBarberos] = useState<Barbero[]>([])
  const [loading, setLoading] = useState(false)
  const [citaAgendada, setCitaAgendada] = useState<CitaAgendada | null>(null)
  const [horasDisponibles, setHorasDisponibles] = useState<string[]>([])
  const [mensajeHorario, setMensajeHorario] = useState('')

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

  // Obtener horarios disponibles cuando cambia fecha o barbero
  useEffect(() => {
    if (fecha && barberoId) {
      fetchHorariosDisponibles()
    } else {
      setHorasDisponibles([])
      setMensajeHorario('')
    }
  }, [fecha, barberoId])

  const fetchHorariosDisponibles = async () => {
    try {
      const token = localStorage.getItem('token') || ''
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
      
      if (data.mensaje) {
        setMensajeHorario(data.mensaje)
        setHorasDisponibles([])
        return
      }

      setHorasDisponibles(data.horarios)
      setMensajeHorario(`Horarios disponibles para ${data.dia}`)

    } catch (error: any) {
      console.error('Error al obtener horarios:', error)
      toast.error(error.message || 'Error al cargar horarios disponibles')
      setHorasDisponibles([])
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
          fecha,
          hora,
          servicio
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
        servicio: data.servicio
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
      setServicio('')
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
              <div>
                <label className="flex items-center gap-2 text-gray-300 mb-2 font-vintage">
                  <CalendarIcon size={18} /> Fecha
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                  value={fecha}
                  onChange={(e) => {
                    setFecha(e.target.value)
                    setHora('')
                  }}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-gray-300 mb-2 font-vintage">
                  <Scissors size={18} /> Selecciona tu Barbero
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
                <>
                  <div>
                    <label className="flex items-center gap-2 text-gray-300 mb-2 font-vintage">
                      <Clock size={18} /> Hora Disponible
                    </label>
                    {mensajeHorario && (
                      <p className="text-sm mb-2 text-gray-400">{mensajeHorario}</p>
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
                          {hora}
                        </option>
                      ))}
                    </select>
                    {horasDisponibles.length === 0 && (
                      <p className="text-red-400 text-sm mt-1">
                        {mensajeHorario || 'No hay horarios disponibles para este día'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-300 mb-2 font-vintage">
                      <Scissors size={18} /> Servicio
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                      value={servicio}
                      onChange={(e) => setServicio(e.target.value)}
                      required
                    >
                      <option value="">-- Selecciona un servicio --</option>
                      {serviciosDisponibles.map((serv) => (
                        <option key={serv} value={serv}>
                          {serv}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              
              <motion.button
                type="submit"
                disabled={loading || !fecha || !hora || !barberoId || !servicio}
                whileHover={{ scale: loading ? 1 : 1.03 }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
                className={`w-full px-6 py-3 bg-gradient-to-r from-red-700 to-blue-700 hover:from-red-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/20 ${
                  loading || !fecha || !hora || !barberoId || !servicio ? 'opacity-70 cursor-not-allowed' : ''
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
                        {new Date(citaAgendada.fecha).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
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
                        Sábados: 9:00 AM - 7:00 PM<br />
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
                        Por favor cancela con al menos 24 horas de anticipación.
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