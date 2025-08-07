'use client'

import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import UsersTable from './components/UsersTable'
import UserModal from './components/UserModal'
import UsersFilters from './components/UsersFilters'

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
    setFormMode('create')
  }

  // Abrir modal para editar usuario
  const handleEditar = (user: User) => {
    setFormUser({ ...user })
    setFormMode('edit')
  }

  // Cerrar modal
  const handleCerrarModal = () => {
    setFormMode(null)
    setFormUser({})
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
    <div className="p-3 md:p-6 bg-gray-800/70 rounded-xl border border-gray-700">
      {/* Header responsive */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white">
          Gestión de Usuarios
        </h2>
        
        {/* Filtros y botón nuevo */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
          <UsersFilters
            filterRol={filterRol}
            setFilterRol={setFilterRol}
            filterEstado={filterEstado}
            setFilterEstado={setFilterEstado}
          />
          
          <button
            onClick={handleNuevo}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm md:text-base">Nuevo Usuario</span>
          </button>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <UsersTable
        users={users}
        loading={loading}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
      />

      {/* Modal */}
      {formMode && (
        <UserModal
          mode={formMode}
          user={formUser}
          onClose={handleCerrarModal}
          onSuccess={() => {
            fetchUsers()
            handleCerrarModal()
          }}
        />
      )}

      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        theme="dark"
        className="mt-16"
      />
    </div>
  )
}