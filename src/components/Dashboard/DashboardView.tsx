'use client'

import { useUser } from '../../app/hooks/useUser'
import { useBarberoStats } from '../../app/hooks/useBarberoStats'
import { motion } from 'framer-motion'
import { fadeIn } from '../../lib/motion'
import BarberoCharts from './BarberoCharts'
import { FiRefreshCw, FiAlertCircle } from 'react-icons/fi'
import { Scissors } from 'lucide-react'

export default function DashboardView() {
  const { user } = useUser()
  const { stats, loading, error, refetch } = useBarberoStats()

  return (
    <div className="space-y-6">
      {user?.rol === 'BARBERO' && (
        <motion.div
          variants={fadeIn('up', 'spring', 0.2, 1)}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Header personalizado */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                ¡Bienvenido, {user.nombre}!
                <Scissors className="w-6 h-6 text-blue-400" />
              </h1>
              <p className="text-gray-400 mt-1">
                Aquí tienes un resumen de tu actividad como barbero
              </p>
            </div>

            {/* Botón de actualizar */}
            <button
              onClick={refetch}
              disabled={loading}
              className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiRefreshCw className={`text-gray-400 ${loading ? 'animate-spin' : ''}`} size={16} />
              <span className="text-gray-300 text-sm">
                {loading ? 'Actualizando...' : 'Actualizar'}
              </span>
            </button>
          </div>

          {/* Manejo de errores */}
          {error && (
            <motion.div
              variants={fadeIn('up', 'spring', 0.3, 1)}
              className="bg-red-900/20 border border-red-500/30 rounded-xl p-4"
            >
              <div className="flex items-center space-x-3">
                <FiAlertCircle className="text-red-400" size={20} />
                <div>
                  <h3 className="text-red-400 font-medium">Error al cargar datos</h3>
                  <p className="text-gray-400 text-sm mt-1">{error}</p>
                  <button
                    onClick={refetch}
                    className="text-red-400 hover:text-red-300 underline text-sm mt-2"
                  >
                    Intentar de nuevo
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Componente de gráficos */}
          <motion.div
            variants={fadeIn('up', 'spring', 0.4, 1)}
          >
            <BarberoCharts stats={stats} loading={loading} />
          </motion.div>

          {/* Mensaje de motivación */}
          {!loading && stats && (
            <motion.div
              variants={fadeIn('up', 'spring', 0.5, 1)}
              className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20"
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">
                  💪 ¡Sigue así, {user.nombre}!
                </h3>
                <p className="text-gray-300 text-sm">
                  {stats.resumen.citasHoy.total > 0
                    ? `Has atendido ${stats.resumen.citasHoy.total} cliente${stats.resumen.citasHoy.total !== 1 ? 's' : ''} hoy. ¡Excelente trabajo!`
                    : 'Aún no tienes citas completadas hoy, pero el día apenas comienza.'
                  }
                  {stats.proximasCitas.length > 0 && (
                    ` Tienes ${stats.proximasCitas.length} cita${stats.proximasCitas.length !== 1 ? 's' : ''} próxima${stats.proximasCitas.length !== 1 ? 's' : ''}.`
                  )}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  )
}