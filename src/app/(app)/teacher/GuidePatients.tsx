'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight, User, Clock, Search } from 'lucide-react'

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

type Filter = 'submitted' | 'returned' | 'pending' | 'approved' | 'all'

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

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'submitted', label: 'Awaiting Review' },
  { id: 'returned', label: 'Returned' },
  { id: 'pending', label: 'In Progress' },
  { id: 'approved', label: 'Approved' },
  { id: 'all', label: 'All' },
]

interface InvestigatorGroup {
  name: string
  email: string
  patients: GuidePatient[]
  awaiting: number
  approved: number
}

export function GuidePatients({ patients }: { patients: GuidePatient[] }) {
  const counts = useMemo(() => {
    const c: Record<Filter, number> = { submitted: 0, returned: 0, pending: 0, approved: 0, all: patients.length }
    for (const p of patients) {
      const s = p.crf_status === 'not_started' ? 'pending' : p.crf_status
      if (s in c) c[s as Filter]++
    }
    return c
  }, [patients])

  // Default to the work that needs doing: Awaiting Review if any, else All
  const [filter, setFilter] = useState<Filter>(() => (counts.submitted > 0 ? 'submitted' : 'all'))
  const [query, setQuery] = useState('')
  const [openOverride, setOpenOverride] = useState<Record<string, boolean>>({})

  const q = query.trim().toLowerCase()
  const isFiltering = filter !== 'all' || q.length > 0

  const filtered = useMemo(() => patients.filter((p) => {
    const s = p.crf_status === 'not_started' ? 'pending' : p.crf_status
    if (filter !== 'all' && s !== filter) return false
    if (q) {
      return (
        p.investigator_name.toLowerCase().includes(q) ||
        p.patient_name.toLowerCase().includes(q) ||
        p.study_patient_id.toLowerCase().includes(q)
      )
    }
    return true
  }), [patients, filter, q])

  const groups = useMemo(() => {
    const map = new Map<string, InvestigatorGroup>()
    for (const p of filtered) {
      const key = p.investigator_email || p.investigator_name || 'Unknown'
      let g = map.get(key)
      if (!g) { g = { name: p.investigator_name || 'Unknown', email: p.investigator_email || '', patients: [], awaiting: 0, approved: 0 }; map.set(key, g) }
      g.patients.push(p)
      if (p.crf_status === 'submitted') g.awaiting++
      if (p.crf_status === 'approved') g.approved++
    }
    return Array.from(map.values()).sort((a, b) => b.awaiting - a.awaiting || a.name.localeCompare(b.name))
  }, [filtered])

  function toggle(key: string) { setOpenOverride((o) => ({ ...o, [key]: !(o[key] ?? defaultOpen(key)) })) }
  function defaultOpen(key: string): boolean {
    // When filtering/searching, expand everything that matched. Otherwise expand only investigators with pending work.
    if (isFiltering) return true
    const g = groups.find((x) => (x.email || x.name) === key)
    return (g?.awaiting ?? 0) > 0
  }
  function isOpen(key: string): boolean {
    return openOverride[key] ?? defaultOpen(key)
  }

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search investigator or patient…"
          className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          suppressHydrationWarning
        />
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f.id
                ? 'bg-green-600 text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f.label}
            <span className={`ml-1.5 ${filter === f.id ? 'text-green-100' : 'text-slate-400'}`}>{counts[f.id]}</span>
          </button>
        ))}
      </div>

      {/* Investigator groups */}
      {groups.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 py-12 text-center text-sm text-slate-400">
          No CRFs match this filter.
        </div>
      ) : groups.map((g) => {
        const key = g.email || g.name
        const open = isOpen(key)
        return (
          <div key={key} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
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
                  {g.patients.length} shown
                  {g.patients[0]?.study_code ? ` · ${g.patients[0].study_code}` : ''}
                </span>
              </span>
              {g.awaiting > 0 && (
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-300">
                  <Clock size={12} /> {g.awaiting}
                </span>
              )}
              {open ? <ChevronDown size={18} className="shrink-0 text-slate-400" /> : <ChevronRight size={18} className="shrink-0 text-slate-400" />}
            </button>

            {open && (
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
                        className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium text-white transition-colors ${
                          p.crf_status === 'submitted' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {p.crf_status === 'submitted' ? 'Review' : 'Open'}
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
