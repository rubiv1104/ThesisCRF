'use client'

import { useState } from 'react'
import { Calculator, ChevronDown, ChevronUp } from 'lucide-react'

// ─── EASI Calculator ────────────────────────────────────────────────────────

const EASI_REGIONS = [
  { key: 'hn', label: 'Head & Neck', mult: 0.1 },
  { key: 'ul', label: 'Upper Limbs', mult: 0.2 },
  { key: 'tr', label: 'Trunk',       mult: 0.3 },
  { key: 'll', label: 'Lower Limbs', mult: 0.4 },
]
const AREA_LABELS = ['0 (0%)', '1 (1–9%)', '2 (10–29%)', '3 (30–49%)', '4 (50–69%)', '5 (70–89%)', '6 (90–100%)']
const INTENSITY_LABELS = ['0 — None', '1 — Mild', '2 — Moderate', '3 — Severe']
const INTENSITY_SIGNS = [
  { key: 'e', label: 'Erythema (E)' },
  { key: 'i', label: 'Edema / Papulation (I)' },
  { key: 'ex', label: 'Excoriation (Ex)' },
  { key: 'l', label: 'Lichenification (L)' },
]

type EasiRegion = { a: number; e: number; i: number; ex: number; l: number }
type EasiValues = Record<string, EasiRegion>

function easiInterpret(total: number) {
  if (total === 0) return { label: 'Clear', color: 'text-green-700 bg-green-50' }
  if (total <= 1) return { label: 'Almost Clear', color: 'text-green-600 bg-green-50' }
  if (total <= 7) return { label: 'Mild', color: 'text-yellow-700 bg-yellow-50' }
  if (total <= 21) return { label: 'Moderate', color: 'text-orange-700 bg-orange-50' }
  if (total <= 50) return { label: 'Severe', color: 'text-red-700 bg-red-50' }
  return { label: 'Very Severe', color: 'text-red-900 bg-red-100' }
}

function EasiCalculator() {
  const init: EasiValues = Object.fromEntries(EASI_REGIONS.map((r) => [r.key, { a: 0, e: 0, i: 0, ex: 0, l: 0 }]))
  const [vals, setVals] = useState<EasiValues>(init)

  function set(region: string, field: string, value: number) {
    setVals((prev) => ({ ...prev, [region]: { ...prev[region]!, [field]: value } }))
  }

  const regionScores = EASI_REGIONS.map((r) => {
    const v = vals[r.key]!
    const intensity = v.e + v.i + v.ex + v.l
    return { ...r, score: +(v.a * intensity * r.mult).toFixed(2) }
  })
  const total = +regionScores.reduce((s, r) => s + r.score, 0).toFixed(2)
  const interp = easiInterpret(total)

  function ScoreSelect({ value, onChange, options }: { value: number; onChange: (v: number) => void; options: string[] }) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {options.map((label, i) => (
          <option key={i} value={i}>{label}</option>
        ))}
      </select>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {EASI_REGIONS.map((r) => {
          const v = vals[r.key]!
          const regionScore = regionScores.find((rs) => rs.key === r.key)!
          return (
            <div key={r.key} className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{r.label}</p>
                  <p className="text-xs text-slate-400">×{r.mult} multiplier</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Sub-score</p>
                  <p className="text-xl font-bold text-blue-700">{regionScore.score.toFixed(2)}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Area (A)</label>
                  <ScoreSelect value={v.a} onChange={(val) => set(r.key, 'a', val)} options={AREA_LABELS} />
                </div>
                {INTENSITY_SIGNS.map((sign) => (
                  <div key={sign.key}>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">{sign.label}</label>
                    <ScoreSelect value={v[sign.key as keyof EasiRegion] as number} onChange={(val) => set(r.key, sign.key, val)} options={INTENSITY_LABELS} />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Total */}
      <div className="rounded-xl border-2 border-blue-100 bg-blue-50 p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500">Total EASI Score</p>
          <p className="text-4xl font-bold text-blue-700">{total}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {regionScores.map((r) => `${r.label}: ${r.score}`).join(' · ')}
          </p>
        </div>
        <span className={`rounded-full px-4 py-2 text-sm font-bold ${interp.color}`}>
          {interp.label}
        </span>
      </div>

      <button
        onClick={() => setVals(init)}
        className="text-xs text-slate-400 hover:text-slate-600 underline"
      >
        Reset all
      </button>
    </div>
  )
}

// ─── DLQI Calculator ────────────────────────────────────────────────────────

const DLQI_QUESTIONS = [
  'Over the last week, how itchy, sore, painful or stinging has your skin been?',
  'Over the last week, how embarrassed or self-conscious have you been because of your skin?',
  'Over the last week, how much has your skin interfered with you going shopping or looking after your home or garden?',
  'Over the last week, how much has your skin influenced the clothes you wear?',
  'Over the last week, how much has your skin affected any social or leisure activities?',
  'Over the last week, how much has your skin made it difficult for you to do any sport?',
  'Has your skin prevented you from working or studying? (If No — how much has your skin been a problem at work or studying?)',
  'Over the last week, how much has your skin caused problems with your partner or close friends or relatives?',
  'Over the last week, how much has your skin caused any sexual difficulties?',
  'Over the last week, how much of a problem has the treatment for your skin been?',
]
const DLQI_OPTIONS = ['0 — Not at all / Not relevant', '1 — A little', '2 — A lot', '3 — Very much']

function dlqiInterpret(total: number) {
  if (total <= 1) return { label: 'No effect on life', color: 'text-green-700 bg-green-50' }
  if (total <= 5) return { label: 'Small effect', color: 'text-yellow-700 bg-yellow-50' }
  if (total <= 10) return { label: 'Moderate effect', color: 'text-orange-700 bg-orange-50' }
  if (total <= 20) return { label: 'Very large effect', color: 'text-red-700 bg-red-50' }
  return { label: 'Extremely large effect', color: 'text-red-900 bg-red-100' }
}

function DlqiCalculator() {
  const [scores, setScores] = useState<number[]>(Array(10).fill(0))
  const total = scores.reduce((a, b) => a + b, 0)
  const interp = dlqiInterpret(total)

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {DLQI_QUESTIONS.map((q, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 flex items-start gap-4">
            <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700 mt-0.5">
              {i + 1}
            </span>
            <div className="flex-1 space-y-2">
              <p className="text-sm text-slate-700">{q}</p>
              <select
                value={scores[i]}
                onChange={(e) => {
                  const next = [...scores]
                  next[i] = Number(e.target.value)
                  setScores(next)
                }}
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {DLQI_OPTIONS.map((opt, j) => (
                  <option key={j} value={j}>{opt}</option>
                ))}
              </select>
            </div>
            <span className="shrink-0 text-xl font-bold text-blue-700 w-6 text-center">{scores[i]}</span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="rounded-xl border-2 border-blue-100 bg-blue-50 p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500">Total DLQI Score</p>
          <p className="text-4xl font-bold text-blue-700">{total}</p>
          <p className="text-xs text-slate-400 mt-0.5">Range 0–30</p>
        </div>
        <span className={`rounded-full px-4 py-2 text-sm font-bold ${interp.color}`}>
          {interp.label}
        </span>
      </div>

      <button
        onClick={() => setScores(Array(10).fill(0))}
        className="text-xs text-slate-400 hover:text-slate-600 underline"
      >
        Reset all
      </button>
    </div>
  )
}

// ─── Reference cards ────────────────────────────────────────────────────────

const SCALE_REFS = [
  {
    group: 'Dermatology Scales (ECZ2026)',
    items: [
      { code: 'vIGA-AD', name: 'Validated Investigator Global Assessment for Atopic Dermatitis', studies: ['ECZ2026'], scoring: '0 = Clear · 1 = Almost Clear · 2 = Mild · 3 = Moderate · 4 = Severe. Response = achieving 0 or 1.', note: 'Recorded at each visit (Baseline – Day 90) in the Disease Assessment grid.' },
      { code: 'Itch NRS', name: 'Itch Numeric Rating Scale (Pruritus NRS)', studies: ['ECZ2026'], scoring: '0 = No itch → 10 = Worst imaginable itch. Mild: 0–3 · Moderate: 4–6 · Severe: 7–10. Clinically meaningful improvement: ≥3 pt reduction from baseline.', note: 'Patient-reported at each visit.' },
    ],
  },
  {
    group: 'Quality of Life',
    items: [
      { code: 'SF-12', name: 'Short Form-12 Health Survey', studies: ['DM2026', 'DMA2026'], scoring: 'PCS and MCS scored 0–100. Higher = better QoL. Norm-based scoring algorithm.', note: 'Administered BT and AT only.' },
      { code: 'CLDQ-NASH', name: 'Chronic Liver Disease Questionnaire — NAFLD/NASH', studies: ['FLD2026'], scoring: '7-pt Likert (1=all the time, 7=never). Higher = better. 6 domains, 36 items. Total = mean of all items.', note: 'Administered at Day 1, 45, 90.' },
    ],
  },
  {
    group: 'Ayurvedic Assessments',
    items: [
      { code: 'PRAKRITI', name: 'Prakriti Assessment (Constitution)', studies: ['ECZ2026', 'AST2026', 'SHP2026', 'DM2026', 'DMA2026', 'HTN2026', 'HYP2026'], scoring: 'Qualitative. Record dominant dosha (Vata / Pitta / Kapha / mixed). Parameters: Saara, Samhanana, Satmya, Satva, Ahara Shakti, Vyayama Shakti.', note: 'Assessed once at enrollment.' },
      { code: 'DASHAVIDHA', name: 'Dashavidha Pariksha (10-fold examination)', studies: ['FLD2026'], scoring: 'Qualitative description per parameter: Prakriti, Saara, Samhanana, Satmya, Satwa, Ahara Shakti, Vyayama Shakti, Vaya, Desha, Kala.', note: '' },
    ],
  },
  {
    group: 'Symptom Grading',
    items: [
      { code: 'LIKERT-3', name: '3-Point Symptom Severity Scale', studies: ['ECZ2026', 'AST2026', 'SHP2026', 'HTN2026', 'HYP2026'], scoring: '0 = Absent · 1 = Mild · 2 = Moderate · 3 = Severe. Sum of all symptom scores = total severity. Compare BT vs AT.', note: '' },
      { code: 'LIKERT-7', name: '7-Point Likert Scale (CLDQ-NASH)', studies: ['FLD2026'], scoring: '1 = All the time → 7 = Never. Higher = better outcome.', note: '' },
    ],
  },
  {
    group: 'Investigations',
    items: [
      { code: 'FIBROSCAN', name: 'FibroScan (Transient Elastography)', studies: ['FLD2026'], scoring: 'LSM: <7.0=F0-F1 · 7.0–9.5=F2 · 9.5–12.5=F3 · >12.5=F4. CAP: <248=S0 · 248–268=S1 · 268–280=S2 · >280=S3.', note: 'Recorded BT and AT.' },
      { code: 'HbA1c', name: 'Glycated Haemoglobin', studies: ['DM2026', 'DMA2026'], scoring: 'Normal: <5.7% · Pre-diabetic: 5.7–6.4% · Diabetic: ≥6.5%. Target for T2DM: <7%.', note: 'Recorded BT and AT.' },
    ],
  },
]

// ─── Main page ───────────────────────────────────────────────────────────────

type Tab = 'easi' | 'dlqi' | 'reference'

export default function AssessmentsPage() {
  const [tab, setTab] = useState<Tab>('easi')

  const tabs: { id: Tab; label: string }[] = [
    { id: 'easi', label: 'EASI Calculator' },
    { id: 'dlqi', label: 'DLQI Calculator' },
    { id: 'reference', label: 'Scale Reference' },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Assessments & Scales</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Interactive calculators and reference guide for all study assessment tools.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {(t.id === 'easi' || t.id === 'dlqi') && <Calculator size={14} />}
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'easi' && (
        <div className="space-y-4">
          <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
            <strong>EASI</strong> — Eczema Area and Severity Index · Range 0–72 · Used in ECZ2026
          </div>
          <EasiCalculator />
        </div>
      )}

      {tab === 'dlqi' && (
        <div className="space-y-4">
          <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
            <strong>DLQI</strong> — Dermatology Life Quality Index · 10 items, Range 0–30 · Used in ECZ2026
          </div>
          <DlqiCalculator />
        </div>
      )}

      {tab === 'reference' && (
        <div className="space-y-6">
          {SCALE_REFS.map((group) => (
            <div key={group.group} className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 border-b border-slate-100 pb-2">
                {group.group}
              </h2>
              <div className="space-y-3">
                {group.items.map((scale) => (
                  <div key={scale.code} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="rounded-md bg-blue-50 px-2 py-0.5 font-mono text-xs font-bold text-blue-700">
                          {scale.code}
                        </span>
                        <h3 className="mt-1 font-semibold text-slate-900 text-sm">{scale.name}</h3>
                      </div>
                      <div className="flex flex-wrap gap-1 shrink-0">
                        {scale.studies.map((s) => (
                          <span key={s} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{s}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700">{scale.scoring}</p>
                    {scale.note && (
                      <p className="text-xs text-amber-700 bg-amber-50 rounded-md px-3 py-1.5">{scale.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-xl border-2 border-dashed border-blue-100 bg-blue-50/40 p-5 text-center">
            <p className="text-sm font-medium text-blue-800">Need a scale added?</p>
            <p className="mt-1 text-xs text-blue-600">
              Submit a request via <a href="/feedback" className="underline font-medium">Feedback & Requests</a>.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
