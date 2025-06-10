import RellenosList from '@/components/admin/rellenos/RellenosList'
import AdminLayout from '@/components/admin/AdminLayout'
import ProtectedRoute from '@/components/admin/ProtectedRoute'

export default function RellenosPage() {
  return (
    <ProtectedRoute>
      <AdminLayout title="Rellenos">
        <RellenosList />
      </AdminLayout>
    </ProtectedRoute>
  )
} 