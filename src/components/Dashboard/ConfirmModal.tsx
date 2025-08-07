// ConfirmModal.tsx
import React from 'react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded p-6 max-w-sm text-center shadow-lg">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="mb-6">{message}</p>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded mr-3"
          onClick={onConfirm}
        >
          Sí, eliminar
        </button>
        <button
          className="bg-gray-300 px-4 py-2 rounded"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
