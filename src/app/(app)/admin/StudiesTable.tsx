'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DurationEditor } from './DurationEditor'
import { StudyStatusButton } from './StudyStatusButton'

interface Study {
  id: string
  study_code: string
  study_title: string
  sample_size: number | null
  study_status: string
  duration_days: number | null
  patientCount: number
  investigator: { full_name: string; email: string } | null
}

export function StudiesTable({ studies }: { studies: Study[] }) {
  const [filter, setFilter] = useState<'active' | 'completed' | 'all'>('active')

  const activeCount = studies.filter((s) => s.study_status === 'active').length
  const completedCount = studies.filter((s) => s.study_status === 'completed').length

  const visible = filter === 'all' ? studies : studies.filter((s) =>
    filter === 'active' ? s.study_status === 'active' : s.study_status !== 'active'
  )

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-3 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">All Studies</h2>
        <div className="flex gap-1.5">
          {([
            ['active', `Active (${activeCount})`],
            ['completed', `Completed (${completedCount})`],
            ['all', `All (${studies.length})`],
          ] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filter === val ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-slate-400">No {filter} studies</p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 text-left font-medium">Code</th>
              <th className="px-5 py-3 text-left font-medium">Study Title</th>
              <th className="px-5 py-3 text-left font-medium">Investigator</th>
              <th className="px-5 py-3 text-center font-medium">Enrolled</th>
              <th className="px-5 py-3 text-center font-medium">Target</th>
              <th className="px-5 py-3 text-center font-medium">Duration</th>
              <th className="px-5 py-3 text-left font-medium">Status</th>
              <th className="px-5 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 font-mono text-xs font-medium text-blue-700">{s.study_code}</td>
                <td className="px-5 py-3 text-slate-700 max-w-xs">
                  <p className="line-clamp-2 text-xs">{s.study_title}</p>
                </td>
                <td className="px-5 py-3">
                  {s.investigator ? (
                    <div>
                      <p className="text-xs font-medium text-slate-800">{s.investigator.full_name}</p>
                      <p className="text-xs text-slate-400">{s.investigator.email}</p>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">Not assigned</span>
                  )}
                </td>
                <td className="px-5 py-3 text-center font-semibold text-slate-900">{s.patientCount}</td>
                <td className="px-5 py-3 text-center text-slate-500">{s.sample_size ?? '—'}</td>
                <td className="px-5 py-3 text-center">
                  <DurationEditor studyId={s.id} initialDays={s.duration_days ?? null} />
                </td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                    s.study_status === 'active' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {s.study_status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2 flex-wrap">
                    <Link
                      href="/admin/patients"
                      className="rounded-md bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
                    >
                      CRFs
                    </Link>
                    <Link
                      href={`/admin/template?study=${s.study_code}`}
                      className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Template
                    </Link>
                    <StudyStatusButton studyId={s.id} studyCode={s.study_code} currentStatus={s.study_status} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
