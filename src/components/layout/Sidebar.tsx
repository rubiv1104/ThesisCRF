'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  FlaskConical,
  Download,
  ShieldCheck,
  Settings,
  X,
} from 'lucide-react'
import { cn } from '@/utils'
import { APP_NAME } from '@/constants'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Studies', href: '/studies', icon: BookOpen },
  { label: 'Patients', href: '/patients', icon: Users },
  { label: 'CRF', href: '/patients', icon: FileText },
  { label: 'Investigations', href: '/patients', icon: FlaskConical },
  { label: 'Export', href: '/export', icon: Download },
  { label: 'Admin', href: '/admin', icon: ShieldCheck },
  { label: 'Settings', href: '/settings', icon: Settings },
] as const

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-16 flex-col border-r border-slate-200 bg-white transition-all duration-200 hover:w-56 lg:static lg:z-auto',
          open ? 'w-56' : 'w-16'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-slate-200 px-4">
          <span className="text-lg font-bold text-blue-600">T</span>
          <span className="ml-2 overflow-hidden whitespace-nowrap text-sm font-semibold text-slate-800 opacity-0 transition-opacity group-hover:opacity-100">
            {APP_NAME}
          </span>
        </div>

        {/* Close button (mobile) */}
        <button
          onClick={onClose}
          className="absolute right-2 top-4 p-1 text-slate-400 hover:text-slate-600 lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-lg mx-2 px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                <Icon size={18} className="shrink-0" />
                <span className="overflow-hidden whitespace-nowrap">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
