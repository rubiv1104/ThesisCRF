'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'

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

// ─── Grading table helpers ────────────────────────────────────────────────────

const GRADING_ROWS: Array<{ key: string; label: string }> = [
  { key: 'kandu_(pruritus)', label: 'Kandu' },
  { key: 'srava_/_lasikadhya_(oozing)', label: 'Srava' },
  { key: 'rukshata_(dryness)', label: 'Rukshata' },
  { key: 'pidikotpatti_(eruption)', label: 'Pidikotpatti' },
  { key: 'shyavata_(discolouration)', label: 'Shyavata' },
  { key: 'ruja_(pain)', label: 'Ruja' },
  { key: 'rajyo_(thickness_/_marked_lining)', label: 'Rajyo' },
  { key: 'easi_score', label: 'EASI' },
  { key: 'viga-ad', label: 'vIGA-AD' },
  { key: 'itch_nrs', label: 'Itch NRS' },
]

const GRADING_COLS: Array<{ key: string; label: string }> = [
  { key: 'baseline_(0)', label: 'D0' },
  { key: 'day_15', label: 'D15' },
  { key: 'day_30', label: 'D30' },
  { key: 'day_45', label: 'D45' },
  { key: 'day_60', label: 'D60' },
  { key: 'day_75', label: 'D75' },
  { key: 'day_90', label: 'D90' },
]

function gk(rowKey: string, colKey: string) {
  return `grading_table__${rowKey}__${colKey}`
}

// ─── Lab column definitions ──────────────────────────────────────────────────

const LAB_GROUPS: Array<{ label: string; cols: Array<{ key: string; label: string }> }> = [
  {
    label: 'Haematology',
    cols: [
      { key: 'hb_bt', label: 'Hb BT' }, { key: 'hb_at', label: 'Hb AT' },
      { key: 'tlc_bt', label: 'TLC BT' }, { key: 'tlc_at', label: 'TLC AT' },
      { key: 'esr_bt', label: 'ESR BT' }, { key: 'esr_at', label: 'ESR AT' },
      { key: 'dlc_n_bt', label: 'N% BT' }, { key: 'dlc_n_at', label: 'N% AT' },
      { key: 'dlc_l_bt', label: 'L% BT' }, { key: 'dlc_l_at', label: 'L% AT' },
      { key: 'dlc_e_bt', label: 'E% BT' }, { key: 'dlc_e_at', label: 'E% AT' },
      { key: 'dlc_b_bt', label: 'B% BT' }, { key: 'dlc_b_at', label: 'B% AT' },
      { key: 'dlc_m_bt', label: 'M% BT' }, { key: 'dlc_m_at', label: 'M% AT' },
    ],
  },
  {
    label: 'Immunology',
    cols: [
      { key: 'sr_ige_bt', label: 'IgE BT' }, { key: 'sr_ige_at', label: 'IgE AT' },
      { key: 'aec_bt', label: 'AEC BT' }, { key: 'aec_at', label: 'AEC AT' },
    ],
  },
  {
    label: 'Renal',
    cols: [
      { key: 'blood_urea_bt', label: 'Urea BT' }, { key: 'blood_urea_at', label: 'Urea AT' },
      { key: 'uric_acid_bt', label: 'UA BT' }, { key: 'uric_acid_at', label: 'UA AT' },
      { key: 'creatinine_bt', label: 'Creat BT' }, { key: 'creatinine_at', label: 'Creat AT' },
    ],
  },
  {
    label: 'Liver',
    cols: [
      { key: 'sgot_bt', label: 'SGOT BT' }, { key: 'sgot_at', label: 'SGOT AT' },
      { key: 'sgpt_bt', label: 'SGPT BT' }, { key: 'sgpt_at', label: 'SGPT AT' },
      { key: 'total_protein_bt', label: 'TP BT' }, { key: 'total_protein_at', label: 'TP AT' },
      { key: 'albumin_bt', label: 'Alb BT' }, { key: 'albumin_at', label: 'Alb AT' },
      { key: 'globulin_bt', label: 'Glob BT' }, { key: 'globulin_at', label: 'Glob AT' },
      { key: 'ag_ratio_bt', label: 'A/G BT' }, { key: 'ag_ratio_at', label: 'A/G AT' },
      { key: 'total_bili_bt', label: 'T.Bili BT' }, { key: 'total_bili_at', label: 'T.Bili AT' },
      { key: 'direct_bili_bt', label: 'D.Bili BT' }, { key: 'direct_bili_at', label: 'D.Bili AT' },
    ],
  },
  {
    label: 'Metabolic',
    cols: [
      { key: 'fbs_bt', label: 'FBS BT' }, { key: 'fbs_at', label: 'FBS AT' },
    ],
  },
]

// ─── Demographics columns ──────────────────────────────────────────────────────

const DEMO_COLS: Array<{ key: string; label: string }> = [
  { key: 'marital_status', label: 'Marital Status' },
  { key: 'education', label: 'Education' },
  { key: 'occupation', label: 'Occupation' },
  { key: 'socioeconomic', label: 'Socio-Economic' },
  { key: 'habitat', label: 'Habitat' },
  { key: 'religion', label: 'Religion' },
  { key: 'family_history', label: 'Family History' },
  { key: 'ahara', label: 'Ahara' },
  { key: 'ahara_vidhi', label: 'Ahara Vidhi' },
  { key: 'bmi', label: 'BMI' },
  { key: 'pulse_rate', label: 'PR (/min)' },
  { key: 'respiratory_rate', label: 'RR (/min)' },
  { key: 'bp_systolic', label: 'BP Sys' },
  { key: 'bp_diastolic', label: 'BP Dia' },
  { key: 'prakriti_sharirik', label: 'Prakriti' },
  { key: 'prakriti_mansika', label: 'Prakriti (Mansika)' },
  { key: 'duration_of_disease', label: 'Duration' },
]

// ─── Misc helpers ─────────────────────────────────────────────────────────────

const EFFECT_LABELS: Record<string, string> = {
  complete_remission: 'Complete Remission',
  excellent: 'Excellent (76–99%)',
  marked: 'Marked (51–75%)',
  moderate: 'Moderate (26–50%)',
  mild: 'Mild (5–25%)',
  unchanged: 'Unchanged (<5%)',
}

function pct(bt: string | undefined, at: string | undefined) {
  const b = parseFloat(bt ?? '')
  const a = parseFloat(at ?? '')
  if (!b || isNaN(b) || isNaN(a)) return '—'
  return (((b - a) / b) * 100).toFixed(1) + '%'
}

function val(v: string | undefined) {
  return v && v !== '' ? v : '—'
}

function statusBadge(s: string) {
  if (s === 'approved') return 'bg-green-50 text-green-700'
  if (s === 'submitted') return 'bg-amber-50 text-amber-700'
  if (s === 'returned') return 'bg-red-50 text-red-600'
  return 'bg-slate-100 text-slate-500'
}

function statusLabel(s: string) {
  if (s === 'pending') return 'In Progress'
  if (s === 'submitted') return 'Submitted'
  if (s === 'approved') return 'Approved'
  if (s === 'returned') return 'Returned'
  return s
}

type Tab = 'summary' | 'scores' | 'labs' | 'demographics'

// ─── Fixed patient ID + name columns ────────────────────────────────────────

function PatientCell({ r }: { r: Row }) {
  return (
    <>
      <td className="sticky left-0 z-10 bg-white px-3 py-2 font-mono text-[11px] font-semibold text-blue-700 border-r border-slate-100">
        {r.study_patient_id}
      </td>
      <td className="px-3 py-2 font-medium text-slate-800 whitespace-nowrap text-xs">
        {r.patient_name}
        {r.has_upload && (
          <span className="ml-1 rounded-full bg-green-50 px-1.5 py-0.5 text-[10px] font-medium text-green-600" title="Excel data uploaded">XL</span>
        )}
      </td>
      <td className="px-2 py-2 text-center text-xs text-slate-500">{r.age}</td>
      <td className="px-2 py-2 text-center text-xs text-slate-500 capitalize">{r.gender?.[0] ?? '—'}</td>
      <td className="px-2 py-2 text-center">
        <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${r.group === 'Group A' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
          {r.group}
        </span>
      </td>
      <td className="px-2 py-2 text-center">
        <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${statusBadge(r.crf_status)}`}>
          {statusLabel(r.crf_status)}
        </span>
      </td>
    </>
  )
}

function FixedHead() {
  return (
    <>
      <th className="sticky left-0 z-20 bg-slate-50 px-3 py-2 text-left text-[10px] uppercase tracking-wide font-medium text-slate-500 border-r border-slate-200">ID</th>
      <th className="px-3 py-2 text-left text-[10px] uppercase tracking-wide font-medium text-slate-500">Name</th>
      <th className="px-2 py-2 text-center text-[10px] uppercase tracking-wide font-medium text-slate-500">Age</th>
      <th className="px-2 py-2 text-center text-[10px] uppercase tracking-wide font-medium text-slate-500">Sex</th>
      <th className="px-2 py-2 text-center text-[10px] uppercase tracking-wide font-medium text-slate-500">Group</th>
      <th className="px-2 py-2 text-center text-[10px] uppercase tracking-wide font-medium text-slate-500">Status</th>
    </>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export function MasterChartTable({ rows }: { rows: Row[] }) {
  const [filter, setFilter] = useState<'all' | 'Group A' | 'Group B'>('all')
  const [tab, setTab] = useState<Tab>('summary')

  const visible = filter === 'all' ? rows : rows.filter((r) => r.group === filter)

  // ── CSV export: Excel-matching column names and order ────────────────────────
  function downloadCSV() {
    // Grading row display names matching the Excel template
    const GRADING_EXCEL_LABELS: Record<string, string> = {
      'kandu_(pruritus)': 'Kandu (Pruritus)',
      'srava_/_lasikadhya_(oozing)': 'Srava (oozing)',
      'rukshata_(dryness)': 'Rukshata (Dryness)',
      'pidikotpatti_(eruption)': 'Pidikotpatti (eruption)',
      'shyavata_(discolouration)': 'Syavata (discolouration)',
      'ruja_(pain)': 'Ruja (pain)',
      'rajyo_(thickness_/_marked_lining)': 'Rajyo (Marked lining)',
      'easi_score': 'EASI Score',
      'viga-ad': 'vIGA-AD',
      'itch_nrs': 'Itch-NRS',
    }

    const GRADING_DAY_LABELS: Record<string, string> = {
      'baseline_(0)': 'Day 0', 'day_15': 'Day 15', 'day_30': 'Day 30',
      'day_45': 'Day 45', 'day_60': 'Day 60', 'day_75': 'Day 75', 'day_90': 'Day 90',
    }

    // Ordered column definitions: { header, getValue }
    type ColDef = { header: string; getValue: (r: Row) => string }
    const cols: ColDef[] = []

    // Identity
    cols.push({ header: 'Sr. No', getValue: (r) => r.study_patient_id })
    cols.push({ header: 'Name of Patient', getValue: (r) => r.patient_name })
    cols.push({ header: 'Group', getValue: (r) => r.group })
    cols.push({ header: 'CRF Status', getValue: (r) => statusLabel(r.crf_status) })

    // Demographics (matching Excel)
    cols.push({ header: 'Age', getValue: (r) => String(r.age ?? '') })
    cols.push({ header: 'Sex', getValue: (r) => r.gender ?? '' })
    cols.push({ header: 'BMI (Kg/m2)', getValue: (r) => val(r.fields['bmi']) })
    cols.push({ header: 'PR (/min)', getValue: (r) => val(r.fields['pulse_rate']) })
    cols.push({ header: 'RR (/min)', getValue: (r) => val(r.fields['respiratory_rate']) })
    cols.push({ header: 'BP (Sys/Dia)', getValue: (r) => {
      const sys = r.fields['bp_systolic'] ?? ''
      const dia = r.fields['bp_diastolic'] ?? ''
      return sys && dia ? `${sys}/${dia}` : (sys || dia || '—')
    }})
    cols.push({ header: 'Duration of Disease', getValue: (r) => val(r.fields['duration_of_disease']) })

    // Labs in same order as Excel template
    const labDefs: Array<{ excelName: string; key: string }> = [
      { excelName: 'Hb / B.T.', key: 'hb_bt' }, { excelName: 'Hb / A.T.', key: 'hb_at' },
      { excelName: 'TLC (×10 3/uL) / B.T.', key: 'tlc_bt' }, { excelName: 'TLC (×10 3/uL) / A.T.', key: 'tlc_at' },
      { excelName: 'Sr. IgE (IU/L) / B.T.', key: 'sr_ige_bt' }, { excelName: 'Sr. IgE (IU/L) / A.T.', key: 'sr_ige_at' },
      { excelName: 'AEC / B.T.', key: 'aec_bt' }, { excelName: 'AEC / A.T.', key: 'aec_at' },
      { excelName: 'ESR / B.T.', key: 'esr_bt' }, { excelName: 'ESR / A.T.', key: 'esr_at' },
      { excelName: 'N% / B.T.', key: 'dlc_n_bt' }, { excelName: 'N% / A.T.', key: 'dlc_n_at' },
      { excelName: 'L% / B.T.', key: 'dlc_l_bt' }, { excelName: 'L% / A.T.', key: 'dlc_l_at' },
      { excelName: 'E% / B.T.', key: 'dlc_e_bt' }, { excelName: 'E% / A.T.', key: 'dlc_e_at' },
      { excelName: 'B% / B.T.', key: 'dlc_b_bt' }, { excelName: 'B% / A.T.', key: 'dlc_b_at' },
      { excelName: 'M% / B.T.', key: 'dlc_m_bt' }, { excelName: 'M% / A.T.', key: 'dlc_m_at' },
      { excelName: 'Blood Urea / B.T.', key: 'blood_urea_bt' }, { excelName: 'Blood Urea / A.T.', key: 'blood_urea_at' },
      { excelName: 'Sr. Uric Acid / B.T.', key: 'uric_acid_bt' }, { excelName: 'Sr. Uric Acid / A.T.', key: 'uric_acid_at' },
      { excelName: 'Sr. Creatinine / B.T.', key: 'creatinine_bt' }, { excelName: 'Sr. Creatinine / A.T.', key: 'creatinine_at' },
      { excelName: 'SGOT / B.T.', key: 'sgot_bt' }, { excelName: 'SGOT / A.T.', key: 'sgot_at' },
      { excelName: 'SGPT / B.T.', key: 'sgpt_bt' }, { excelName: 'SGPT / A.T.', key: 'sgpt_at' },
      { excelName: 'Total Protein / B.T.', key: 'total_protein_bt' }, { excelName: 'Total Protein / A.T.', key: 'total_protein_at' },
      { excelName: 'Albumin / B.T.', key: 'albumin_bt' }, { excelName: 'Albumin / A.T.', key: 'albumin_at' },
      { excelName: 'Globulin / B.T.', key: 'globulin_bt' }, { excelName: 'Globulin / A.T.', key: 'globulin_at' },
      { excelName: 'A/G Ratio / B.T.', key: 'ag_ratio_bt' }, { excelName: 'A/G Ratio / A.T.', key: 'ag_ratio_at' },
      { excelName: 'Total Bilirubin / B.T.', key: 'total_bili_bt' }, { excelName: 'Total Bilirubin / A.T.', key: 'total_bili_at' },
      { excelName: 'Direct Bilirubin / B.T.', key: 'direct_bili_bt' }, { excelName: 'Direct Bilirubin / A.T.', key: 'direct_bili_at' },
      { excelName: 'FBS / B.T.', key: 'fbs_bt' }, { excelName: 'FBS / A.T.', key: 'fbs_at' },
    ]
    for (const { excelName, key } of labDefs) {
      cols.push({ header: excelName, getValue: (r) => val(r.fields[key]) })
    }

    // Grading scores (same row/day order as Excel)
    for (const row of GRADING_ROWS) {
      const rowLabel = GRADING_EXCEL_LABELS[row.key] ?? row.label
      for (const col of GRADING_COLS) {
        const dayLabel = GRADING_DAY_LABELS[col.key] ?? col.label
        cols.push({
          header: `${rowLabel} / ${dayLabel}`,
          getValue: (r) => val(r.fields[gk(row.key, col.key)]),
        })
      }
    }

    // DLQI (matching Excel)
    cols.push({ header: 'DLQI / B.T.', getValue: (r) => val(r.fields['dlqi_total_bt']) })
    cols.push({ header: 'DLQI / A.T.', getValue: (r) => val(r.fields['dlqi_total_at']) })

    // Extra calculated columns useful for thesis (not in Excel but added at end)
    cols.push({ header: 'EASI Calc D0', getValue: (r) => val(r.fields['easi_total_bt']) })
    cols.push({ header: 'EASI Calc D15', getValue: (r) => val(r.fields['easi_total_d15']) })
    cols.push({ header: 'EASI Calc D30', getValue: (r) => val(r.fields['easi_total_d30']) })
    cols.push({ header: 'EASI Calc D45', getValue: (r) => val(r.fields['easi_total_d45']) })
    cols.push({ header: 'EASI Calc D60', getValue: (r) => val(r.fields['easi_total_d60']) })
    cols.push({ header: 'EASI Calc D75', getValue: (r) => val(r.fields['easi_total_d75']) })
    cols.push({ header: 'EASI Calc D90', getValue: (r) => val(r.fields['easi_total_at']) })
    cols.push({ header: 'EASI % Reduction', getValue: (r) => pct(r.fields['easi_total_bt'], r.fields['easi_total_at']) })
    cols.push({ header: 'DLQI % Reduction', getValue: (r) => pct(r.fields['dlqi_total_bt'], r.fields['dlqi_total_at']) })
    cols.push({ header: 'Overall Effect', getValue: (r) => EFFECT_LABELS[r.fields['overall_effect'] ?? ''] ?? val(r.fields['overall_effect']) })

    const headers = cols.map((c) => `"${c.header.replace(/"/g, '""')}"`)
    const csvRows = visible.map((r) =>
      cols.map((c) => {
        const v = c.getValue(r)
        // Wrap in quotes if value contains comma, quote, or newline
        return v.includes(',') || v.includes('"') || v.includes('\n')
          ? `"${v.replace(/"/g, '""')}"`
          : v
      }).join(',')
    )

    const blob = new Blob([[headers.join(','), ...csvRows].join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'master-chart.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
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
        <button
          onClick={downloadCSV}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Download size={13} />
          Download CSV (all columns)
        </button>
      </div>

      {/* Column group tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {([
          { id: 'summary', label: 'Summary' },
          { id: 'scores', label: 'Disease Scores (Day 0–90)' },
          { id: 'labs', label: 'Investigations' },
          { id: 'demographics', label: 'Demographics' },
        ] as { id: Tab; label: string }[]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${
              tab === t.id
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="text-xs border-collapse">
          <thead className="bg-slate-50">
            {tab === 'labs' && (
              <tr>
                <th colSpan={6} className="sticky left-0 z-20 bg-slate-50 border-b border-slate-100" />
                {LAB_GROUPS.map((grp, gi) => (
                  <th
                    key={grp.label}
                    colSpan={grp.cols.length}
                    className={`px-2 py-1 text-center text-[10px] font-semibold uppercase tracking-wide border-l border-b border-slate-200 ${LAB_BG[gi] ?? ''} ${
                      gi === 0 ? 'text-slate-600' : gi === 1 ? 'text-blue-600' : gi === 2 ? 'text-purple-600' : gi === 3 ? 'text-amber-600' : gi === 4 ? 'text-green-600' : 'text-pink-600'
                    }`}
                  >
                    {grp.label}
                  </th>
                ))}
              </tr>
            )}
            <tr>
              <FixedHead />
              {tab === 'summary' && <SummaryHead />}
              {tab === 'scores' && <ScoresHead />}
              {tab === 'labs' && <LabsHead />}
              {tab === 'demographics' && <DemoHead />}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                <PatientCell r={r} />
                {tab === 'summary' && <SummaryRow r={r} />}
                {tab === 'scores' && <ScoresRow r={r} />}
                {tab === 'labs' && <LabsRow r={r} />}
                {tab === 'demographics' && <DemoRow r={r} />}
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={20} className="py-10 text-center text-slate-400 text-xs">No patients match filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-400">
        {tab === 'scores' && 'Disease scores from the grading table (Day 0 = Baseline). '}
        {tab === 'summary' && '%↓ = improvement from BT to AT. '}
        Values from CRF entries + uploaded Excel. Download CSV for all columns.
      </p>
    </div>
  )
}

// ─── Summary tab ──────────────────────────────────────────────────────────────

function SummaryHead() {
  return (
    <>
      {EASI_VISITS.map((v, i) => (
        <th key={v.key} className={`px-2 py-2 text-center text-[10px] uppercase font-medium text-orange-600 bg-orange-50 whitespace-nowrap ${i === 0 ? 'border-l border-slate-200' : ''}`}>
          EASI {v.label}
        </th>
      ))}
      <th className="px-2 py-2 text-center text-[10px] uppercase font-medium text-orange-700 bg-orange-100 whitespace-nowrap">EASI %↓</th>
      <th className="px-2 py-2 text-center text-[10px] uppercase font-medium text-blue-600 bg-blue-50 whitespace-nowrap">DLQI BT</th>
      <th className="px-2 py-2 text-center text-[10px] uppercase font-medium text-blue-600 bg-blue-50 whitespace-nowrap">DLQI AT</th>
      <th className="px-2 py-2 text-center text-[10px] uppercase font-medium text-blue-700 bg-blue-100 whitespace-nowrap">DLQI %↓</th>
      <th className="px-2 py-2 text-center text-[10px] uppercase font-medium text-purple-600 bg-purple-50 whitespace-nowrap">IgE BT</th>
      <th className="px-2 py-2 text-center text-[10px] uppercase font-medium text-purple-600 bg-purple-50 whitespace-nowrap">IgE AT</th>
      <th className="px-2 py-2 text-center text-[10px] uppercase font-medium text-purple-600 bg-purple-50 whitespace-nowrap">AEC BT</th>
      <th className="px-2 py-2 text-center text-[10px] uppercase font-medium text-purple-600 bg-purple-50 whitespace-nowrap">AEC AT</th>
      <th className="px-2 py-2 text-center text-[10px] uppercase font-medium text-slate-500 bg-slate-50 whitespace-nowrap">Overall Effect</th>
    </>
  )
}

function SummaryRow({ r }: { r: Row }) {
  return (
    <>
      {EASI_VISITS.map((v, i) => (
        <td key={v.key} className={`px-2 py-2 text-center font-mono text-[11px] bg-orange-50/30 ${i === 0 ? 'border-l border-slate-100' : ''}`}>
          {val(r.fields[v.key])}
        </td>
      ))}
      <td className="px-2 py-2 text-center font-semibold text-orange-700 bg-orange-100/40 text-[11px]">{pct(r.fields.easi_total_bt, r.fields.easi_total_at)}</td>
      <td className="px-2 py-2 text-center font-mono text-[11px] bg-blue-50/30">{val(r.fields.dlqi_total_bt)}</td>
      <td className="px-2 py-2 text-center font-mono text-[11px] bg-blue-50/30">{val(r.fields.dlqi_total_at)}</td>
      <td className="px-2 py-2 text-center font-semibold text-blue-700 bg-blue-100/40 text-[11px]">{pct(r.fields.dlqi_total_bt, r.fields.dlqi_total_at)}</td>
      <td className="px-2 py-2 text-center font-mono text-[11px] bg-purple-50/30">{val(r.fields.sr_ige_bt)}</td>
      <td className="px-2 py-2 text-center font-mono text-[11px] bg-purple-50/30">{val(r.fields.sr_ige_at)}</td>
      <td className="px-2 py-2 text-center font-mono text-[11px] bg-purple-50/30">{val(r.fields.aec_bt)}</td>
      <td className="px-2 py-2 text-center font-mono text-[11px] bg-purple-50/30">{val(r.fields.aec_at)}</td>
      <td className="px-2 py-2 text-xs text-slate-600 whitespace-nowrap max-w-[160px] truncate" title={EFFECT_LABELS[r.fields.overall_effect ?? ''] ?? ''}>
        {EFFECT_LABELS[r.fields.overall_effect ?? ''] ?? val(r.fields.overall_effect)}
      </td>
    </>
  )
}

// ─── Disease scores tab ───────────────────────────────────────────────────────

// EASI calculated totals from the detailed EASI grid (auto-calculated, all 7 visits)
const EASI_VISITS: Array<{ key: string; label: string }> = [
  { key: 'easi_total_bt',  label: 'D0' },
  { key: 'easi_total_d15', label: 'D15' },
  { key: 'easi_total_d30', label: 'D30' },
  { key: 'easi_total_d45', label: 'D45' },
  { key: 'easi_total_d60', label: 'D60' },
  { key: 'easi_total_d75', label: 'D75' },
  { key: 'easi_total_at',  label: 'D90' },
]

const SCORE_ROW_COLORS = [
  'bg-rose-50/40', 'bg-orange-50/40', 'bg-amber-50/40', 'bg-yellow-50/40',
  'bg-lime-50/40', 'bg-green-50/40', 'bg-teal-50/40', 'bg-cyan-50/40',
  'bg-sky-50/40', 'bg-blue-50/40',
]

function ScoresHead() {
  return (
    <>
      {/* EASI calculated totals — separate group */}
      {EASI_VISITS.map((v, i) => (
        <th
          key={v.key}
          className={`px-1.5 py-1 text-center text-[10px] font-medium whitespace-nowrap border-l bg-orange-50 text-orange-700 ${i === 0 ? 'border-orange-300' : 'border-orange-100'}`}
          title={`EASI Score — ${v.label}`}
        >
          {i === 0 ? (
            <span className="flex flex-col items-center gap-0.5">
              <span className="font-semibold">EASI</span>
              <span className="text-[9px]">{v.label}</span>
            </span>
          ) : v.label}
        </th>
      ))}
      {/* Other grading parameters */}
      {GRADING_ROWS.filter((r) => r.key !== 'easi_score').map((row, ri) =>
        GRADING_COLS.map((col, ci) => (
          <th
            key={`${row.key}-${col.key}`}
            className={`px-1.5 py-1 text-center text-[10px] font-medium whitespace-nowrap border-l ${
              ri % 2 === 0 ? 'bg-slate-50 text-slate-500' : 'bg-white text-slate-400'
            } ${ci === 0 ? 'border-slate-300' : 'border-slate-100'}`}
            title={`${row.label} – ${col.label}`}
          >
            {ci === 0 ? (
              <span className="flex flex-col items-center gap-0.5">
                <span className="font-semibold text-slate-700">{row.label}</span>
                <span className="text-[9px] text-slate-400">{col.label}</span>
              </span>
            ) : col.label}
          </th>
        ))
      )}
    </>
  )
}

function ScoresRow({ r }: { r: Row }) {
  return (
    <>
      {/* EASI calculated totals */}
      {EASI_VISITS.map((v, i) => (
        <td
          key={v.key}
          className={`px-2 py-2 text-center font-mono text-[11px] bg-orange-50/30 ${i === 0 ? 'border-l border-orange-200' : ''}`}
        >
          {val(r.fields[v.key])}
        </td>
      ))}
      {/* Other grading parameters */}
      {GRADING_ROWS.filter((row) => row.key !== 'easi_score').map((row, ri) =>
        GRADING_COLS.map((col) => (
          <td
            key={`${row.key}-${col.key}`}
            className={`px-2 py-2 text-center font-mono text-[11px] ${SCORE_ROW_COLORS[ri] ?? ''} ${col.key === 'baseline_(0)' ? 'border-l border-slate-200' : ''}`}
          >
            {val(r.fields[gk(row.key, col.key)])}
          </td>
        ))
      )}
    </>
  )
}

// ─── Labs tab ─────────────────────────────────────────────────────────────────

const LAB_BG = ['bg-slate-50/40', 'bg-blue-50/30', 'bg-purple-50/30', 'bg-amber-50/30', 'bg-green-50/30', 'bg-pink-50/30']

function LabsHead() {
  return (
    <>
      {LAB_GROUPS.map((grp, gi) =>
        grp.cols.map((col, ci) => (
          <th
            key={col.key}
            className={`px-2 py-1 text-center text-[10px] font-medium text-slate-500 whitespace-nowrap ${LAB_BG[gi] ?? ''} border-l ${ci === 0 ? 'border-slate-300' : 'border-slate-100'}`}
            title={grp.label}
          >
            {col.label}
          </th>
        ))
      )}
    </>
  )
}

function LabsRow({ r }: { r: Row }) {
  return (
    <>
      {LAB_GROUPS.map((grp, gi) =>
        grp.cols.map((col, ci) => (
          <td
            key={col.key}
            className={`px-2 py-2 text-center font-mono text-[11px] ${LAB_BG[gi] ?? ''} ${ci === 0 ? 'border-l border-slate-200' : ''}`}
          >
            {val(r.fields[col.key])}
          </td>
        ))
      )}
    </>
  )
}

// ─── Demographics tab ─────────────────────────────────────────────────────────

function DemoHead() {
  return (
    <>
      {DEMO_COLS.map((c) => (
        <th key={c.key} className="px-2 py-1 text-left text-[10px] font-medium text-slate-500 whitespace-nowrap border-l border-slate-100 bg-slate-50">
          {c.label}
        </th>
      ))}
    </>
  )
}

function DemoRow({ r }: { r: Row }) {
  return (
    <>
      {DEMO_COLS.map((c) => (
        <td key={c.key} className="px-2 py-2 text-xs text-slate-600 whitespace-nowrap border-l border-slate-50 max-w-[120px] truncate" title={val(r.fields[c.key])}>
          {val(r.fields[c.key])}
        </td>
      ))}
    </>
  )
}
