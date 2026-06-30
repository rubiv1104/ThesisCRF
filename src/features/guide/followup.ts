/**
 * GUIDE FOLLOW-UP TRACKER — computed visit schedule
 * =================================================
 * There is no visit-schedule table; the schedule is derived from the study's
 * visit labels (or duration in 15-day steps) anchored to the recruitment date.
 * Completion is inferred from assessment / investigation visit labels that
 * match a scheduled day. Best-effort, but enough for a colour-coded tracker.
 * Pure / client-safe.
 */

export type FollowUpStatus = 'completed' | 'overdue' | 'upcoming' | 'pending'

export interface FollowUpVisit {
  label: string
  offset: number // days from recruitment
  dueDate: string | null // ISO date
  status: FollowUpStatus
}

/** Extract the day-offset a label refers to (e.g. "Day 15", "Visit 2 (30 days)", "BT", "AT"). */
function labelToDay(label: string, durationDays: number): number | null {
  const l = label.toLowerCase()
  if (/\b(bt|baseline|before)\b/.test(l)) return 0
  if (/\b(at|after)\b/.test(l)) return durationDays || 90
  const days = l.match(/(\d+)\s*days?/)
  if (days?.[1]) return parseInt(days[1], 10)
  const day = l.match(/day\s*(\d+)/)
  if (day?.[1]) return parseInt(day[1], 10)
  const visit = l.match(/visit\s*(\d+)/)
  if (visit?.[1]) return parseInt(visit[1], 10) * 15 // assume 15-day cadence
  const bare = l.match(/(\d+)/)
  if (bare?.[1]) return parseInt(bare[1], 10)
  return null
}

function startOfDay(d: Date) { d.setHours(0, 0, 0, 0); return d }

export function buildFollowUp(opts: {
  visitSchedule?: string[]
  durationDays?: number
  recruitedAt: string | null
  completedLabels: string[]
  approved: boolean
}): FollowUpVisit[] {
  const duration = opts.durationDays && opts.durationDays > 0 ? opts.durationDays : 90

  // 1. Determine the list of scheduled visit offsets + labels
  let visits: { label: string; offset: number }[] = []
  if (opts.visitSchedule && opts.visitSchedule.length > 0) {
    visits = opts.visitSchedule.map((label) => ({ label, offset: labelToDay(label, duration) ?? 0 }))
  } else {
    for (let d = 0; d <= duration; d += 15) {
      visits.push({ label: d === 0 ? 'Baseline (Day 0)' : `Day ${d}`, offset: d })
    }
  }
  visits.sort((a, b) => a.offset - b.offset)

  // 2. Which day-offsets have recorded data (from assessment / investigation labels)
  const completedDays = new Set<number>()
  for (const l of opts.completedLabels) {
    const d = labelToDay(l, duration)
    if (d != null) completedDays.add(d)
  }

  const today = startOfDay(new Date())
  const recruited = opts.recruitedAt ? startOfDay(new Date(opts.recruitedAt)) : null

  return visits.map((v) => {
    const dueDate = recruited ? new Date(recruited.getTime() + v.offset * 86400000) : null
    let status: FollowUpStatus
    if (opts.approved || completedDays.has(v.offset)) {
      status = 'completed'
    } else if (!dueDate) {
      status = 'pending'
    } else if (dueDate.getTime() > today.getTime() + 7 * 86400000) {
      status = 'pending'
    } else if (dueDate.getTime() >= today.getTime()) {
      status = 'upcoming'
    } else {
      status = 'overdue'
    }
    return { label: v.label, offset: v.offset, dueDate: dueDate ? dueDate.toISOString() : null, status }
  })
}
