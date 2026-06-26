'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import * as XLSX from 'xlsx'
import { Upload, FileSpreadsheet, CheckCircle2, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { saveExcelUploads, getStudyForUser } from './actions'

// ── Column mapping: compound Excel name → CRF field key ───────────────────────
// Compound name = "Parent" (for single-col) or "Parent / Sub" (for merged-header cols)

function toKey(s: string) {
  return s.replace(/\s+/g, '_').toLowerCase()
}

const GRADING_ROW_MAP: Record<string, string> = {
  'kandu (pruritus)': 'kandu_(pruritus)',
  'srava (oozing)': 'srava_/_lasikadhya_(oozing)',
  'rukshata (dryness)': 'rukshata_(dryness)',
  'pidikotpatti (eruption)': 'pidikotpatti_(eruption)',
  'syavata (discolouration)': 'shyavata_(discolouration)',
  'ruja (pain)': 'ruja_(pain)',
  'rajyo (marked lining)': 'rajyo_(thickness_/_marked_lining)',
  'easi score': 'easi_score',
  'viga-ad': 'viga-ad',
  'itch-nrs': 'itch_nrs',
}

const GRADING_COL_MAP: Record<string, string> = {
  'day 0': 'baseline_(0)',
  'day 15': 'day_15',
  'day 30': 'day_30',
  'day 45': 'day_45',
  'day 60': 'day_60',
  'day 75': 'day_75',
  'day 90': 'day_90',
}

function buildExcelColumnMap(): Record<string, string> {
  const map: Record<string, string> = {
    // Labs BT/AT
    'Hb / B.T.': 'hb_bt', 'Hb / A.T.': 'hb_at',
    'TLC (×10 3/uL) / B.T.': 'tlc_bt', 'TLC (×10 3/uL) / A.T.': 'tlc_at',
    'Sr. IgE (IU/L) / B.T.': 'sr_ige_bt', 'Sr. IgE (IU/L) / A.T.': 'sr_ige_at',
    'AEC / B.T.': 'aec_bt', 'AEC / A.T.': 'aec_at',
    'ESR / B.T.': 'esr_bt', 'ESR / A.T.': 'esr_at',
    'N% / B.T.': 'dlc_n_bt', 'N% / A.T.': 'dlc_n_at',
    'L% / B.T.': 'dlc_l_bt', 'L% / A.T.': 'dlc_l_at',
    'E% / B.T.': 'dlc_e_bt', 'E% / A.T.': 'dlc_e_at',
    'B% / B.T.': 'dlc_b_bt', 'B% / A.T.': 'dlc_b_at',
    'M% / B.T.': 'dlc_m_bt', 'M% / A.T.': 'dlc_m_at',
    'Blood Urea / B.T.': 'blood_urea_bt', 'Blood Urea / A.T.': 'blood_urea_at',
    'Sr. Uric Acid / B.T.': 'uric_acid_bt', 'Sr. Uric Acid / A.T.': 'uric_acid_at',
    'Sr. Creatinine / B.T.': 'creatinine_bt', 'Sr. Creatinine / A.T.': 'creatinine_at',
    'SGOT / B.T.': 'sgot_bt', 'SGOT / A.T.': 'sgot_at',
    'SGPT / B.T.': 'sgpt_bt', 'SGPT / A.T.': 'sgpt_at',
    'Total Protein / B.T.': 'total_protein_bt', 'Total Protein / A.T.': 'total_protein_at',
    'Albumin / B.T.': 'albumin_bt', 'Albumin / A.T.': 'albumin_at',
    'Globulin / B.T.': 'globulin_bt', 'Globulin / A.T.': 'globulin_at',
    'A/G Ratio / B.T.': 'ag_ratio_bt', 'A/G Ratio / A.T.': 'ag_ratio_at',
    'Total Bilirubin / B.T.': 'total_bili_bt', 'Total Bilirubin / A.T.': 'total_bili_at',
    'Direct Bilirubin / B.T.': 'direct_bili_bt', 'Direct Bilirubin / A.T.': 'direct_bili_at',
    'FBS / B.T.': 'fbs_bt', 'FBS / A.T.': 'fbs_at',
    // DLQI
    'DLQI / B.T.': 'dlqi_total_bt', 'DLQI / A.T.': 'dlqi_total_at',
    // Demographics (single-col, no sub-header)
    'Age': '_age', 'Sex': '_sex', 'BMI (Kg/m2)': 'bmi',
    'RR (/min)': 'respiratory_rate', 'PR (/min)': 'pulse_rate',
  }

  // Grading table: rows × days
  const gradingRows = ['Kandu (Pruritus)', 'Srava (oozing)', 'Rukshata (Dryness)',
    'Pidikotpatti (eruption)', 'Syavata (discolouration)', 'Ruja (pain)',
    'Rajyo (Marked lining)', 'EASI Score', 'vIGA-AD', 'Itch-NRS']
  const days = ['Day 0', 'Day 15', 'Day 30', 'Day 45', 'Day 60', 'Day 75', 'Day 90']

  for (const row of gradingRows) {
    for (const day of days) {
      const compound = `${row} / ${day}`
      const rowNorm = toKey(row)
      const crfRow = GRADING_ROW_MAP[rowNorm] ?? rowNorm
      const crfCol = GRADING_COL_MAP[toKey(day)] ?? toKey(day)
      map[compound] = `grading_table__${crfRow}__${crfCol}`
    }
  }

  return map
}

const COLUMN_MAP = buildExcelColumnMap()

// ── Parse Excel file ──────────────────────────────────────────────────────────

interface ParsedRow {
  patient_name: string
  patient_sr_no: string
  data: Record<string, string>
  _detected: string[] // which CRF fields were found
}

function parseExcel(file: File): Promise<ParsedRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target?.result, { type: 'array' })
        const sheetName = wb.SheetNames[0] ?? ''
        const ws = wb.Sheets[sheetName]
        if (!ws) { reject(new Error('No sheets found in file')); return }
        const raw = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1, defval: '' })

        if (raw.length < 3) {
          reject(new Error('File must have at least 2 header rows and 1 data row'))
          return
        }

        const row0 = raw[0] as string[]
        const row1 = raw[1] as string[]

        // Fill-forward empty cells in row0 (merged cells in Excel appear as empty)
        const parentHeaders: string[] = []
        let lastParent = ''
        for (const cell of row0) {
          const trimmed = String(cell).trim()
          if (trimmed) lastParent = trimmed
          parentHeaders.push(lastParent)
        }

        // Build compound column names
        const compoundNames: string[] = parentHeaders.map((parent, i) => {
          const sub = String(row1[i] ?? '').trim()
          return sub ? `${parent} / ${sub}` : parent
        })

        // Find patient_name and sr_no columns
        const nameCol = compoundNames.findIndex((n) => n === 'Name of Patient')
        const srCol = compoundNames.findIndex((n) => n === 'Sr. No')

        const results: ParsedRow[] = []

        for (let ri = 2; ri < raw.length; ri++) {
          const dataRow = raw[ri] as (string | number)[]
          const patientName = String(dataRow[nameCol] ?? '').trim()
          if (!patientName) continue

          const srNo = String(dataRow[srCol] ?? ri - 1).trim()
          const data: Record<string, string> = {}
          const detected: string[] = []

          for (let ci = 0; ci < compoundNames.length; ci++) {
            const compound = compoundNames[ci] ?? ''
            const crfKey = COLUMN_MAP[compound]
            if (!crfKey) continue
            const rawVal = String(dataRow[ci] ?? '').trim()
            if (!rawVal || rawVal === '0') continue
            data[crfKey] = rawVal
            if (!crfKey.startsWith('_')) detected.push(crfKey)
          }

          results.push({ patient_name: patientName, patient_sr_no: srNo, data, _detected: detected })
        }

        resolve(results)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsArrayBuffer(file)
  })
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Study { id: string; study_code: string; study_title: string }

export default function UploadMasterChartPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [study, setStudy] = useState<Study | null>(null)
  const [parsed, setParsed] = useState<ParsedRow[] | null>(null)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getStudyForUser().then((s) => setStudy(s))
  }, [])

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setParsed(null)
    try {
      const rows = await parseExcel(file)
      if (rows.length === 0) {
        setError('No patient rows detected. Make sure the file has Name of Patient in column headers.')
        return
      }
      setParsed(rows)
    } catch (err) {
      setError(String(err))
    }
  }

  function handleSave() {
    if (!parsed || !study) return
    startTransition(async () => {
      const rows = parsed.map((r) => ({
        patient_name: r.patient_name,
        patient_sr_no: r.patient_sr_no,
        data: r.data,
      }))
      const result = await saveExcelUploads(study.id, rows)
      if ('error' in result) {
        setError(result.error)
      } else {
        setSaved(true)
        setTimeout(() => router.push('/master-chart'), 1500)
      }
    })
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/master-chart" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Upload Master Chart</h1>
          <p className="text-sm text-slate-500">
            Upload your Excel master chart — values will auto-suggest when filling CRFs
          </p>
        </div>
      </div>

      {study && (
        <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm text-blue-700">
          Study: <span className="font-mono font-bold">{study.study_code}</span> — {study.study_title}
        </div>
      )}

      {/* Upload zone */}
      {!parsed && (
        <div
          className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 py-16 transition-colors hover:border-blue-400 hover:bg-blue-50"
          onClick={() => fileRef.current?.click()}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
            <FileSpreadsheet size={28} className="text-green-600" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-slate-700">Click to select your Excel master chart</p>
            <p className="mt-1 text-sm text-slate-400">.xlsx file with standard 2-row header format</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFile}
          />
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Preview */}
      {parsed && !saved && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800">{parsed.length} patients detected</p>
              <p className="text-sm text-slate-500">
                Fields auto-mapped: labs, outcome scores, grading table values
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setParsed(null); if (fileRef.current) fileRef.current.value = '' }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Change File
              </button>
              <button
                onClick={handleSave}
                disabled={isPending || !study}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {isPending ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                Save to System
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Sr.</th>
                  <th className="px-4 py-3 text-left font-medium">Patient Name</th>
                  <th className="px-4 py-3 text-center font-medium text-purple-600">Hb BT</th>
                  <th className="px-4 py-3 text-center font-medium text-purple-600">IgE BT</th>
                  <th className="px-4 py-3 text-center font-medium text-purple-600">AEC BT</th>
                  <th className="px-4 py-3 text-center font-medium text-orange-600">EASI Day 0</th>
                  <th className="px-4 py-3 text-center font-medium text-orange-600">EASI Day 90</th>
                  <th className="px-4 py-3 text-center font-medium text-blue-600">DLQI BT</th>
                  <th className="px-4 py-3 text-center font-medium text-slate-500">Fields found</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsed.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 text-slate-400">{r.patient_sr_no}</td>
                    <td className="px-4 py-2.5 font-medium text-slate-800">{r.patient_name}</td>
                    <td className="px-4 py-2.5 text-center font-mono">{r.data.hb_bt ?? '—'}</td>
                    <td className="px-4 py-2.5 text-center font-mono">{r.data.sr_ige_bt ?? '—'}</td>
                    <td className="px-4 py-2.5 text-center font-mono">{r.data.aec_bt ?? '—'}</td>
                    <td className="px-4 py-2.5 text-center font-mono">
                      {r.data['grading_table__easi_score__baseline_(0)'] ?? '—'}
                    </td>
                    <td className="px-4 py-2.5 text-center font-mono">
                      {r.data['grading_table__easi_score__day_90'] ?? '—'}
                    </td>
                    <td className="px-4 py-2.5 text-center font-mono">{r.data.dlqi_total_bt ?? '—'}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className="rounded-full bg-green-50 px-2 py-0.5 font-medium text-green-700">
                        {r._detected.length} fields
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
            <p className="font-semibold">After saving:</p>
            <ul className="mt-1.5 list-inside list-disc space-y-0.5 text-xs">
              <li>Open any patient&apos;s CRF — lab values and grading scores will appear as blue suggestions</li>
              <li>Press <kbd className="rounded border border-amber-300 bg-amber-100 px-1 py-0.5 font-mono text-[10px]">Tab</kbd> to accept a suggestion, or just type your own value</li>
              <li>Existing CRF entries are never overwritten automatically</li>
            </ul>
          </div>
        </div>
      )}

      {saved && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <CheckCircle2 size={48} className="text-green-500" />
          <p className="text-lg font-semibold text-slate-800">Saved successfully!</p>
          <p className="text-sm text-slate-500">Redirecting to master chart…</p>
        </div>
      )}

      {/* How it works */}
      {!parsed && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">What gets detected automatically</h2>
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 sm:grid-cols-3">
            {[
              { group: 'Labs', color: 'bg-purple-50 text-purple-700', items: 'Hb, TLC, Sr. IgE, AEC, Blood Urea, Sr. Uric Acid, Sr. Creatinine, SGOT, SGPT, FBS — both BT and AT' },
              { group: 'Outcome Scores', color: 'bg-orange-50 text-orange-700', items: 'EASI Score, DLQI, vIGA-AD, Itch-NRS — all time points (Day 0–90)' },
              { group: 'Symptom Grading', color: 'bg-blue-50 text-blue-700', items: 'Kandu, Srava, Rukshata, Pidikotpatti, Syavata, Ruja, Rajyo — all 7 time points' },
            ].map((g) => (
              <div key={g.group} className="rounded-lg border border-slate-100 p-3">
                <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${g.color} mb-2`}>{g.group}</span>
                <p className="leading-relaxed">{g.items}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Your Excel file must have the standard 2-row header format (main header in row 1, BT/AT or Day labels in row 2).
          </p>
        </div>
      )}
    </div>
  )
}
