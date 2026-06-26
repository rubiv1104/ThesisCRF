/**
 * Shared, framework-agnostic CRF assembly.
 * Walks a registered CRF template + a flat values map (field_key → response)
 * into a normalised structure that both the print view (React) and the
 * Word export route (docx) render from. No React / no DOM here.
 *
 * Choice fields (radio / select / checkbox_group) carry ALL their options with
 * the chosen one(s) marked — so the export reads like a filled paper proforma,
 * not just a list of answers.
 */
import { CRF_REGISTRY } from '../registry'
import type { CrfField } from '../types'

export type ChoiceOption = { label: string; selected: boolean }

export type CrfBlock =
  | { kind: 'heading'; text: string }
  | { kind: 'field'; label: string; value: string }
  | { kind: 'choice'; label: string; options: ChoiceOption[] }
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
      const raw = values[field.key] ?? ''

      // Choice fields: keep all options, mark the selected one(s)
      if ((field.type === 'radio' || field.type === 'select') && field.options) {
        blocks.push({
          kind: 'choice',
          label,
          options: field.options.map((o) => ({ label: o.label, selected: o.value === raw })),
        })
        continue
      }
      if (field.type === 'checkbox_group' && field.options) {
        const chosen = raw.split(',').filter(Boolean)
        blocks.push({
          kind: 'choice',
          label,
          options: field.options.map((o) => ({ label: o.label, selected: chosen.includes(o.value) })),
        })
        continue
      }

      // Free-form fields (text / number / date / textarea / calculated)
      blocks.push({ kind: 'field', label, value: raw })
    }

    return { key: section.key, title: section.title, blocks }
  })

  return { studyCode: template.study_code, version: template.version, sections }
}
