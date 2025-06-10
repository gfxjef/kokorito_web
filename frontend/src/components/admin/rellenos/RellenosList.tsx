'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Relleno } from '@/types/admin/Relleno'
import rellenoService from '@/services/admin/rellenoService'
import StatusBadge from '@/components/admin/ui/StatusBadge'

export default function RellenosList() {
  const [rellenos, setRellenos] = useState<Relleno[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadRellenos()
  }, [])

  const loadRellenos = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔄 Cargando rellenos desde backend...')
      
      const response = await rellenoService.getAll()
      console.log('✅ Rellenos obtenidos:', response)
      
      setRellenos(response.data)
    } catch (err: any) {
      console.error('❌ Error al cargar rellenos:', err)
      setError(`Error de conexión: ${err.message || 'No se pudo conectar al servidor'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este relleno?')) return
    
    try {
      console.log('🗑️ Eliminando relleno:', id)
      await rellenoService.delete(id)
      console.log('✅ Relleno eliminado exitosamente')
      await loadRellenos()
    } catch (err: any) {
      console.error('❌ Error al eliminar relleno:', err)
      alert(`Error al eliminar relleno: ${err.message || 'Error desconocido'}`)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-gray-500">Conectando con el servidor...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="text-red-500 text-lg">⚠️</div>
          <h3 className="text-lg font-medium text-red-800 ml-2">Error de Conexión</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <div className="flex space-x-4">
          <button
            onClick={loadRellenos}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Reintentar
          </button>
          <div className="text-sm text-red-600">
            Verifica que el backend esté ejecutándose en http://localhost:8000
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">Gestiona los rellenos disponibles para productos</p>
        </div>
        <Link
          href="/admin/rellenos/crear"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nuevo Relleno
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Relleno
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Características
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rellenos.map((relleno) => (
              <tr key={relleno.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {relleno.color_hex && (
                      <div
                        className="w-4 h-4 rounded-full mr-3 border"
                        style={{ backgroundColor: relleno.color_hex }}
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {relleno.nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        {relleno.descripcion}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    S/. {(typeof relleno.precio_adicional === 'number' ? relleno.precio_adicional : 0).toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <StatusBadge 
                      status={relleno.is_active ? 'active' : 'inactive'}
                      size="sm"
                    />
                    {relleno.is_premium && (
                      <StatusBadge status="premium" size="sm" />
                    )}
                    {relleno.is_disponible && (
                      <StatusBadge status="available" size="sm" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    {relleno.es_vegano && <span className="text-green-600">🌱</span>}
                    {relleno.contiene_gluten && <span className="text-orange-600">🌾</span>}
                    {relleno.contiene_lactosa && <span className="text-blue-600">🥛</span>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Link
                      href={`/admin/rellenos/${relleno.id}/editar`}
                      className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(relleno.id)}
                      className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rellenos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No hay rellenos registrados</div>
            <Link
              href="/admin/rellenos/crear"
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Crear primer relleno
            </Link>
          </div>
        )}
      </div>
    </div>
  )
} 