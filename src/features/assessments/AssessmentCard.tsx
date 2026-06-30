'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { X, Loader2, ClipboardList } from 'lucide-react'
import { type AssessmentDef, type Responses, useScore } from './library'

interface Result { responses: Responses; total: number | null; interpretation: string | null }

export function AssessmentCard({ patientId, def, readOnly = false }: { patientId: string; def: AssessmentDef; readOnly?: boolean }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any
  const [byVisit, setByVisit] = useState<Record<string, Result>>({})
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<{ visit: string; value: Responses } | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('assessment_results')
      .select('visit_label, responses, total, interpretation')
      .eq('patient_id', patientId)
      .eq('assessment_code', def.code)
    const map: Record<string, Result> = {}
    for (const r of (data ?? []) as any[]) {
      map[r.visit_label] = { responses: r.responses ?? {}, total: r.total, interpretation: r.interpretation }
    }
    setByVisit(map)
    setLoading(false)
  }, [patientId, def.code]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load() }, [load])

  async function save() {
    if (!editing) return
    setSaving(true)
    const { total, subscores } = def.score(editing.value)
    const interpretation = def.interpret(total)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('assessment_results').upsert({
      patient_id: patientId,
      assessment_code: def.code,
      visit_label: editing.visit,
      responses: editing.value,
      total,
      subscores,
      interpretation,
      assessed_by: user?.id,
      assessed_at: new Date().toISOString(),
    }, { onConflict: 'patient_id,assessment_code,visit_label' })
    setSaving(false)
    if (error) { toast.error('Save failed: ' + error.message); return }
    toast.success(`${def.short} ${editing.visit} saved — ${total} (${interpretation})`)
    setEditing(null)
    await load()
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <ClipboardList size={16} className="text-blue-600" />
          <div>
            <p className="text-sm font-semibold text-slate-900">{def.short}</p>
            <p className="text-xs text-slate-400">{def.name} · {def.category} · {def.range}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-xs text-slate-400">Loading…</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {def.visits.map((visit) => {
            const r = byVisit[visit]
            const filled = r && r.total != null
            return (
              <button
                key={visit}
                disabled={readOnly && !filled}
                onClick={() => !readOnly && setEditing({ visit, value: r?.responses ?? {} })}
                className={`rounded-lg border px-2.5 py-1.5 text-left text-xs transition-colors ${
                  filled ? 'border-blue-200 bg-blue-50 hover:bg-blue-100' : 'border-dashed border-slate-200 text-slate-400 hover:bg-slate-50'
                } ${readOnly && !filled ? 'cursor-default opacity-60' : ''}`}
                title={readOnly ? 'View' : 'Enter / edit'}
              >
                <span className="block font-medium text-slate-600">{visit}</span>
                {filled
                  ? <span className="block font-bold text-blue-700">{r.total} <span className="font-normal text-blue-500">{r.interpretation}</span></span>
                  : <span className="block">—</span>}
              </button>
            )
          })}
        </div>
      )}

      {editing && (
        <EditModal
          def={def}
          visit={editing.visit}
          value={editing.value}
          onChange={(v) => setEditing({ ...editing, value: v })}
          onClose={() => setEditing(null)}
          onSave={save}
          saving={saving}
        />
      )}
    </div>
  )
}

function EditModal({ def, visit, value, onChange, onClose, onSave, saving }: {
  def: AssessmentDef; visit: string; value: Responses
  onChange: (v: Responses) => void; onClose: () => void; onSave: () => void; saving: boolean
}) {
  const { total, interpretation } = useScore(def, value)
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">{def.short} — {visit}</p>
            <p className="text-xs text-slate-400">{def.name}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <def.Workspace value={value} onChange={onChange} />
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-5 py-3">
          <div>
            <span className="text-xs text-slate-500">Score</span>
            <p className="text-xl font-bold text-blue-700">{total} <span className="text-sm font-medium text-blue-500">{interpretation}</span></p>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white">Cancel</button>
            <button onClick={onSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
              {saving && <Loader2 size={14} className="animate-spin" />} Save {visit}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
