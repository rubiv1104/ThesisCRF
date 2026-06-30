'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight, User, Clock } from 'lucide-react'

export interface GuidePatient {
  id: string
  patient_name: string
  study_patient_id: string
  study_code: string
  group_name: string | null
  investigator_name: string
  investigator_email: string
  crf_status: string
  fill_percent: number
}

function statusBadge(s: string) {
  if (s === 'approved') return 'bg-green-50 text-green-700'
  if (s === 'submitted') return 'bg-amber-100 text-amber-700 ring-1 ring-amber-300'
  if (s === 'returned') return 'bg-red-50 text-red-600'
  return 'bg-slate-100 text-slate-500'
}
function statusLabel(s: string) {
  if (s === 'submitted') return 'Awaiting Review'
  if (s === 'pending') return 'In Progress'
  if (s === 'not_started') return 'Not Started'
  return s.charAt(0).toUpperCase() + s.slice(1)
}

interface InvestigatorGroup {
  name: string
  email: string
  patients: GuidePatient[]
  awaiting: number
}

export function GuidePatients({ patients }: { patients: GuidePatient[] }) {
  // Group by investigator
  const map = new Map<string, InvestigatorGroup>()
  for (const p of patients) {
    const key = p.investigator_email || p.investigator_name || 'Unknown'
    let g = map.get(key)
    if (!g) { g = { name: p.investigator_name || 'Unknown', email: p.investigator_email || '', patients: [], awaiting: 0 }; map.set(key, g) }
    g.patients.push(p)
    if (p.crf_status === 'submitted') g.awaiting++
  }
  const groups = Array.from(map.values()).sort((a, b) => b.awaiting - a.awaiting || a.name.localeCompare(b.name))

  // Auto-expand investigators who have submissions awaiting review
  const [open, setOpen] = useState<Record<string, boolean>>(
    () => Object.fromEntries(groups.filter((g) => g.awaiting > 0).map((g) => [g.email || g.name, true]))
  )
  function toggle(key: string) { setOpen((o) => ({ ...o, [key]: !o[key] })) }

  if (patients.length === 0) return null

  return (
    <div className="space-y-3">
      {groups.map((g) => {
        const key = g.email || g.name
        const isOpen = open[key] ?? false
        return (
          <div key={key} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Investigator header — tap to expand */}
            <button
              onClick={() => toggle(key)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <User size={17} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-slate-900">{g.name}</span>
                <span className="block truncate text-xs text-slate-400">
                  {g.patients.length} patient{g.patients.length !== 1 ? 's' : ''}
                  {g.patients[0]?.study_code ? ` · ${g.patients[0].study_code}` : ''}
                </span>
              </span>
              {g.awaiting > 0 && (
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-300">
                  <Clock size={12} /> {g.awaiting}
                </span>
              )}
              {isOpen ? <ChevronDown size={18} className="shrink-0 text-slate-400" /> : <ChevronRight size={18} className="shrink-0 text-slate-400" />}
            </button>

            {/* Patients (mobile-friendly cards) */}
            {isOpen && (
              <ul className="divide-y divide-slate-100 border-t border-slate-100">
                {[...g.patients]
                  .sort((a, b) => {
                    const order: Record<string, number> = { submitted: 0, returned: 1, pending: 2, not_started: 3, approved: 4 }
                    return (order[a.crf_status] ?? 2) - (order[b.crf_status] ?? 2)
                  })
                  .map((p) => (
                    <li key={p.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">{p.patient_name}</p>
                        <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-400">
                          <span className="font-mono">{p.study_patient_id}</span>
                          {p.group_name && <span>· {p.group_name}</span>}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge(p.crf_status)}`}>
                            {statusLabel(p.crf_status)}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <span className="h-1.5 w-12 overflow-hidden rounded-full bg-slate-100">
                              <span className={`block h-full rounded-full ${p.fill_percent >= 90 ? 'bg-green-500' : p.fill_percent >= 50 ? 'bg-blue-500' : p.fill_percent >= 20 ? 'bg-amber-500' : 'bg-slate-300'}`} style={{ width: `${p.fill_percent}%` }} />
                            </span>
                            {p.fill_percent}%
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/teacher/review/${p.id}`}
                        className="shrink-0 rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700 active:bg-green-800 transition-colors"
                      >
                        Review
                      </Link>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}
