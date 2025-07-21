'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type User = {
  nombre: string
  rol: string
}

type AuthContextType = {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const nombre = localStorage.getItem('nombre')
    const rol = localStorage.getItem('rol')
    if (nombre && rol) {
      setUser({ nombre, rol })
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
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
