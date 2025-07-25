'use client'

import { useState, useCallback } from 'react'

interface ImageUploaderProps {
  onImageUpload: (file: File) => Promise<string>
  onUrlChange: (url: string) => void
  currentValue: string
}

export default function ImageUploader({ onImageUpload, onUrlChange, currentValue }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('url')

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, [onImageUpload, onUrlChange])

  return (
    <div className="space-y-2">
      <div className="flex border-b">
        <button
          type="button"
          className={`px-4 py-2 ${activeTab === 'url' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('url')}
        >
          Desde URL
        </button>
        <button
          type="button"
          className={`px-4 py-2 ${activeTab === 'upload' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          Subir imagen
        </button>
      </div>

      {activeTab === 'url' ? (
        <input
          type="text"
          value={currentValue}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://ejemplo.com/imagen.jpg"
          className="w-full border rounded px-3 py-2"
        />
      ) : (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="w-full border rounded px-3 py-2"
          />
          {uploading && <p className="text-sm text-gray-500">Subiendo imagen...</p>}
        </div>
      )}

      {currentValue && (
        <div className="mt-2">
          <p className="text-sm font-medium mb-1">Vista previa:</p>
          <div className="relative h-40 bg-gray-100 rounded">
            <img
              src={currentValue}
              alt="Preview"
              className="object-contain w-full h-full"
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