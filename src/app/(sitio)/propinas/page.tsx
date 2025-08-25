'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Oswald, Anton } from 'next/font/google'
import {
    Star,
    User,
    Scissors,
    DollarSign,
    MessageCircle,
    CreditCard,
    Heart
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
    especialidad?: string
    experiencia?: string
}

interface Propina {
    id: number
    barbero_id: number
    nombre_cliente: string
    email_cliente?: string
    monto: number
    mensaje: string
    calificacion: number
    fecha_creacion: string
    barbero_nombre?: string
}

export default function PropinasPage() {
    const { user } = useUser()
    const router = useRouter()

    // Estados del formulario
    const [barberoId, setBarberoId] = useState('')
    const [monto, setMonto] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [calificacion, setCalificacion] = useState(0)
    const [metodoPago, setMetodoPago] = useState('transferencia')
    const [referenciaPago, setReferenciaPago] = useState('')

    // Estados de datos
    const [barberos, setBarberos] = useState<Barbero[]>([])
    const [propinas, setPropinas] = useState<Propina[]>([])
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

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

    // Obtener propinas existentes
    useEffect(() => {
        const fetchPropinas = async () => {
            try {
                const res = await fetch('/api/propinas')

                if (!res.ok) {
                    const errorData = await res.json()
                    throw new Error(errorData.error || 'Error al cargar propinas')
                }

                const data = await res.json()
                setPropinas(data)
            } catch (error: any) {
                console.error('Error al cargar propinas:', error)
                toast.error(error.message || 'Error al cargar las propinas existentes')
            }
        }
        fetchPropinas()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user) {
            toast.error('Debes iniciar sesión para dejar una propina.', {
                icon: '🔒',
                position: 'bottom-center',
                style: {
                    background: '#1a1a1a',
                    color: '#fff',
                    border: '1px solid #e53e3e'
                }
            })
            return router.push('/login')
        }

        if (!barberoId || !monto || calificacion === 0) {
            toast.error('Completa todos los campos obligatorios')
            return
        }

        if (metodoPago === 'transferencia' && !referenciaPago) {
            toast.error('Debes proporcionar la referencia de pago')
            return
        }

        try {
            setSubmitting(true)

            const res = await fetch('/api/propinas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify({
                    barbero_id: Number(barberoId),
                    monto: Number(monto),
                    mensaje,
                    calificacion,
                    metodo_pago: metodoPago,
                    referencia_pago: referenciaPago || null
                })
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || 'No se pudo enviar la propina')

            // Actualizar lista de propinas
            setPropinas(prev => [data, ...prev])

            // Resetear formulario
            setBarberoId('')
            setMonto('')
            setMensaje('')
            setCalificacion(0)
            setReferenciaPago('')

            toast.success('¡Propina enviada con éxito! Gracias por tu generosidad.', {
                position: 'bottom-center',
                style: {
                    background: '#1a1a1a',
                    color: '#fff',
                    border: '1px solid #4ade80'
                }
            })

        } catch (err: any) {
            toast.error(err.message || 'Error al enviar la propina', {
                position: 'bottom-center',
                style: {
                    background: '#1a1a1a',
                    color: '#fff',
                    border: '1px solid #e53e3e'
                }
            })
        } finally {
            setSubmitting(false)
        }
    }

    const renderStars = (rating: number) => {
        return Array(5).fill(0).map((_, i) => (
            <Star
                key={i}
                size={20}
                className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}
            />
        ))
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
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
            <section className="relative h-96 md:h-screen/2 flex items-center justify-center overflow-hidden">
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
                            Apoya a Nuestros Barberos
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 font-vintage">
                        Deja una propina y comparte tu experiencia
                    </p>
                </motion.div>
            </section>

            {/* Contenido Principal */}
            <section className="py-16 px-6 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Formulario de Propina */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="bg-gray-900/50 p-8 rounded-xl border border-gray-700"
                    >
                        <h2 className="text-3xl font-bold mb-6 font-barber">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
                                Dejar Propina
                            </span>
                        </h2>

                        {!user ? (
                            <div className="text-center py-8">
                                <p className="text-gray-300 mb-4">Debes iniciar sesión para dejar una propina</p>
                                <button
                                    onClick={() => router.push('/login')}
                                    className="px-6 py-3 bg-gradient-to-r from-red-700 to-blue-700 text-white font-medium rounded-lg transition-all duration-300"
                                >
                                    Iniciar Sesión
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Seleccionar Barbero */}
                                <div>
                                    <label className="flex items-center gap-2 text-gray-300 mb-2 font-vintage">
                                        <User size={18} /> Selecciona un Barbero *
                                    </label>
                                    <select
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                                        value={barberoId}
                                        onChange={(e) => setBarberoId(e.target.value)}
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

                                {/* Monto de Propina */}
                                <div>
                                    <label className="flex items-center gap-2 text-gray-300 mb-2 font-vintage">
                                        <DollarSign size={18} /> Monto de Propina (MXN) *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        step="0.01"
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                                        value={monto}
                                        onChange={(e) => setMonto(e.target.value)}
                                        placeholder="Ejemplo: 50.00"
                                        required
                                    />
                                </div>

                                {/* Calificación con Estrellas */}
                                <div>
                                    <label className="flex items-center gap-2 text-gray-300 mb-2 font-vintage">
                                        <Star size={18} /> Calificación *
                                    </label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setCalificacion(star)}
                                                className="p-1 transition-transform hover:scale-110"
                                            >
                                                <Star
                                                    size={32}
                                                    className={star <= calificacion ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-gray-400 text-sm mt-1">
                                        {calificacion === 0 ? 'Selecciona una calificación' :
                                            calificacion === 1 ? 'Muy malo' :
                                                calificacion === 2 ? 'Malo' :
                                                    calificacion === 3 ? 'Regular' :
                                                        calificacion === 4 ? 'Bueno' : 'Excelente'}
                                    </p>
                                </div>

                                {/* Mensaje */}
                                <div>
                                    <label className="flex items-center gap-2 text-gray-300 mb-2 font-vintage">
                                        <MessageCircle size={18} /> Mensaje (Opcional)
                                    </label>
                                    <textarea
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                                        value={mensaje}
                                        onChange={(e) => setMensaje(e.target.value)}
                                        placeholder="Comparte tu experiencia con este barbero..."
                                        rows={4}
                                    />
                                </div>

                                {/* Método de Pago */}
                                <div>
                                    <label className="flex items-center gap-2 text-gray-300 mb-2 font-vintage">
                                        <CreditCard size={18} /> Método de Pago *
                                    </label>
                                    <select
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                                        value={metodoPago}
                                        onChange={(e) => setMetodoPago(e.target.value)}
                                        required
                                    >
                                        <option value="transferencia">Transferencia bancaria</option>
                                        {/*<option value="efectivo">Efectivo (en establecimiento)</option>*/}
                                    </select>
                                </div>

                                {/* Referencia de Pago (solo para transferencia) */}
                                {metodoPago === 'transferencia' && (
                                    <>
                                        <PaymentCard />
                                        <div>
                                            <label className="flex items-center gap-2 text-gray-300 mb-2 font-vintage">
                                                Referencia/Folio de Transferencia *
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                                                value={referenciaPago}
                                                onChange={(e) => setReferenciaPago(e.target.value)}
                                                placeholder="Ingresa la referencia de tu transferencia"
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                <motion.button
                                    type="submit"
                                    disabled={submitting}
                                    whileHover={{ scale: submitting ? 1 : 1.03 }}
                                    whileTap={{ scale: submitting ? 1 : 0.97 }}
                                    className={`w-full px-6 py-3 bg-gradient-to-r from-red-700 to-blue-700 hover:from-red-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/20 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {submitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Enviando...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <Heart size={20} /> Enviar Propina
                                        </span>
                                    )}
                                </motion.button>
                            </form>
                        )}
                    </motion.div>

                    {/* Reseñas de Propinas Existentes */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-700">
                            <h2 className="text-3xl font-bold mb-6 font-barber">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
                                    Propinas Recientes
                                </span>
                            </h2>

                            {propinas.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                    <p>Aún no hay propinas. ¡Sé el primero en apoyar a nuestros barberos!</p>
                                </div>
                            ) : (
                                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                                    {propinas.map((propina) => (
                                        <div key={propina.id} className="bg-gray-800/40 p-4 rounded-lg border border-gray-700">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">{propina.nombre_cliente}</h3>
                                                    <p className="text-gray-400 text-sm">
                                                        Para {propina.barbero_nombre || `Barbero #${propina.barbero_id}`}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-green-400 font-bold text-lg">${propina.monto}</p>
                                                    <p className="text-gray-400 text-xs">{formatDate(propina.fecha_creacion)}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 mb-2">
                                                {renderStars(propina.calificacion)}
                                            </div>

                                            {propina.mensaje && (
                                                <p className="text-gray-300 mt-2 italic">"{propina.mensaje}"</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Información Adicional */}
                        <div className="bg-gradient-to-br from-red-900/20 to-blue-900/20 p-6 rounded-xl border border-gray-700">
                            <h3 className="text-xl font-bold mb-4 font-barber text-red-400">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-blue-500">
                                    ¿Por qué dejar propina?
                                </span>
                            </h3>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-start gap-2">
                                    <Heart size={16} className="text-red-500 mt-1 flex-shrink-0" />
                                    <span>Reconoce el excelente trabajo de nuestros barberos</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <DollarSign size={16} className="text-green-500 mt-1 flex-shrink-0" />
                                    <span>Apoya directamente al profesional que te atendió</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Star size={16} className="text-yellow-500 mt-1 flex-shrink-0" />
                                    <span>Motiva a continuar brindando un servicio de calidad</span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    )
}