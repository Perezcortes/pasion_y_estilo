'use client'

import { useUser } from '../app/hooks/useUser'
import { motion } from 'framer-motion'
import { fadeIn } from '../lib/motion'

interface Appointment {
  id: number;
  client: string;
  service: string;
  time: string;
  status: string;
  barber?: string; // Propiedad opcional
}

export default function AppointmentsView() {
  const { user } = useUser()

  // Datos de ejemplo con tipo explícito
  const appointments: Appointment[] = user?.rol === 'ADMIN' 
    ? [
        { id: 1, client: 'Juan Pérez', service: 'Corte Clásico', time: '10:00 AM', barber: 'Carlos', status: 'confirmada' },
        { id: 2, client: 'María García', service: 'Afeitado', time: '11:30 AM', barber: 'Luis', status: 'pendiente' }
      ]
    : [
        { id: 1, client: 'Cliente 1', service: 'Corte', time: '09:00 AM', status: 'confirmada' },
        { id: 2, client: 'Cliente 2', service: 'Barba', time: '11:00 AM', status: 'pendiente' }
      ]

  return (
    <motion.div
      variants={fadeIn('up', 'spring', 0.2, 1)}
      className="bg-gray-800/70 rounded-xl p-6 border border-gray-700"
    >
      <h2 className="text-lg font-semibold text-white mb-4">
        {user?.rol === 'ADMIN' ? 'Todas las Citas' : 'Mis Próximas Citas'}
      </h2>
      
      <div className="space-y-3">
        {appointments.map(appointment => (
          <div 
            key={appointment.id} 
            className="p-4 bg-gray-700/30 rounded-lg flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium text-white">{appointment.client}</h3>
              <p className="text-sm text-gray-300">
                {appointment.service} • {appointment.time}
                {user?.rol === 'ADMIN' && appointment.barber && ` • ${appointment.barber}`}
              </p>
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
  )
}