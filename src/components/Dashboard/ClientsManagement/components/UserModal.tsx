import { useState } from 'react'
import { toast } from 'react-toastify'

interface User {
  id?: number
  nombre: string
  correo: string
  rol: 'ADMIN' | 'CLIENTE' | 'BARBERO'
  estado: 'ACTIVO' | 'INACTIVO'
  especialidad?: string | null
  experiencia?: number | null
}

interface UserModalProps {
  mode: 'edit' | 'create'
  user: Partial<User>
  onClose: () => void
  onSuccess: () => void
}

export default function UserModal({ mode, user, onClose, onSuccess }: UserModalProps) {
  const [formUser, setFormUser] = useState<Partial<User>>(user)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Manejar cambios en formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormUser((prev) => ({
      ...prev,
      [name]: name === 'experiencia' ? Number(value) : value
    }))
  }

  // Guardar usuario (crear o editar)
  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validaciones básicas
    if (!formUser.nombre || !formUser.correo || !formUser.rol || !formUser.estado) {
      toast.warning('Por favor llena todos los campos obligatorios.')
      setLoading(false)
      return
    }

    if (mode === 'create') {
      // Validar contraseña al crear
      if (!password || password.length < 6) {
        toast.warning('La contraseña debe tener al menos 6 caracteres.')
        setLoading(false)
        return
      }
      if (password !== confirmPassword) {
        toast.warning('Las contraseñas no coinciden.')
        setLoading(false)
        return
      }

      try {
        const res = await fetch('/api/usuarios/registro', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: formUser.nombre,
            correo: formUser.correo,
            password: password,
            rol: formUser.rol,
            especialidad: formUser.especialidad || '',
            experiencia: formUser.experiencia || 0
          })
        })
        const data = await res.json()
        if (data.success) {
          toast.success('Usuario creado con éxito')
          onSuccess()
        } else {
          toast.error(data.error || 'Error al crear usuario')
        }
      } catch {
        toast.error('Error al conectar con el servidor')
      }
    } else if (mode === 'edit' && formUser.id) {
      // Actualizar usuario con PATCH
      try {
        const res = await fetch('/api/usuarios', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formUser)
        })
        const data = await res.json()
        if (data.success) {
          toast.success('Usuario actualizado con éxito')
          onSuccess()
        } else {
          toast.error(data.error || 'Error al actualizar usuario')
        }
      } catch {
        toast.error('Error al conectar con el servidor')
      }
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header del modal */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg md:text-xl font-semibold text-white">
              {mode === 'edit' ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleGuardar} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre*
              </label>
              <input
                type="text"
                name="nombre"
                value={formUser.nombre || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
                placeholder="Ingresa el nombre completo"
              />
            </div>

            {/* Correo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Correo*
              </label>
              <input
                type="email"
                name="correo"
                value={formUser.correo || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
                placeholder="ejemplo@correo.com"
              />
            </div>

            {/* Campos de contraseña solo para crear */}
            {mode === 'create' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contraseña*
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirmar Contraseña*
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                    placeholder="Repite la contraseña"
                  />
                </div>
              </div>
            )}

            {/* Rol y Estado en una fila */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rol*
                </label>
                <select
                  name="rol"
                  value={formUser.rol || 'CLIENTE'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                >
                  <option value="CLIENTE">Cliente</option>
                  <option value="BARBERO">Barbero</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Estado*
                </label>
                <select
                  name="estado"
                  value={formUser.estado || 'ACTIVO'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                >
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                </select>
              </div>
            </div>

            {/* Campos específicos para barberos */}
            {formUser.rol === 'BARBERO' && (
              <div className="space-y-4 pt-2 border-t border-gray-700">
                <h4 className="text-sm font-medium text-gray-300">Información del Barbero</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Especialidad
                  </label>
                  <input
                    type="text"
                    name="especialidad"
                    value={formUser.especialidad || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="ej. Cortes clásicos, Barba"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Experiencia (años)
                  </label>
                  <input
                    type="number"
                    min={0}
                    name="experiencia"
                    value={formUser.experiencia ?? ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="0"
                  />
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-700">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  'Guardar'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}