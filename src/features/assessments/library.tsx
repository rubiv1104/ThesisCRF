'use client'

/**
 * MASTER ASSESSMENT LIBRARY
 * =========================
 * Each scale is defined ONCE here — its data-entry workspace, its scoring, and
 * its interpretation. CRFs/patients reference a scale by code and never know how
 * it is scored. A scale shared by multiple studies (e.g. DLQI in ECZ + SHP) is
 * defined a single time and listed against every study that uses it.
 *
 * To add a scale: add one entry to ASSESSMENT_LIBRARY. Nothing else changes.
 */
import { useMemo, type ReactElement } from 'react'
import { EXTRA_SCALES } from './scales'

export type Responses = Record<string, unknown>

export interface AssessmentDef {
  code: string
  name: string
  short: string
  category: 'Dermatology' | 'Quality of Life' | 'Ayurvedic' | 'Clinical Score' | 'Investigation'
  studies: string[]
  visits: string[]
  range: string
  score: (r: Responses) => { total: number; subscores?: Record<string, number> }
  interpret: (total: number) => string
  Workspace: (props: { value: Responses; onChange: (r: Responses) => void }) => ReactElement
}

// ── shared UI helper ──────────────────────────────────────────────────────────
function Select({ value, onChange, options }: { value: number; onChange: (v: number) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      {options.map((label, i) => <option key={i} value={i}>{label}</option>)}
    </select>
  )
}

// ── EASI ──────────────────────────────────────────────────────────────────────
const EASI_REGIONS = [
  { key: 'hn', label: 'Head & Neck', mult: 0.1 },
  { key: 'ul', label: 'Upper Limbs', mult: 0.2 },
  { key: 'tr', label: 'Trunk', mult: 0.3 },
  { key: 'll', label: 'Lower Limbs', mult: 0.4 },
]
const AREA = ['0 (none)', '1 (1–9%)', '2 (10–29%)', '3 (30–49%)', '4 (50–69%)', '5 (70–89%)', '6 (90–100%)']
const INT = ['0 None', '1 Mild', '2 Moderate', '3 Severe']
const EASI_SIGNS = [{ key: 'e', label: 'Erythema' }, { key: 'i', label: 'Edema/Papulation' }, { key: 'ex', label: 'Excoriation' }, { key: 'l', label: 'Lichenification' }]

function easiRegion(r: Responses, key: string) {
  const v = (r[key] as Record<string, number>) ?? {}
  return { a: v.a ?? 0, e: v.e ?? 0, i: v.i ?? 0, ex: v.ex ?? 0, l: v.l ?? 0 }
}
function easiScore(r: Responses) {
  const subscores: Record<string, number> = {}
  let total = 0
  for (const reg of EASI_REGIONS) {
    const v = easiRegion(r, reg.key)
    const s = +(v.a * (v.e + v.i + v.ex + v.l) * reg.mult).toFixed(2)
    subscores[reg.label] = s
    total += s
  }
  return { total: +total.toFixed(1), subscores }
}
function easiInterpret(t: number) {
  if (t === 0) return 'Clear'
  if (t <= 1) return 'Almost Clear'
  if (t <= 7) return 'Mild'
  if (t <= 21) return 'Moderate'
  if (t <= 50) return 'Severe'
  return 'Very Severe'
}
function EasiWorkspace({ value, onChange }: { value: Responses; onChange: (r: Responses) => void }) {
  function set(region: string, field: string, v: number) {
    const cur = (value[region] as Record<string, number>) ?? {}
    onChange({ ...value, [region]: { ...cur, [field]: v } })
  }
  return (
    <div className="space-y-3">
      <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
        <strong>Set the Area first.</strong> EASI = Area × (E+I+Ex+L) × region weight — a region with <strong>Area 0</strong> scores 0 even if the signs are severe.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {EASI_REGIONS.map((reg) => {
          const v = easiRegion(value, reg.key)
          const sub = +(v.a * (v.e + v.i + v.ex + v.l) * reg.mult).toFixed(2)
          const needsArea = v.a === 0 && (v.e + v.i + v.ex + v.l) > 0
          return (
            <div key={reg.key} className="rounded-lg border border-slate-200 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-700">{reg.label} <span className="text-slate-400">×{reg.mult}</span></p>
                <span className="text-sm font-bold text-blue-700">{sub.toFixed(2)}</span>
              </div>
              <div>
                <label className="mb-0.5 block text-[11px] font-semibold text-slate-700">Area (% of region) {needsArea && <span className="text-amber-600">← set this to score</span>}</label>
                <div className={needsArea ? 'rounded-lg ring-2 ring-amber-400' : ''}><Select value={v.a} onChange={(x) => set(reg.key, 'a', x)} options={AREA} /></div>
              </div>
              {EASI_SIGNS.map((s) => (
                <div key={s.key}><label className="mb-0.5 block text-[11px] text-slate-500">{s.label}</label><Select value={v[s.key as 'e']} onChange={(x) => set(reg.key, s.key, x)} options={INT} /></div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── DLQI ──────────────────────────────────────────────────────────────────────
const DLQI_Q = [
  'Itchy, sore, painful or stinging skin', 'Embarrassed or self-conscious', 'Interfered with shopping / home / garden',
  'Influenced the clothes you wear', 'Affected social or leisure activities', 'Made it difficult to do sport',
  'Prevented you from working or studying', 'Problems with partner / friends / relatives', 'Caused sexual difficulties',
  'Problem due to treatment of your skin',
]
const DLQI_OPT = ['0 Not at all / NR', '1 A little', '2 A lot', '3 Very much']
const DLQI_Q7_NO = ['0 Not at all', '1 A little', '2 A lot']
function dlqiScores(r: Responses) {
  const s = (r.scores as number[]) ?? Array(10).fill(0)
  const q7 = (r.q7Prevented as string) ?? ''
  const get = (i: number) => i === 6 ? (q7 === 'yes' ? 3 : q7 === 'no' ? (s[6] ?? 0) : 0) : (s[i] ?? 0)
  return { s, q7, get }
}
function dlqiScore(r: Responses) {
  const { get } = dlqiScores(r)
  let total = 0
  for (let i = 0; i < 10; i++) total += get(i)
  return { total }
}
function dlqiInterpret(t: number) {
  if (t <= 1) return 'No effect'
  if (t <= 5) return 'Small effect'
  if (t <= 10) return 'Moderate effect'
  if (t <= 20) return 'Very large effect'
  return 'Extremely large effect'
}
function DlqiWorkspace({ value, onChange }: { value: Responses; onChange: (r: Responses) => void }) {
  const { s, q7, get } = dlqiScores(value)
  function setScore(i: number, v: number) { const n = [...s]; n[i] = v; onChange({ ...value, scores: n }) }
  return (
    <div className="space-y-2">
      {DLQI_Q.map((q, i) => (
        <div key={i} className="flex items-start gap-3 rounded-lg border border-slate-200 p-2.5">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-blue-700">{i + 1}</span>
          <div className="flex-1 space-y-1.5">
            <p className="text-xs text-slate-700">{q}</p>
            {i === 6 ? (
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <button type="button" onClick={() => onChange({ ...value, q7Prevented: 'yes' })} className={`rounded-md border px-2.5 py-1 text-[11px] ${q7 === 'yes' ? 'border-red-500 bg-red-600 text-white' : 'border-slate-200 text-slate-600'}`}>Yes (3)</button>
                  <button type="button" onClick={() => onChange({ ...value, q7Prevented: 'no', scores: (() => { const n = [...s]; n[6] = 0; return n })() })} className={`rounded-md border px-2.5 py-1 text-[11px] ${q7 === 'no' ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-200 text-slate-600'}`}>No</button>
                </div>
                {q7 === 'no' && <Select value={s[6] ?? 0} onChange={(v) => setScore(6, v)} options={DLQI_Q7_NO} />}
              </div>
            ) : (
              <Select value={s[i] ?? 0} onChange={(v) => setScore(i, v)} options={DLQI_OPT} />
            )}
          </div>
          <span className="w-5 text-center text-sm font-bold text-blue-700">{get(i)}</span>
        </div>
      ))}
    </div>
  )
}

// ── Registry ──────────────────────────────────────────────────────────────────
export const ASSESSMENT_LIBRARY: Record<string, AssessmentDef> = {
  EASI: {
    code: 'EASI', name: 'Eczema Area and Severity Index', short: 'EASI', category: 'Dermatology',
    studies: ['ECZ2026'], visits: ['Day 0', 'Day 15', 'Day 30', 'Day 45', 'Day 60', 'Day 75', 'Day 90'], range: '0–72',
    score: easiScore, interpret: easiInterpret, Workspace: EasiWorkspace,
  },
  DLQI: {
    code: 'DLQI', name: 'Dermatology Life Quality Index', short: 'DLQI', category: 'Quality of Life',
    studies: ['ECZ2026', 'SHP2026'], visits: ['BT', 'AT'], range: '0–30',
    score: dlqiScore, interpret: dlqiInterpret, Workspace: DlqiWorkspace,
  },
  ...Object.fromEntries(EXTRA_SCALES.map((d) => [d.code, d])),
}

export function assessmentsForStudy(studyCode: string): AssessmentDef[] {
  return Object.values(ASSESSMENT_LIBRARY).filter((a) => a.studies.includes(studyCode))
}

/** Live-computed score + interpretation for a workspace value. */
export function useScore(def: AssessmentDef, value: Responses) {
  return useMemo(() => {
    const { total, subscores } = def.score(value)
    return { total, subscores, interpretation: def.interpret(total) }
  }, [def, value])
}
