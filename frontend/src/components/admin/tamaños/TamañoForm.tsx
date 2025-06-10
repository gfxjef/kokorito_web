'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Tamaño, TamañoForm as TamañoFormType } from '@/types/admin/Tamaño'
import tamañoService from '@/services/admin/tamañoService'
import Toggle from '@/components/admin/ui/Toggle'

interface TamañoFormProps {
  tamaño?: Tamaño
  isEdit?: boolean
}

export default function TamañoForm({ tamaño, isEdit = false }: TamañoFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<TamañoFormType>({
    nombre: tamaño?.nombre || '',
    descripcion: tamaño?.descripcion || '',
    precio_adicional: tamaño?.precio_adicional || 0,
    multiplicador_precio: tamaño?.multiplicador_precio || 1,
    diametro_cm: tamaño?.diametro_cm || 0,
    peso_gramos: tamaño?.peso_gramos || 0,
    porciones_aproximadas: tamaño?.porciones_aproximadas || 0,
    color_hex: tamaño?.color_hex || '#8B5CF6',
    icono: tamaño?.icono || '🍰',
    orden_display: tamaño?.orden_display || 1,
    is_active: tamaño?.is_active ?? true,
    is_disponible: tamaño?.is_disponible ?? true
  })

  const [slug, setSlug] = useState(tamaño?.slug || '')

  // Auto-generar slug cuando cambia el nombre
  useEffect(() => {
    if (formData.nombre && !isEdit) {
      const generatedSlug = tamañoService.generateSlug(formData.nombre)
      setSlug(generatedSlug)
    }
  }, [formData.nombre, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isEdit && tamaño) {
        await tamañoService.update(tamaño.id, formData)
      } else {
        await tamañoService.create(formData)
      }
      
      router.push('/admin/tamanos')
    } catch (err: any) {
      setError(err.message || 'Error al guardar tamaño')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof TamañoFormType, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const iconos = ['🍰', '🧁', '🎂', '🍕', '🥧', '🥮', '🫓', '🍪', '🧇', '🥞']

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
                placeholder="Ej: Mediano"
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
                placeholder="mediano"
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
                placeholder="Descripción del tamaño..."
              />
            </div>
          </div>
        </div>

        {/* Configuración de Precio */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Configuración de Precio</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <p className="text-sm text-gray-500 mt-1">
                Precio que se suma al precio base del producto
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Multiplicador de Precio
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={formData.multiplicador_precio}
                onChange={(e) => handleInputChange('multiplicador_precio', parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Factor por el cual se multiplica el precio base
              </p>
            </div>
          </div>
        </div>

        {/* Especificaciones Físicas */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Especificaciones Físicas</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diámetro (cm)
              </label>
              <input
                type="number"
                min="0"
                value={formData.diametro_cm || ''}
                onChange={(e) => handleInputChange('diametro_cm', parseInt(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso Aproximado (gr)
              </label>
              <input
                type="number"
                min="0"
                value={formData.peso_gramos || ''}
                onChange={(e) => handleInputChange('peso_gramos', parseInt(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Porciones Aproximadas
              </label>
              <input
                type="number"
                min="1"
                value={formData.porciones_aproximadas || ''}
                onChange={(e) => handleInputChange('porciones_aproximadas', parseInt(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="8"
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
                Orden de Visualización
              </label>
              <input
                type="number"
                min="1"
                value={formData.orden_display}
                onChange={(e) => handleInputChange('orden_display', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Estados */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Estados</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Toggle
              enabled={formData.is_active}
              onChange={(value) => handleInputChange('is_active', value)}
              label="Tamaño Activo"
            />
            
            <Toggle
              enabled={formData.is_disponible}
              onChange={(value) => handleInputChange('is_disponible', value)}
              label="Disponible para Pedidos"
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
            {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'} Tamaño
          </button>
        </div>
      </form>
    </div>
  )
} 