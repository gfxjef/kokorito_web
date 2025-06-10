import CategoriaForm from '@/components/admin/categorias/CategoriaForm'
import AdminLayout from '@/components/admin/AdminLayout'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import Breadcrumbs from '@/components/admin/Breadcrumbs'

export default function CrearCategoriaPage() {
  const breadcrumbItems = [
    { name: 'Categorías', href: '/admin/categorias' },
    { name: 'Crear', current: true }
  ]

  return (
    <ProtectedRoute>
      <AdminLayout title="Crear Categoría">
        <Breadcrumbs items={breadcrumbItems} />
        <CategoriaForm />
      </AdminLayout>
    </ProtectedRoute>
  )
} 