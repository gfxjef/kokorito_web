import ProtectedRoute from '@/components/admin/ProtectedRoute'
import AdminLayout from '@/components/admin/AdminLayout'
import TamañoForm from '@/components/admin/tamaños/TamañoForm'

export default function CrearTamañoPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Tamaño</h1>
            <p className="mt-2 text-gray-600">
              Añadir un nuevo tamaño al catálogo de productos
            </p>
          </div>

          {/* Formulario */}
          <TamañoForm />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
} 