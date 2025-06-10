'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Categoria } from '@/types/admin/Categoria'
import categoriaService from '@/services/admin/categoriaService'
import StatusBadge from '@/components/admin/ui/StatusBadge'

export default function CategoriasList() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCategorias()
  }, [])

  const loadCategorias = async () => {
    try {
      setLoading(true)
      const response = await categoriaService.getAll()
      setCategorias(response.data)
    } catch (err) {
      setError('Error al cargar categorías')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return
    
    try {
      await categoriaService.delete(id)
      await loadCategorias()
    } catch (err) {
      alert('Error al eliminar categoría')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Cargando categorías...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-700">{error}</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">Gestiona las categorías de productos</p>
        </div>
        <Link
          href="/admin/categorias/crear"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nueva Categoría
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orden
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categorias.map((categoria) => (
              <tr key={categoria.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {categoria.color_tema && (
                      <div
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: categoria.color_tema }}
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {categoria.nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        {categoria.slug}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <StatusBadge 
                      status={categoria.is_active ? 'active' : 'inactive'}
                      size="sm"
                    />
                    {categoria.is_featured && (
                      <StatusBadge status="featured" size="sm" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {categoria.orden_display}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(categoria.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Link
                      href={`/admin/categorias/${categoria.id}/editar`}
                      className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(categoria.id)}
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

        {categorias.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No hay categorías registradas</div>
            <Link
              href="/admin/categorias/crear"
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Crear primera categoría
            </Link>
          </div>
        )}
      </div>
    </div>
  )
} 