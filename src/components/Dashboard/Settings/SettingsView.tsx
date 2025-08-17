'use client'

import { useState } from 'react'
import { useUser } from '../../../app/hooks/useUser'
import LoyalClientsManagement from './LoyalClientsManagement'

export default function SettingsView() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('loyal-clients')

  if (user?.rol !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center h-64 text-red-400">
        No tienes permisos para ver esta sección
      </div>
    )
  }

  const tabs = [
    {
      id: 'loyal-clients',
      name: 'Clientes Fieles',
      icon: '👑',
      description: 'Gestión de recompensas y fidelidad'
    },
    {
      id: 'general',
      name: 'Configuración General',
      icon: '⚙️',
      description: 'Configuraciones del sistema'
    },
    {
      id: 'notifications',
      name: 'Notificaciones',
      icon: '🔔',
      description: 'Configurar alertas y notificaciones'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800/70 rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-2">Configuración del Sistema</h2>
        <p className="text-gray-400">Gestiona la configuración y herramientas administrativas</p>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-gray-800/70 rounded-xl border border-gray-700">
        <div className="flex border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-900/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <div className="text-left">
                <div>{tab.name}</div>
                <div className="text-xs opacity-70">{tab.description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'loyal-clients' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Sistema de Clientes Fieles
                </h3>
                <p className="text-gray-400 mb-4">
                  Identifica y gestiona clientes leales para ofrecerles recompensas y promociones personalizadas. 
                  El sistema analiza automáticamente el historial de citas para generar recomendaciones.
                </p>
                
                {/* Quick Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-purple-900/50 to-purple-800/50 rounded-lg p-4 border border-purple-500/30">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">👑</span>
                      <div>
                        <div className="text-purple-200 text-sm">Clientes VIP</div>
                        <div className="text-purple-100 font-bold">Automático 20+ citas</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 rounded-lg p-4 border border-blue-500/30">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎯</span>
                      <div>
                        <div className="text-blue-200 text-sm">Detección inteligente</div>
                        <div className="text-blue-100 font-bold">Patrones de fidelidad</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-900/50 to-green-800/50 rounded-lg p-4 border border-green-500/30">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎁</span>
                      <div>
                        <div className="text-green-200 text-sm">Recomendaciones</div>
                        <div className="text-green-100 font-bold">Automáticas</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-900/50 to-yellow-800/50 rounded-lg p-4 border border-yellow-500/30">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📊</span>
                      <div>
                        <div className="text-yellow-200 text-sm">Análisis completo</div>
                        <div className="text-yellow-100 font-bold">Tiempo real</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <LoyalClientsManagement />
            </div>
          )}

          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Configuración General</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Configuraciones del negocio */}
                  <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                    <h4 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                      <span>🏪</span>
                      Información del Negocio
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Nombre del establecimiento</label>
                        <input 
                          type="text" 
                          className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                          defaultValue="Pérez Cortes - Pasión y Estilo"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Horario de atención</label>
                        <input 
                          type="text" 
                          className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                          defaultValue="Lunes a Sábado 8:00 AM - 9:00 PM"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Teléfono de contacto</label>
                        <input 
                          type="tel" 
                          className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                          placeholder="(953) 123-4567"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Configuraciones de citas */}
                  <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                    <h4 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                      <span>📅</span>
                      Configuración de Citas
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Duración promedio por cita (minutos)</label>
                        <input 
                          type="number" 
                          className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                          defaultValue="45"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Tiempo de anticipación mínimo (horas)</label>
                        <input 
                          type="number" 
                          className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                          defaultValue="2"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="allowCancelation"
                          className="rounded"
                        />
                        <label htmlFor="allowCancelation" className="text-sm text-gray-300">
                          Permitir cancelación de citas
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                    Guardar Configuración
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Configuración de Notificaciones</h3>
                
                <div className="space-y-4">
                  {/* Notificaciones de citas */}
                  <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                    <h4 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                      <span>📅</span>
                      Notificaciones de Citas
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white">Recordatorio 24h antes</div>
                          <div className="text-sm text-gray-400">Enviar recordatorio un día antes de la cita</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white">Recordatorio 2h antes</div>
                          <div className="text-sm text-gray-400">Recordatorio el día de la cita</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Notificaciones de clientes fieles */}
                  <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                    <h4 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                      <span>👑</span>
                      Alertas de Clientes Fieles
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white">Notificar cliente VIP</div>
                          <div className="text-sm text-gray-400">Alerta cuando un cliente alcance estatus VIP</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white">Cliente ausente</div>
                          <div className="text-sm text-gray-400">Notificar cuando un cliente fiel no venga por mucho tiempo</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                    Guardar Configuración
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}