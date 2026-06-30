/**
 * Derives Master Chart columns automatically from a study's CRF template.
 * Each study therefore gets a master chart that matches its own CRF — not a
 * shared/hardcoded set. Choice fields resolve to their option labels; grids
 * expand to one column per cell (row × visit).
 */
import { CRF_REGISTRY } from './registry'
import { assessmentsForStudy } from '../assessments/library'

export interface MasterColumn {
  key: string
  label: string
  section: string
  kind: 'text' | 'number' | 'choice' | 'grid'
  options?: { value: string; label: string }[]
}

function toKey(s: string): string {
  return s.replace(/\s+/g, '_').toLowerCase()
}

/** All available columns for a study, in CRF order, grouped by section title. */
export function buildMasterColumns(studyCode: string): MasterColumn[] {
  const t = CRF_REGISTRY[studyCode]
  if (!t) return []
  const cols: MasterColumn[] = []

  for (const sec of t.sections) {
    for (const f of sec.fields) {
      if (f.type === 'heading' || f.type === 'divider' || f.type === 'calculated') {
        if (f.type === 'calculated') {
          cols.push({ key: f.key, label: f.label, section: sec.title, kind: 'number' })
        }
        continue
      }
      if (f.type === 'assessment_grid' || f.type === 'investigation_table') {
        for (const row of f.rows ?? []) {
          for (const c of f.columns ?? []) {
            cols.push({
              key: `${f.key}__${toKey(row)}__${toKey(c)}`,
              label: `${row} · ${c}`,
              section: `${sec.title} — ${f.label}`,
              kind: 'grid',
            })
          }
        }
        continue
      }
      const kind: MasterColumn['kind'] =
        f.type === 'radio' || f.type === 'select' || f.type === 'checkbox_group' ? 'choice'
        : f.type === 'number' ? 'number'
        : 'text'
      cols.push({ key: f.key, label: f.label + (f.unit ? ` (${f.unit})` : ''), section: sec.title, kind, options: f.options })
    }
  }

  // Assessment Engine scores (stored separately from the CRF templates).
  for (const a of assessmentsForStudy(studyCode)) {
    for (const v of a.visits) {
      cols.push({ key: assessmentColumnKey(a.code, v), label: `${a.short} ${v}`, section: 'Assessment Scores', kind: 'number' })
    }
  }

  return cols
}

/** Synthetic master-chart key for an assessment score at a visit. */
export function assessmentColumnKey(code: string, visit: string): string {
  return `assess__${code}__${visit}`
}

/** Resolve a patient's stored value for a column to a display string. */
export function resolveCell(col: MasterColumn, fields: Record<string, string>): string {
  const raw = fields[col.key] ?? ''
  if (!raw) return ''
  if (col.kind === 'choice' && col.options) {
    if (raw.includes(',')) {
      const set = raw.split(',').filter(Boolean)
      return col.options.filter((o) => set.includes(o.value)).map((o) => o.label).join(', ') || raw
    }
    return col.options.find((o) => o.value === raw)?.label ?? raw
  }
  return raw
}

/** Sensible default visible columns: skip grid cells (often many/empty early). */
export function defaultVisibleKeys(cols: MasterColumn[]): string[] {
  return cols.filter((c) => c.kind !== 'grid').map((c) => c.key)
}
