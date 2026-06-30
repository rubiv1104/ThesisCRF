'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ChevronDown, ChevronRight, Users } from 'lucide-react'
import { DeletePatientButton } from './DeletePatientButton'

interface Patient {
  id: string
  patient_name: string
  study_patient_id: string
  age: number
  gender: string
  study_code: string
  study_title: string
  batch: string
  group_name: string | null
  investigator_name: string | null
  investigator_email: string | null
  crf_status: string
  fill_percent: number
}

function crfStatusStyle(s: string) {
  if (s === 'approved') return 'bg-green-50 text-green-700'
  if (s === 'submitted') return 'bg-amber-100 text-amber-700 ring-1 ring-amber-300'
  if (s === 'returned') return 'bg-red-50 text-red-600'
  return 'bg-slate-100 text-slate-500'
}

function crfStatusLabel(s: string) {
  if (s === 'pending') return 'In Progress'
  if (s === 'not_started') return 'Not Started'
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function CompletionBar({ percent }: { percent: number }) {
  const color = percent >= 90 ? 'bg-green-500' : percent >= 50 ? 'bg-blue-500' : percent >= 20 ? 'bg-amber-500' : 'bg-slate-300'
  const text = percent >= 90 ? 'text-green-700' : percent >= 50 ? 'text-blue-700' : percent >= 20 ? 'text-amber-700' : 'text-slate-500'
  return (
    <div className="flex items-center gap-2 min-w-[90px]">
      <div className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
      <span className={`text-xs font-medium tabular-nums ${text}`}>{percent}%</span>
    </div>
  )
}

function PatientRow({ p }: { p: Patient }) {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{p.study_patient_id}</td>
      <td className="px-4 py-2.5 font-medium text-slate-900">{p.patient_name}</td>
      <td className="px-4 py-2.5 text-slate-500 text-xs">{p.age}y / {p.gender}</td>
      <td className="px-4 py-2.5"><CompletionBar percent={p.fill_percent} /></td>
      <td className="px-4 py-2.5">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${crfStatusStyle(p.crf_status)}`}>
          {crfStatusLabel(p.crf_status)}
        </span>
      </td>
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Link
            href={`/patients/${p.id}/crf`}
            className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Open CRF
          </Link>
          <DeletePatientButton patientId={p.id} patientName={p.patient_name} />
        </div>
      </td>
    </tr>
  )
}

type StudyEntry = { code: string; title: string; investigator: string | null; patients: Patient[] }
type GroupEntry = { name: string; patients: Patient[] }
type BatchEntry = { batch: string; patients: Patient[] }

function StudyCard({ code, studyTitle, investigator, studyPatients, isCollapsed, onToggle }: {
  code: string
  studyTitle: string
  investigator: string | null
  studyPatients: Patient[]
  isCollapsed: boolean
  onToggle: () => void
}) {
  // Group within study by group_name
  const groupMap = new Map<string, GroupEntry>()
  for (const p of studyPatients) {
    const g = p.group_name ?? 'Unassigned'
    let grp = groupMap.get(g)
    if (!grp) { grp = { name: g, patients: [] }; groupMap.set(g, grp) }
    grp.patients.push(p)
  }
  const groups: GroupEntry[] = Array.from(groupMap.values()).sort((a, b) => a.name.localeCompare(b.name))
  const avg = studyPatients.length
    ? Math.round(studyPatients.reduce((s, p) => s + p.fill_percent, 0) / studyPatients.length)
    : 0

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Study (participant) header */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono text-sm font-bold text-blue-700">{code}</span>
          {investigator && (
            <span className="flex items-center gap-1 text-xs text-slate-500 shrink-0">
              <Users size={12} />
              {investigator}
            </span>
          )}
          {studyTitle && (
            <span className="hidden md:block text-xs text-slate-400 truncate">{studyTitle}</span>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-slate-400">avg {avg}% filled</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {studyPatients.length} patient{studyPatients.length !== 1 ? 's' : ''}
          </span>
          {isCollapsed
            ? <ChevronRight size={16} className="text-slate-400" />
            : <ChevronDown size={16} className="text-slate-400" />
          }
        </div>
      </button>

      {!isCollapsed && (
        <div className="border-t border-slate-100">
          {groups.map(({ name: groupName, patients: groupPatients }) => {
            const isGroupA = groupName === 'Group A'
            const isGroupB = groupName === 'Group B'
            return (
              <div key={groupName}>
                <div className={`flex items-center gap-2 px-5 py-2 border-b border-slate-100 ${
                  isGroupA ? 'bg-purple-50' : isGroupB ? 'bg-blue-50' : 'bg-slate-50'
                }`}>
                  <span className={`text-xs font-semibold ${
                    isGroupA ? 'text-purple-700' : isGroupB ? 'text-blue-700' : 'text-slate-600'
                  }`}>{groupName}</span>
                  <span className={`text-xs ${
                    isGroupA ? 'text-purple-500' : isGroupB ? 'text-blue-500' : 'text-slate-400'
                  }`}>· {groupPatients.length} patient{groupPatients.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">ID</th>
                      <th className="px-4 py-2 text-left font-medium">Patient Name</th>
                      <th className="px-4 py-2 text-left font-medium">Age / Sex</th>
                      <th className="px-4 py-2 text-left font-medium">CRF Filled</th>
                      <th className="px-4 py-2 text-left font-medium">CRF Status</th>
                      <th className="px-4 py-2 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {groupPatients.map((p) => <PatientRow key={p.id} p={p} />)}
                  </tbody>
                </table>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function GroupedView({ patients }: { patients: Patient[] }) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  function toggle(key: string) {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Batch → studies (participants) → groups
  const batchMap = new Map<string, BatchEntry>()
  for (const p of patients) {
    let b = batchMap.get(p.batch)
    if (!b) { b = { batch: p.batch, patients: [] }; batchMap.set(p.batch, b) }
    b.patients.push(p)
  }
  // 'Other' sorts last, otherwise lexical (2023-2026 before 2024-2027)
  const batches = Array.from(batchMap.values()).sort((a, b) => {
    if (a.batch === 'Other') return 1
    if (b.batch === 'Other') return -1
    return a.batch.localeCompare(b.batch)
  })

  return (
    <div className="space-y-8">
      {batches.map(({ batch, patients: batchPatients }) => {
        const studyMap = new Map<string, StudyEntry>()
        for (const p of batchPatients) {
          let entry = studyMap.get(p.study_code)
          if (!entry) {
            entry = { code: p.study_code, title: p.study_title, investigator: p.investigator_name, patients: [] }
            studyMap.set(p.study_code, entry)
          }
          entry.patients.push(p)
        }
        const studies = Array.from(studyMap.values()).sort((a, b) => a.code.localeCompare(b.code))

        return (
          <div key={batch} className="space-y-3">
            {/* Batch header */}
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-slate-800 px-3 py-1 text-sm font-bold text-white">Batch {batch}</span>
              <span className="text-xs text-slate-400">
                {studies.length} scholar{studies.length !== 1 ? 's' : ''} · {batchPatients.length} patient{batchPatients.length !== 1 ? 's' : ''}
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="space-y-3">
              {studies.map((s) => (
                <StudyCard
                  key={s.code}
                  code={s.code}
                  studyTitle={s.title}
                  investigator={s.investigator}
                  studyPatients={s.patients}
                  isCollapsed={collapsed[s.code] ?? false}
                  onToggle={() => toggle(s.code)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function FlatView({ patients }: { patients: Patient[] }) {
  return patients.length === 0 ? (
    <div className="rounded-xl border-2 border-dashed border-slate-200 py-12 text-center">
      <p className="text-sm text-slate-400">No patients match your search</p>
    </div>
  ) : (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[820px] text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-4 py-2.5 text-left font-medium">ID</th>
            <th className="px-4 py-2.5 text-left font-medium">Patient</th>
            <th className="px-4 py-2.5 text-left font-medium">Study</th>
            <th className="px-4 py-2.5 text-left font-medium">Group</th>
            <th className="px-4 py-2.5 text-left font-medium">Investigator</th>
            <th className="px-4 py-2.5 text-left font-medium">Age/Sex</th>
            <th className="px-4 py-2.5 text-left font-medium">CRF Filled</th>
            <th className="px-4 py-2.5 text-left font-medium">CRF Status</th>
            <th className="px-4 py-2.5 text-left font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {patients.map((p) => (
            <tr key={p.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{p.study_patient_id}</td>
              <td className="px-4 py-2.5 font-medium text-slate-900">{p.patient_name}</td>
              <td className="px-4 py-2.5">
                <span className="font-mono text-xs font-bold text-blue-700">{p.study_code}</span>
              </td>
              <td className="px-4 py-2.5">
                {p.group_name ? (
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    p.group_name === 'Group A' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {p.group_name}
                  </span>
                ) : <span className="text-slate-400 text-xs">—</span>}
              </td>
              <td className="px-4 py-2.5 text-xs text-slate-700">{p.investigator_name ?? '—'}</td>
              <td className="px-4 py-2.5 text-xs text-slate-500">{p.age}y / {p.gender}</td>
              <td className="px-4 py-2.5"><CompletionBar percent={p.fill_percent} /></td>
              <td className="px-4 py-2.5">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${crfStatusStyle(p.crf_status)}`}>
                  {crfStatusLabel(p.crf_status)}
                </span>
              </td>
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/patients/${p.id}/crf`}
                    className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    Open CRF
                  </Link>
                  <DeletePatientButton patientId={p.id} patientName={p.patient_name} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function PatientsSearch({ patients }: { patients: Patient[] }) {
  const [query, setQuery] = useState('')

  const isSearching = query.trim().length > 0

  const filtered = isSearching
    ? patients.filter((p) => {
        const q = query.toLowerCase()
        return (
          p.patient_name.toLowerCase().includes(q) ||
          p.study_patient_id.toLowerCase().includes(q) ||
          p.study_code.toLowerCase().includes(q) ||
          (p.investigator_name?.toLowerCase().includes(q) ?? false) ||
          (p.group_name?.toLowerCase().includes(q) ?? false)
        )
      })
    : patients

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, patient ID, study code, investigator…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          suppressHydrationWarning
        />
      </div>

      {isSearching && (
        <p className="text-xs text-slate-400">{filtered.length} patient{filtered.length !== 1 ? 's' : ''} found</p>
      )}

      {isSearching
        ? <FlatView patients={filtered} />
        : patients.length === 0
          ? (
            <div className="rounded-xl border-2 border-dashed border-slate-200 py-16 text-center">
              <p className="text-sm text-slate-500">No patients enrolled yet</p>
              <p className="mt-1 text-xs text-slate-400">Investigators add patients from their dashboard</p>
            </div>
          )
          : <GroupedView patients={patients} />
      }
    </div>
  )
}
