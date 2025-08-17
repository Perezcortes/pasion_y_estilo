'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiSave } from 'react-icons/fi'
import { useUser } from '../../app/hooks/useUser'

interface ProfileDashboardProps {
  isOpen: boolean
  onClose: () => void
}

interface UserProfile {
  id: number
  nombre: string
  correo: string
  rol: string
  estado: string
  creado_en: string
  especialidad?: string
  experiencia?: string
}

interface FormData {
  nombre: string
  correo: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function ProfileDashboard({ isOpen, onClose }: ProfileDashboardProps) {
  const { user } = useUser()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    correo: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Cargar datos del perfil
  useEffect(() => {
    if (isOpen && user?.id) {
      loadProfile()
    }
  }, [isOpen, user?.id])

  const loadProfile = async () => {
    if (!user?.id) return

    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/usuarios/${user.id}`)
      const data = await response.json()
      
      if (response.ok) {
        setProfile(data)
        setFormData({
          nombre: data.nombre || '',
          correo: data.correo || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        setError(data.error || 'Error al cargar el perfil')
      }
    } catch (error) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar mensajes al escribir
    if (error) setError('')
    if (success) setSuccess('')
  }

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      setError('El nombre es requerido')
      return false
    }

    if (!formData.correo.trim()) {
      setError('El correo es requerido')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.correo)) {
      setError('Ingresa un correo válido')
      return false
    }

    // Si está cambiando contraseña
    if (isChangingPassword) {
      if (!formData.currentPassword) {
        setError('Debes ingresar tu contraseña actual')
        return false
      }

      if (!formData.newPassword) {
        setError('Debes ingresar la nueva contraseña')
        return false
      }

      if (formData.newPassword.length < 6) {
        setError('La nueva contraseña debe tener al menos 6 caracteres')
        return false
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    if (!user?.id) return

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const updateData: any = {
        nombre: formData.nombre.trim(),
        correo: formData.correo.trim()
      }

      // Solo incluir contraseñas si está cambiando
      if (isChangingPassword) {
        updateData.currentPassword = formData.currentPassword
        updateData.newPassword = formData.newPassword
      }

      const response = await fetch(`/api/usuarios/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Perfil actualizado correctamente')
        
        // Limpiar campos de contraseña
        if (isChangingPassword) {
          setFormData(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }))
          setIsChangingPassword(false)
        }
        
        // Recargar perfil
        await loadProfile()
        
        // Cerrar modal después de un momento
        setTimeout(() => {
          onClose()
        }, 1500)
      } else {
        setError(data.error || 'Error al actualizar el perfil')
      }
    } catch (error) {
      setError('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    if (!saving) {
      setError('')
      setSuccess('')
      setIsChangingPassword(false)
      onClose()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getRoleName = (rol: string) => {
    const roles = {
      'ADMIN': 'Administrador',
      'BARBERO': 'Barbero',
      'CLIENTE': 'Cliente'
    }
    return roles[rol as keyof typeof roles] || rol
  }

  const getRoleBadge = (rol: string) => {
    const badges = {
      'ADMIN': 'bg-purple-600/20 text-purple-400 border-purple-500/30',
      'BARBERO': 'bg-blue-600/20 text-blue-400 border-blue-500/30',
      'CLIENTE': 'bg-green-600/20 text-green-400 border-green-500/30'
    }
    return badges[rol as keyof typeof badges] || 'bg-gray-600/20 text-gray-400 border-gray-500/30'
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-900">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FiUser className="mr-2 text-red-500" />
              Mi Perfil
            </h2>
            <button
              onClick={handleClose}
              disabled={saving}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 text-gray-400 hover:text-white"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[calc(90vh-80px)] overflow-y-auto">
            {loading ? (
              <div className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-600 rounded"></div>
                  <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Información del perfil */}
                {profile && (
                  <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Rol:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadge(profile.rol)}`}>
                        {getRoleName(profile.rol)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Miembro desde:</span>
                      <span className="text-sm text-gray-300">{formatDate(profile.creado_en)}</span>
                    </div>
                    {profile.especialidad && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Especialidad:</span>
                        <span className="text-sm text-gray-300">{profile.especialidad}</span>
                      </div>
                    )}
                    {profile.experiencia && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Experiencia:</span>
                        <span className="text-sm text-gray-300">{profile.experiencia} años</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Campos editables */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400 transition-colors"
                      placeholder="Tu nombre completo"
                      disabled={saving}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      type="email"
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400 transition-colors"
                      placeholder="tu@correo.com"
                      disabled={saving}
                    />
                  </div>
                </div>

                {/* Cambiar contraseña */}
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-gray-300">
                      Cambiar contraseña
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsChangingPassword(!isChangingPassword)}
                      className="text-sm text-red-400 hover:text-red-300 transition-colors"
                      disabled={saving}
                    >
                      {isChangingPassword ? 'Cancelar' : 'Cambiar'}
                    </button>
                  </div>

                  <AnimatePresence>
                    {isChangingPassword && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-4 overflow-hidden"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Contraseña actual
                          </label>
                          <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                            <input
                              type={showCurrentPassword ? "text" : "password"}
                              name="currentPassword"
                              value={formData.currentPassword}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400 transition-colors"
                              placeholder="Tu contraseña actual"
                              disabled={saving}
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400 transition-colors"
                              disabled={saving}
                            >
                              {showCurrentPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Nueva contraseña
                          </label>
                          <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                            <input
                              type={showNewPassword ? "text" : "password"}
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400 transition-colors"
                              placeholder="Nueva contraseña (mín. 6 caracteres)"
                              disabled={saving}
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400 transition-colors"
                              disabled={saving}
                            >
                              {showNewPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Confirmar nueva contraseña
                          </label>
                          <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400 transition-colors"
                              placeholder="Confirma tu nueva contraseña"
                              disabled={saving}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400 transition-colors"
                              disabled={saving}
                            >
                              {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mensajes */}
                {error && (
                  <div className="p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-300 text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-green-900/50 border border-green-500/50 rounded-lg text-green-300 text-sm">
                    {success}
                  </div>
                )}

                {/* Botones */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={saving}
                    className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all disabled:opacity-50 flex items-center justify-center font-medium"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <FiSave className="mr-2" size={16} />
                        Guardar cambios
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}