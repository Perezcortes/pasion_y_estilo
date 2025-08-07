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

interface UsersTableProps {
  users: User[]
  loading: boolean
  onEditar: (user: User) => void
  onEliminar: (id: number) => void
}

export default function UsersTable({ users, loading, onEditar, onEliminar }: UsersTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-300">Cargando usuarios...</span>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No hay usuarios registrados</div>
        <p className="text-gray-500 text-sm">Crea tu primer usuario haciendo clic en "Nuevo Usuario"</p>
      </div>
    )
  }

  return (
    <>
      {/* Vista de tabla para desktop */}
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-600">
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Correo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Especialidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Experiencia</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Creado en</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800/30 divide-y divide-gray-600">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-700/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.correo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full 
                    ${user.rol === 'ADMIN' ? 'bg-purple-900/40 text-purple-300 border border-purple-500/30' : 
                      user.rol === 'BARBERO' ? 'bg-blue-900/40 text-blue-300 border border-blue-500/30' : 
                      'bg-green-900/40 text-green-300 border border-green-500/30'}`}>
                    {user.rol}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full 
                    ${user.estado === 'ACTIVO' ? 'bg-green-900/40 text-green-300 border border-green-500/30' : 
                    'bg-red-900/40 text-red-300 border border-red-500/30'}`}>
                    {user.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.especialidad || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.experiencia ?? '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {new Date(user.creado_en).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => onEditar(user)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onEliminar(user.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista de cards para móvil y tablet */}
      <div className="lg:hidden space-y-4">
        {users.map((user) => (
          <div key={user.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-all">
            <div className="flex flex-col space-y-3">
              {/* Header del card */}
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate">{user.nombre}</h3>
                  <p className="text-gray-400 text-sm truncate">{user.correo}</p>
                </div>
                <div className="flex space-x-2 ml-2">
                  <button
                    onClick={() => onEditar(user)}
                    className="text-blue-400 hover:text-blue-300 text-sm px-2 py-1 rounded transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onEliminar(user.id)}
                    className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                  ${user.rol === 'ADMIN' ? 'bg-purple-900/40 text-purple-300 border border-purple-500/30' : 
                    user.rol === 'BARBERO' ? 'bg-blue-900/40 text-blue-300 border border-blue-500/30' : 
                    'bg-green-900/40 text-green-300 border border-green-500/30'}`}>
                  {user.rol}
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                  ${user.estado === 'ACTIVO' ? 'bg-green-900/40 text-green-300 border border-green-500/30' : 
                  'bg-red-900/40 text-red-300 border border-red-500/30'}`}>
                  {user.estado}
                </span>
              </div>

              {/* Información adicional */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-400">ID: </span>
                  <span className="text-gray-300">{user.id}</span>
                </div>
                <div>
                  <span className="text-gray-400">Creado: </span>
                  <span className="text-gray-300">{new Date(user.creado_en).toLocaleDateString()}</span>
                </div>
                {user.especialidad && (
                  <div className="col-span-2">
                    <span className="text-gray-400">Especialidad: </span>
                    <span className="text-gray-300">{user.especialidad}</span>
                  </div>
                )}
                {user.experiencia !== null && user.experiencia !== undefined && (
                  <div>
                    <span className="text-gray-400">Experiencia: </span>
                    <span className="text-gray-300">{user.experiencia} años</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}