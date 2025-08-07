'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageUploaderProps {
  onImageUpload: (file: File) => Promise<string>
  onUrlChange: (url: string) => void
  currentValue: string
}

export default function ImageUploader({
  onImageUpload,
  onUrlChange,
  currentValue
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('url')

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        setUploading(true)
        try {
          const url = await onImageUpload(file)
          onUrlChange(url)
        } finally {
          setUploading(false)
        }
      }
    },
    [onImageUpload, onUrlChange]
  )

  return (
    <div className="space-y-4 text-white">
      {/* Tabs */}
      <div className="flex border-b border-gray-600">
        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`px-4 py-2 text-sm font-medium focus:outline-none transition ${
            activeTab === 'url'
              ? 'border-b-2 border-blue-500 text-blue-400'
              : 'text-gray-400 hover:text-blue-400'
          }`}
        >
          Desde URL
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 text-sm font-medium focus:outline-none transition ${
            activeTab === 'upload'
              ? 'border-b-2 border-blue-500 text-blue-400'
              : 'text-gray-400 hover:text-blue-400'
          }`}
        >
          Subir imagen
        </button>
      </div>

      {/* Input field */}
      <AnimatePresence mode="wait">
        {activeTab === 'url' ? (
          <motion.div
            key="url-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <input
              type="text"
              value={currentValue}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </motion.div>
        ) : (
          <motion.div
            key="upload-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-sm text-white focus:outline-none"
            />
            {uploading && (
              <p className="mt-1 text-xs text-gray-400 animate-pulse">
                Subiendo imagen...
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview */}
      {currentValue && (
        <div>
          <p className="text-sm font-medium text-gray-300 mb-2">Vista previa:</p>
          <div className="relative w-full h-48 rounded-lg border border-gray-700 bg-gray-900 overflow-hidden shadow-inner">
            <img
              src={currentValue}
              alt="Vista previa"
              className="w-full h-full object-contain transition duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
