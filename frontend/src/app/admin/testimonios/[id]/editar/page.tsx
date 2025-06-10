'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import AdminLayout from '@/components/admin/AdminLayout'
import TestimonioForm from '@/components/admin/testimonios/TestimonioForm'
import { Testimonio } from '@/types/admin/Testimonio'
import testimonioService from '@/services/admin/testimonioService'

interface EditarTestimonioPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditarTestimonioPage({ params }: EditarTestimonioPageProps) {
  const [testimonio, setTestimonio] = useState<Testimonio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTestimonio = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Await params since it's now a Promise in Next.js 15
        const resolvedParams = await params
        console.log('🔍 Cargando testimonio con ID:', resolvedParams.id)
        
        const id = parseInt(resolvedParams.id)
        if (isNaN(id)) {
          setError('ID inválido')
          return
        }

        const response = await testimonioService.getById(id)
        console.log('✅ Testimonio cargado:', response.data)
        
        // Si response.data es un array, tomar el primer elemento
        const testimonioData = Array.isArray(response.data) ? response.data[0] : response.data
        console.log('📋 Testimonio procesado:', testimonioData)
        setTestimonio(testimonioData)
      } catch (err: any) {
        console.error('❌ Error al cargar testimonio:', err)
        setError(`Error al cargar testimonio: ${err.message || 'Error desconocido'}`)
      } finally {
        setLoading(false)
      }
    }

    loadTestimonio()
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

  if (error || !testimonio) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="text-center py-12">
            <div className="text-red-600 text-lg mb-4">
              {error || 'Testimonio no encontrado'}
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
              Editar Testimonio: {testimonio.nombre_cliente}
            </h1>
            <p className="mt-2 text-gray-600">
              Modificar la información del testimonio
            </p>
          </div>

          {/* Formulario */}
          <TestimonioForm testimonio={testimonio} isEdit={true} />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
} 