/**
 * CRF validation helpers shared by the client (live indicators) and the
 * server (hard block on Submit-for-Review).
 */
import { CRF_REGISTRY } from './registry'

export interface MissingField {
  sectionKey: string
  section: string
  key: string
  label: string
}

/** Required input fields that are empty, respecting conditional (dependsOn) visibility. */
export function findMissingRequired(studyCode: string, values: Record<string, string>): MissingField[] {
  const t = CRF_REGISTRY[studyCode]
  if (!t) return []
  const missing: MissingField[] = []
  for (const sec of t.sections) {
    for (const f of sec.fields) {
      if (!f.required) continue
      if (f.type === 'heading' || f.type === 'divider' || f.type === 'assessment_grid' || f.type === 'investigation_table') continue
      if (f.dependsOn && values[f.dependsOn.key] !== f.dependsOn.value) continue
      const v = values[f.key]
      if (v === undefined || v === null || String(v).trim() === '') {
        missing.push({ sectionKey: sec.key, section: sec.title, key: f.key, label: f.label })
      }
    }
  }
  return missing
}

/** Count of missing required fields per section key. */
export function missingRequiredBySection(studyCode: string, values: Record<string, string>): Record<string, number> {
  const out: Record<string, number> = {}
  for (const m of findMissingRequired(studyCode, values)) {
    out[m.sectionKey] = (out[m.sectionKey] ?? 0) + 1
  }
  return out
}
