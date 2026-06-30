'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  FlaskConical,
  Download,
  Settings,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  MessageSquarePlus,
  Inbox,
  Scale,
  GraduationCap,
  TableProperties,
  FileText,
} from 'lucide-react'
import { cn } from '@/utils'
import { APP_NAME } from '@/constants'

const INVESTIGATOR_NAV = [
  { label: 'My Patients', href: '/dashboard', icon: LayoutDashboard },
  { label: 'CRF Preview', href: '/crf-preview', icon: FileText },
  { label: 'Master Chart', href: '/master-chart', icon: TableProperties },
  { label: 'Investigations', href: '/investigations', icon: FlaskConical },
  { label: 'Assessments & Scales', href: '/assessments', icon: Scale },
  { label: 'Feedback & Requests', href: '/feedback', icon: MessageSquarePlus },
  { label: 'Settings', href: '/settings', icon: Settings },
]

const TEACHER_NAV = [
  { label: 'Students\' CRFs', href: '/teacher', icon: GraduationCap },
  { label: 'CRF Preview', href: '/teacher/template', icon: FileText },
  { label: 'Master Chart', href: '/master-chart', icon: TableProperties },
  { label: 'Assessments & Scales', href: '/assessments', icon: Scale },
  { label: 'Settings', href: '/settings', icon: Settings },
]

const ADMIN_NAV = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'All Patients & CRFs', href: '/admin/patients', icon: ClipboardList },
  { label: 'User Management', href: '/admin/users', icon: Users },
  { label: 'Assessments & Scales', href: '/assessments', icon: Scale },
  { label: 'Feedback Inbox', href: '/admin/feedback', icon: Inbox },
  { label: 'Export', href: '/export', icon: Download },
  { label: 'Settings', href: '/settings', icon: Settings },
]

const ROLE_CONFIG = {
  admin: {
    nav: ADMIN_NAV,
    label: 'Administrator',
    color: 'text-purple-700',
    badge: 'bg-purple-50 text-purple-700',
  },
  teacher: {
    nav: TEACHER_NAV,
    label: 'Guide',
    color: 'text-green-700',
    badge: 'bg-green-50 text-green-700',
  },
  investigator: {
    nav: INVESTIGATOR_NAV,
    label: 'Investigator',
    color: 'text-blue-700',
    badge: 'bg-blue-50 text-blue-700',
  },
}

interface SidebarProps {
  open: boolean
  onClose: () => void
  role?: 'admin' | 'teacher' | 'investigator'
}

export function Sidebar({ open, onClose, role = 'investigator' }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    const saved = localStorage.getItem('sidebar-collapsed')
    return saved === 'true'
  })

  function toggleCollapse() {
    setCollapsed((v) => {
      localStorage.setItem('sidebar-collapsed', String(!v))
      return !v
    })
  }

  const config = ROLE_CONFIG[role]

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex flex-col border-r border-slate-200 bg-white transition-all duration-200 lg:static lg:z-auto',
          open ? 'w-60' : 'w-0 overflow-hidden lg:overflow-visible',
          collapsed ? 'lg:w-16' : 'lg:w-60'
        )}
      >
        {/* Logo + collapse toggle */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white">
              T
            </span>
            {!collapsed && (
              <span className="truncate text-sm font-semibold text-slate-800 leading-tight">
                {APP_NAME}
              </span>
            )}
          </div>
          <button
            onClick={toggleCollapse}
            className="hidden shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:flex"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Role badge */}
        {!collapsed && (
          <div className="mx-3 mt-3 rounded-md bg-slate-50 px-3 py-2">
            <p className="text-xs text-slate-400">Signed in as</p>
            <p className={cn('text-xs font-semibold', config.color)}>
              {config.label}
            </p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto py-3 px-2">
          {config.nav.map((item) => {
            const Icon = item.icon
            const active =
              pathname === item.href ||
              (item.href !== '/admin' && item.href !== '/teacher' && pathname.startsWith(item.href + '/'))
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                title={collapsed ? item.label : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  collapsed ? 'justify-center px-0' : '',
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="border-t border-slate-100 px-4 py-3">
            <p className="text-xs text-slate-400 leading-tight">
              ThesisCRF v1.0<br />
              PG Dept. Kayachikitsa
            </p>
          </div>
        )}
      </aside>
    </>
  )
}
