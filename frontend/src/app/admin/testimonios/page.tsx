'use client'

import ProtectedRoute from '@/components/admin/ProtectedRoute'
import AdminLayout from '@/components/admin/AdminLayout'
import TestimoniosList from '@/components/admin/testimonios/TestimoniosList'

export default function TestimoniosPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Testimonios</h1>
            <p className="mt-2 text-gray-600">
              Administra las reseñas y testimonios de los clientes
            </p>
          </div>

          {/* Lista de testimonios */}
          <TestimoniosList />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
} 