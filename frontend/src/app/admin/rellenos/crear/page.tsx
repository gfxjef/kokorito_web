import ProtectedRoute from '@/components/admin/ProtectedRoute'
import AdminLayout from '@/components/admin/AdminLayout'
import RellenoForm from '@/components/admin/rellenos/RellenoForm'

export default function CrearRellenoPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Relleno</h1>
            <p className="mt-2 text-gray-600">
              Añadir un nuevo relleno al catálogo de productos
            </p>
          </div>

          {/* Formulario */}
          <RellenoForm />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
} 