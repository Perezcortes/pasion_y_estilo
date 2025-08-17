'use client'

import { useState, useEffect } from 'react'
import { X, User, Mail, Save, Loader2, Scissors, Award } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface User {
  id: number
  nombre: string
  correo: string
  rol: string
  estado: string
  especialidad?: string
  experiencia?: string
}

interface DashboardProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
  onUserUpdate?: (updatedUser: User) => void
}

export default function DashboardProfileModal({ 
  isOpen, 
  onClose, 
  user, 
  onUserUpdate 
}: DashboardProfileModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    especialidad: '',
    experiencia: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        correo: user.correo || '',
        especialidad: user.especialidad || '',
        experiencia: user.experiencia || ''
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      toast.error('El nombre es requerido')
      return false
    }

    if (!formData.correo.trim()) {
      toast.error('El correo es requerido')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.correo)) {
      toast.error('Formato de correo inválido')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)

    try {
      const updateData = {
        id: user.id,
        nombre: formData.nombre.trim(),
        correo: formData.correo.trim(),
        rol: user.rol,
        estado: user.estado,
        ...(user.rol === 'BARBERO' && {
          especialidad: formData.especialidad.trim(),
          experiencia: formData.experiencia.trim()
        })
      }

      const response = await fetch('/api/usuarios', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar perfil')
      }

      // Crear objeto de usuario actualizado
      const updatedUser = {
        ...user,
        nombre: formData.nombre.trim(),
        correo: formData.correo.trim(),
        ...(user.rol === 'BARBERO' && {
          especialidad: formData.especialidad.trim(),
          experiencia: formData.experiencia.trim()
        })
      }

      // Llamar callback si existe
      if (onUserUpdate) {
        onUserUpdate(updatedUser)
      }

      toast.success('Perfil actualizado correctamente')
      onClose()
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.message || 'Error al actualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    // Restaurar valores originales
    setFormData({
      nombre: user.nombre || '',
      correo: user.correo || '',
      especialidad: user.especialidad || '',
      experiencia: user.experiencia || ''
    })
    onClose()
  }

  const getRoleColor = (rol: string) => {
    switch (rol) {
      case 'ADMIN':
        return 'bg-red-600/20 text-red-400 border-red-600/30'
      case 'BARBERO':
        return 'bg-blue-600/20 text-blue-400 border-blue-600/30'
      case 'CLIENTE':
        return 'bg-green-600/20 text-green-400 border-green-600/30'
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-600/30'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCancel}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg mx-4 bg-gray-900 rounded-xl border border-gray-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-red-600/20 to-purple-600/20 rounded-lg">
                  <User size={24} className="text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Mi Perfil</h2>
                  <p className="text-gray-400 text-sm">Gestiona tu información personal</p>
                </div>
              </div>
              <button
                onClick={handleCancel}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                {/* Rol Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">Rol actual:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.rol)}`}>
                    {user.rol}
                  </span>
                </div>

                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="Tu nombre completo"
                      required
                    />
                  </div>
                </div>

                {/* Correo */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Campos específicos para BARBERO */}
                {user.rol === 'BARBERO' && (
                  <>
                    <div className="border-t border-gray-700 pt-4 mt-6">
                      <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
                        <Scissors size={16} className="text-red-400" />
                        Información profesional
                      </h3>
                    </div>

                    {/* Especialidad */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Especialidad
                      </label>
                      <div className="relative">
                        <Scissors size={18} className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          name="especialidad"
                          value={formData.especialidad}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                          placeholder="Ej: Cortes clásicos, Barbas, Degradados..."
                        />
                      </div>
                    </div>

                    {/* Experiencia */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Experiencia
                      </label>
                      <div className="relative">
                        <Award size={18} className="absolute left-3 top-3 text-gray-400" />
                        <textarea
                          name="experiencia"
                          value={formData.experiencia}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                          placeholder="Describe tu experiencia, años trabajando, logros..."
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-6 mt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 disabled:opacity-50 text-white rounded-lg transition-all font-medium flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Guardar cambios
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}