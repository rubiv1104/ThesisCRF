'use client'

import { useTransition } from 'react'
import { Eye, Loader2, LogOut } from 'lucide-react'
import { stopImpersonating } from './actions'

export function ImpersonationBanner({ name, role }: { name: string; role: string }) {
  const [pending, start] = useTransition()
  return (
    <div className="flex items-center justify-between gap-3 bg-amber-500 px-4 py-1.5 text-white">
      <div className="flex items-center gap-2 text-sm">
        <Eye size={15} />
        <span>Currently viewing as <strong>{name || 'user'}</strong> ({role})</span>
      </div>
      <button
        onClick={() => start(() => stopImpersonating())}
        disabled={pending}
        className="flex items-center gap-1.5 rounded-md bg-white/20 px-3 py-1 text-xs font-medium hover:bg-white/30 disabled:opacity-60"
      >
        {pending ? <Loader2 size={12} className="animate-spin" /> : <LogOut size={12} />}
        Return to Administrator
      </button>
    </div>
  )
}
