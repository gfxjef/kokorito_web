'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { 
  HomeIcon, 
  TagIcon, 
  CubeIcon, 
  CakeIcon, 
  AdjustmentsHorizontalIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightOnRectangleIcon,
  GiftIcon,
  ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'Categorías', href: '/admin/categorias', icon: TagIcon },
  { name: 'Productos', href: '/admin/productos', icon: CubeIcon },
  { name: 'Rellenos', href: '/admin/rellenos', icon: CakeIcon },
  { name: 'Tamaños', href: '/admin/tamanos', icon: AdjustmentsHorizontalIcon },
  { name: 'Testimonios', href: '/admin/testimonios', icon: ChatBubbleLeftEllipsisIcon },
]

function LogoutButton() {
  const { logout } = useAuth()
  
  const handleLogout = () => {
    logout()
    window.location.href = '/admin/login'
  }

  return (
    <button 
      onClick={handleLogout}
      className="group flex w-full gap-x-3 rounded-md p-3 text-sm leading-6 font-medium text-gray-700 hover:text-red-700 hover:bg-red-50 transition-colors"
    >
      <ArrowRightOnRectangleIcon
        className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-red-700"
        aria-hidden="true"
      />
      Cerrar Sesión
    </button>
  )
}

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-white shadow-lg">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-6">
        <div className="flex items-center">
          <div className="text-2xl">🍰</div>
          <div className="ml-3">
            <h1 className="text-xl font-bold text-gray-900">Kokorito</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-4 py-6">
        <ul role="list" className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`
                    group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-medium transition-colors
                    ${isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <item.icon
                    className={`h-5 w-5 shrink-0 ${
                      isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-blue-700'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Logout */}
        <div className="mt-auto">
          <LogoutButton />
        </div>
      </nav>
    </div>
  )
} 