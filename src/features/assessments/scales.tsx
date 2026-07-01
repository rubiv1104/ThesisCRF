'use client'

/**
 * Additional Master Assessment Library scales (registered into library.tsx).
 * Each scale defined once: workspace + scoring + interpretation.
 *   UAS7, UCT  → SHP2026 (urticaria)
 *   SF-12      → DM2026, DMA2026 (diabetes QoL)
 *   CLDQ-NASH, FibroScan → FLD2026 (fatty liver)
 *   Zulewski   → HYP2026 (subclinical hypothyroidism)
 *   AHA-Symptoms → HTN2026 (hypertension)
 */
import type { AssessmentDef, Responses } from './library'

function Sel({ value, onChange, options }: { value: number; onChange: (v: number) => void; options: string[] }) {
  return (
    <select value={value} onChange={(e) => onChange(Number(e.target.value))}
      className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400">
      {options.map((l, i) => <option key={i} value={i}>{l}</option>)}
    </select>
  )
}
function Num({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input type="number" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
  )
}

interface QItem { label: string; options: string[]; domain?: string }

/** Generic vertical questionnaire workspace (index of option = its point value). */
function makeWorkspace(items: QItem[], opts: { groupByDomain?: boolean } = {}) {
  return function WS({ value, onChange }: { value: Responses; onChange: (r: Responses) => void }) {
    const s = (value.s as number[]) ?? Array(items.length).fill(0)
    function set(i: number, v: number) { const n = [...s]; n[i] = v; onChange({ ...value, s: n }) }
    let lastDomain = ''
    return (
      <div className="space-y-2">
        {items.map((it, i) => {
          const showDomain = opts.groupByDomain && it.domain && it.domain !== lastDomain
          if (it.domain) lastDomain = it.domain
          return (
            <div key={i}>
              {showDomain && <p className="mb-1 mt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{it.domain}</p>}
              <div className="rounded-lg border border-slate-200 p-2.5">
                <p className="mb-1 text-xs text-slate-700">{i + 1}. {it.label}</p>
                <Sel value={s[i] ?? 0} onChange={(v) => set(i, v)} options={it.options} />
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}
function sumScore(n: number) {
  return (v: Responses) => {
    const s = (v.s as number[]) ?? []
    let t = 0
    for (let i = 0; i < n; i++) t += s[i] ?? 0
    return { total: t }
  }
}

// ── UAS7 (7-day) ──────────────────────────────────────────────────────────────
const UAS_WHEAL = ['0 None', '1 Mild (<20 wheals/24h)', '2 Moderate (20–50)', '3 Intense (>50)']
const UAS_ITCH = ['0 None', '1 Mild', '2 Moderate', '3 Intense (disturbs sleep)']
function uas7Workspace({ value, onChange }: { value: Responses; onChange: (r: Responses) => void }) {
  const w = (value.wheals as number[]) ?? Array(7).fill(0)
  const it = (value.itch as number[]) ?? Array(7).fill(0)
  const setW = (i: number, v: number) => { const n = [...w]; n[i] = v; onChange({ ...value, wheals: n }) }
  const setI = (i: number, v: number) => { const n = [...it]; n[i] = v; onChange({ ...value, itch: n }) }
  return (
    <div className="space-y-2">
      <p className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-800">Daily wheals (0–3) + itch (0–3) for 7 days. UAS7 = sum (0–42).</p>
      {Array.from({ length: 7 }).map((_, d) => (
        <div key={d} className="rounded-lg border border-slate-200 p-2.5">
          <p className="mb-1 text-xs font-semibold text-slate-700">Day {d + 1}</p>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-[11px] text-slate-500">Wheals</label><Sel value={w[d] ?? 0} onChange={(v) => setW(d, v)} options={UAS_WHEAL} /></div>
            <div><label className="text-[11px] text-slate-500">Itch</label><Sel value={it[d] ?? 0} onChange={(v) => setI(d, v)} options={UAS_ITCH} /></div>
          </div>
        </div>
      ))}
    </div>
  )
}
function uas7Score(v: Responses) {
  const w = (v.wheals as number[]) ?? []
  const it = (v.itch as number[]) ?? []
  let total = 0
  for (let i = 0; i < 7; i++) total += (w[i] ?? 0) + (it[i] ?? 0)
  return { total }
}

// ── SF-12 ─────────────────────────────────────────────────────────────────────
// Options ordered worst → best so the index encodes increasing health.
const SF12_ITEMS: QItem[] = [
  { label: 'In general, your health is', options: ['Poor', 'Fair', 'Good', 'Very good', 'Excellent'], domain: 'Physical' },
  { label: 'Moderate activities (table, vacuuming, bowling) — limited?', options: ['Yes, limited a lot', 'Yes, limited a little', 'No, not limited'], domain: 'Physical' },
  { label: 'Climbing several flights of stairs — limited?', options: ['Yes, limited a lot', 'Yes, limited a little', 'No, not limited'], domain: 'Physical' },
  { label: 'Accomplished less than you would like (physical)', options: ['Yes', 'No'], domain: 'Physical' },
  { label: 'Limited in the kind of work/activities (physical)', options: ['Yes', 'No'], domain: 'Physical' },
  { label: 'Pain interfered with normal work', options: ['Extremely', 'Quite a bit', 'Moderately', 'A little bit', 'Not at all'], domain: 'Physical' },
  { label: 'Accomplished less than you would like (emotional)', options: ['Yes', 'No'], domain: 'Mental' },
  { label: 'Did work less carefully than usual (emotional)', options: ['Yes', 'No'], domain: 'Mental' },
  { label: 'Felt calm and peaceful', options: ['None of the time', 'A little', 'Some', 'A good bit', 'Most', 'All of the time'], domain: 'Mental' },
  { label: 'Had a lot of energy', options: ['None of the time', 'A little', 'Some', 'A good bit', 'Most', 'All of the time'], domain: 'Mental' },
  { label: 'Felt downhearted and blue', options: ['All of the time', 'Most', 'A good bit', 'Some', 'A little', 'None of the time'], domain: 'Mental' },
  { label: 'Health interfered with social activities', options: ['All of the time', 'Most', 'Some', 'A little', 'None of the time'], domain: 'Mental' },
]
function sf12Score(v: Responses) {
  const s = (v.s as number[]) ?? Array(12).fill(0)
  const pct = (i: number) => { const len = SF12_ITEMS[i]!.options.length; return ((s[i] ?? 0) / (len - 1)) * 100 }
  const phys: number[] = [], ment: number[] = []
  SF12_ITEMS.forEach((it, i) => (it.domain === 'Physical' ? phys : ment).push(pct(i)))
  const mean = (a: number[]) => +(a.reduce((x, y) => x + y, 0) / a.length).toFixed(1)
  const P = mean(phys), M = mean(ment)
  return { total: +((P + M) / 2).toFixed(1), subscores: { 'Physical (0–100)': P, 'Mental (0–100)': M } }
}

// ── CLDQ-NASH ─────────────────────────────────────────────────────────────────
const CLDQ_DOMAINS: { domain: string; items: string[] }[] = [
  { domain: 'Abdominal Symptoms', items: ['Abdominal pain', 'Abdominal discomfort', 'Abdominal bloating', 'Right-side abdominal pain', 'Belching / gas'] },
  { domain: 'Fatigue', items: ['Feeling tired', 'Feeling exhausted', 'Drained of energy', 'Drowsy during the day', 'Difficulty concentrating', 'Difficulty with memory'] },
  { domain: 'Systemic Symptoms', items: ['Dry mouth', 'Muscle cramps', 'Itching', 'Trouble sleeping', 'Headaches', 'Dizziness'] },
  { domain: 'Activity', items: ['Needing to rest', 'Unable to do usual activities', 'Less productive', 'Difficulty with physical activity'] },
  { domain: 'Emotional Function', items: ['Worrying about future', 'Feeling depressed', 'Feeling frustrated', 'Worrying about complications', 'Feeling a burden', 'Feeling irritable', 'Embarrassed about condition'] },
  { domain: 'Worry', items: ['Worry about weight', 'Worry about medications', 'Worry about diet', 'Concerned about condition', 'Worry about new treatments', 'Worry about worsening', 'Worry about family risk', 'Worry about telling others'] },
]
const CLDQ_ITEMS: QItem[] = CLDQ_DOMAINS.flatMap((d) => d.items.map((label) => ({ label, domain: d.domain, options: ['1 All the time', '2 Most', '3 A good bit', '4 Some', '5 A little', '6 Rarely', '7 Never'] })))
function cldqScore(v: Responses) {
  const s = (v.s as number[]) ?? Array(CLDQ_ITEMS.length).fill(0)
  const val = (i: number) => (s[i] ?? 0) + 1 // index 0..6 → 1..7
  const subscores: Record<string, number> = {}
  let idx = 0, allSum = 0
  for (const d of CLDQ_DOMAINS) {
    let sum = 0
    for (let k = 0; k < d.items.length; k++) { sum += val(idx); allSum += val(idx); idx++ }
    subscores[d.domain] = +(sum / d.items.length).toFixed(2)
  }
  return { total: +(allSum / CLDQ_ITEMS.length).toFixed(2), subscores }
}

// ── FibroScan ─────────────────────────────────────────────────────────────────
function fibroStage(lsm: number) { return lsm < 7 ? 'F0–F1' : lsm < 9.5 ? 'F2' : lsm < 12.5 ? 'F3' : 'F4' }
function steatosisGrade(cap: number) { return cap < 248 ? 'S0' : cap < 268 ? 'S1' : cap < 280 ? 'S2' : 'S3' }
function fibroWorkspace({ value, onChange }: { value: Responses; onChange: (r: Responses) => void }) {
  const lsm = (value.lsm as string) ?? ''
  const cap = (value.cap as string) ?? ''
  const ln = parseFloat(lsm), cn = parseFloat(cap)
  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Liver Stiffness — LSM (kPa)</label>
        <Num value={lsm} placeholder="e.g. 8.4" onChange={(v) => onChange({ ...value, lsm: v })} />
        {!isNaN(ln) && <p className="mt-1 text-xs font-semibold text-blue-700">Fibrosis: {fibroStage(ln)}</p>}
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Steatosis — CAP (dB/m)</label>
        <Num value={cap} placeholder="e.g. 265" onChange={(v) => onChange({ ...value, cap: v })} />
        {!isNaN(cn) && <p className="mt-1 text-xs font-semibold text-blue-700">Steatosis: {steatosisGrade(cn)}</p>}
      </div>
    </div>
  )
}
function fibroScore(v: Responses) {
  const ln = parseFloat((v.lsm as string) ?? '')
  const cn = parseFloat((v.cap as string) ?? '')
  return { total: isNaN(ln) ? 0 : ln, subscores: { 'CAP (dB/m)': isNaN(cn) ? 0 : cn } }
}

// ── Zulewski Clinical Score (subclinical hypothyroidism) ──────────────────────
const ZULEWSKI_ITEMS: QItem[] = [
  'Diminished sweating', 'Hoarseness', 'Paraesthesia', 'Dry skin', 'Cold intolerance', 'Constipation', 'Weight increase',
  'Slow movements', 'Delayed ankle reflex', 'Coarse skin', 'Periorbital puffiness', 'Cold skin',
].map((label) => ({ label, options: ['Absent', 'Present'] }))

// ── AHA symptom severity (essential hypertension) ─────────────────────────────
const AHA_ITEMS: QItem[] = [
  { label: 'Headache', options: ['Absent', 'Off & On', 'Mild–Moderate (no medication)', 'Severe (medication required)'] },
  { label: 'Palpitation', options: ['Absent', 'Present'] },
  { label: 'Dizziness', options: ['Absent', 'Off & On', 'On standing only', 'Constantly present'] },
  { label: 'Breathlessness', options: ['Absent', 'On severe exertion', 'On slight exertion', 'At rest'] },
  { label: 'Fatigue', options: ['Absent', 'Present'] },
  { label: 'Chest pain', options: ['Absent', 'Slight on severe exertion', 'On exertion (few minutes)', 'Severe (subsides on anti-HTN Tx)'] },
  { label: 'Nausea / Vomiting', options: ['Absent', 'Only nausea', 'Vomiting once/twice', 'Vomiting >twice'] },
  { label: 'Pale / Red skin', options: ['Absent', 'Present'] },
]

// ── Tamaka Shwasa clinical symptom grading (bronchial asthma) ─────────────────
const TAMAKA_ITEMS: QItem[] = [
  { label: 'Frequency of attacks (Shwasa Vega)', options: ['0 No attack (1 mo)', '1 Once a month', '2 Once in 2 weeks', '3 Once a week', '4 Twice a week', '5 ≥ Once a day'] },
  { label: 'Duration of attack', options: ['0 No attack', '1 ½–1 h', '2 1–6 h', '3 6–12 h', '4 12 h', '5 > 12 h'] },
  { label: 'Intensity of attack', options: ['0 Asymptomatic', '1 Intermittent < 1/wk', '2 > 1/wk, < 1/day', '3 Daily', '4 Continuous'] },
  { label: 'Kasam (Cough)', options: ['0 No cough', '1 Dry / easy expectoration', '2 Mild pain & difficulty', '3 Severe pain / restlessness', '4 Coughing to fainting'] },
  { label: 'Kapha Nishthivanam (Expectoration)', options: ['0 None', '1 Early morning only', '2 2–3 times daily', '3 Always'] },
  { label: 'Rudhho Ghur-ghurakam (Wheezing)', options: ['0 None', '1 Early am, no medicine', '2 Early am, needs medicine', '3 Early am + occasional daytime', '4 All day, needs medicine', '5 All day, unresponsive'] },
  { label: 'Urashoola / Parshvashoola (Chest pain)', options: ['0 None', '1 With attack', '2 Often, relieved by snehana/swedana', '3 Often without attack, relieved', '4 Always'] },
  { label: 'Asino labhate Saukhyam (Relief on sitting)', options: ['0 Relief lying', '1 Temporarily better sitting', '2 Sitting gives relief', '3 Must sit, cannot sleep'] },
  { label: 'Rhonchi / Crepts', options: ['0 Few on forced breathing', '1 Few scattered bilateral', '2 Between grade 1 & 3', '3 Innumerable high-pitched'] },
  { label: 'Peenasa', options: ['0 None', '1 During attack, subsides 1–2 d', '2 Persists 1 wk after attack', '3 Often without attack', '4 Always'] },
]

export const EXTRA_SCALES: AssessmentDef[] = [
  {
    code: 'TamakaShwasa', name: 'Tamaka Shwasa Clinical Symptom Score', short: 'Tamaka Sx', category: 'Clinical Score',
    studies: ['AST2026'], visits: ['BT', 'D7', 'D14', 'D30', 'D45', 'D60', 'AT'], range: '0–40',
    score: sumScore(10), Workspace: makeWorkspace(TAMAKA_ITEMS),
    interpret: (t) => t === 0 ? 'Asymptomatic' : t <= 8 ? 'Minimal' : t <= 16 ? 'Mild' : t <= 26 ? 'Moderate' : 'Severe',
  },
  {
    code: 'UAS7', name: 'Urticaria Activity Score over 7 days', short: 'UAS7', category: 'Dermatology',
    studies: ['SHP2026'], visits: ['BT', 'D7', 'D14', 'D21', 'D45', 'D60', 'D75', 'AT'], range: '0–42',
    score: uas7Score, Workspace: uas7Workspace,
    interpret: (t) => t === 0 ? 'Urticaria-free' : t <= 6 ? 'Well-controlled' : t <= 15 ? 'Mild' : t <= 27 ? 'Moderate' : 'Severe',
  },
  {
    code: 'UCT', name: 'Urticaria Control Test', short: 'UCT', category: 'Dermatology',
    studies: ['SHP2026'], visits: ['BT', 'AT'], range: '0–16',
    score: sumScore(4), Workspace: makeWorkspace([
      { label: 'Physical symptoms (itch, wheals, swelling) — last 4 weeks', options: ['Very much', 'Much', 'Some', 'A little', 'Not at all'] },
      { label: 'Quality of life affected — last 4 weeks', options: ['Very much', 'Much', 'Some', 'A little', 'Not at all'] },
      { label: 'Treatment not enough to control symptoms — last 4 weeks', options: ['Very often', 'Often', 'Sometimes', 'Rarely', 'Not at all'] },
      { label: 'Overall control of urticaria — last 4 weeks', options: ['Not at all', 'A little', 'Some', 'Well', 'Very well'] },
    ]),
    interpret: (t) => t >= 12 ? 'Well controlled' : 'Poorly controlled',
  },
  {
    code: 'SF-12', name: 'SF-12 Health Survey', short: 'SF-12', category: 'Quality of Life',
    // DMA2026 uses the Diabetes Symptom Questionnaire (DSQ) per its proforma, not SF-12.
    studies: ['DM2026'], visits: ['BT', 'AT'], range: '0–100',
    score: sf12Score, Workspace: makeWorkspace(SF12_ITEMS),
    interpret: (t) => t >= 60 ? 'Good QoL' : t >= 40 ? 'Moderate QoL' : 'Poor QoL',
  },
  {
    code: 'CLDQ-NASH', name: 'Chronic Liver Disease Questionnaire (NAFLD/NASH)', short: 'CLDQ', category: 'Quality of Life',
    studies: ['FLD2026'], visits: ['Day 1', 'Day 45', 'Day 90'], range: '1–7',
    score: cldqScore, Workspace: makeWorkspace(CLDQ_ITEMS, { groupByDomain: true }),
    interpret: (t) => t >= 6 ? 'Minimal impairment' : t >= 5 ? 'Mild' : t >= 4 ? 'Moderate' : t >= 3 ? 'Severe' : 'Very severe',
  },
  {
    code: 'FibroScan', name: 'FibroScan (Transient Elastography)', short: 'FibroScan', category: 'Investigation',
    // Retired: the IEC removed FibroScan from FLD2026's investigations (proforma correction log).
    studies: [], visits: ['BT', 'AT'], range: 'kPa',
    score: fibroScore, Workspace: fibroWorkspace,
    interpret: (t) => t === 0 ? '—' : `Fibrosis ${fibroStage(t)}`,
  },
  {
    code: 'Zulewski', name: 'Zulewski Clinical Score (Hypothyroidism)', short: 'Zulewski', category: 'Clinical Score',
    studies: ['HYP2026'], visits: ['BT', 'AT'], range: '0–12',
    score: sumScore(12), Workspace: makeWorkspace(ZULEWSKI_ITEMS),
    interpret: (t) => t >= 6 ? 'Hypothyroid (likely)' : t >= 3 ? 'Intermediate' : 'Euthyroid range',
  },
  {
    code: 'AHA-Symptoms', name: 'AHA Symptom Severity (Hypertension)', short: 'AHA Sx', category: 'Clinical Score',
    studies: ['HTN2026'], visits: ['BT', 'FU1', 'FU2', 'FU3', 'FU4', 'FU5', 'FU6', 'AT'], range: '0–18',
    score: sumScore(8), Workspace: makeWorkspace(AHA_ITEMS),
    interpret: (t) => t === 0 ? 'Asymptomatic' : t <= 5 ? 'Mild' : t <= 10 ? 'Moderate' : 'Severe',
  },
]
