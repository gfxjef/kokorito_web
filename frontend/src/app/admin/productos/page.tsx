import ProtectedRoute from '@/components/admin/ProtectedRoute'
import AdminLayout from '@/components/admin/AdminLayout'
import ProductosList from '@/components/admin/productos/ProductosList'

export default function ProductosPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
            <p className="mt-2 text-gray-600">
              Administra el catálogo completo de productos, rellenos y tamaños
            </p>
          </div>

          {/* Lista de productos */}
          <ProductosList />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
} 