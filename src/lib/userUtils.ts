// utils/userUtils.ts
import { User } from '../types/user'

// Helper function to ensure user object has all required properties
export function ensureCompleteUser(user: any): User | null {
  if (!user) return null
  
  return {
    id: user.id || 0,
    nombre: user.nombre || '',
    correo: user.correo || user.email || '',
    telefono: user.telefono || user.phone || '',
    rol: user.rol || user.role || 'CLIENTE',
    estado: user.estado || user.status || 'ACTIVO',
    fecha_registro: user.fecha_registro || user.createdAt || new Date().toISOString()
  }
}

// Helper to check if user has required properties for modals
export function isCompleteUser(user: any): user is User {
  return user && 
         typeof user.id === 'number' && 
         typeof user.nombre === 'string' && 
         typeof user.correo === 'string'
}