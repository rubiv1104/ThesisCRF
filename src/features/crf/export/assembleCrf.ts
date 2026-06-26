/**
 * Shared, framework-agnostic CRF assembly.
 * Walks a registered CRF template + a flat values map (field_key → response)
 * into a normalised structure that both the print view (React) and the
 * Word export route (docx) render from. No React / no DOM here.
 */
import { CRF_REGISTRY } from '../registry'
import type { CrfField } from '../types'

export type CrfBlock =
  | { kind: 'heading'; text: string }
  | { kind: 'field'; label: string; value: string }
  | { kind: 'grid'; label: string; columns: string[]; rows: { header: string; cells: string[] }[] }

export interface CrfExportSection {
  key: string
  title: string
  blocks: CrfBlock[]
}

export interface CrfExportDoc {
  studyCode: string
  version: string
  sections: CrfExportSection[]
}

/** Mirror of the key-building used by CrfFieldRenderer for grid cells. */
function toKey(name: string): string {
  return name.replace(/\s+/g, '_').toLowerCase()
}

/** Resolve a field's stored value into a human-readable display value. */
function resolveValue(field: CrfField, values: Record<string, string>): string {
  const raw = values[field.key] ?? ''
  if (!raw) return ''

  if ((field.type === 'radio' || field.type === 'select') && field.options) {
    return field.options.find((o) => o.value === raw)?.label ?? raw
  }
  if (field.type === 'checkbox_group' && field.options) {
    const chosen = raw.split(',').filter(Boolean)
    const labels = field.options.filter((o) => chosen.includes(o.value)).map((o) => o.label)
    return labels.length ? labels.join(', ') : raw
  }
  return raw
}

/**
 * Build the export document for a study + values map.
 * Returns null if the study has no registered template.
 */
export function assembleCrf(studyCode: string, values: Record<string, string>): CrfExportDoc | null {
  const template = CRF_REGISTRY[studyCode]
  if (!template) return null

  const sections: CrfExportSection[] = template.sections.map((section) => {
    const blocks: CrfBlock[] = []

    for (const field of section.fields) {
      if (field.type === 'divider') continue

      if (field.type === 'heading') {
        blocks.push({ kind: 'heading', text: field.label })
        continue
      }

      if (field.type === 'assessment_grid' || field.type === 'investigation_table') {
        const columns = field.columns ?? []
        const rows = (field.rows ?? []).map((row) => {
          const rowKey = `${field.key}__${toKey(row)}`
          const cells = columns.map((col) => values[`${rowKey}__${toKey(col)}`] ?? '')
          return { header: row, cells }
        })
        blocks.push({ kind: 'grid', label: field.label, columns, rows })
        continue
      }

      // Respect conditional visibility used in the live form
      if (field.dependsOn && values[field.dependsOn.key] !== field.dependsOn.value) continue

      const label = field.label + (field.unit ? ` (${field.unit})` : '')
      blocks.push({ kind: 'field', label, value: resolveValue(field, values) })
    }

    return { key: section.key, title: section.title, blocks }
  })

  return { studyCode: template.study_code, version: template.version, sections }
}
