'use client'

/**
 * PROFORMA VIEW — a document-faithful renderer that displays AND fills the CRF
 * as one continuous paper-like sheet (numbered sections, inline tables,
 * ☑/☐ checkboxes, dotted-line blanks, large writing areas), mirroring the
 * original departmental proforma. Schema-driven, so it works for every current
 * and future study without per-study layout code. Shares the same values map
 * and onChange as the fast form, so data + saving are identical.
 */
import { computeCalcValue, computeCalcDate } from './CrfFieldRenderer'
import type { CrfField, CrfSectionDef } from '../types'

function toKey(name: string) {
  return name.replace(/\s+/g, '_').toLowerCase()
}

interface Props {
  sections: CrfSectionDef[]
  values: Record<string, string>
  onChange: (key: string, value: string) => void
  visitSectionKeys?: string[]
  fieldFilter?: (sectionKey: string, fieldKey: string, fieldType: string) => boolean
  readOnly?: boolean
}

export function CrfProformaView({ sections, values, onChange, visitSectionKeys, fieldFilter, readOnly = false }: Props) {
  const visible = visitSectionKeys ? sections.filter((s) => visitSectionKeys.includes(s.key)) : sections

  return (
    <div className="crf-proforma mx-auto max-w-[820px] bg-white px-5 py-6 text-slate-900 shadow-sm sm:px-10 sm:py-8">
      {visible.map((section, si) => {
        const fields = fieldFilter
          ? section.fields.filter((f) => fieldFilter(section.key, f.key, f.type))
          : section.fields
        if (fields.length === 0) return null
        return (
          <section key={section.key} className="crf-proforma-section mb-6">
            <h2 className="mb-3 border-b-2 border-slate-800 pb-1 text-sm font-bold uppercase tracking-wide text-slate-900">
              {si + 1}. {section.title.replace(/^\d+\.\s*/, '')}
            </h2>
            <div className="space-y-2">
              {fields.map((f) => (
                <ProformaField key={f.key} field={f} values={values} onChange={onChange} readOnly={readOnly} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function ProformaField({ field, values, onChange, readOnly }: {
  field: CrfField
  values: Record<string, string>
  onChange: (key: string, value: string) => void
  readOnly: boolean
}) {
  // Conditional visibility (same rule as the form)
  if (field.dependsOn && values[field.dependsOn.key] !== field.dependsOn.value) return null

  const raw = values[field.key] ?? ''
  const labelText = field.label + (field.unit ? ` (${field.unit})` : '')

  if (field.type === 'divider') return <hr className="my-2 border-slate-200" />

  if (field.type === 'heading') {
    return <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-600">{field.label}</p>
  }

  // ── Tables (assessment grid / investigation table) ──
  if (field.type === 'assessment_grid' || field.type === 'investigation_table') {
    const columns = field.columns ?? []
    return (
      <div className="my-2">
        {field.label && <p className="mb-1 text-sm font-medium text-slate-700">{field.label}</p>}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-400 px-2 py-1 text-left font-semibold text-slate-700">Parameter</th>
                {columns.map((c) => (
                  <th key={c} className="border border-slate-400 px-2 py-1 text-center font-semibold text-slate-700">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(field.rows ?? []).map((row) => {
                const rk = `${field.key}__${toKey(row)}`
                return (
                  <tr key={row}>
                    <td className="border border-slate-400 px-2 py-1 text-slate-800">{row}</td>
                    {columns.map((col) => {
                      const ck = `${rk}__${toKey(col)}`
                      return (
                        <td key={col} className="border border-slate-400 p-0">
                          <input
                            value={values[ck] ?? ''}
                            disabled={readOnly}
                            onChange={(e) => onChange(ck, e.target.value)}
                            className="h-7 w-full min-w-[54px] border-0 bg-transparent px-1 text-center text-xs focus:bg-amber-50 focus:outline-none disabled:cursor-default"
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
      </div>
    )
  }

  // ── Calculated (read-only computed value) ──
  if (field.type === 'calculated') {
    const d = computeCalcDate(field, values)
    const n = d === null ? computeCalcValue(field, values) : null
    const display = d ?? (n !== null ? String(n) : '—')
    return (
      <div className="flex flex-wrap items-baseline gap-2 py-0.5 text-sm">
        <span className="text-slate-700">{labelText}:</span>
        <span className="font-semibold text-slate-900">{display}</span>
        <span className="text-[11px] text-slate-400">(auto)</span>
      </div>
    )
  }

  // ── Radio / Select → inline ☑/☐ options, original order ──
  if ((field.type === 'radio' || field.type === 'select') && field.options) {
    return (
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-0.5 text-sm">
        <span className="text-slate-700">{labelText}:</span>
        {field.options.map((o) => {
          const sel = raw === o.value
          return (
            <button
              key={o.value}
              type="button"
              disabled={readOnly}
              onClick={() => onChange(field.key, sel ? '' : o.value)}
              className={`text-left ${sel ? 'font-semibold text-slate-900' : 'text-slate-500'} ${readOnly ? 'cursor-default' : 'hover:text-slate-900'}`}
            >
              {sel ? '☑' : '☐'} {o.label}
            </button>
          )
        })}
      </div>
    )
  }

  // ── Checkbox group → inline ☑/☐, multi-select ──
  if (field.type === 'checkbox_group' && field.options) {
    const chosen = raw.split(',').filter(Boolean)
    const toggle = (v: string) => {
      const next = chosen.includes(v) ? chosen.filter((x) => x !== v) : [...chosen, v]
      onChange(field.key, next.join(','))
    }
    return (
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-0.5 text-sm">
        <span className="text-slate-700">{labelText}:</span>
        {field.options.map((o) => {
          const sel = chosen.includes(o.value)
          return (
            <button
              key={o.value}
              type="button"
              disabled={readOnly}
              onClick={() => toggle(o.value)}
              className={`text-left ${sel ? 'font-semibold text-slate-900' : 'text-slate-500'} ${readOnly ? 'cursor-default' : 'hover:text-slate-900'}`}
            >
              {sel ? '☑' : '☐'} {o.label}
            </button>
          )
        })}
      </div>
    )
  }

  // ── Large writing area ──
  if (field.type === 'textarea') {
    return (
      <div className="py-1">
        <p className="mb-1 text-sm text-slate-700">{labelText}:</p>
        <textarea
          value={raw}
          disabled={readOnly}
          onChange={(e) => onChange(field.key, e.target.value)}
          rows={4}
          className="min-h-[90px] w-full resize-y rounded-sm border border-slate-300 bg-transparent px-2 py-1.5 text-sm focus:border-slate-800 focus:outline-none disabled:cursor-default"
        />
      </div>
    )
  }

  // ── Short fields (text / number / date) → underlined blank ──
  const inputType = field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'
  return (
    <div className="flex flex-wrap items-baseline gap-2 py-0.5 text-sm">
      <label className="text-slate-700">{labelText}:</label>
      <input
        type={inputType}
        value={raw}
        disabled={readOnly}
        placeholder={field.placeholder}
        onChange={(e) => onChange(field.key, e.target.value)}
        className={`${field.type === 'text' ? 'min-w-[160px] flex-1' : 'min-w-[120px]'} border-0 border-b border-slate-400 bg-transparent px-1 pb-0.5 text-sm text-slate-900 placeholder:text-slate-300 focus:border-slate-800 focus:outline-none disabled:cursor-default`}
      />
    </div>
  )
}
