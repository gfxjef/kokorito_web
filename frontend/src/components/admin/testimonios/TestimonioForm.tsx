'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { StarIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { Testimonio, TestimonioForm as TestimonioFormType } from '@/types/admin/Testimonio'
import { Producto } from '@/types/admin/Producto'
import testimonioService from '@/services/admin/testimonioService'
import productoService from '@/services/admin/productoService'
import Toggle from '@/components/admin/ui/Toggle'

interface TestimonioFormProps {
  testimonio?: Testimonio
  isEdit?: boolean
}

export default function TestimonioForm({ testimonio, isEdit = false }: TestimonioFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingProductos, setLoadingProductos] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [productos, setProductos] = useState<Producto[]>([])
  
  const [formData, setFormData] = useState<TestimonioFormType>({
    nombre_cliente: testimonio?.nombre_cliente || '',
    email_cliente: testimonio?.email_cliente || '',
    telefono_cliente: testimonio?.telefono_cliente || '',
    titulo: testimonio?.titulo || '',
    comentario: testimonio?.comentario || '',
    rating: testimonio?.rating || 5,
    producto_id: testimonio?.producto_id || 0,
    is_active: testimonio?.is_active ?? true,
    is_publico: testimonio?.is_publico ?? true,
    is_destacado: testimonio?.is_destacado ?? false,
    is_verificado: testimonio?.is_verificado ?? false,
    orden_display: testimonio?.orden_display || 1,
    notas_moderacion: testimonio?.notas_moderacion || ''
  })

  // Cargar productos disponibles
  useEffect(() => {
    const loadProductos = async () => {
      try {
        const response = await productoService.getAll()
        setProductos(response.data)
      } catch (err) {
        console.error('Error al cargar productos:', err)
      } finally {
        setLoadingProductos(false)
      }
    }
    loadProductos()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isEdit && testimonio) {
        await testimonioService.update(testimonio.id, formData)
      } else {
        await testimonioService.create(formData)
      }
      
      router.push('/admin/testimonios')
    } catch (err: any) {
      setError(err.message || 'Error al guardar testimonio')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof TestimonioFormType, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const renderStarRating = () => {
    return (
      <div className="flex space-x-1">
        {Array.from({ length: 5 }, (_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleInputChange('rating', index + 1)}
            className="focus:outline-none"
          >
            {index < formData.rating ? (
              <StarIconSolid className="h-6 w-6 text-yellow-400 hover:text-yellow-500" />
            ) : (
              <StarIcon className="h-6 w-6 text-gray-300 hover:text-yellow-400" />
            )}
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">({formData.rating}/5)</span>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-700">{error}</div>
          </div>
        )}

        {/* Información del Cliente */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Información del Cliente</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Cliente *
              </label>
              <input
                type="text"
                required
                value={formData.nombre_cliente}
                onChange={(e) => handleInputChange('nombre_cliente', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ej: María González"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email_cliente}
                onChange={(e) => handleInputChange('email_cliente', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="maria@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.telefono_cliente}
                onChange={(e) => handleInputChange('telefono_cliente', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="+51 999 999 999"
              />
            </div>
          </div>
        </div>

        {/* Testimonio */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Contenido del Testimonio</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título (Opcional)
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => handleInputChange('titulo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ej: ¡Excelente servicio!"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentario *
              </label>
              <textarea
                rows={4}
                required
                value={formData.comentario}
                onChange={(e) => handleInputChange('comentario', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Escriba aquí el testimonio del cliente..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calificación *
              </label>
              {renderStarRating()}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Producto Relacionado *
              </label>
              {loadingProductos ? (
                <div className="text-gray-500">Cargando productos...</div>
              ) : (
                <select
                  required
                  value={formData.producto_id}
                  onChange={(e) => handleInputChange('producto_id', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={0}>Seleccionar producto...</option>
                  {productos.map((producto) => (
                    <option key={producto.id} value={producto.id}>
                      {producto.nombre}
                    </option>
                  ))}
                </select>
              )}
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
                label="Testimonio Activo"
              />
              
              <Toggle
                enabled={formData.is_publico}
                onChange={(value) => handleInputChange('is_publico', value)}
                label="Visible al Público"
              />
              
              <Toggle
                enabled={formData.is_verificado}
                onChange={(value) => handleInputChange('is_verificado', value)}
                label="Cliente Verificado"
              />
              
              <Toggle
                enabled={formData.is_destacado}
                onChange={(value) => handleInputChange('is_destacado', value)}
                label="Testimonio Destacado"
              />
            </div>

            <div>
              <div className="mb-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas de Moderación
                </label>
                <textarea
                  rows={3}
                  value={formData.notas_moderacion}
                  onChange={(e) => handleInputChange('notas_moderacion', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Notas internas sobre este testimonio..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vista Previa */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Vista Previa</h3>
          
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 font-medium text-sm">
                  {formData.nombre_cliente.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {formData.nombre_cliente || 'Nombre del cliente'}
                </div>
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }, (_, index) => (
                    index < formData.rating ? (
                      <StarIconSolid key={index} className="h-4 w-4 text-yellow-400" />
                    ) : (
                      <StarIcon key={index} className="h-4 w-4 text-gray-300" />
                    )
                  ))}
                </div>
              </div>
            </div>
            
            {formData.titulo && (
              <h4 className="font-medium text-gray-900 mb-2">{formData.titulo}</h4>
            )}
            
            <blockquote className="text-gray-700 italic">
              "{formData.comentario || 'El comentario aparecerá aquí...'}"
            </blockquote>
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
            {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'} Testimonio
          </button>
        </div>
      </form>
    </div>
  )
} 