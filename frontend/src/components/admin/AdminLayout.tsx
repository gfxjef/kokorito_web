'use client'

import Sidebar from './Sidebar'
import Header from './Header'

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 z-50">
          <Sidebar />
        </div>

        {/* Main content area */}
        <div className="flex flex-1 flex-col pl-64">
          {/* Header */}
          <Header title={title} />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
} 