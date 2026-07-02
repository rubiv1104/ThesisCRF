/**
 * ASSESSMENT → CRF SYNC
 * =====================
 * When a calculator (EASI, DLQI, UAS7, UCT …) is scored in the Assessment
 * panel, its total is written into the corresponding score row/field of the
 * study's CRF — so the proforma's own score cells fill automatically instead
 * of being re-typed. Mapping is per study + scale code; a scale/visit with no
 * mapped cell simply syncs nothing.
 */
import { CRF_REGISTRY } from '@/features/crf/registry'

function toKey(name: string) {
  return name.replace(/\s+/g, '_').toLowerCase()
}
/** grid cell key exactly as CrfFieldRenderer / assembleCrf build it */
function cell(gridKey: string, row: string, col: string) {
  return `${gridKey}__${toKey(row)}__${toKey(col)}`
}

/** studyCode → assessmentCode → (visitLabel) → CRF response keys to fill */
const SYNC_MAP: Record<string, Record<string, (visit: string) => string[]>> = {
  ECZ2026: {
    EASI: (v) => {
      const col = v === 'Day 0' ? 'Baseline (0)' : v // grid columns: Baseline (0), Day 15 … Day 90
      return [cell('grading_table', 'EASI Score', col)]
    },
    DLQI: (v) => (v === 'BT' ? ['dlqi_bt'] : v === 'AT' ? ['dlqi_at'] : []),
  },
  SHP2026: {
    DLQI: (v) =>
      v === 'BT' ? [cell('bt_at_grid', 'Dermatology Life Quality Index (DLQI)', 'BT')]
      : v === 'AT' ? [cell('bt_at_grid', 'Dermatology Life Quality Index (DLQI)', 'AT')]
      : [],
    UAS7: (v) => {
      // scale visits BT/D7/D14/D21/D45/D60/D75/AT → grid columns Baseline/Day 7/…/Day 90
      const colMap: Record<string, string> = {
        BT: 'Baseline', D7: 'Day 7', D14: 'Day 14', D21: 'Day 21',
        D45: 'Day 43', D60: 'Day 58', D75: 'Day 73', AT: 'Day 90',
      }
      const keys: string[] = []
      const col = colMap[v]
      if (col) keys.push(cell('symptom_grid', 'UAS Score', col))
      if (v === 'BT') keys.push(cell('bt_at_grid', 'UAS7 Score', 'BT'))
      if (v === 'AT') keys.push(cell('bt_at_grid', 'UAS7 Score', 'AT'))
      return keys
    },
    UCT: (v) => {
      const keys: string[] = []
      if (v === 'BT') keys.push(cell('symptom_grid', 'UCT (Urticaria Control Test)', 'Baseline'), cell('bt_at_grid', 'UCT Score', 'BT'))
      if (v === 'AT') keys.push(cell('symptom_grid', 'UCT (Urticaria Control Test)', 'Day 90'), cell('bt_at_grid', 'UCT Score', 'AT'))
      return keys
    },
  },
}

/** Section owning a response key (direct field or grid cell prefix). */
function findSectionKey(studyCode: string, responseKey: string): { sectionKey: string; label: string; type: string } | null {
  const template = CRF_REGISTRY[studyCode]
  if (!template) return null
  for (const section of template.sections) {
    for (const field of section.fields) {
      if (field.key === responseKey) return { sectionKey: section.key, label: field.label, type: field.type }
      if (responseKey.startsWith(field.key + '__')) return { sectionKey: section.key, label: responseKey, type: field.type }
    }
  }
  return null
}

/**
 * Write a saved assessment total into its mapped CRF cell(s).
 * Best-effort: returns the keys written (for live UI update); never throws.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function syncAssessmentToCrf(supabase: any, opts: {
  patientId: string
  studyCode: string
  assessmentCode: string
  visit: string
  total: number
}): Promise<{ key: string; value: string }[]> {
  try {
    const keys = SYNC_MAP[opts.studyCode]?.[opts.assessmentCode]?.(opts.visit) ?? []
    if (keys.length === 0) return []

    const { data: crf } = await supabase.from('crfs').select('id').eq('patient_id', opts.patientId).maybeSingle()
    if (!crf?.id) return []

    const value = String(opts.total)
    const written: { key: string; value: string }[] = []
    const rows: Record<string, unknown>[] = []

    for (const key of keys) {
      const meta = findSectionKey(opts.studyCode, key)
      if (!meta) continue
      const { data: section } = await supabase
        .from('crf_sections').select('id')
        .eq('crf_id', crf.id).eq('section_name', meta.sectionKey).maybeSingle()
      if (!section?.id) continue
      rows.push({ section_id: section.id, field_key: key, field_label: meta.label, field_type: meta.type, response: value, visit_number: 0 })
      written.push({ key, value })
    }

    if (rows.length > 0) {
      await supabase.from('crf_responses').upsert(rows, { onConflict: 'section_id,field_key,visit_number' })
      // Live-update any mounted CRF form on the same page
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('crf-external-update', { detail: written }))
      }
    }
    return written
  } catch {
    return [] // sync is a convenience — never block the assessment save
  }
}
