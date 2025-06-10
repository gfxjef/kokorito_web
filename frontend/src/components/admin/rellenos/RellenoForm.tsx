'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Relleno, RellenoForm as RellenoFormType } from '@/types/admin/Relleno'
import rellenoService from '@/services/admin/rellenoService'
import Toggle from '@/components/admin/ui/Toggle'

interface RellenoFormProps {
  relleno?: Relleno
  isEdit?: boolean
}

export default function RellenoForm({ relleno, isEdit = false }: RellenoFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<RellenoFormType>({
    nombre: relleno?.nombre || '',
    descripcion: relleno?.descripcion || '',
    precio_adicional: relleno?.precio_adicional || 0,
    color_hex: relleno?.color_hex || '#8B5CF6',
    icono: relleno?.icono || '🧁',
    imagen_url: relleno?.imagen_url || '',
    orden_display: relleno?.orden_display || 1,
    is_premium: relleno?.is_premium ?? false,
    is_active: relleno?.is_active ?? true,
    is_disponible: relleno?.is_disponible ?? true,
    requiere_stock: relleno?.requiere_stock ?? false,
    stock_disponible: relleno?.stock_disponible || 0,
    contiene_gluten: relleno?.contiene_gluten ?? false,
    contiene_lactosa: relleno?.contiene_lactosa ?? false,
    es_vegano: relleno?.es_vegano ?? false
  })

  const [slug, setSlug] = useState(relleno?.slug || '')

  // Auto-generar slug cuando cambia el nombre
  useEffect(() => {
    if (formData.nombre && !isEdit) {
      const generatedSlug = rellenoService.generateSlug(formData.nombre)
      setSlug(generatedSlug)
    }
  }, [formData.nombre, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isEdit && relleno) {
        await rellenoService.update(relleno.id, formData)
      } else {
        await rellenoService.create(formData)
      }
      
      router.push('/admin/rellenos')
    } catch (err: any) {
      setError(err.message || 'Error al guardar relleno')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof RellenoFormType, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const iconos = ['🧁', '🍫', '🍓', '🥥', '🍯', '🍊', '🍋', '🍌', '🫐', '🍒']

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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ej: Chocolate Belga"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                placeholder="chocolate-belga"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Descripción del relleno..."
              />
            </div>
          </div>
        </div>

        {/* Configuración Visual y Precio */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Configuración Visual y Precio</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio Adicional (S/.)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.precio_adicional}
                onChange={(e) => handleInputChange('precio_adicional', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={formData.color_hex}
                  onChange={(e) => handleInputChange('color_hex', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.color_hex}
                  onChange={(e) => handleInputChange('color_hex', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icono
              </label>
              <div className="grid grid-cols-5 gap-2">
                {iconos.map((icono) => (
                  <button
                    key={icono}
                    type="button"
                    onClick={() => handleInputChange('icono', icono)}
                    className={`p-2 border rounded text-lg hover:bg-gray-50 ${
                      formData.icono === icono ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
                    }`}
                  >
                    {icono}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={formData.icono || ''}
                onChange={(e) => handleInputChange('icono', e.target.value)}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="O escribir emoji personalizado"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Orden
              </label>
              <input
                type="number"
                min="1"
                value={formData.orden_display}
                onChange={(e) => handleInputChange('orden_display', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de Imagen
              </label>
              <input
                type="url"
                value={formData.imagen_url}
                onChange={(e) => handleInputChange('imagen_url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
          </div>
        </div>

        {/* Estados y Configuración */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Estados y Configuración</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Toggle
                enabled={formData.is_active}
                onChange={(value) => handleInputChange('is_active', value)}
                label="Relleno Activo"
              />
              
              <Toggle
                enabled={formData.is_disponible}
                onChange={(value) => handleInputChange('is_disponible', value)}
                label="Disponible para Pedidos"
              />
              
              <Toggle
                enabled={formData.is_premium}
                onChange={(value) => handleInputChange('is_premium', value)}
                label="Relleno Premium"
              />
              
              <Toggle
                enabled={formData.requiere_stock}
                onChange={(value) => handleInputChange('requiere_stock', value)}
                label="Requiere Control de Stock"
              />
            </div>

            <div>
              {formData.requiere_stock && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Disponible
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock_disponible}
                    onChange={(e) => handleInputChange('stock_disponible', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Características Alimentarias */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Características Alimentarias</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Toggle
              enabled={formData.contiene_gluten}
              onChange={(value) => handleInputChange('contiene_gluten', value)}
              label="Contiene Gluten 🌾"
            />
            
            <Toggle
              enabled={formData.contiene_lactosa}
              onChange={(value) => handleInputChange('contiene_lactosa', value)}
              label="Contiene Lactosa 🥛"
            />
            
            <Toggle
              enabled={formData.es_vegano}
              onChange={(value) => handleInputChange('es_vegano', value)}
              label="Es Vegano 🌱"
            />
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
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'} Relleno
          </button>
        </div>
      </form>
    </div>
  )
} 