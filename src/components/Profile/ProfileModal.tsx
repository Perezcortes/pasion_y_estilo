'use client'

import { useState, useEffect } from 'react'
import { X, User, Mail, Lock, Eye, EyeOff, Save, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface User {
  id: number
  nombre: string
  correo: string
  rol: string
}

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
  onUserUpdate: (updatedUser: User) => void
}

export default function ProfileModal({ isOpen, onClose, user, onUserUpdate }: ProfileModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [loading, setLoading] = useState(false)
  const [changePassword, setChangePassword] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre,
        correo: user.correo,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
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

    if (changePassword) {
      if (!formData.currentPassword) {
        toast.error('Debes ingresar tu contraseña actual')
        return false
      }

      if (!formData.newPassword) {
        toast.error('Debes ingresar una nueva contraseña')
        return false
      }

      if (formData.newPassword.length < 6) {
        toast.error('La nueva contraseña debe tener al menos 6 caracteres')
        return false
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('Las contraseñas no coinciden')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)

    try {
      const updateData: any = {
        nombre: formData.nombre.trim(),
        correo: formData.correo.trim()
      }

      if (changePassword) {
        updateData.currentPassword = formData.currentPassword
        updateData.newPassword = formData.newPassword
      }

      const response = await fetch(`/api/usuarios/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar perfil')
      }

      // Actualizar localStorage con los nuevos datos
      localStorage.setItem('nombre', data.user.nombre)
      
      // Actualizar el contexto
      onUserUpdate(data.user)

      toast.success('Perfil actualizado correctamente')
      
      // Resetear campos de contraseña
      if (changePassword) {
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }))
        setChangePassword(false)
      }

      onClose()
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.message || 'Error al actualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      nombre: user.nombre,
      correo: user.correo,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setChangePassword(false)
    onClose()
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
            className="relative w-full max-w-md mx-4 bg-gray-900 rounded-xl border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <User size={20} className="text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Mi Perfil</h2>
                  <p className="text-gray-400 text-sm">Actualiza tu información personal</p>
                </div>
              </div>
              <button
                onClick={handleCancel}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              {/* Toggle cambiar contraseña */}
              <div className="flex items-center justify-between py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={changePassword}
                    onChange={(e) => setChangePassword(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300">Cambiar contraseña</span>
                </label>
              </div>

              {/* Campos de contraseña */}
              <AnimatePresence>
                {changePassword && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    {/* Contraseña actual */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Contraseña actual
                      </label>
                      <div className="relative">
                        <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-12 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="Tu contraseña actual"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('current')}
                          className="absolute right-3 top-3 text-gray-400 hover:text-white"
                        >
                          {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Nueva contraseña */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nueva contraseña
                      </label>
                      <div className="relative">
                        <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-12 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="Nueva contraseña (min. 6 caracteres)"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute right-3 top-3 text-gray-400 hover:text-white"
                        >
                          {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirmar contraseña */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Confirmar nueva contraseña
                      </label>
                      <div className="relative">
                        <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-12 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="Confirma tu nueva contraseña"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute right-3 top-3 text-gray-400 hover:text-white"
                        >
                          {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
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
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Guardar
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