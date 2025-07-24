'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useUser } from '../../hooks/useUser'

interface Barbero {
  id: number
  nombre: string
}

export default function AgendarCitaPage() {
  const { user } = useUser()
  const router = useRouter()

  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [barberoId, setBarberoId] = useState('')
  const [barberos, setBarberos] = useState<Barbero[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchBarberos = async () => {
      try {
        const res = await fetch('/api/barberos')
        const data = await res.json()
        setBarberos(data)
      } catch (error) {
        toast.error('Error al cargar barberos')
      }
    }

    fetchBarberos()
  }, [])

  const handleAgendar = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.warning('Debes iniciar sesión o registrarte para agendar una cita.')
      return
    }

    try {
      setLoading(true)

      const res = await fetch('/api/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_cliente: user.id,
          id_barbero: Number(barberoId),
          fecha,
          hora
        })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'No se pudo agendar la cita')

      toast.success('Cita agendada correctamente. Revisa tu correo.')
      setFecha('')
      setHora('')
      setBarberoId('')
    } catch (err: any) {
      toast.error(err.message || 'Error al agendar cita')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Agendar una cita</h1>
      <form onSubmit={handleAgendar} className="space-y-4 bg-white p-6 rounded-2xl shadow-md">
        <div>
          <label className="block text-sm font-semibold">Fecha</label>
          <input
            type="date"
            className="w-full border p-2 rounded-md"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            disabled={!user}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Hora</label>
          <input
            type="time"
            className="w-full border p-2 rounded-md"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            required
            disabled={!user}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Selecciona barbero</label>
          <select
            className="w-full border p-2 rounded-md"
            value={barberoId}
            onChange={(e) => setBarberoId(e.target.value)}
            required
            disabled={!user}
          >
            <option value="">-- Selecciona un barbero --</option>
            {barberos.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nombre}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading || !user}
          className={`w-full py-2 rounded-md transition
            ${!user ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 text-white'}
          `}
        >
          {loading ? 'Agendando...' : 'Agendar Cita'}
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </section>
  )
}
