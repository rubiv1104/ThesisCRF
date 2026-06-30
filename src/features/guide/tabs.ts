/**
 * GUIDE QUICK-REVIEW — section categorisation + value formatting
 * ==============================================================
 * Maps a study's CRF sections into a small, fixed set of review tabs so the
 * guide reviews one short scroll at a time instead of the whole form.
 * Pure / client-safe (no Supabase, no server imports).
 */
import type { CrfField, CrfSectionDef, CrfTemplateDef } from '@/features/crf/types'

export type ReviewTabId =
  | 'history'
  | 'examination'
  | 'investigations'
  | 'assessments'
  | 'treatment'
  | 'followup'
  | 'other'

export const REVIEW_TABS: { id: ReviewTabId; label: string }[] = [
  { id: 'history', label: 'History' },
  { id: 'examination', label: 'Examination' },
  { id: 'investigations', label: 'Investigations' },
  { id: 'assessments', label: 'Assessments' },
  { id: 'treatment', label: 'Treatment' },
  { id: 'followup', label: 'Follow-up' },
  { id: 'other', label: 'Other' },
]

/** Classify a CRF section into a review tab using key + title keywords. */
export function categorizeSection(section: CrfSectionDef): ReviewTabId {
  const k = `${section.key} ${section.title}`.toLowerCase()

  if (/(investigation|laborator|\blab\b|\blft\b|\bcbc\b|\busg\b|\becg\b|haemat|biochem)/.test(k)) return 'investigations'
  if (/(easi|dlqi|sf-?12|scoring|grading|disease_assessment|disease assessment|assessment|outcome|severity|score|cldq|fibroscan)/.test(k)) return 'assessments'
  if (/(treatment|drug|medicin|medication|therap|interven|aushadha|posology|dose|regimen|pathya|adr|adverse)/.test(k)) return 'treatment'
  if (/(follow|visit|completion|withdraw)/.test(k)) return 'followup'
  if (/(exam|pariksha|vital|general|local|systemic|inspection|palpation|nadi|ashtasthana|dashavidha)/.test(k)) return 'examination'
  if (/(histor|demograph|eligib|study_info|study info|consent|complaint|chief|present|past|family|personal|habit|enrol|registration|identif)/.test(k)) return 'history'
  return 'other'
}

/** Human-readable value for a stored response (resolves radio/select/checkbox labels). */
export function formatFieldValue(field: CrfField, raw: string | undefined): string {
  if (raw == null || raw === '') return ''
  if ((field.type === 'radio' || field.type === 'select') && field.options) {
    return field.options.find((o) => o.value === raw)?.label ?? raw
  }
  if (field.type === 'checkbox_group' && field.options) {
    return raw
      .split(',')
      .map((v) => v.trim())
      .map((v) => field.options!.find((o) => o.value === v)?.label ?? v)
      .filter(Boolean)
      .join(', ')
  }
  return raw
}

export interface ReviewRow {
  key: string
  label: string
  value: string
  /** original field type — lets the UI flag empty/important rows */
  type: string
}

export interface ReviewSection {
  key: string
  title: string
  rows: ReviewRow[]
}

export type ReviewTabContent = Record<ReviewTabId, ReviewSection[]>

/**
 * Build per-tab read rows from a template + flat values map.
 * Grids, headings and dividers are excluded (grids are summarised separately
 * via assessment_results / uploaded documents). Only fields with a saved value
 * become rows, so the guide sees recorded data, not an empty form.
 */
export function buildReviewTabs(
  template: CrfTemplateDef | undefined,
  values: Record<string, string>,
): ReviewTabContent {
  const out: ReviewTabContent = {
    history: [], examination: [], investigations: [],
    assessments: [], treatment: [], followup: [], other: [],
  }
  if (!template) return out

  for (const section of template.sections) {
    const tab = categorizeSection(section)
    const rows: ReviewRow[] = []
    for (const field of section.fields) {
      if (field.type === 'heading' || field.type === 'divider') continue
      if (field.type === 'assessment_grid' || field.type === 'investigation_table') continue
      const raw = values[field.key]
      if (raw == null || raw === '') continue
      rows.push({ key: field.key, label: field.label, value: formatFieldValue(field, raw), type: field.type })
    }
    if (rows.length > 0) out[tab].push({ key: section.key, title: section.title, rows })
  }
  return out
}

/** Section options for the comment / correction picker (template order). */
export function sectionOptions(template: CrfTemplateDef | undefined): { key: string; title: string }[] {
  if (!template) return []
  return template.sections
    .filter((s) => s.fields.some((f) => f.type !== 'heading' && f.type !== 'divider'))
    .map((s) => ({ key: s.key, title: s.title }))
}
