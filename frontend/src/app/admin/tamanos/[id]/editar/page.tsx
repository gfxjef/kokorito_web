'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import AdminLayout from '@/components/admin/AdminLayout'
import TamañoForm from '@/components/admin/tamaños/TamañoForm'
import { Tamaño } from '@/types/admin/Tamaño'
import tamañoService from '@/services/admin/tamañoService'

interface EditarTamañoPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditarTamañoPage({ params }: EditarTamañoPageProps) {
  const [tamaño, setTamaño] = useState<Tamaño | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTamaño = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Await params since it's now a Promise in Next.js 15
        const resolvedParams = await params
        console.log('🔍 Cargando tamaño con ID:', resolvedParams.id)
        
        const id = parseInt(resolvedParams.id)
        if (isNaN(id)) {
          setError('ID inválido')
          return
        }

        const response = await tamañoService.getById(id)
        console.log('✅ Tamaño cargado:', response.data)
        
        // Si response.data es un array, tomar el primer elemento
        const tamañoData = Array.isArray(response.data) ? response.data[0] : response.data
        console.log('📋 Tamaño procesado:', tamañoData)
        setTamaño(tamañoData)
      } catch (err: any) {
        console.error('❌ Error al cargar tamaño:', err)
        setError(`Error al cargar tamaño: ${err.message || 'Error desconocido'}`)
      } finally {
        setLoading(false)
      }
    }

    loadTamaño()
  }, [params])

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
              <div className="text-gray-500">Cargando tamaño...</div>
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

  if (!tamaño) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="text-center py-12">
            <div className="text-gray-600 text-lg mb-4">
              Tamaño no encontrado
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
              Editar Tamaño: {tamaño.nombre}
            </h1>
            <p className="mt-2 text-gray-600">
              Modificar la información del tamaño
            </p>
          </div>

          {/* Formulario */}
          <TamañoForm tamaño={tamaño} isEdit={true} />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
} 