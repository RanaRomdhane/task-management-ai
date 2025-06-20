'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navigationItems = [
  { name: 'Dashboard', href: '/' },
  { name: 'Tasks', href: '/tasks' },
  { name: 'Calendar', href: '/calendar' },
  { name: 'Batches', href: '/batches' },
  { name: 'Analytics', href: '/analytics' },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm sticky top-16 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto space-x-8 py-2 hide-scrollbar">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm',
                pathname === item.href
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}