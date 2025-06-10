import ProtectedRoute from '@/components/admin/ProtectedRoute'
import AdminLayout from '@/components/admin/AdminLayout'
import ProductoForm from '@/components/admin/productos/ProductoForm'

export default function CrearProductoPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Producto</h1>
            <p className="mt-2 text-gray-600">
              Añadir un nuevo producto al catálogo con sus relaciones
            </p>
          </div>

          {/* Formulario */}
          <ProductoForm />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
} 