'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
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

export function PatientsSearch({ patients }: { patients: Patient[] }) {
  const [query, setQuery] = useState('')
  const [studyFilter, setStudyFilter] = useState('all')

  const studyCodes = Array.from(new Set(patients.map((p) => p.study_code))).sort()

  const filtered = patients.filter((p) => {
    if (studyFilter !== 'all' && p.study_code !== studyFilter) return false
    if (query) {
      const q = query.toLowerCase()
      return (
        p.patient_name.toLowerCase().includes(q) ||
        p.study_patient_id.toLowerCase().includes(q) ||
        p.study_code.toLowerCase().includes(q) ||
        (p.investigator_name?.toLowerCase().includes(q) ?? false)
      )
    }
    return true
  })

  const vstatus = (s: string) => {
    if (s === 'approved') return 'bg-green-50 text-green-700'
    if (s === 'submitted') return 'bg-amber-100 text-amber-700 ring-1 ring-amber-300'
    if (s === 'returned') return 'bg-red-50 text-red-600'
    return 'bg-slate-100 text-slate-500'
  }

  return (
    <div className="space-y-4">
      {/* Search + study filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, patient ID, investigator…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <select
          value={studyFilter}
          onChange={(e) => setStudyFilter(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">All Studies</option>
          {studyCodes.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <p className="text-xs text-slate-400">{filtered.length} patient{filtered.length !== 1 ? 's' : ''} shown</p>

      {filtered.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 py-12 text-center">
          <p className="text-sm text-slate-400">No patients match your search</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-5 py-2 text-left font-medium">ID</th>
                <th className="px-5 py-2 text-left font-medium">Patient</th>
                <th className="px-5 py-2 text-left font-medium">Study</th>
                <th className="px-5 py-2 text-left font-medium">Age/Sex</th>
                <th className="px-5 py-2 text-left font-medium">Group</th>
                <th className="px-5 py-2 text-left font-medium">Investigator</th>
                <th className="px-5 py-2 text-left font-medium">CRF Status</th>
                <th className="px-5 py-2 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-2.5 font-mono text-xs text-slate-500">{p.study_patient_id}</td>
                  <td className="px-5 py-2.5 font-medium text-slate-900">{p.patient_name}</td>
                  <td className="px-5 py-2.5">
                    <span className="font-mono text-xs font-bold text-blue-700">{p.study_code}</span>
                  </td>
                  <td className="px-5 py-2.5 text-slate-600 text-xs">{p.age}y / {p.gender}</td>
                  <td className="px-5 py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.group_name === 'Group A' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {p.group_name ?? '—'}
                    </span>
                  </td>
                  <td className="px-5 py-2.5">
                    <div className="text-xs font-medium text-slate-800">{p.investigator_name ?? '—'}</div>
                    <div className="text-[11px] text-slate-400">{p.investigator_email ?? ''}</div>
                  </td>
                  <td className="px-5 py-2.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${vstatus(p.crf_status)}`}>
                      {p.crf_status === 'pending' ? 'In Progress' : p.crf_status === 'not_started' ? 'Not Started' : p.crf_status}
                    </span>
                  </td>
                  <td className="px-5 py-2.5">
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
      )}
    </div>
  )
}
