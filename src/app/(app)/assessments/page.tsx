'use client'

import { useMemo, useState } from 'react'
import { Calculator, RotateCcw } from 'lucide-react'
import { ASSESSMENT_LIBRARY, useScore, type AssessmentDef, type Responses } from '@/features/assessments/library'

/**
 * Assessments & Scales — a standalone calculator/reference that runs the SAME
 * Master Assessment Library used inside the CRF. No patient is involved; nothing
 * is saved. This guarantees the calculator and the CRF can never disagree.
 */
export default function AssessmentsPage() {
  const scales = useMemo(() => Object.values(ASSESSMENT_LIBRARY), [])
  const [code, setCode] = useState(scales[0]?.code ?? '')
  const [value, setValue] = useState<Responses>({})

  const def = ASSESSMENT_LIBRARY[code] as AssessmentDef | undefined

  function pick(c: string) { setCode(c); setValue({}) }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Assessments &amp; Scales</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Interactive calculators for every scale in the library. Scores and interpretations match exactly what the CRF computes.
        </p>
      </div>

      {/* Scale picker */}
      <div className="flex flex-wrap gap-1.5">
        {scales.map((s) => (
          <button
            key={s.code}
            onClick={() => pick(s.code)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              code === s.code ? 'bg-blue-600 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Calculator size={13} /> {s.short}
          </button>
        ))}
      </div>

      {def && <ScaleCalculator def={def} value={value} onChange={setValue} onReset={() => setValue({})} />}
    </div>
  )
}

function ScaleCalculator({ def, value, onChange, onReset }: { def: AssessmentDef; value: Responses; onChange: (r: Responses) => void; onReset: () => void }) {
  const { total, subscores, interpretation } = useScore(def, value)
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
        <strong>{def.name}</strong> · {def.category} · Range {def.range}
        {def.studies.length > 0 && <> · Used in {def.studies.join(', ')}</>}
      </div>

      <def.Workspace value={value} onChange={onChange} />

      {/* Live result */}
      <div className="sticky bottom-0 flex items-center justify-between gap-4 rounded-xl border-2 border-blue-100 bg-white p-4 shadow-sm">
        <div>
          <p className="text-xs font-medium text-slate-500">Score</p>
          <p className="text-3xl font-bold text-blue-700">{total} <span className="text-base font-medium text-blue-500">{interpretation}</span></p>
          {subscores && Object.keys(subscores).length > 0 && (
            <p className="mt-0.5 text-xs text-slate-400">{Object.entries(subscores).map(([k, v]) => `${k}: ${v}`).join(' · ')}</p>
          )}
        </div>
        <button onClick={onReset} className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
          <RotateCcw size={13} /> Reset
        </button>
      </div>
    </div>
  )
}
