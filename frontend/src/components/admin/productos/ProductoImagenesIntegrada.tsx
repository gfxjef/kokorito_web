'use client'

import { useState, useEffect } from 'react'
import { PhotoIcon, TrashIcon, EyeIcon, ArrowUpIcon, ArrowDownIcon, PlusIcon } from '@heroicons/react/24/outline'
import { ProductoImagen } from '@/types/admin/ProductoImagen'
import { Producto } from '@/types/admin/Producto'

interface ProductoImagenesIntegradaProps {
  producto?: Producto
  isEdit?: boolean
  imagenPrincipal: string
  onImagenPrincipalChange: (url: string) => void
}

export default function ProductoImagenesIntegrada({
  producto,
  isEdit = false,
  imagenPrincipal,
  onImagenPrincipalChange
}: ProductoImagenesIntegradaProps) {
  const [imagenes, setImagenes] = useState<ProductoImagen[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedGallery, setExpandedGallery] = useState(false)
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newImageAlt, setNewImageAlt] = useState('')
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    console.log(`🔄 ProductoImagenesIntegrada - Efecto ejecutándose. isEdit: ${isEdit}, productoId: ${producto?.id}`)
    if (isEdit && producto?.id) {
      loadImagenes()
    }
  }, [isEdit, producto?.id]) // ✅ Solo depende del ID, no del objeto completo

  useEffect(() => {
    // Auto-hide success message
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const loadImagenes = async () => {
    if (!producto) return
    
    try {
      setLoading(true)
      console.log(`📡 ProductoImagenesIntegrada - Cargando imágenes para producto ${producto.id}`)
      const response = await fetch(`/api/backend/v1/producto-imagenes/producto/${producto.id}`)
      const data = await response.json()
      
      if (data.success) {
        setImagenes(data.data || [])
        console.log(`✅ ProductoImagenesIntegrada - ${data.data?.length || 0} imágenes cargadas`)
      }
    } catch (err) {
      console.error('Error cargando imágenes:', err)
    } finally {
      setLoading(false)
    }
  }



  const handleAddImageClick = async () => {
    if (!newImageUrl.trim() || !producto) return

    setSaving(true)
    try {
      const newImage = {
        producto_id: producto.id,
        url: newImageUrl,
        alt_text: newImageAlt || `Imagen de ${producto.nombre}`,
        titulo: newImageAlt || `${producto.nombre}`,
        orden: imagenes.length + 1,
        is_principal: imagenes.length === 0,
        is_active: true
      }

      const response = await fetch('/api/backend/v1/producto-imagenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newImage)
      })

      const data = await response.json()
      if (data.success) {
        await loadImagenes()
        setNewImageUrl('')
        setNewImageAlt('')
        setSuccessMessage('Imagen agregada exitosamente')
      }
    } catch (err) {
      console.error('Error agregando imagen:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteImage = async (id: number) => {
    if (!confirm('¿Eliminar esta imagen?')) return

    try {
      const response = await fetch(`/api/backend/v1/producto-imagenes/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadImagenes()
        setSuccessMessage('Imagen eliminada')
      }
    } catch (err) {
      console.error('Error eliminando imagen:', err)
    }
  }

  const handleSetPrincipal = async (id: number) => {
    try {
      // Quitar principal de todas
      const updates = imagenes.map(async (img) => {
        if (img.id !== id && img.is_principal) {
          await fetch(`/api/backend/v1/producto-imagenes/${img.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_principal: false })
          })
        }
      })

      await Promise.all(updates)

      // Establecer nueva principal
      const response = await fetch(`/api/backend/v1/producto-imagenes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_principal: true })
      })

      if (response.ok) {
        await loadImagenes()
        setSuccessMessage('Imagen principal actualizada')
        
        // Actualizar imagen principal en el producto
        const imagenPrincipal = imagenes.find(img => img.id === id)
        if (imagenPrincipal) {
          onImagenPrincipalChange(imagenPrincipal.url)
        }
      }
    } catch (err) {
      console.error('Error estableciendo principal:', err)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Imágenes del Producto</h3>

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-700 text-sm">{successMessage}</p>
        </div>
      )}

      {/* Imagen Principal */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagen Principal (URL) *
        </label>
        <div className="flex gap-4">
          <input
            type="url"
            value={imagenPrincipal}
            onChange={(e) => onImagenPrincipalChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://ejemplo.com/imagen-principal.jpg"
          />
          {imagenPrincipal && (
            <div className="w-20 h-20 border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
              <img
                src={imagenPrincipal}
                alt="Vista previa"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Esta será la imagen principal en catálogos y listados
        </p>
      </div>

      {/* Galería de Imágenes Adicionales */}
      {isEdit && producto && (
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-900">
              Galería de Imágenes ({imagenes.length}/6)
            </h4>
            <button
              type="button"
              onClick={() => setExpandedGallery(!expandedGallery)}
              className="text-sm text-purple-600 hover:text-purple-800"
            >
              {expandedGallery ? 'Ocultar galería' : 'Mostrar galería'}
            </button>
          </div>

          {expandedGallery && (
            <div className="space-y-4">
              {/* Formulario agregar imagen */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="URL de la imagen"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddImageClick()
                      }
                    }}
                  />
                  <input
                    type="text"
                    value={newImageAlt}
                    onChange={(e) => setNewImageAlt(e.target.value)}
                    placeholder="Texto alternativo"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddImageClick()
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddImageClick}
                    disabled={saving || imagenes.length >= 6}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Agregando...' : 'Agregar'}
                  </button>
                </div>
              </div>

              {/* Lista de imágenes */}
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                </div>
              ) : imagenes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <PhotoIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No hay imágenes adicionales</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagenes
                    .sort((a, b) => a.orden - b.orden)
                    .map((imagen, index) => (
                      <div key={imagen.id} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={imagen.url}
                            alt={imagen.alt_text || ''}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5FcnJvcjwvdGV4dD48L3N2Zz4='
                            }}
                          />
                        </div>

                        {/* Badges */}
                        <div className="absolute top-1 left-1 space-y-1">
                          {imagen.is_principal && (
                            <span className="inline-block px-1.5 py-0.5 bg-purple-600 text-white text-xs rounded">
                              Principal
                            </span>
                          )}
                          <span className="inline-block px-1.5 py-0.5 bg-gray-600 text-white text-xs rounded">
                            #{imagen.orden}
                          </span>
                        </div>

                        {/* Acciones */}
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-white rounded shadow-lg p-1 space-y-1">
                            <button
                              type="button"
                              onClick={() => window.open(imagen.url, '_blank')}
                              className="block p-1 text-gray-600 hover:text-gray-900 rounded"
                              title="Ver imagen"
                            >
                              <EyeIcon className="h-3 w-3" />
                            </button>
                            
                            {!imagen.is_principal && (
                              <button
                                type="button"
                                onClick={() => handleSetPrincipal(imagen.id)}
                                className="block p-1 text-purple-600 hover:text-purple-900 rounded"
                                title="Establecer como principal"
                              >
                                <PhotoIcon className="h-3 w-3" />
                              </button>
                            )}
                            
                            <button
                              type="button"
                              onClick={() => handleDeleteImage(imagen.id)}
                              className="block p-1 text-red-600 hover:text-red-900 rounded"
                              title="Eliminar"
                            >
                              <TrashIcon className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 