'use client'

import { useUser } from '../app/hooks/useUser'
import { motion } from 'framer-motion'
import { fadeIn } from '../lib/motion'

export default function DashboardView() {
  const { user } = useUser()

  // Datos de ejemplo para barberos
  const barberAppointments = [
    { id: 1, client: 'Juan Pérez', service: 'Corte Clásico', time: '10:00 AM', status: 'confirmada' },
    { id: 2, client: 'María García', service: 'Afeitado', time: '11:30 AM', status: 'pendiente' }
  ]

  return (
    <div className="space-y-6">
      {user?.rol === 'BARBERO' && (
        <motion.div
          variants={fadeIn('up', 'spring', 0.2, 1)}
          className="bg-gray-800/70 rounded-xl p-6 border border-gray-700"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Mis Citas de Hoy</h2>
          <div className="space-y-3">
            {barberAppointments.map(appointment => (
              <div key={appointment.id} className="p-4 bg-gray-700/30 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-white">{appointment.client}</h3>
                  <p className="text-sm text-gray-300">{appointment.service} • {appointment.time}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  appointment.status === 'confirmada' ? 'bg-green-900/30 text-green-400' :
                  appointment.status === 'pendiente' ? 'bg-yellow-900/30 text-yellow-400' :
                  'bg-red-900/30 text-red-400'
                }`}>
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}