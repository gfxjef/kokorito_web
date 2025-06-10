'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PlusIcon, PencilIcon, TrashIcon, PhotoIcon, EyeIcon } from '@heroicons/react/24/outline'
import { Producto } from '@/types/admin/Producto'
import { Categoria } from '@/types/admin/Categoria'
import productoService from '@/services/admin/productoService'
import categoriaService from '@/services/admin/categoriaService'
import StatusBadge from '@/components/admin/ui/StatusBadge'

export default function ProductosList() {
  const router = useRouter()
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtros, setFiltros] = useState({
    categoria_id: 0,
    is_active: '',
    is_disponible: '',
    search: ''
  })

  // Cargar categorías solo una vez al montar el componente
  useEffect(() => {
    loadCategorias()
  }, [])

  // Cargar productos cuando cambian los filtros
  useEffect(() => {
    loadProductos()
  }, [filtros])

  const loadProductos = async () => {
    try {
      setLoading(true)
      // Convertir filtros para la API
      const filtrosAPI: any = {
        search: filtros.search || undefined,
        categoria_id: filtros.categoria_id > 0 ? filtros.categoria_id : undefined,
        is_active: filtros.is_active === '' ? undefined : filtros.is_active === 'true',
        is_disponible: filtros.is_disponible === '' ? undefined : filtros.is_disponible === 'true'
      }
      
      const response = await productoService.getAll(filtrosAPI)
      setProductos(response.data)
    } catch (err: any) {
      setError(err.message || 'Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  const loadCategorias = async () => {
    try {
      const response = await categoriaService.getAll()
      setCategorias(response.data)
    } catch (err) {
      console.error('Error al cargar categorías:', err)
    }
  }

  const handleDelete = async (id: number, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar el producto "${nombre}"?`)) {
      return
    }

    try {
      await productoService.delete(id)
      await loadProductos()
    } catch (err: any) {
      alert(err.message || 'Error al eliminar producto')
    }
  }

  const getCategoriaName = (categoria_id: number) => {
    const categoria = categorias.find(c => c.id === categoria_id)
    return categoria ? categoria.nombre : 'Sin categoría'
  }

  const formatPrice = (precio: number) => {
    const numericPrice = typeof precio === 'number' ? precio : Number(precio) || 0
    return `S/. ${numericPrice.toFixed(2)}`
  }

  if (loading && productos.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-700">{error}</div>
        <button
          onClick={loadProductos}
          className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
        >
          Intentar de nuevo
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con filtros y botón crear */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Catálogo de Productos</h2>
          <p className="text-sm text-gray-500">
            Gestiona el catálogo completo de productos con relaciones
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/productos/crear')}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Nuevo Producto
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <input
              type="text"
              value={filtros.search}
              onChange={(e) => setFiltros(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Nombre o SKU..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={filtros.categoria_id}
              onChange={(e) => setFiltros(prev => ({ ...prev, categoria_id: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filtros.is_active}
              onChange={(e) => setFiltros(prev => ({ ...prev, is_active: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Todos los estados</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Disponibilidad
            </label>
            <select
              value={filtros.is_disponible}
              onChange={(e) => setFiltros(prev => ({ ...prev, is_disponible: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Todas</option>
              <option value="true">Disponibles</option>
              <option value="false">No disponibles</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {productos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No hay productos registrados</div>
            <button
              onClick={() => router.push('/admin/productos/crear')}
              className="text-purple-600 hover:text-purple-800"
            >
              Crear el primer producto
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precios
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock & Orden
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estados
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productos.map((producto) => (
                  <tr key={producto.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {producto.imagen_principal ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={producto.imagen_principal}
                              alt={producto.nombre}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                              <PhotoIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {producto.nombre}
                          </div>
                          <div className="text-sm text-gray-500">
                            SKU: {producto.sku}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getCategoriaName(producto.categoria_id)}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(producto.precio_base)}
                      </div>
                      {producto.precio_oferta && producto.precio_oferta > 0 && (
                        <div className="text-sm text-green-600">
                          Oferta: {formatPrice(producto.precio_oferta)}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Stock: {producto.stock_disponible}
                      </div>
                      <div className="text-sm text-gray-500">
                        Orden: {producto.orden_display}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <StatusBadge 
                          status={producto.is_active ? 'active' : 'inactive'} 
                          text={producto.is_active ? 'Activo' : 'Inactivo'}
                        />
                        <StatusBadge 
                          status={producto.is_disponible ? 'available' : 'unavailable'} 
                          text={producto.is_disponible ? 'Disponible' : 'No Disponible'}
                        />
                        {producto.is_destacado && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Destacado
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/admin/productos/${producto.id}/editar`)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Editar"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(producto.id, producto.nombre)}
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
          </div>
        )}
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{productos.length}</div>
          <div className="text-sm text-gray-500">Total Productos</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            {productos.filter(p => p.is_active).length}
          </div>
          <div className="text-sm text-gray-500">Activos</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">
            {productos.filter(p => p.is_disponible).length}
          </div>
          <div className="text-sm text-gray-500">Disponibles</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">
            {productos.filter(p => p.is_destacado).length}
          </div>
          <div className="text-sm text-gray-500">Destacados</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">
            {productos.filter(p => p.precio_oferta && p.precio_oferta > 0).length}
          </div>
          <div className="text-sm text-gray-500">En Oferta</div>
        </div>
      </div>
    </div>
  )
} 