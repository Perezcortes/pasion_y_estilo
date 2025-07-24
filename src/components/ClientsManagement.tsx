'use client'

import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import bcrypt from 'bcryptjs'

interface User {
  id: number
  nombre: string
  correo: string
  rol: 'ADMIN' | 'CLIENTE' | 'BARBERO'
  estado: 'ACTIVO' | 'INACTIVO'
  creado_en: string
  especialidad?: string | null
  experiencia?: number | null
}

type FormMode = 'edit' | 'create' | null

export default function ClientsManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [filterRol, setFilterRol] = useState<string>('')
  const [filterEstado, setFilterEstado] = useState<string>('')
  const [formMode, setFormMode] = useState<FormMode>(null)
  const [formUser, setFormUser] = useState<Partial<User>>({})
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Cargar usuarios con filtros
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterRol) params.append('rol', filterRol)
      if (filterEstado) params.append('estado', filterEstado)

      const res = await fetch('/api/usuarios?' + params.toString())
      const data = await res.json()
      if (data.success) {
        setUsers(data.users)
      } else {
        toast.error('Error al cargar usuarios')
      }
    } catch {
      toast.error('Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [filterRol, filterEstado])

  // Abrir modal para crear nuevo usuario
  const handleNuevo = () => {
    setFormUser({ rol: 'CLIENTE', estado: 'ACTIVO' })
    setPassword('')
    setConfirmPassword('')
    setFormMode('create')
  }

  // Abrir modal para editar usuario
  const handleEditar = (user: User) => {
    setFormUser({ ...user })
    setPassword('')
    setConfirmPassword('')
    setFormMode('edit')
  }

  // Cerrar modal
  const handleCerrarModal = () => {
    setFormMode(null)
    setFormUser({})
    setPassword('')
    setConfirmPassword('')
  }

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

    // Validaciones básicas
    if (!formUser.nombre || !formUser.correo || !formUser.rol || !formUser.estado) {
      toast.warning('Por favor llena todos los campos obligatorios.')
      return
    }

    if (formMode === 'create') {
      // Validar contraseña al crear
      if (!password || password.length < 6) {
        toast.warning('La contraseña debe tener al menos 6 caracteres.')
        return
      }
      if (password !== confirmPassword) {
        toast.warning('Las contraseñas no coinciden.')
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
          fetchUsers()
          handleCerrarModal()
        } else {
          toast.error(data.error || 'Error al crear usuario')
        }
      } catch {
        toast.error('Error al conectar con el servidor')
      }
    } else if (formMode === 'edit' && formUser.id) {
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
          fetchUsers()
          handleCerrarModal()
        } else {
          toast.error(data.error || 'Error al actualizar usuario')
        }
      } catch {
        toast.error('Error al conectar con el servidor')
      }
    }
  }

  // Eliminar usuario
  const handleEliminar = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return

    try {
      const res = await fetch('/api/usuarios', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Usuario eliminado con éxito')
        fetchUsers()
      } else {
        toast.error(data.error || 'Error al eliminar usuario')
      }
    } catch {
      toast.error('Error al conectar con el servidor')
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Gestión de Usuarios</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2">
            <select
              value={filterRol}
              onChange={(e) => setFilterRol(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los roles</option>
              <option value="ADMIN">Administrador</option>
              <option value="BARBERO">Barbero</option>
              <option value="CLIENTE">Cliente</option>
            </select>

            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="ACTIVO">Activo</option>
              <option value="INACTIVO">Inactivo</option>
            </select>
          </div>

          <button
            onClick={handleNuevo}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nuevo Usuario
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center my-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especialidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experiencia</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado en</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.correo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.rol === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 
                          user.rol === 'BARBERO' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {user.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.especialidad || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.experiencia ?? '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.creado_en).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditar(user)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {formMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {formMode === 'edit' ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h3>
                <button
                  onClick={handleCerrarModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleGuardar} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formUser.nombre || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo*</label>
                  <input
                    type="email"
                    name="correo"
                    value={formUser.correo || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {formMode === 'create' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña*</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña*</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol*</label>
                  <select
                    name="rol"
                    value={formUser.rol || 'CLIENTE'}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="CLIENTE">Cliente</option>
                    <option value="BARBERO">Barbero</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado*</label>
                  <select
                    name="estado"
                    value={formUser.estado || 'ACTIVO'}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="ACTIVO">Activo</option>
                    <option value="INACTIVO">Inactivo</option>
                  </select>
                </div>

                {formUser.rol === 'BARBERO' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
                      <input
                        type="text"
                        name="especialidad"
                        value={formUser.especialidad || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experiencia (años)</label>
                      <input
                        type="number"
                        min={0}
                        name="experiencia"
                        value={formUser.experiencia ?? ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCerrarModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}