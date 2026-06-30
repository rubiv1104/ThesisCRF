'use client'

import { useEffect, useMemo, useState } from 'react'
import * as XLSX from 'xlsx'
import { Download, SlidersHorizontal, BarChart3, X, Check } from 'lucide-react'
import { buildMasterColumns, resolveCell, defaultVisibleKeys, type MasterColumn } from '@/features/crf/masterColumns'

interface Row {
  id: string
  study_patient_id: string
  patient_name: string
  age: number
  gender: string
  group: string
  crf_status: string
  fields: Record<string, string>
  has_upload?: boolean
}

function statusBadge(s: string) {
  if (s === 'approved') return 'bg-green-50 text-green-700'
  if (s === 'submitted') return 'bg-amber-50 text-amber-700'
  if (s === 'returned') return 'bg-red-50 text-red-600'
  return 'bg-slate-100 text-slate-500'
}
function statusLabel(s: string) {
  if (s === 'pending') return 'In Progress'
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function MasterChartTable({ rows, studyCode }: { rows: Row[]; studyCode: string }) {
  const allColumns = useMemo(() => buildMasterColumns(studyCode), [studyCode])
  const storageKey = `mc_cols_${studyCode}`

  const [filter, setFilter] = useState<'all' | 'Group A' | 'Group B'>('all')
  const [visibleKeys, setVisibleKeys] = useState<string[]>([])
  const [showPicker, setShowPicker] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [deid, setDeid] = useState(false)

  // Load saved column selection (or sensible default) after mount
  useEffect(() => {
    let initial = defaultVisibleKeys(allColumns)
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const arr = JSON.parse(saved) as string[]
        const valid = new Set(allColumns.map((c) => c.key))
        const kept = arr.filter((k) => valid.has(k))
        if (kept.length) initial = kept
      }
    } catch { /* ignore */ }
    setVisibleKeys(initial)
    setHydrated(true)
  }, [storageKey, allColumns])

  function persist(keys: string[]) {
    setVisibleKeys(keys)
    try { localStorage.setItem(storageKey, JSON.stringify(keys)) } catch { /* ignore */ }
  }
  function toggleCol(key: string) {
    persist(visibleKeys.includes(key) ? visibleKeys.filter((k) => k !== key) : [...visibleKeys, key])
  }

  const visibleCols = useMemo(
    () => allColumns.filter((c) => visibleKeys.includes(c.key)),
    [allColumns, visibleKeys]
  )

  const visible = filter === 'all' ? rows : rows.filter((r) => r.group === filter)

  // Group available columns by section for the picker
  const colsBySection = useMemo(() => {
    const m = new Map<string, MasterColumn[]>()
    for (const c of allColumns) {
      const arr = m.get(c.section) ?? []
      arr.push(c)
      m.set(c.section, arr)
    }
    return Array.from(m.entries())
  }, [allColumns])

  // Excel export — one workbook with a separate sheet per trial group.
  // When `deid` is set, the patient Name column is omitted (study ID only).
  function downloadExcel() {
    const header = ['Sr. No', ...(deid ? [] : ['Name']), 'Age', 'Sex', 'Group', 'CRF Status', ...visibleCols.map((c) => c.label)]
    const sheetFor = (groupRows: Row[]) => {
      const aoa: (string | number)[][] = [header]
      for (const r of groupRows) {
        aoa.push([
          r.study_patient_id, ...(deid ? [] : [r.patient_name]), r.age ?? '', r.gender ?? '', r.group, statusLabel(r.crf_status),
          ...visibleCols.map((c) => resolveCell(c, r.fields)),
        ])
      }
      return XLSX.utils.aoa_to_sheet(aoa)
    }

    const wb = XLSX.utils.book_new()
    const groupA = rows.filter((r) => r.group === 'Group A')
    const groupB = rows.filter((r) => r.group === 'Group B')
    const others = rows.filter((r) => r.group !== 'Group A' && r.group !== 'Group B')

    XLSX.utils.book_append_sheet(wb, sheetFor(groupA), 'Group A')
    XLSX.utils.book_append_sheet(wb, sheetFor(groupB), 'Group B')
    if (others.length) XLSX.utils.book_append_sheet(wb, sheetFor(others), 'Unassigned')

    XLSX.writeFile(wb, `master-chart-${studyCode}${deid ? '-deidentified' : ''}.xlsx`)
  }

  if (allColumns.length === 0) {
    return <div className="rounded-xl border-2 border-dashed border-slate-200 py-12 text-center text-sm text-slate-400">No CRF template registered for {studyCode}, so columns can&apos;t be generated.</div>
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-2">
          {(['all', 'Group A', 'Group B'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filter === f ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f === 'all' ? 'All' : f} ({f === 'all' ? rows.length : rows.filter((r) => r.group === f).length})
            </button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <button onClick={() => setShowStats((v) => !v)} className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
            <BarChart3 size={13} /> How to fill / Stats
          </button>
          <button onClick={() => setShowPicker((v) => !v)} className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
            <SlidersHorizontal size={13} /> Columns ({visibleCols.length})
          </button>
          <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
            <input type="checkbox" checked={deid} onChange={(e) => setDeid(e.target.checked)} className="accent-amber-600" />
            De-identify (no names)
          </label>
          <button onClick={downloadExcel} className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
            <Download size={13} /> Excel (Group A + B sheets)
          </button>
        </div>
      </div>

      {/* Stats / guidance */}
      {showStats && <StatsPanel onClose={() => setShowStats(false)} />}

      {/* Column picker */}
      {showPicker && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">Choose columns</p>
            <div className="flex items-center gap-2">
              <button onClick={() => persist(allColumns.map((c) => c.key))} className="text-xs text-blue-600 hover:underline">Select all</button>
              <button onClick={() => persist(defaultVisibleKeys(allColumns))} className="text-xs text-slate-500 hover:underline">Default</button>
              <button onClick={() => persist([])} className="text-xs text-slate-500 hover:underline">None</button>
              <button onClick={() => setShowPicker(false)} className="rounded p-1 text-slate-400 hover:bg-slate-100"><X size={15} /></button>
            </div>
          </div>
          <div className="max-h-80 space-y-4 overflow-y-auto pr-1">
            {colsBySection.map(([section, cols]) => (
              <div key={section}>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">{section}</p>
                <div className="flex flex-wrap gap-1.5">
                  {cols.map((c) => {
                    const on = visibleKeys.includes(c.key)
                    return (
                      <button
                        key={c.key}
                        onClick={() => toggleCol(c.key)}
                        className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                          on ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {on && <Check size={11} />} {c.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="text-xs border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <th className="sticky left-0 z-20 bg-slate-50 px-3 py-2 text-left text-[10px] uppercase tracking-wide font-medium text-slate-500 border-r border-slate-200">ID</th>
              <th className="px-3 py-2 text-left text-[10px] uppercase tracking-wide font-medium text-slate-500">Name</th>
              <th className="px-2 py-2 text-center text-[10px] uppercase tracking-wide font-medium text-slate-500">Age</th>
              <th className="px-2 py-2 text-center text-[10px] uppercase tracking-wide font-medium text-slate-500">Sex</th>
              <th className="px-2 py-2 text-center text-[10px] uppercase tracking-wide font-medium text-slate-500">Group</th>
              <th className="px-2 py-2 text-center text-[10px] uppercase tracking-wide font-medium text-slate-500">Status</th>
              {visibleCols.map((c) => (
                <th key={c.key} className="px-2 py-2 text-left text-[10px] font-medium text-slate-500 whitespace-nowrap border-l border-slate-100" title={c.section}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-10 bg-white px-3 py-2 font-mono text-[11px] font-semibold text-blue-700 border-r border-slate-100 whitespace-nowrap">{r.study_patient_id}</td>
                <td className="px-3 py-2 font-medium text-slate-800 whitespace-nowrap">
                  {r.patient_name}
                  {r.has_upload && <span className="ml-1 rounded-full bg-green-50 px-1.5 py-0.5 text-[10px] font-medium text-green-600" title="Excel uploaded">XL</span>}
                </td>
                <td className="px-2 py-2 text-center text-slate-500">{r.age}</td>
                <td className="px-2 py-2 text-center text-slate-500">{r.gender?.[0] ?? '—'}</td>
                <td className="px-2 py-2 text-center">
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${r.group === 'Group A' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>{r.group}</span>
                </td>
                <td className="px-2 py-2 text-center">
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${statusBadge(r.crf_status)}`}>{statusLabel(r.crf_status)}</span>
                </td>
                {visibleCols.map((c) => (
                  <td key={c.key} className="px-2 py-2 text-slate-600 whitespace-nowrap border-l border-slate-50 max-w-[180px] truncate" title={resolveCell(c, r.fields)}>
                    {resolveCell(c, r.fields) || '—'}
                  </td>
                ))}
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={6 + visibleCols.length} className="py-10 text-center text-slate-400">No patients match filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-400">
        {hydrated ? `${visibleCols.length} of ${allColumns.length} CRF fields shown` : 'Loading columns…'} · Columns are auto-generated from the {studyCode} CRF. Use “Columns” to add/remove, then download Excel (Group A and Group B on separate sheets).
      </p>
    </div>
  )
}

function StatsPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-sm">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-semibold text-blue-900">How to fill the Master Chart & analyse it</p>
        <button onClick={onClose} className="rounded p-1 text-blue-400 hover:bg-blue-100"><X size={15} /></button>
      </div>
      <ul className="list-disc space-y-1.5 pl-5 text-xs text-slate-700">
        <li><strong>One row per participant, one column per variable/timepoint.</strong> Keep Before-Treatment (BT) and After-Treatment (AT) in separate columns so paired analysis is possible.</li>
        <li><strong>No blank cells.</strong> Enter the actual value, or write <em>NA</em> for genuinely missing data — blanks break statistical tests and bias results.</li>
        <li><strong>Consistent units & coding</strong> down each column (e.g. always mg/dL; always 0–3 for a symptom grade). Don&apos;t mix text and numbers in one column.</li>
        <li><strong>Within-group change (BT vs AT):</strong> paired t-test for normally-distributed continuous data (EASI, labs); Wilcoxon signed-rank for ordinal symptom grades (0–3) or skewed data.</li>
        <li><strong>Between-group (Group A vs B):</strong> independent t-test / Mann–Whitney U for numeric outcomes; Chi-square or Fisher&apos;s exact for categorical (e.g. response yes/no).</li>
        <li><strong>Efficacy = % change:</strong> (BT − AT) / BT × 100. Report mean ± SD (or median, IQR for ordinal).</li>
        <li><strong>Symptom grades</strong> are ordinal — summarise as median (IQR), not mean, and use non-parametric tests.</li>
        <li><strong>Check normality</strong> (Shapiro–Wilk) before choosing parametric vs non-parametric tests; report p-value and define significance (usually p &lt; 0.05).</li>
        <li><strong>Keep group sizes balanced</strong> and note any dropouts/withdrawals — analyse per protocol and/or intention-to-treat.</li>
      </ul>
    </div>
  )
}
