import CategoriasList from '@/components/admin/categorias/CategoriasList'
import AdminLayout from '@/components/admin/AdminLayout'
import ProtectedRoute from '@/components/admin/ProtectedRoute'

export default function CategoriasPage() {
  return (
    <ProtectedRoute>
      <AdminLayout title="Categorías">
        <CategoriasList />
      </AdminLayout>
    </ProtectedRoute>
  )
} 