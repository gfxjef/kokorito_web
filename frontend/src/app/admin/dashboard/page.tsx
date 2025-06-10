'use client'

import Link from 'next/link'
import { 
  CubeIcon, 
  TagIcon, 
  ChatBubbleLeftRightIcon,
  CakeIcon,
  AdjustmentsHorizontalIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import AdminLayout from '@/components/admin/AdminLayout'
import ProtectedRoute from '@/components/admin/ProtectedRoute'

function DashboardContent() {
  const quickActions = [
    { name: 'Nuevo Producto', href: '/admin/productos/crear', icon: CubeIcon, color: 'bg-blue-500' },
    { name: 'Nueva Categoría', href: '/admin/categorias/crear', icon: TagIcon, color: 'bg-green-500' },
    { name: 'Nuevo Relleno', href: '/admin/rellenos/crear', icon: CakeIcon, color: 'bg-purple-500' },
    { name: 'Nuevo Tamaño', href: '/admin/tamanos/crear', icon: AdjustmentsHorizontalIcon, color: 'bg-orange-500' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Kokorito</h1>
        <p className="text-gray-600 mt-2">Panel de administración de la pastelería</p>
      </div>
      
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CubeIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Productos</h3>
              <p className="text-2xl font-bold text-blue-600">24</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TagIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Categorías</h3>
              <p className="text-2xl font-bold text-green-600">8</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Testimonios</h3>
              <p className="text-2xl font-bold text-purple-600">156</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CakeIcon className="h-8 w-8 text-pink-500" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Rellenos</h3>
              <p className="text-2xl font-bold text-pink-600">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AdjustmentsHorizontalIcon className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Tamaños</h3>
              <p className="text-2xl font-bold text-orange-600">6</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Ventas</h3>
              <p className="text-2xl font-bold text-yellow-600">S/. 12,450</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${action.color}`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">{action.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Actividad Reciente</h2>
        </div>
        <div className="p-6">
          <div className="text-center text-gray-500 py-8">
            <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p>Sistema administrativo listo. ¡Empieza a gestionar tu pastelería!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <AdminLayout title="Dashboard">
        <DashboardContent />
      </AdminLayout>
    </ProtectedRoute>
  )
} 