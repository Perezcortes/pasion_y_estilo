interface UsersFiltersProps {
  filterRol: string
  setFilterRol: (rol: string) => void
  filterEstado: string
  setFilterEstado: (estado: string) => void
}

export default function UsersFilters({ 
  filterRol, 
  setFilterRol, 
  filterEstado, 
  setFilterEstado 
}: UsersFiltersProps) {
  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
      <select
        value={filterRol}
        onChange={(e) => setFilterRol(e.target.value)}
        className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      >
        <option value="">Todos los roles</option>
        <option value="ADMIN">Administrador</option>
        <option value="BARBERO">Barbero</option>
        <option value="CLIENTE">Cliente</option>
      </select>

      <select
        value={filterEstado}
        onChange={(e) => setFilterEstado(e.target.value)}
        className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      >
        <option value="">Todos los estados</option>
        <option value="ACTIVO">Activo</option>
        <option value="INACTIVO">Inactivo</option>
      </select>
    </div>
  )
}