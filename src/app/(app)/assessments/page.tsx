'use client'

import { useState } from 'react'
import { Calculator, Activity } from 'lucide-react'

// ─── EASI Calculator ────────────────────────────────────────────────────────

const EASI_REGIONS = [
  { key: 'hn', label: 'Head & Neck', mult: 0.1 },
  { key: 'ul', label: 'Upper Limbs', mult: 0.2 },
  { key: 'tr', label: 'Trunk',       mult: 0.3 },
  { key: 'll', label: 'Lower Limbs', mult: 0.4 },
]
const AREA_LABELS = ['0 (no active eczema)', '1 (1–9%)', '2 (10–29%)', '3 (30–49%)', '4 (50–69%)', '5 (70–89%)', '6 (90–100%)']
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
  { q: 'Over the last week, how itchy, sore, painful or stinging has your skin been?' },
  { q: 'Over the last week, how embarrassed or self-conscious have you been because of your skin?' },
  { q: 'Over the last week, how much has your skin interfered with you going shopping or looking after your home or garden?' },
  { q: 'Over the last week, how much has your skin influenced the clothes you wear?' },
  { q: 'Over the last week, how much has your skin affected any social or leisure activities?' },
  { q: 'Over the last week, how much has your skin made it difficult for you to do any sport?' },
  { q: 'Has your skin prevented you from working or studying?', special: true },
  { q: 'Over the last week, how much has your skin caused problems with your partner or any of your close friends or relatives?' },
  { q: 'Over the last week, how much has your skin caused any sexual difficulties?' },
  { q: 'Over the last week, how much of a problem has the treatment for your skin been?' },
]
const DLQI_OPTIONS = ['0 — Not at all / Not relevant', '1 — A little', '2 — A lot', '3 — Very much']
const DLQI_Q7_FOLLOWUP = ['0 — Not at all', '1 — A little', '2 — A lot']

function dlqiInterpret(total: number) {
  if (total <= 1) return { label: 'No effect on life', color: 'text-green-700 bg-green-50' }
  if (total <= 5) return { label: 'Small effect', color: 'text-yellow-700 bg-yellow-50' }
  if (total <= 10) return { label: 'Moderate effect', color: 'text-orange-700 bg-orange-50' }
  if (total <= 20) return { label: 'Very large effect', color: 'text-red-700 bg-red-50' }
  return { label: 'Extremely large effect', color: 'text-red-900 bg-red-100' }
}

function DlqiCalculator() {
  const [scores, setScores] = useState<number[]>(Array(10).fill(0))
  const [q7Prevented, setQ7Prevented] = useState<boolean | null>(null)

  function getScore(i: number) {
    if (i === 6) {
      if (q7Prevented === true) return 3
      if (q7Prevented === false) return scores[6] ?? 0
      return 0
    }
    return scores[i] ?? 0
  }

  const total = DLQI_QUESTIONS.reduce((sum, _, i) => sum + getScore(i), 0)
  const interp = dlqiInterpret(total)

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {DLQI_QUESTIONS.map(({ q, special }, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 flex items-start gap-4">
            <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700 mt-0.5">
              {i + 1}
            </span>
            <div className="flex-1 space-y-2">
              <p className="text-sm text-slate-700">{q}</p>
              {special ? (
                <div className="space-y-2">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setQ7Prevented(true)}
                      className={`rounded-lg border px-4 py-1.5 text-xs font-medium transition-colors ${
                        q7Prevented === true ? 'bg-red-600 text-white border-red-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Yes — prevented work/study (score 3)
                    </button>
                    <button
                      onClick={() => { setQ7Prevented(false); setScores((prev) => { const n = [...prev]; n[6] = 0; return n }) }}
                      className={`rounded-lg border px-4 py-1.5 text-xs font-medium transition-colors ${
                        q7Prevented === false ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      No
                    </button>
                  </div>
                  {q7Prevented === false && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">How much has your skin been a problem at work or studying?</p>
                      <select
                        value={scores[6]}
                        onChange={(e) => { const n = [...scores]; n[6] = Number(e.target.value); setScores(n) }}
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        {DLQI_Q7_FOLLOWUP.map((opt, j) => <option key={j} value={j}>{opt}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              ) : (
                <select
                  value={scores[i]}
                  onChange={(e) => { const n = [...scores]; n[i] = Number(e.target.value); setScores(n) }}
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {DLQI_OPTIONS.map((opt, j) => <option key={j} value={j}>{opt}</option>)}
                </select>
              )}
            </div>
            <span className="shrink-0 text-xl font-bold text-blue-700 w-6 text-center">{getScore(i)}</span>
          </div>
        ))}
      </div>

      <div className="rounded-xl border-2 border-blue-100 bg-blue-50 p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500">Total DLQI Score</p>
          <p className="text-4xl font-bold text-blue-700">{total}</p>
          <p className="text-xs text-slate-400 mt-0.5">Range 0–30 · Q7: {q7Prevented === true ? 'Prevented work (3)' : q7Prevented === false ? `Not prevented (${scores[6]})` : 'Not answered (0)'}</p>
        </div>
        <span className={`rounded-full px-4 py-2 text-sm font-bold ${interp.color}`}>
          {interp.label}
        </span>
      </div>

      <button
        onClick={() => { setScores(Array(10).fill(0)); setQ7Prevented(null) }}
        className="text-xs text-slate-400 hover:text-slate-600 underline"
      >
        Reset all
      </button>
    </div>
  )
}

// ─── CLDQ-NASH Calculator ────────────────────────────────────────────────────

const CLDQ_DOMAINS = [
  {
    key: 'as', label: 'Abdominal Symptoms', abbr: 'AS', color: 'blue',
    items: [
      'Abdominal pain',
      'Abdominal discomfort',
      'Abdominal bloating',
      'Pain in the right side of your abdomen',
      'Belching / gas',
    ],
  },
  {
    key: 'fa', label: 'Fatigue', abbr: 'FA', color: 'amber',
    items: [
      'Feeling tired',
      'Feeling exhausted / fatigued',
      'Feeling listless or drained of energy',
      'Feeling drowsy during the day',
      'Difficulty concentrating',
      'Difficulty with memory',
    ],
  },
  {
    key: 'ss', label: 'Systemic Symptoms', abbr: 'SS', color: 'purple',
    items: [
      'Dry mouth',
      'Muscle cramps',
      'Itching / pruritus',
      'Trouble sleeping',
      'Headaches',
      'Dizziness',
    ],
  },
  {
    key: 'ac', label: 'Activity', abbr: 'AC', color: 'green',
    items: [
      'Needing to rest',
      'Being unable to perform usual activities',
      'Being less productive than usual',
      'Difficulty with physical activities',
    ],
  },
  {
    key: 'ef', label: 'Emotional Function', abbr: 'EF', color: 'rose',
    items: [
      'Worrying about your future',
      'Feeling depressed',
      'Feeling frustrated',
      'Worrying about complications of your condition',
      'Feeling like a burden to others',
      'Feeling irritable',
      'Feeling embarrassed about your condition',
    ],
  },
  {
    key: 'wo', label: 'Worry', abbr: 'WO', color: 'orange',
    items: [
      'Worrying about your weight',
      'Worrying about your medications',
      'Worrying about your diet',
      'Feeling concerned about your condition',
      'Worrying about new treatments',
      'Worrying about your condition getting worse',
      'Worrying about family members developing the condition',
      'Worrying about telling others about your condition',
    ],
  },
]

const CLDQ_LABELS = [
  '1 — All the time',
  '2 — Most of the time',
  '3 — A good bit of the time',
  '4 — Some of the time',
  '5 — A little of the time',
  '6 — Rarely',
  '7 — Never',
]

const CLDQ_COLOR: Record<string, string> = {
  blue:   'border-blue-200 bg-blue-50',
  amber:  'border-amber-200 bg-amber-50',
  purple: 'border-purple-200 bg-purple-50',
  green:  'border-green-200 bg-green-50',
  rose:   'border-rose-200 bg-rose-50',
  orange: 'border-orange-200 bg-orange-50',
}
const CLDQ_TEXT: Record<string, string> = {
  blue:   'text-blue-700',
  amber:  'text-amber-700',
  purple: 'text-purple-700',
  green:  'text-green-700',
  rose:   'text-rose-700',
  orange: 'text-orange-700',
}

function cldqInterpret(score: number) {
  if (score >= 6) return { label: 'Minimal impairment', color: 'text-green-700 bg-green-50' }
  if (score >= 5) return { label: 'Mild impairment', color: 'text-yellow-700 bg-yellow-50' }
  if (score >= 4) return { label: 'Moderate impairment', color: 'text-orange-700 bg-orange-50' }
  if (score >= 3) return { label: 'Severe impairment', color: 'text-red-700 bg-red-50' }
  return { label: 'Very severe impairment', color: 'text-red-900 bg-red-100' }
}

function CldqNashCalculator() {
  // scores[domainIndex][itemIndex] = 1–7 (default 4 = neutral midpoint)
  const [scores, setScores] = useState<number[][]>(
    CLDQ_DOMAINS.map((d) => Array(d.items.length).fill(4))
  )

  function setScore(di: number, ii: number, val: number) {
    setScores((prev) => {
      const next = prev.map((row) => [...row])
      if (next[di]) next[di]![ii] = val
      return next
    })
  }

  const domainMeans = CLDQ_DOMAINS.map((d, di) => {
    const row = scores[di] ?? []
    return +(row.reduce((s, v) => s + v, 0) / row.length).toFixed(2)
  })

  const allItems = scores.flat()
  const total = +(allItems.reduce((s, v) => s + v, 0) / allItems.length).toFixed(2)
  const interp = cldqInterpret(total)

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Score each item <strong>1–7</strong> based on how often the patient experienced it over the past 2 weeks.
        Higher score = better quality of life. Default starts at 4 (midpoint).
      </p>

      {CLDQ_DOMAINS.map((domain, di) => {
        const mean = domainMeans[di] ?? 0
        return (
          <div key={domain.key} className={`rounded-xl border ${CLDQ_COLOR[domain.color] ?? ''} p-4 space-y-3`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`rounded-md px-2 py-0.5 text-xs font-bold font-mono ${CLDQ_TEXT[domain.color] ?? ''} bg-white/70`}>
                  {domain.abbr}
                </span>
                <span className={`text-sm font-semibold ${CLDQ_TEXT[domain.color] ?? ''}`}>{domain.label}</span>
                <span className="text-xs text-slate-400">({domain.items.length} items)</span>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Domain mean</p>
                <p className={`text-xl font-bold ${CLDQ_TEXT[domain.color] ?? ''}`}>{mean.toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-2">
              {domain.items.map((item, ii) => (
                <div key={ii} className="flex items-center gap-3 bg-white/60 rounded-lg px-3 py-2">
                  <span className="text-xs text-slate-400 w-4 shrink-0">{ii + 1}.</span>
                  <span className="flex-1 text-xs text-slate-700">{item}</span>
                  <select
                    value={scores[di]?.[ii] ?? 4}
                    onChange={(e) => setScore(di, ii, Number(e.target.value))}
                    className="shrink-0 w-52 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {CLDQ_LABELS.map((label, j) => (
                      <option key={j} value={j + 1}>{label}</option>
                    ))}
                  </select>
                  <span className={`shrink-0 w-5 text-center text-sm font-bold ${CLDQ_TEXT[domain.color] ?? ''}`}>
                    {scores[di]?.[ii] ?? 4}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Totals */}
      <div className="rounded-xl border-2 border-slate-200 bg-white p-5 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500">Total CLDQ-NASH Score</p>
            <p className="text-4xl font-bold text-slate-900">{total}</p>
            <p className="text-xs text-slate-400 mt-0.5">Mean of all 36 items · Range 1–7</p>
          </div>
          <span className={`rounded-full px-4 py-2 text-sm font-bold ${interp.color}`}>
            {interp.label}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100">
          {CLDQ_DOMAINS.map((d, di) => (
            <div key={d.key} className={`rounded-lg px-3 py-2 ${CLDQ_COLOR[d.color] ?? ''}`}>
              <p className={`text-xs font-semibold ${CLDQ_TEXT[d.color] ?? ''}`}>{d.abbr}: {domainMeans[di]?.toFixed(2)}</p>
              <p className="text-xs text-slate-500">{d.label}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setScores(CLDQ_DOMAINS.map((d) => Array(d.items.length).fill(4)))}
        className="text-xs text-slate-400 hover:text-slate-600 underline"
      >
        Reset all to midpoint (4)
      </button>
    </div>
  )
}

// ─── FibroScan Interpreter ───────────────────────────────────────────────────

const LSM_STAGES = [
  { label: 'F0–F1', desc: 'No or minimal fibrosis', range: '< 7.0 kPa', color: 'green',   min: 0,    max: 6.99 },
  { label: 'F2',    desc: 'Significant fibrosis',   range: '7.0–9.4 kPa', color: 'yellow', min: 7.0,  max: 9.49 },
  { label: 'F3',    desc: 'Advanced (bridging) fibrosis', range: '9.5–12.4 kPa', color: 'orange', min: 9.5, max: 12.49 },
  { label: 'F4',    desc: 'Cirrhosis',               range: '≥ 12.5 kPa', color: 'red',    min: 12.5, max: Infinity },
]

const CAP_STAGES = [
  { label: 'S0', desc: 'No steatosis (< 5%)',         range: '< 248 dB/m',    color: 'green',  min: 0,   max: 247 },
  { label: 'S1', desc: 'Mild steatosis (5–33%)',       range: '248–267 dB/m',  color: 'yellow', min: 248, max: 267 },
  { label: 'S2', desc: 'Moderate steatosis (33–66%)',  range: '268–279 dB/m',  color: 'orange', min: 268, max: 279 },
  { label: 'S3', desc: 'Severe steatosis (> 66%)',     range: '≥ 280 dB/m',   color: 'red',    min: 280, max: Infinity },
]

const FS_BADGE: Record<string, string> = {
  green:  'bg-green-50 text-green-700 border-green-200',
  yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
  red:    'bg-red-50 text-red-700 border-red-200',
}

function FibroScanInterpreter() {
  const [lsm, setLsm] = useState('')
  const [cap, setCap] = useState('')

  const lsmVal = parseFloat(lsm)
  const capVal = parseFloat(cap)

  const lsmStage = isNaN(lsmVal) ? null : LSM_STAGES.find((s) => lsmVal >= s.min && lsmVal <= s.max) ?? null
  const capStage = isNaN(capVal) ? null : CAP_STAGES.find((s) => capVal >= s.min && capVal <= s.max) ?? null

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">

        {/* LSM Panel */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Liver Stiffness Measurement (LSM)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Fibrosis stage · Transient Elastography</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">LSM value (kPa)</label>
            <input
              type="number"
              min={0}
              step={0.1}
              value={lsm}
              onChange={(e) => setLsm(e.target.value)}
              placeholder="e.g. 8.4"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {lsmStage ? (
            <div className={`rounded-xl border-2 p-4 ${FS_BADGE[lsmStage.color] ?? ''}`}>
              <p className="text-3xl font-bold">{lsmStage.label}</p>
              <p className="text-sm font-medium mt-0.5">{lsmStage.desc}</p>
              <p className="text-xs mt-1 opacity-70">Range: {lsmStage.range}</p>
            </div>
          ) : lsm ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-400">
              Enter a valid value
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
              Enter LSM to see fibrosis stage
            </div>
          )}

          {/* Reference table */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 mb-2">Reference cutoffs</p>
            {LSM_STAGES.map((s) => (
              <div key={s.label}
                className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs border ${
                  lsmStage?.label === s.label
                    ? FS_BADGE[s.color] + ' font-semibold'
                    : 'border-transparent text-slate-600'
                }`}
              >
                <span className="font-mono font-bold w-10">{s.label}</span>
                <span className="flex-1">{s.desc}</span>
                <span className="text-slate-400">{s.range}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CAP Panel */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Controlled Attenuation Parameter (CAP)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Steatosis grade · Hepatic fat quantification</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">CAP score (dB/m)</label>
            <input
              type="number"
              min={100}
              max={400}
              step={1}
              value={cap}
              onChange={(e) => setCap(e.target.value)}
              placeholder="e.g. 265"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {capStage ? (
            <div className={`rounded-xl border-2 p-4 ${FS_BADGE[capStage.color] ?? ''}`}>
              <p className="text-3xl font-bold">{capStage.label}</p>
              <p className="text-sm font-medium mt-0.5">{capStage.desc}</p>
              <p className="text-xs mt-1 opacity-70">Range: {capStage.range}</p>
            </div>
          ) : cap ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-400">
              Enter a valid value
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
              Enter CAP score to see steatosis grade
            </div>
          )}

          {/* Reference table */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 mb-2">Reference cutoffs</p>
            {CAP_STAGES.map((s) => (
              <div key={s.label}
                className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs border ${
                  capStage?.label === s.label
                    ? FS_BADGE[s.color] + ' font-semibold'
                    : 'border-transparent text-slate-600'
                }`}
              >
                <span className="font-mono font-bold w-10">{s.label}</span>
                <span className="flex-1">{s.desc}</span>
                <span className="text-slate-400">{s.range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
        <strong>Note:</strong> Cutoffs shown are general M-probe values. Interpretation may vary by probe type (M vs XL) and clinical context. Always correlate with biopsy and clinical findings for diagnostic decisions.
      </div>
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

type Tab = 'easi' | 'dlqi' | 'cldq' | 'fibroscan' | 'reference'

export default function AssessmentsPage() {
  const [tab, setTab] = useState<Tab>('easi')

  const tabs: { id: Tab; label: string; icon?: 'calc' | 'activity' }[] = [
    { id: 'easi',      label: 'EASI',          icon: 'calc' },
    { id: 'dlqi',      label: 'DLQI',          icon: 'calc' },
    { id: 'cldq',      label: 'CLDQ-NASH',     icon: 'calc' },
    { id: 'fibroscan', label: 'FibroScan',      icon: 'activity' },
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
      <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 w-fit">
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
            {t.icon === 'calc' && <Calculator size={14} />}
            {t.icon === 'activity' && <Activity size={14} />}
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

      {tab === 'cldq' && (
        <div className="space-y-4">
          <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
            <strong>CLDQ-NASH</strong> — Chronic Liver Disease Questionnaire (NAFLD/NASH) · 36 items, 6 domains · Range 1–7 (higher = better) · Used in FLD2026
          </div>
          <CldqNashCalculator />
        </div>
      )}

      {tab === 'fibroscan' && (
        <div className="space-y-4">
          <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
            <strong>FibroScan</strong> — Transient Elastography interpreter · LSM (kPa) → Fibrosis stage · CAP (dB/m) → Steatosis grade · Used in FLD2026
          </div>
          <FibroScanInterpreter />
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
