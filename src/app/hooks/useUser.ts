'use client'

import { useEffect, useState } from 'react'
import jwtDecode from 'jwt-decode'

interface DecodedToken {
  id: number
  nombre: string
  rol: 'CLIENTE' | 'ADMIN' | 'BARBERO'
  exp: number
}

export function useUser() {
  const [user, setUser] = useState<DecodedToken | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token)
        setUser(decoded)
      } catch (e) {
        setUser(null)
      }
    }
  }, [])

  return user
}
