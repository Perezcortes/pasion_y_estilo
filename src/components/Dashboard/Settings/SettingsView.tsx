'use client'

import { useState } from 'react'
import { Crown, Settings, Bell, Store, Calendar, Target, Gift, BarChart3, Phone, Clock, CheckCircle } from 'lucide-react'
import { useUser } from '../../../app/hooks/useUser'
import LoyalClientsManagement from './LoyalClientsManagement'

export default function SettingsView() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('loyal-clients')

  // Permitir acceso a ADMIN y BARBERO
  if (!user || (user.rol !== 'ADMIN' && user.rol !== 'BARBERO')) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400">
        <div className="text-center">
          <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No tienes permisos para ver esta sección</p>
        </div>
      </div>
    )
  }

  const tabs = [
    {
      id: 'loyal-clients',
      name: 'Clientes Fieles',
      icon: Crown,
      description: 'Gestión de recompensas y fidelidad'
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Tabs Navigation */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-xl overflow-hidden">
          {/* Mobile tabs - Horizontal scroll */}
          <div className="sm:hidden">
            <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-700">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 flex items-center gap-2 py-4 px-6 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-950/30'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Desktop tabs */}
          <div className="hidden sm:flex border-b border-gray-700">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-950/30'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold">{tab.name}</div>
                    <div className="text-xs opacity-70 hidden lg:block">{tab.description}</div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {activeTab === 'loyal-clients' && (
              <div>
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Crown className="w-6 h-6 text-amber-400" />
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      Sistema de Clientes Fieles
                    </h2>
                  </div>
                  <p className="text-gray-400 mb-6 text-sm sm:text-base">
                    Identifica y gestiona clientes leales para ofrecerles recompensas y promociones personalizadas. 
                    El sistema analiza automáticamente el historial de citas para generar recomendaciones.
                  </p>
                  
                  {/* Quick Stats Cards - Responsive Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/40 rounded-lg p-4 border border-amber-500/20 shadow-lg">
                      <div className="flex items-center gap-3">
                        <Crown className="w-8 h-8 text-amber-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-amber-200 text-sm font-medium">Clientes VIP</div>
                          <div className="text-amber-100 font-bold text-xs sm:text-sm">Automático 20+ citas</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 rounded-lg p-4 border border-blue-500/20 shadow-lg">
                      <div className="flex items-center gap-3">
                        <Target className="w-8 h-8 text-blue-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-blue-200 text-sm font-medium">Detección inteligente</div>
                          <div className="text-blue-100 font-bold text-xs sm:text-sm">Patrones de fidelidad</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/40 rounded-lg p-4 border border-emerald-500/20 shadow-lg">
                      <div className="flex items-center gap-3">
                        <Gift className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-emerald-200 text-sm font-medium">Recomendaciones</div>
                          <div className="text-emerald-100 font-bold text-xs sm:text-sm">Automáticas</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-violet-900/40 to-violet-800/40 rounded-lg p-4 border border-violet-500/20 shadow-lg">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-violet-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-violet-200 text-sm font-medium">Análisis completo</div>
                          <div className="text-violet-100 font-bold text-xs sm:text-sm">Tiempo real</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <LoyalClientsManagement />
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Bell className="w-6 h-6 text-gray-400" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Configuración de Notificaciones</h2>
                </div>
                
                <div className="space-y-6">
                  {/* Notificaciones de citas */}
                  <div className="bg-gray-700/30 rounded-lg p-4 sm:p-6 border border-gray-600/50 shadow-lg">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      Notificaciones de Citas
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-600/30 rounded-lg border border-gray-500/30">
                        <div className="flex-1 min-w-0 mr-4">
                          <div className="text-white font-medium">Recordatorio 24h antes</div>
                          <div className="text-sm text-gray-400">Enviar recordatorio un día antes de la cita</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-600/30 rounded-lg border border-gray-500/30">
                        <div className="flex-1 min-w-0 mr-4">
                          <div className="text-white font-medium">Recordatorio 2h antes</div>
                          <div className="text-sm text-gray-400">Recordatorio el día de la cita</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Notificaciones de clientes fieles */}
                  <div className="bg-gray-700/30 rounded-lg p-4 sm:p-6 border border-gray-600/50 shadow-lg">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Crown className="w-5 h-5 text-amber-400" />
                      Alertas de Clientes Fieles
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-600/30 rounded-lg border border-gray-500/30">
                        <div className="flex-1 min-w-0 mr-4">
                          <div className="text-white font-medium">Notificar cliente VIP</div>
                          <div className="text-sm text-gray-400">Alerta cuando un cliente alcance estatus VIP</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-600/30 rounded-lg border border-gray-500/30">
                        <div className="flex-1 min-w-0 mr-4">
                          <div className="text-white font-medium">Cliente ausente</div>
                          <div className="text-sm text-gray-400">Notificar cuando un cliente fiel no venga por mucho tiempo</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Guardar Configuración
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}