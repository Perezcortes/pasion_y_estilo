// types/user.ts or lib/types.ts
export interface User {
  id: number
  nombre: string
  correo: string
  telefono?: string
  rol: string // Using string to be flexible with different role formats
  estado?: 'ACTIVO' | 'INACTIVO'
  fecha_registro?: string
}

export interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoading?: boolean
}

// You can also create specific role types if needed
export type UserRole = 'CLIENTE' | 'BARBERO' | 'ADMIN' | '1' | '2' | '3'

// Extended user interface with stricter role typing if needed
export interface StrictUser extends Omit<User, 'rol'> {
  rol: UserRole
}