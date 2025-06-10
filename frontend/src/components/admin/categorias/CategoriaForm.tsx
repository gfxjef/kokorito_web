'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Categoria, CategoriaForm as CategoriaFormType } from '@/types/admin/Categoria'
import categoriaService from '@/services/admin/categoriaService'
import Toggle from '@/components/admin/ui/Toggle'

interface CategoriaFormProps {
  categoria?: Categoria
  isEdit?: boolean
}

export default function CategoriaForm({ categoria, isEdit = false }: CategoriaFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<CategoriaFormType>({
    nombre: categoria?.nombre || '',
    descripcion: categoria?.descripcion || '',
    parent_id: categoria?.parent_id || undefined,
    color_tema: categoria?.color_tema || '#3B82F6',
    imagen_url: categoria?.imagen_url || '',
    orden_display: categoria?.orden_display || 1,
    is_active: categoria?.is_active ?? true,
    is_featured: categoria?.is_featured ?? false,
    meta_title: categoria?.meta_title || '',
    meta_description: categoria?.meta_description || ''
  })

  const [slug, setSlug] = useState(categoria?.slug || '')

  // Auto-generar slug cuando cambia el nombre
  useEffect(() => {
    if (formData.nombre && !isEdit) {
      const generatedSlug = categoriaService.generateSlug(formData.nombre)
      setSlug(generatedSlug)
    }
  }, [formData.nombre, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isEdit && categoria) {
        await categoriaService.update(categoria.id, formData)
      } else {
        await categoriaService.create(formData)
      }
      
      router.push('/admin/categorias')
    } catch (err: any) {
      setError(err.message || 'Error al guardar categoría')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof CategoriaFormType, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-700">{error}</div>
          </div>
        )}

        {/* Información Básica */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Información Básica</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Tortas Especiales"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="tortas-especiales"
                readOnly={!isEdit}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                rows={3}
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción de la categoría..."
              />
            </div>
          </div>
        </div>

        {/* Configuración Visual */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Configuración Visual</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Tema
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={formData.color_tema}
                  onChange={(e) => handleInputChange('color_tema', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.color_tema}
                  onChange={(e) => handleInputChange('color_tema', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#3B82F6"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Orden de Visualización
              </label>
              <input
                type="number"
                min="1"
                value={formData.orden_display}
                onChange={(e) => handleInputChange('orden_display', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de Imagen
              </label>
              <input
                type="url"
                value={formData.imagen_url}
                onChange={(e) => handleInputChange('imagen_url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
          </div>
        </div>

        {/* Estados */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Estados</h3>
          
          <div className="space-y-4">
            <Toggle
              enabled={formData.is_active}
              onChange={(value) => handleInputChange('is_active', value)}
              label="Categoría Activa"
            />
            
            <Toggle
              enabled={formData.is_featured}
              onChange={(value) => handleInputChange('is_featured', value)}
              label="Categoría Destacada"
            />
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">SEO</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Título
              </label>
              <input
                type="text"
                value={formData.meta_title}
                onChange={(e) => handleInputChange('meta_title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Título para SEO"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Descripción
              </label>
              <textarea
                rows={2}
                value={formData.meta_description}
                onChange={(e) => handleInputChange('meta_description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción para motores de búsqueda"
              />
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'} Categoría
          </button>
        </div>
      </form>
    </div>
  )
} 