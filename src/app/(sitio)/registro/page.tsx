'use client'

import { motion } from 'framer-motion'
import { fadeIn } from '../../../lib/motion'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/usuarios/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          correo: formData.correo,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar usuario')
      }

      // Redirigir al login después del registro exitoso
      toast.success('Registro exitoso!')
      setTimeout(() => {
        router.push('/login?registered=true')
      }, 2000) // espera 2 segundos para que se vea el toast

    } catch (err: any) {
      setError(err.message)
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
            Crear Cuenta
          </h1>
          <p className="mt-2 text-sm text-gray-300">
            Completa el formulario para registrarte
          </p>
        </motion.div>
      </div>

      <motion.div
        variants={fadeIn('up', 'spring', 0.4, 1)}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-gray-800/70 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-700">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-900/50 text-red-200 px-4 py-3 rounded-md text-sm border border-red-700"
              >
                {error}
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-300">
                  Nombre
                </label>
                <div className="mt-1">
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-300">
                  Apellido
                </label>
                <div className="mt-1">
                  <input
                    id="apellido"
                    name="apellido"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={formData.apellido}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-300">
                Teléfono
              </label>
              <div className="mt-1">
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  autoComplete="tel"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white sm:text-sm"
                />
              </div>
            </div>

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
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-400">Mínimo 6 caracteres</p>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirmar Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                Acepto los <Link href="/terminos" className="text-blue-400 hover:text-blue-300">Términos y Condiciones</Link> y la <Link href="/privacidad" className="text-blue-400 hover:text-blue-300">Política de Privacidad</Link>
              </label>
            </div>

            <div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registrando...
                  </span>
                ) : 'Registrarse'}
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
                  ¿Ya tienes una cuenta?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                >
                  Iniciar Sesión
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