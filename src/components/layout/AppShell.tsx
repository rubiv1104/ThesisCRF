'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'
import { ImpersonationBanner } from '@/features/dev/ImpersonationBanner'

interface AppShellProps {
  children: React.ReactNode
  role?: 'admin' | 'teacher' | 'investigator'
  impersonation?: { name: string; role: string } | null
}

export function AppShell({ children, role = 'investigator', impersonation = null }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} role={role} />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {impersonation && <ImpersonationBanner name={impersonation.name} role={impersonation.role} />}
        <TopNav onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
