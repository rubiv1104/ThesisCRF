'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  Bell, UserPlus, ClipboardCheck, CheckCircle2, CornerUpLeft, MessageSquare, Check,
} from 'lucide-react'
import { markNotificationsRead } from './actions'

export interface NotificationRow {
  id: string
  type: string
  title: string
  body: string | null
  patient_id: string | null
  read: boolean
  created_at: string
}

const ICON: Record<string, { icon: typeof Bell; cls: string }> = {
  new_patient: { icon: UserPlus, cls: 'text-blue-500 bg-blue-50' },
  crf_submitted: { icon: ClipboardCheck, cls: 'text-amber-600 bg-amber-50' },
  correction_resolved: { icon: CheckCircle2, cls: 'text-green-600 bg-green-50' },
  crf_approved: { icon: CheckCircle2, cls: 'text-green-600 bg-green-50' },
  correction_requested: { icon: CornerUpLeft, cls: 'text-red-500 bg-red-50' },
  correction_comment: { icon: MessageSquare, cls: 'text-blue-500 bg-blue-50' },
}

function timeAgo(d: string) {
  const s = (Date.now() - new Date(d).getTime()) / 1000
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`
  return new Date(d).toLocaleDateString('en-IN', { dateStyle: 'medium' })
}

export function NotificationsList({ items, linkFor }: { items: NotificationRow[]; linkFor: (patientId: string) => string }) {
  const [rows, setRows] = useState(items)
  const [, startT] = useTransition()
  const unread = rows.filter((r) => !r.read).length

  function markAll() {
    setRows((rs) => rs.map((r) => ({ ...r, read: true })))
    startT(() => { markNotificationsRead() })
  }
  function markOne(id: string) {
    setRows((rs) => rs.map((r) => r.id === id ? { ...r, read: true } : r))
    startT(() => { markNotificationsRead([id]) })
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-slate-200 py-16 text-center">
        <Bell size={28} className="mx-auto text-slate-300" />
        <p className="mt-2 text-sm text-slate-500">No notifications yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{unread} unread</p>
        {unread > 0 && (
          <button onClick={markAll} className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
            <Check size={13} /> Mark all read
          </button>
        )}
      </div>

      <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {rows.map((n) => {
          const meta = ICON[n.type] ?? { icon: Bell, cls: 'text-slate-500 bg-slate-100' }
          const Icon = meta.icon
          const body = (
            <div className={`flex items-start gap-3 px-4 py-3 ${n.read ? '' : 'bg-blue-50/40'}`}>
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.cls}`}><Icon size={16} /></span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800">{n.title}</p>
                {n.body && <p className="truncate text-xs text-slate-500">{n.body}</p>}
                <p className="mt-0.5 text-[11px] text-slate-400">{timeAgo(n.created_at)}</p>
              </div>
              {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
            </div>
          )
          return (
            <li key={n.id} onClick={() => !n.read && markOne(n.id)}>
              {n.patient_id ? <Link href={linkFor(n.patient_id)} className="block hover:bg-slate-50">{body}</Link> : body}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
