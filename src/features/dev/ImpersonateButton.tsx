'use client'

import { useTransition } from 'react'
import { Eye, Loader2 } from 'lucide-react'
import { impersonate } from './actions'

export function ImpersonateButton({ userId, label }: { userId: string; label: string }) {
  const [pending, start] = useTransition()
  return (
    <button
      onClick={() => start(() => impersonate(userId))}
      disabled={pending}
      className="flex shrink-0 items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-700 disabled:opacity-60"
    >
      {pending ? <Loader2 size={12} className="animate-spin" /> : <Eye size={12} />} {label}
    </button>
  )
}
