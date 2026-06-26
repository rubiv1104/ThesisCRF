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
  group_name: string | null
  investigator_name: string | null
  investigator_email: string | null
  crf_status: string
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

function PatientRow({ p }: { p: Patient }) {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{p.study_patient_id}</td>
      <td className="px-4 py-2.5 font-medium text-slate-900">{p.patient_name}</td>
      <td className="px-4 py-2.5 text-slate-500 text-xs">{p.age}y / {p.gender}</td>
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

function GroupedView({ patients }: { patients: Patient[] }) {
  // Group by study_code
  const byStudy: Record<string, Patient[]> = {}
  for (const p of patients) {
    ;(byStudy[p.study_code] ??= []).push(p)
  }
  const studyCodes = Object.keys(byStudy).sort()

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  function toggle(key: string) {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-4">
      {studyCodes.map((code) => {
        const studyPatients = byStudy[code]
        const investigator = studyPatients[0]?.investigator_name
        const studyTitle = studyPatients[0]?.study_title

        // Group within study by group_name
        const byGroup: Record<string, Patient[]> = {}
        for (const p of studyPatients) {
          const g = p.group_name ?? 'Unassigned'
          ;(byGroup[g] ??= []).push(p)
        }
        const groups = Object.keys(byGroup).sort()

        const isCollapsed = collapsed[code]

        return (
          <div key={code} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Study header */}
            <button
              onClick={() => toggle(code)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-blue-700">{code}</span>
                {investigator && (
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Users size={12} />
                    {investigator}
                  </span>
                )}
                {studyTitle && (
                  <span className="hidden sm:block text-xs text-slate-400 max-w-xs truncate">
                    {studyTitle}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
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
                {groups.map((groupName) => {
                  const groupPatients = byGroup[groupName]
                  const isGroupA = groupName === 'Group A'
                  const isGroupB = groupName === 'Group B'

                  return (
                    <div key={groupName}>
                      {/* Group subheader */}
                      <div className={`flex items-center gap-2 px-5 py-2 border-b border-slate-100 ${
                        isGroupA ? 'bg-purple-50' : isGroupB ? 'bg-blue-50' : 'bg-slate-50'
                      }`}>
                        <span className={`text-xs font-semibold ${
                          isGroupA ? 'text-purple-700' : isGroupB ? 'text-blue-700' : 'text-slate-600'
                        }`}>
                          {groupName}
                        </span>
                        <span className={`text-xs ${
                          isGroupA ? 'text-purple-500' : isGroupB ? 'text-blue-500' : 'text-slate-400'
                        }`}>
                          · {groupPatients.length} patient{groupPatients.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Patients table */}
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                          <tr>
                            <th className="px-4 py-2 text-left font-medium">ID</th>
                            <th className="px-4 py-2 text-left font-medium">Patient Name</th>
                            <th className="px-4 py-2 text-left font-medium">Age / Sex</th>
                            <th className="px-4 py-2 text-left font-medium">CRF Status</th>
                            <th className="px-4 py-2 text-left font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {groupPatients.map((p) => <PatientRow key={p.id} p={p} />)}
                        </tbody>
                      </table>
                    </div>
                  )
                })}
              </div>
            )}
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
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-4 py-2.5 text-left font-medium">ID</th>
            <th className="px-4 py-2.5 text-left font-medium">Patient</th>
            <th className="px-4 py-2.5 text-left font-medium">Study</th>
            <th className="px-4 py-2.5 text-left font-medium">Group</th>
            <th className="px-4 py-2.5 text-left font-medium">Investigator</th>
            <th className="px-4 py-2.5 text-left font-medium">Age/Sex</th>
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
