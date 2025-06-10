'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import TamañosList from '@/components/admin/tamaños/TamañosList'

export default function TamañosPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Tamaños</h1>
            <p className="mt-2 text-gray-600">
              Administra los tamaños disponibles para los productos
            </p>
          </div>

          {/* Lista de tamaños */}
          <TamañosList />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
} 