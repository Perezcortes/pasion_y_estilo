'use client'

import { motion } from 'framer-motion'
import { CreditCard, Copy, CheckCircle, Building2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function PaymentCard() {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // Datos bancarios (estos deberían venir de una configuración o base de datos)
  const bankData = {
    banco: 'Banco Azteca',
    numeroCuenta: '5263540138421371',
    titular: 'Jorge Miguel Herrera Mendez',
    clabe: '012345678901234567',
    concepto: 'Pago de servicio - Barbería'
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      toast.success(`${field} copiado al portapapeles`, {
        position: 'top-center',
        duration: 2000,
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #4ade80'
        }
      })
      
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      toast.error('Error al copiar al portapapeles')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 p-6 rounded-xl border border-blue-500/30 shadow-lg"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-600/20 rounded-lg">
          <CreditCard size={24} className="text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Datos Bancarios</h3>
          <p className="text-blue-300 text-sm">Para realizar tu transferencia</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Banco */}
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Building2 size={16} className="text-gray-400" />
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">Banco</p>
              <p className="text-white font-medium">{bankData.banco}</p>
            </div>
          </div>
        </div>

        {/* Número de Cuenta */}
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div className="flex-1">
            <p className="text-gray-400 text-xs uppercase tracking-wide">Número de Cuenta</p>
            <p className="text-white font-mono text-lg tracking-wider">{bankData.numeroCuenta}</p>
          </div>
          <button
            onClick={() => copyToClipboard(bankData.numeroCuenta, 'Número de cuenta')}
            className="ml-3 p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
          >
            {copiedField === 'Número de cuenta' ? (
              <CheckCircle size={16} className="text-green-400" />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>

        {/* CLABE */}
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div className="flex-1">
            <p className="text-gray-400 text-xs uppercase tracking-wide">CLABE Interbancaria</p>
            <p className="text-white font-mono text-lg tracking-wider">{bankData.clabe}</p>
          </div>
          <button
            onClick={() => copyToClipboard(bankData.clabe, 'CLABE')}
            className="ml-3 p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
          >
            {copiedField === 'CLABE' ? (
              <CheckCircle size={16} className="text-green-400" />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>

        {/* Titular */}
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div className="flex-1">
            <p className="text-gray-400 text-xs uppercase tracking-wide">Titular de la Cuenta</p>
            <p className="text-white font-medium">{bankData.titular}</p>
          </div>
          <button
            onClick={() => copyToClipboard(bankData.titular, 'Titular')}
            className="ml-3 p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
          >
            {copiedField === 'Titular' ? (
              <CheckCircle size={16} className="text-green-400" />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>

        {/* Concepto sugerido */}
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div className="flex-1">
            <p className="text-gray-400 text-xs uppercase tracking-wide">Concepto Sugerido</p>
            <p className="text-white font-medium">{bankData.concepto}</p>
          </div>
          <button
            onClick={() => copyToClipboard(bankData.concepto, 'Concepto')}
            className="ml-3 p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
          >
            {copiedField === 'Concepto' ? (
              <CheckCircle size={16} className="text-green-400" />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
        <p className="text-yellow-300 text-sm font-medium mb-2">Instrucciones importantes:</p>
        <ul className="text-yellow-200 text-xs space-y-1">
          <li>• Realiza la transferencia por el monto exacto del servicio</li>
          <li>• Guarda el comprobante de transferencia</li>
          <li>• Introduce el folio o referencia en el campo correspondiente</li>
          <li>• Tu cita será confirmada una vez verificado el pago</li>
        </ul>
      </div>
    </motion.div>
  )
}