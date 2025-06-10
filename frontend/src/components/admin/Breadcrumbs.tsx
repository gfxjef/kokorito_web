'use client'

import Link from 'next/link'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'

interface BreadcrumbItem {
  name: string
  href?: string
  current?: boolean
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-2">
        {/* Home link */}
        <li>
          <Link
            href="/admin/dashboard"
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <HomeIcon className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Dashboard</span>
          </Link>
        </li>

        {/* Breadcrumb items */}
        {items.map((item, index) => (
          <li key={item.name}>
            <div className="flex items-center">
              <ChevronRightIcon
                className="h-5 w-5 text-gray-300"
                aria-hidden="true"
              />
              {item.current ? (
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href || '#'}
                  className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
} 