'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PlusIcon, PencilIcon, TrashIcon, StarIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { Testimonio } from '@/types/admin/Testimonio'
import testimonioService from '@/services/admin/testimonioService'
import StatusBadge from '@/components/admin/ui/StatusBadge'

export default function TestimoniosList() {
  const router = useRouter()
  const [testimonios, setTestimonios] = useState<Testimonio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTestimonios()
  }, [])

  const loadTestimonios = async () => {
    try {
      setLoading(true)
      const response = await testimonioService.getAll()
      setTestimonios(response.data)
    } catch (err: any) {
      setError(err.message || 'Error al cargar testimonios')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, nombre_cliente: string) => {
    if (!confirm(`¿Estás seguro de eliminar el testimonio de "${nombre_cliente}"?`)) {
      return
    }

    try {
      await testimonioService.delete(id)
      await loadTestimonios()
    } catch (err: any) {
      alert(err.message || 'Error al eliminar testimonio')
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      index < rating ? (
        <StarIconSolid key={index} className="h-4 w-4 text-yellow-400" />
      ) : (
        <StarIcon key={index} className="h-4 w-4 text-gray-300" />
      )
    ))
  }

  if (loading) {
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
          onClick={loadTestimonios}
          className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
        >
          Intentar de nuevo
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con botón crear */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Testimonios de Clientes</h2>
          <p className="text-sm text-gray-500">
            Gestiona los testimonios y reseñas de los clientes
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/testimonios/crear')}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Nuevo Testimonio
        </button>
      </div>

      {/* Tabla de testimonios */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {testimonios.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No hay testimonios registrados</div>
            <button
              onClick={() => router.push('/admin/testimonios/crear')}
              className="text-purple-600 hover:text-purple-800"
            >
              Crear el primer testimonio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {testimonios.map((testimonio) => (
              <div key={testimonio.id} className="bg-gray-50 rounded-lg p-4 border hover:shadow-md transition-shadow">
                {/* Header del testimonio */}
                                 <div className="flex justify-between items-start mb-3">
                   <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                       <span className="text-purple-600 font-medium text-sm">
                         {testimonio.nombre_cliente.charAt(0).toUpperCase()}
                       </span>
                     </div>
                     <div>
                       <div className="font-medium text-gray-900">{testimonio.nombre_cliente}</div>
                       <div className="text-sm text-gray-500">{testimonio.email_cliente}</div>
                     </div>
                   </div>
                   
                   <div className="flex space-x-1">
                     <button
                       onClick={() => router.push(`/admin/testimonios/${testimonio.id}/editar`)}
                       className="text-indigo-600 hover:text-indigo-900 p-1"
                       title="Editar"
                     >
                       <PencilIcon className="h-4 w-4" />
                     </button>
                     <button
                       onClick={() => handleDelete(testimonio.id, testimonio.nombre_cliente)}
                       className="text-red-600 hover:text-red-900 p-1"
                       title="Eliminar"
                     >
                       <TrashIcon className="h-4 w-4" />
                     </button>
                   </div>
                 </div>

                 {/* Rating */}
                 <div className="flex items-center space-x-2 mb-3">
                   <div className="flex">{renderStars(testimonio.rating)}</div>
                   <span className="text-sm text-gray-600">({testimonio.rating}/5)</span>
                 </div>

                 {/* Título y Contenido */}
                 {testimonio.titulo && (
                   <h4 className="font-medium text-gray-900 mb-2">{testimonio.titulo}</h4>
                 )}
                 <blockquote className="text-gray-700 italic mb-3 line-clamp-3">
                   "{testimonio.comentario}"
                 </blockquote>

                 {/* Producto relacionado */}
                 <div className="text-sm text-gray-600 mb-3">
                   Producto ID: <span className="font-medium">{testimonio.producto_id}</span>
                 </div>

                                 {/* Estados */}
                 <div className="flex flex-wrap gap-2 mb-3">
                   <StatusBadge
                     status={testimonio.is_active ? 'active' : 'inactive'}
                     text={testimonio.is_active ? 'Activo' : 'Inactivo'}
                   />
                   {testimonio.is_publico && (
                     <StatusBadge status="public" text="Público" />
                   )}
                   {testimonio.is_verificado && (
                     <StatusBadge status="premium" text="Verificado" />
                   )}
                   {testimonio.is_destacado && (
                     <StatusBadge status="featured" text="Destacado" />
                   )}
                 </div>

                 {/* Fecha */}
                 <div className="text-xs text-gray-500">
                   {new Date(testimonio.created_at).toLocaleDateString('es-ES')}
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{testimonios.length}</div>
          <div className="text-sm text-gray-500">Total</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            {testimonios.filter(t => t.is_active).length}
          </div>
          <div className="text-sm text-gray-500">Activos</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">
            {testimonios.filter(t => t.is_verificado).length}
          </div>
          <div className="text-sm text-gray-500">Verificados</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">
            {testimonios.filter(t => t.is_destacado).length}
          </div>
          <div className="text-sm text-gray-500">Destacados</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">
            {testimonios.length > 0 ? (testimonios.reduce((acc, t) => acc + t.rating, 0) / testimonios.length).toFixed(1) : '0'}
          </div>
          <div className="text-sm text-gray-500">Rating Promedio</div>
        </div>
      </div>
    </div>
  )
} 