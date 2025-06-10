'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import AdminLayout from '@/components/admin/AdminLayout'
import RellenoForm from '@/components/admin/rellenos/RellenoForm'
import { Relleno } from '@/types/admin/Relleno'
import rellenoService from '@/services/admin/rellenoService'

interface EditarRellenoPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditarRellenoPage({ params }: EditarRellenoPageProps) {
  const [relleno, setRelleno] = useState<Relleno | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadRelleno = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Await params since it's now a Promise in Next.js 15
        const resolvedParams = await params
        console.log('🔍 Cargando relleno con ID:', resolvedParams.id)
        
        const id = parseInt(resolvedParams.id)
        if (isNaN(id)) {
          setError('ID inválido')
          return
        }

        const response = await rellenoService.getById(id)
        console.log('✅ Relleno cargado:', response.data)
        
        // Si response.data es un array, tomar el primer elemento
        const rellenoData = Array.isArray(response.data) ? response.data[0] : response.data
        console.log('📋 Relleno procesado:', rellenoData)
        setRelleno(rellenoData)
      } catch (err: any) {
        console.error('❌ Error al cargar relleno:', err)
        setError(`Error al cargar relleno: ${err.message || 'Error desconocido'}`)
      } finally {
        setLoading(false)
      }
    }

    loadRelleno()
  }, [params])

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
              <div className="text-gray-500">Cargando relleno...</div>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="text-red-500 text-lg">⚠️</div>
              <h3 className="text-lg font-medium text-red-800 ml-2">Error al Cargar</h3>
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="flex space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Reintentar
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                ← Volver
              </button>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  if (!relleno) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="text-center py-12">
            <div className="text-gray-600 text-lg mb-4">
              Relleno no encontrado
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
              Editar Relleno: {relleno.nombre}
            </h1>
            <p className="mt-2 text-gray-600">
              Modificar la información del relleno
            </p>
          </div>

          {/* Formulario */}
          <RellenoForm relleno={relleno} isEdit={true} />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
} 