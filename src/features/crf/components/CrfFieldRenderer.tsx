'use client'

import { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/utils'
import type { CrfField } from '../types'

// ── Calculation helpers ──────────────────────────────────────────────────────

function toKey(name: string) {
  return name.replace(/\s+/g, '_').toLowerCase()
}

// Plausibility ranges for physiological fields whose units are consistent across
// all study CRFs. Soft warning only — never blocks saving.
const FIELD_RANGES: Record<string, { min: number; max: number }> = {
  pulse_rate: { min: 20, max: 250 },
  respiratory_rate: { min: 5, max: 80 },
  bp_systolic: { min: 50, max: 300 },
  bp_diastolic: { min: 30, max: 200 },
}

function rangeWarning(key: string, raw: string): string | null {
  const r = FIELD_RANGES[key]
  if (!r || raw === '' || raw == null) return null
  const n = parseFloat(raw)
  if (isNaN(n)) return null
  if (n < r.min || n > r.max) return `Out of expected range (${r.min}–${r.max})`
  return null
}

/** Parse a "0–N" / "0-N" score ceiling from a grid row label, if present. */
function parseScoreMax(label: string): number | null {
  const m = label.match(/0\s*[–-]\s*(\d+)/)
  return m && m[1] ? parseInt(m[1], 10) : null
}

// Arrow-key / Enter navigation between assessment-grid cells.
// Up/Down (and Enter) move vertically; Left/Right move horizontally only when
// the caret is at the edge of the cell so in-cell editing still works.
function handleGridKey(e: React.KeyboardEvent<HTMLInputElement>, gridKey: string) {
  const el = e.currentTarget
  const r = Number(el.dataset.row)
  const c = Number(el.dataset.col)
  if (Number.isNaN(r) || Number.isNaN(c)) return

  let tr = r
  let tc = c
  switch (e.key) {
    case 'ArrowUp': tr = r - 1; break
    case 'ArrowDown':
    case 'Enter': tr = r + 1; break
    case 'ArrowLeft':
      if (el.selectionStart !== 0 || el.selectionEnd !== 0) return
      tc = c - 1; break
    case 'ArrowRight':
      if (el.selectionStart !== el.value.length || el.selectionEnd !== el.value.length) return
      tc = c + 1; break
    default: return
  }

  const sel = `input[data-grid="${(window.CSS && CSS.escape) ? CSS.escape(gridKey) : gridKey}"][data-row="${tr}"][data-col="${tc}"]`
  const next = document.querySelector<HTMLInputElement>(sel)
  if (next) {
    e.preventDefault()
    next.focus()
    next.select()
  }
}

function computeCalcDate(field: CrfField, allValues: Record<string, string>): string | null {
  if (field.formulaId === 'date_plus_days') {
    const raw = allValues['date_induction'] ?? ''
    const days = parseInt(allValues['study_duration_days'] ?? '') || field.formulaDays
    if (!raw || !days) return null
    const d = new Date(raw)
    if (isNaN(d.getTime())) return null
    d.setDate(d.getDate() + days)
    return d.toISOString().split('T')[0] ?? null
  }
  return null
}

function computeCalcValue(field: CrfField, allValues: Record<string, string>): number | null {
  if (field.sumKeys) {
    const keys: string[] = field.sumKeys
    const vals = keys.map((k) => parseFloat(allValues[k] ?? '') || 0)
    if (vals.every((v) => v === 0) && keys.every((k) => !allValues[k])) return null
    return Math.round(vals.reduce((a, b) => a + b, 0) * 10) / 10
  }

  if (field.formulaId === 'bmi') {
    const h = parseFloat(allValues['height'] ?? '')
    const w = parseFloat(allValues['weight'] ?? '')
    if (!h || !w || isNaN(h) || isNaN(w)) return null
    const hm = h / 100 // height entered in cm, convert to m
    return Math.round((w / (hm * hm)) * 10) / 10
  }

  if (field.formulaId?.startsWith('easi_')) {
    // formulaId pattern: 'easi_<suffix>' → grid key: 'easi_grid_<suffix>'
    // e.g. easi_bt → easi_grid_bt, easi_d15 → easi_grid_d15, easi_at → easi_grid_at
    const gridKey = 'easi_grid_' + field.formulaId.slice('easi_'.length)
    const regions: { row: string; m: number }[] = [
      { row: 'Head / Neck (×0.1)', m: 0.1 },
      { row: 'Upper Limbs (×0.2)', m: 0.2 },
      { row: 'Trunk (×0.3)', m: 0.3 },
      { row: 'Lower Limbs (×0.4)', m: 0.4 },
    ]
    const colA = 'Area (A) 0–6'
    const colE = 'Erythema (E) 0–3'
    const colI = 'Edema / Papulation (I) 0–3'
    const colEx = 'Excoriation (Ex) 0–3'
    const colL = 'Lichenification (L) 0–3'

    let hasAnyValue = false
    let total = 0
    for (const { row, m } of regions) {
      const rk = `${gridKey}__${toKey(row)}`
      const A = parseFloat(allValues[`${rk}__${toKey(colA)}`] ?? '') || 0
      const E = parseFloat(allValues[`${rk}__${toKey(colE)}`] ?? '') || 0
      const I = parseFloat(allValues[`${rk}__${toKey(colI)}`] ?? '') || 0
      const Ex = parseFloat(allValues[`${rk}__${toKey(colEx)}`] ?? '') || 0
      const L = parseFloat(allValues[`${rk}__${toKey(colL)}`] ?? '') || 0
      if (A || E || I || Ex || L) hasAnyValue = true
      total += A * (E + I + Ex + L) * m
    }
    if (!hasAnyValue) return null
    return Math.round(total * 10) / 10
  }

  return null
}

// Separate component so useEffect is always called (not conditional)
function CalculatedField({
  field, allValues, value, onChange,
}: {
  field: CrfField
  allValues: Record<string, string>
  value: string
  onChange: (key: string, value: string) => void
}) {
  const computedDate = computeCalcDate(field, allValues)
  const computedNum = computedDate === null ? computeCalcValue(field, allValues) : null
  const displayVal = computedDate ?? (computedNum !== null ? String(computedNum) : '')

  useEffect(() => {
    if (displayVal !== value) {
      onChange(field.key, displayVal)
    }
  }, [displayVal]) // eslint-disable-line react-hooks/exhaustive-deps

  const interpretEASI = (v: number) => {
    if (v === 0) return 'Clear'
    if (v <= 1) return 'Almost Clear'
    if (v <= 7) return 'Mild'
    if (v <= 21) return 'Moderate'
    if (v <= 50) return 'Severe'
    return 'Very Severe'
  }

  const interpretDLQI = (v: number) => {
    if (v <= 1) return 'No effect on life'
    if (v <= 5) return 'Small effect'
    if (v <= 10) return 'Moderate effect'
    if (v <= 20) return 'Very large effect'
    return 'Extremely large effect'
  }

  const interpretBMI = (v: number) => {
    if (v < 18.5) return 'Underweight'
    if (v < 23) return 'Normal'
    if (v < 25) return 'Overweight'
    if (v < 30) return 'Obese I'
    return 'Obese II+'
  }

  let interpretation = ''
  if (computedNum !== null) {
    if (field.formulaId?.startsWith('easi')) interpretation = interpretEASI(computedNum)
    if (field.formulaId === 'bmi') interpretation = interpretBMI(computedNum)
    if (field.sumKeys?.some((k) => k.startsWith('dlqi_q'))) interpretation = interpretDLQI(computedNum)
  }

  const hasValue = displayVal !== ''

  // Format date for human-readable display (keep YYYY-MM-DD as the stored value)
  const displayLabel = computedDate
    ? new Date(computedDate + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : computedNum !== null ? String(computedNum) : '—'

  return (
    <div className="sm:col-span-2 flex flex-col gap-1.5">
      <Label className="text-sm text-slate-700">{field.label}</Label>
      <div className={cn(
        'flex items-center gap-3 rounded-lg border px-4 py-3',
        hasValue ? 'border-green-200 bg-green-50' : 'border-slate-200 bg-slate-50',
      )}>
        <span className={cn(
          computedDate ? 'text-lg font-semibold' : 'text-2xl font-bold tabular-nums',
          hasValue ? 'text-green-700' : 'text-slate-300',
        )}>
          {displayLabel}
        </span>
        {hasValue && interpretation && (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
            {interpretation}
          </span>
        )}
        <span className="ml-auto text-xs text-slate-400">auto-calculated</span>
      </div>
      {field.hint && <p className="text-xs text-slate-400">{field.hint}</p>}
    </div>
  )
}

// ── Ghost-text suggestion input ───────────────────────────────────────────────
// Shows previous/Excel value as blue ghost text. Tab or click to accept.

function SuggestInput({
  id, value, suggestion, placeholder, onChange, type = 'text', className,
}: {
  id: string
  value: string
  suggestion?: string
  placeholder?: string
  onChange: (v: string) => void
  type?: string
  className?: string
}) {
  const showSuggestion = !!suggestion && !value

  return (
    <div className={cn('relative', className)}>
      {showSuggestion && (
        <div className="pointer-events-none absolute inset-0 flex items-center rounded-md px-3">
          <span className="truncate text-sm text-blue-300">{suggestion}</span>
          <kbd className="ml-auto shrink-0 rounded border border-blue-200 bg-blue-50 px-1 py-0.5 text-[10px] text-blue-300">Tab</kbd>
        </div>
      )}
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={showSuggestion ? undefined : placeholder}
        className={cn(showSuggestion && 'bg-transparent', type === 'number' && 'max-w-[180px]')}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Tab' && showSuggestion) {
            e.preventDefault()
            onChange(suggestion!)
          }
        }}
      />
    </div>
  )
}

interface CrfFieldRendererProps {
  field: CrfField
  value: string
  onChange: (key: string, value: string) => void
  allValues: Record<string, string>
  suggestion?: string
}

export function CrfFieldRenderer({ field, value, onChange, allValues, suggestion }: CrfFieldRendererProps) {
  // Conditional visibility
  if (field.dependsOn) {
    const depValue = allValues[field.dependsOn.key]
    if (depValue !== field.dependsOn.value) return null
  }

  if (field.type === 'calculated') {
    return (
      <CalculatedField
        field={field}
        allValues={allValues}
        value={value}
        onChange={onChange}
      />
    )
  }

  if (field.type === 'heading') {
    return (
      <div className="sm:col-span-2 mt-3 border-b border-slate-200 pb-1">
        <p className="text-sm font-semibold text-slate-700">{field.label}</p>
      </div>
    )
  }

  if (field.type === 'divider') {
    return <div className="sm:col-span-2 border-t border-slate-100" />
  }

  if (field.type === 'assessment_grid') {
    return (
      <div className="min-w-0 sm:col-span-2 overflow-x-auto">
        <p className="mb-2 text-sm font-medium text-slate-700">{field.label}</p>
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-200 px-2 py-1.5 text-left font-medium text-slate-600">
                Parameter
              </th>
              {field.columns?.map((col) => (
                <th
                  key={col}
                  className="border border-slate-200 px-2 py-1.5 text-center font-medium text-slate-600"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {field.rows?.map((row, ri) => {
              const rowKey = `${field.key}__${row.replace(/\s+/g, '_').toLowerCase()}`
              const scoreMax = parseScoreMax(row)
              return (
                <tr key={row} className="odd:bg-white even:bg-slate-50">
                  <td className="border border-slate-200 px-2 py-1.5 text-slate-700">{row}</td>
                  {field.columns?.map((col, ci) => {
                    const cellKey = `${rowKey}__${col.replace(/\s+/g, '_').toLowerCase()}`
                    const raw = allValues[cellKey] ?? ''
                    const n = raw === '' ? NaN : parseFloat(raw)
                    const outOfRange = scoreMax != null && !isNaN(n) && (n < 0 || n > scoreMax)
                    return (
                      <td key={col} className={cn('border border-slate-200 px-1 py-1', outOfRange && 'bg-red-50')}>
                        <Input
                          className={cn('h-7 border-0 bg-transparent p-0 text-center text-xs focus-visible:ring-0', outOfRange && 'text-red-600 font-semibold')}
                          value={raw}
                          onChange={(e) => onChange(cellKey, e.target.value)}
                          data-grid={field.key}
                          data-row={ri}
                          data-col={ci}
                          onKeyDown={(e) => handleGridKey(e, field.key)}
                          title={outOfRange ? `Expected 0–${scoreMax}` : undefined}
                        />
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  // Full-width fields: long-form inputs, long labels, and multi-option groups.
  const isLongLabel = field.label.length > 55
  const manyOpts = (field.options?.length ?? 0) > 3
  const fullWidth = field.type === 'textarea' || isLongLabel ||
    ((field.type === 'radio' || field.type === 'checkbox_group') && manyOpts)

  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', fullWidth && 'sm:col-span-2')}>
      <Label
        htmlFor={field.key}
        className={cn('text-sm leading-snug text-slate-700', field.required && "after:ml-0.5 after:text-red-500 after:content-['*']")}
      >
        {field.label}
        {field.unit && <span className="ml-1 text-xs font-normal text-slate-400">({field.unit})</span>}
      </Label>

      {field.type === 'text' && (
        <SuggestInput
          id={field.key}
          value={value}
          suggestion={suggestion}
          placeholder={field.placeholder}
          onChange={(v) => onChange(field.key, v)}
        />
      )}

      {field.type === 'number' && (
        <>
          <SuggestInput
            id={field.key}
            type="number"
            value={value}
            suggestion={suggestion}
            placeholder={field.placeholder}
            className="sm:max-w-[220px]"
            onChange={(v) => onChange(field.key, v)}
          />
          {rangeWarning(field.key, value) && (
            <p className="text-xs font-medium text-amber-600">{rangeWarning(field.key, value)}</p>
          )}
        </>
      )}

      {field.type === 'date' && (
        <Input
          id={field.key}
          type="date"
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="sm:max-w-[220px]"
        />
      )}

      {field.type === 'textarea' && (
        <div className="relative">
          {suggestion && !value && (
            <div className="pointer-events-none absolute left-3 top-2.5 right-8 text-sm text-blue-300 leading-relaxed">
              {suggestion}
            </div>
          )}
          <Textarea
            id={field.key}
            value={value}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={!suggestion ? field.placeholder : undefined}
            rows={3}
            className={cn(suggestion && !value && 'bg-transparent')}
            onKeyDown={(e) => {
              if (e.key === 'Tab' && suggestion && !value) {
                e.preventDefault()
                onChange(field.key, suggestion)
              }
            }}
          />
          {suggestion && !value && (
            <button
              type="button"
              onClick={() => onChange(field.key, suggestion)}
              className="mt-0.5 text-[11px] text-blue-400 hover:text-blue-600"
            >
              ↵ Use suggestion
            </button>
          )}
        </div>
      )}

      {field.type === 'select' && (
        <Select value={value ?? ''} onValueChange={(v) => onChange(field.key, v ?? '')}>
          <SelectTrigger id={field.key} className="sm:max-w-xs">
            <SelectValue placeholder="Select…" />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {field.type === 'radio' && (
        <RadioGroup
          value={value}
          onValueChange={(v) => onChange(field.key, v)}
          className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2"
        >
          {field.options?.map((opt) => (
            <div key={opt.value} className="flex min-w-0 items-start gap-2">
              <RadioGroupItem value={opt.value} id={`${field.key}_${opt.value}`} className="mt-0.5 shrink-0" />
              <Label htmlFor={`${field.key}_${opt.value}`} className="cursor-pointer font-normal leading-snug">
                {opt.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}

      {field.type === 'checkbox_group' && (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-x-6">
          {field.options?.map((opt) => {
            const checked = value ? value.split(',').includes(opt.value) : false
            return (
              <div key={opt.value} className="flex min-w-0 items-start gap-2">
                <Checkbox
                  id={`${field.key}_${opt.value}`}
                  checked={checked}
                  className="mt-0.5 shrink-0"
                  onCheckedChange={(c) => {
                    const current = value ? value.split(',').filter(Boolean) : []
                    const next = c
                      ? [...current, opt.value]
                      : current.filter((v) => v !== opt.value)
                    onChange(field.key, next.join(','))
                  }}
                />
                <Label htmlFor={`${field.key}_${opt.value}`} className="cursor-pointer font-normal leading-snug">
                  {opt.label}
                </Label>
              </div>
            )
          })}
        </div>
      )}

      {field.hint && <p className="text-xs text-slate-400">{field.hint}</p>}
    </div>
  )
}
