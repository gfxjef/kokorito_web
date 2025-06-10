'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import AdminLayout from '@/components/admin/AdminLayout'
import ProductoForm from '@/components/admin/productos/ProductoForm'
import { Producto } from '@/types/admin/Producto'
import productoService from '@/services/admin/productoService'

interface EditarProductoPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditarProductoPage({ params }: EditarProductoPageProps) {
  const [producto, setProducto] = useState<Producto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('🔄 EditarProductoPage - useEffect ejecutándose')
    const loadProducto = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Await params since it's now a Promise in Next.js 15
        const resolvedParams = await params
        console.log('🔍 EditarProductoPage - Cargando producto con ID:', resolvedParams.id)
        
        const id = parseInt(resolvedParams.id)
        if (isNaN(id)) {
          setError('ID inválido')
          return
        }

        const response = await productoService.getById(id)
        console.log('✅ Producto cargado:', response.data)
        
        // Si response.data es un array, tomar el primer elemento
        const productoData = Array.isArray(response.data) ? response.data[0] : response.data
        console.log('📋 Producto procesado:', productoData)
        setProducto(productoData)
      } catch (err: any) {
        console.error('❌ Error al cargar producto:', err)
        setError(`Error al cargar producto: ${err.message || 'Error desconocido'}`)
      } finally {
        setLoading(false)
      }
    }

    loadProducto()
  }, [params])

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  if (error || !producto) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="text-center py-12">
            <div className="text-red-600 text-lg mb-4">
              {error || 'Producto no encontrado'}
            </div>
            <button
              onClick={() => window.history.back()}
              className="text-purple-600 hover:text-purple-800"
            >
              ← Volver
            </button>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Editar Producto: {producto.nombre}
            </h1>
            <p className="mt-2 text-gray-600">
              Modificar la información del producto y sus relaciones
            </p>
          </div>

          {/* Formulario */}
          <ProductoForm producto={producto} isEdit={true} />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
} 