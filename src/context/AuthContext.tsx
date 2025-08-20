'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type User = {
  nombre: string
  rol: string
}

type AuthContextType = {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar el usuario desde el servidor (cookie HTTP-only)
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const userData = await response.json()
          setUser({
            nombre: userData.nombre,
            rol: userData.rol
          })
        } else {
          // Si no hay autenticación válida, limpiar cualquier dato local
          localStorage.removeItem('nombre')
          localStorage.removeItem('rol')
          localStorage.removeItem('token')
          setUser(null)
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>')
  }
  return context
}