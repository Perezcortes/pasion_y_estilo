'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast';
import { fadeIn } from '../../../lib/motion'
import { useAuth } from '../../../context/AuthContext'

type FormData = {
  correo: string
  password: string
}

type Rol = 'ADMIN' | 'BARBERO' | 'CLIENTE'

// Estructura actualizada según tu nuevo endpoint
interface UserData {
  id: number
  nombre: string
  correo: string
  rol: Rol
  estado: string
  creado_en: string
}

export default function LoginPage() {
  const { setUser } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState<FormData>({
    correo: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('Intentando login con:', formData.correo)
      
      // 1) Hacer login
      const res = await fetch('/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include', // Importante para cookies
      })

      const data = await res.json()
      console.log('Respuesta del login:', data)
      
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al iniciar sesión')
      }

      // 2) Obtener datos del usuario desde la cookie recién seteada
      console.log('Obteniendo datos del usuario...')
      const meRes = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      })

      console.log('Status de /api/auth/me:', meRes.status)
      
      if (!meRes.ok) {
        throw new Error('No se pudieron obtener los datos del usuario.')
      }

      // Tu endpoint ahora devuelve directamente los datos del usuario
      const userData: UserData = await meRes.json()
      console.log('Datos del usuario obtenidos:', userData)
      
      if (!userData || !userData.id) {
        throw new Error('Usuario no encontrado')
      }

      // 3) Guardar en localStorage
      localStorage.setItem('nombre', userData.nombre)
      localStorage.setItem('rol', userData.rol)
      localStorage.setItem('token', 'logged-in') // Flag para indicar que está logueado

      // 4) Actualizar el contexto para refrescar Navbar
      setUser({ nombre: userData.nombre, rol: userData.rol })

      toast.success(`Bienvenido, ${userData.nombre}`, {
        duration: 2500,
        icon: '🎉',
      })

      // 5) Redirigir según rol
      switch (userData.rol) {
        case 'ADMIN':
        case 'BARBERO':
          console.log('Redirigiendo a dashboard...')
          router.push('/dashboard')
          break
        case 'CLIENTE':
          console.log('Redirigiendo a home...')
          router.push('/')
          break
        default:
          setError('Rol no válido')
      }
    } catch (err: any) {
      console.error('Error en login:', err)
      setError(err?.message || 'Error inesperado')
      toast.error(err?.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          variants={fadeIn('up', 'spring', 0.2, 1)}
          className="text-center"
        >
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600">
            Barbería Premium
          </h2>
          <h1 className="mt-6 text-2xl sm:text-3xl font-bold text-white">
            Iniciar Sesión
          </h1>
          <p className="mt-2 text-sm text-gray-300">
            Ingresa tus credenciales para acceder al sistema
          </p>
        </motion.div>
      </div>

      <motion.div
        variants={fadeIn('up', 'spring', 0.4, 1)}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-gray-800/70 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-900/50 text-red-200 px-4 py-3 rounded-md text-sm border border-red-700"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-300">
                Correo Electrónico
              </label>
              <div className="mt-1">
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.correo}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <Link href="/recuperar-contrasena" className="font-medium text-blue-400 hover:text-blue-300">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                           5.291A7.962 7.962 0 014 12H0c0 3.042 
                           1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  'Iniciar Sesión'
                )}
              </motion.button>
            </div>
          </form>

          <motion.div
            variants={fadeIn('up', 'spring', 0.6, 1)}
            className="mt-6"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  ¿No tienes una cuenta?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/registro">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                >
                  Registrarse
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        variants={fadeIn('up', 'spring', 0.8, 1)}
        className="mt-8 text-center text-xs text-gray-500"
      >
        <p>© {new Date().getFullYear()} Barbería Premium. Todos los derechos reservados.</p>
      </motion.div>
    </motion.main>
  )
}