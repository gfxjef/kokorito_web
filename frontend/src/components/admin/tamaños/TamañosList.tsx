'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Tamaño } from '@/types/admin/Tamaño'
import tamañoService from '@/services/admin/tamañoService'
import StatusBadge from '@/components/admin/ui/StatusBadge'

export default function TamañosList() {
  const router = useRouter()
  const [tamaños, setTamaños] = useState<Tamaño[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTamaños()
  }, [])

  const loadTamaños = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔄 Cargando tamaños desde backend...')
      
      const response = await tamañoService.getAll()
      console.log('✅ Tamaños obtenidos:', response)
      
      setTamaños(response.data)
    } catch (err: any) {
      console.error('❌ Error al cargar tamaños:', err)
      setError(`Error de conexión: ${err.message || 'No se pudo conectar al servidor'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este tamaño?')) return
    
    try {
      console.log('🗑️ Eliminando tamaño:', id)
      await tamañoService.delete(id)
      console.log('✅ Tamaño eliminado exitosamente')
      await loadTamaños()
    } catch (err: any) {
      console.error('❌ Error al eliminar tamaño:', err)
      alert(`Error al eliminar tamaño: ${err.message || 'Error desconocido'}`)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
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
            onClick={loadTamaños}
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
    <div className="space-y-6">
      {/* Header con botón crear */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Tamaños Disponibles</h2>
          <p className="text-sm text-gray-500">
            Gestiona los tamaños de productos disponibles
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/tamanos/crear')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Nuevo Tamaño
        </button>
      </div>

      {/* Tabla de tamaños */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {tamaños.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No hay tamaños registrados</div>
            <button
              onClick={() => router.push('/admin/tamanos/crear')}
              className="text-purple-600 hover:text-purple-800"
            >
              Crear el primer tamaño
            </button>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tamaño
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Base
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detalles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tamaños.map((tamaño) => (
                <tr key={tamaño.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="w-8 h-8 rounded-full mr-3 flex items-center justify-center text-white text-sm font-medium"
                        style={{ backgroundColor: tamaño.color_hex }}
                      >
                        {tamaño.icono}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {tamaño.nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          {tamaño.descripcion}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                                     <td className="px-6 py-4 whitespace-nowrap">
                     <div className="text-sm font-medium text-gray-900">
                       +S/. {(typeof tamaño.precio_adicional === 'number' ? tamaño.precio_adicional : 0).toFixed(2)}
                     </div>
                     <div className="text-sm text-gray-500">
                       x{tamaño.multiplicador_precio}
                     </div>
                   </td>

                   <td className="px-6 py-4 whitespace-nowrap">
                     <div className="text-sm text-gray-900">
                       {tamaño.porciones_aproximadas || 0} porciones
                     </div>
                     <div className="text-sm text-gray-500">
                       Ø {tamaño.diametro_cm || 0}cm
                     </div>
                     {(tamaño.peso_gramos || 0) > 0 && (
                       <div className="text-sm text-gray-500">
                         ~{tamaño.peso_gramos}gr
                       </div>
                     )}
                   </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <StatusBadge
                        status={tamaño.is_active ? 'active' : 'inactive'}
                        text={tamaño.is_active ? 'Activo' : 'Inactivo'}
                      />
                                             {tamaño.is_disponible && (
                         <StatusBadge
                           status="available"
                           text="Disponible"
                         />
                       )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/admin/tamanos/${tamaño.id}/editar`)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Editar"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tamaño.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{tamaños.length}</div>
          <div className="text-sm text-gray-500">Total Tamaños</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            {tamaños.filter(t => t.is_active).length}
          </div>
          <div className="text-sm text-gray-500">Activos</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">
            {tamaños.filter(t => t.is_disponible).length}
          </div>
          <div className="text-sm text-gray-500">Disponibles</div>
        </div>
                 <div className="bg-white p-4 rounded-lg shadow">
           <div className="text-2xl font-bold text-purple-600">
             {tamaños.filter(t => t.multiplicador_precio > 1).length}
           </div>
           <div className="text-sm text-gray-500">Con Multiplicador</div>
         </div>
      </div>
    </div>
  )
} 