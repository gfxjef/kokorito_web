import ProtectedRoute from '@/components/admin/ProtectedRoute'
import AdminLayout from '@/components/admin/AdminLayout'
import TestimonioForm from '@/components/admin/testimonios/TestimonioForm'

export default function CrearTestimonioPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Testimonio</h1>
            <p className="mt-2 text-gray-600">
              Añadir un nuevo testimonio de cliente
            </p>
          </div>

          {/* Formulario */}
          <TestimonioForm />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
} 