/**
 * Visit-schedule helpers for the "follow-ups due" reminder.
 * Day offsets are derived from each study's visit labels ("Day 7", "Day 30"…).
 * Studies whose labels carry no "Day N" (e.g. "1st Follow-up") are simply not
 * projected — there is no reliable offset to compute from.
 *
 * NOTE: this is a schedule *projection* from the induction date. It does not
 * assert a visit was done (the data model has no per-visit record yet), so the
 * UI wording says "confirm", not "missed".
 */
import { CRF_REGISTRY } from './registry'

// ECZ2026 uses day tabs rather than a visitSchedule array.
const EXPLICIT_DAYS: Record<string, number[]> = {
  ECZ2026: [0, 15, 30, 45, 60, 75, 90],
}

export function studyVisitDays(studyCode: string): { label: string; day: number }[] {
  if (EXPLICIT_DAYS[studyCode]) {
    return EXPLICIT_DAYS[studyCode].map((d) => ({ label: d === 0 ? 'Day 0 (Baseline)' : `Day ${d}`, day: d }))
  }
  const sched = CRF_REGISTRY[studyCode]?.visitSchedule ?? []
  const out: { label: string; day: number }[] = []
  for (const label of sched) {
    const m = label.match(/day\s*(\d+)/i) // only trust explicit "Day N"
    if (m && m[1]) out.push({ label, day: parseInt(m[1], 10) })
  }
  return out
}

export interface VisitWindow {
  label: string
  date: string // YYYY-MM-DD
  daysUntil: number // negative = in the past
}

/**
 * The single most-relevant visit within ±10 days of today for a patient,
 * given their induction date. Returns null when not projectable.
 */
export function relevantVisitWindow(studyCode: string, induction: string | undefined | null): VisitWindow | null {
  if (!induction) return null
  const days = studyVisitDays(studyCode)
  if (days.length === 0) return null
  const base = new Date(induction.length <= 10 ? induction + 'T00:00:00' : induction)
  if (isNaN(base.getTime())) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let best: VisitWindow | null = null
  for (const v of days) {
    const d = new Date(base)
    d.setDate(d.getDate() + v.day)
    const daysUntil = Math.round((d.getTime() - today.getTime()) / 86400000)
    if (daysUntil >= -10 && daysUntil <= 10) {
      if (!best || Math.abs(daysUntil) < Math.abs(best.daysUntil)) {
        best = { label: v.label, date: d.toISOString().slice(0, 10), daysUntil }
      }
    }
  }
  return best
}
