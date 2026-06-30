/**
 * Server loader: assembles everything the Guide Review screen needs for one
 * patient — header, status, assessment & investigation summaries, quick-review
 * tabs, computed follow-up tracker, timeline and comments.
 * RLS restricts the guide to patients in their supervised studies.
 */
import { CRF_REGISTRY } from '@/features/crf/registry'
import { buildReviewTabs, sectionOptions, type ReviewTabContent } from './tabs'
import { buildFollowUp, type FollowUpVisit } from './followup'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseLike = any

export interface AssessmentSeries {
  code: string
  points: { visit: string; total: number | null; interpretation: string | null }[]
  latest: { visit: string; total: number | null; interpretation: string | null } | null
  delta: number | null // latest - first (numeric trend)
}

export interface InvestigationItem {
  id: string
  file_name: string
  file_path: string
  visit_label: string | null
  description: string | null
  created_at: string
}

export interface ReviewComment {
  id: string
  section_key: string
  field_key: string | null
  correction: string
  corrector_name: string | null
  status: string
  created_at: string
}

export interface TimelineEvent {
  date: string
  label: string
  detail?: string
  kind: 'register' | 'update' | 'comment' | 'approved' | 'returned' | 'submitted'
}

export interface GuideReviewData {
  patient: {
    id: string
    patient_name: string
    study_patient_id: string
    age: number | null
    gender: string | null
    phone: string | null
    hospital_cr_number: string | null
    opd_number: string | null
    created_at: string
    investigator_name: string | null
  }
  studyCode: string
  studyTitle: string
  groupName: string | null
  durationDays: number | null
  crf: {
    id: string | null
    validation_status: string
    validation_note: string
    validated_at: string | null
    updated_at: string | null
  }
  completionPct: number
  assessments: AssessmentSeries[]
  investigations: InvestigationItem[]
  tabs: ReviewTabContent
  sections: { key: string; title: string }[]
  followUp: FollowUpVisit[]
  timeline: TimelineEvent[]
  comments: ReviewComment[]
  bookmarked: boolean
}

function trendArrowDay(label: string): number {
  const l = label.toLowerCase()
  if (/\b(bt|baseline|before)\b/.test(l)) return 0
  if (/\b(at|after)\b/.test(l)) return 9999
  const m = l.match(/(\d+)/)
  return m?.[1] ? parseInt(m[1], 10) : 50
}

export async function loadGuideReview(
  supabase: SupabaseLike,
  patientId: string,
  viewerId: string,
): Promise<GuideReviewData | null> {
  const { data: raw } = await supabase
    .from('patients')
    .select('id, patient_name, study_patient_id, age, gender, phone, hospital_cr_number, opd_number, created_at, study_id, studies(study_code, study_title, duration_days), research_groups(group_name), user_profiles!patients_created_by_fkey(full_name)')
    .eq('id', patientId)
    .single()
  if (!raw) return null
  const p = raw as any
  const studyCode: string = p.studies?.study_code ?? ''
  const template = CRF_REGISTRY[studyCode]

  const { data: crf } = await supabase
    .from('crfs')
    .select('id, validation_status, validation_note, validated_at, updated_at')
    .eq('patient_id', patientId)
    .maybeSingle()

  // CRF responses → flat values map
  const values: Record<string, string> = {}
  if (crf?.id) {
    const { data: sections } = await supabase.from('crf_sections').select('id').eq('crf_id', crf.id)
    const sectionIds = (sections ?? []).map((s: any) => s.id)
    if (sectionIds.length > 0) {
      const { data: responses } = await supabase
        .from('crf_responses')
        .select('field_key, response')
        .in('section_id', sectionIds)
      for (const r of responses ?? []) {
        if (r.field_key && r.response != null && r.response !== '') values[r.field_key] = r.response
      }
    }
  }

  // Assessments → grouped series with trend
  const { data: assessRaw } = await supabase
    .from('assessment_results')
    .select('assessment_code, visit_label, total, interpretation, assessed_at')
    .eq('patient_id', patientId)
  const byCode = new Map<string, any[]>()
  for (const a of (assessRaw ?? []) as any[]) {
    if (!byCode.has(a.assessment_code)) byCode.set(a.assessment_code, [])
    byCode.get(a.assessment_code)!.push(a)
  }
  const assessments: AssessmentSeries[] = Array.from(byCode.entries()).map(([code, rows]) => {
    rows.sort((a, b) => trendArrowDay(a.visit_label ?? '') - trendArrowDay(b.visit_label ?? ''))
    const points = rows.map((r) => ({ visit: r.visit_label ?? '—', total: r.total, interpretation: r.interpretation }))
    const first = points[0]?.total
    const last = points[points.length - 1]?.total
    const delta = first != null && last != null ? Number(last) - Number(first) : null
    return { code, points, latest: points[points.length - 1] ?? null, delta }
  })

  // Investigations
  const { data: docs } = await supabase
    .from('investigation_documents')
    .select('id, file_name, file_path, visit_label, description, created_at')
    .eq('patient_id', patientId)
    .eq('doc_type', 'investigation')
    .order('created_at', { ascending: false })
  const investigations = (docs ?? []) as InvestigationItem[]

  // Comments
  let comments: ReviewComment[] = []
  if (crf?.id) {
    const { data: cors } = await supabase
      .from('crf_corrections')
      .select('id, section_key, field_key, correction, corrector_name, status, created_at')
      .eq('crf_id', crf.id)
      .order('created_at', { ascending: false })
    comments = (cors ?? []) as ReviewComment[]
  }

  // Bookmark
  const { data: bm } = await supabase
    .from('guide_bookmarks')
    .select('id')
    .eq('user_id', viewerId)
    .eq('patient_id', patientId)
    .maybeSingle()

  // Completion %
  const { expectedSlots } = await import('@/features/crf/studyMeta')
  const expected = expectedSlots(studyCode)
  const filled = Object.keys(values).length
  const completionPct = expected > 0 ? Math.min(100, Math.round((filled / expected) * 100)) : 0

  // Follow-up tracker
  const completedLabels = [
    ...((assessRaw ?? []) as any[]).map((a) => a.visit_label ?? ''),
    ...investigations.map((d) => d.visit_label ?? ''),
  ].filter(Boolean)
  const followUp = buildFollowUp({
    visitSchedule: template?.visitSchedule,
    durationDays: p.studies?.duration_days ?? null,
    recruitedAt: p.created_at,
    completedLabels,
    approved: crf?.validation_status === 'approved',
  })

  // Timeline
  const timeline: TimelineEvent[] = []
  timeline.push({ date: p.created_at, label: 'Patient registered', kind: 'register', detail: p.study_patient_id })
  if (crf?.updated_at) timeline.push({ date: crf.updated_at, label: 'CRF last updated', kind: 'update' })
  for (const c of comments) {
    timeline.push({ date: c.created_at, label: 'Comment added', detail: c.section_key, kind: 'comment' })
  }
  if (crf?.validated_at && (crf.validation_status === 'approved' || crf.validation_status === 'returned')) {
    timeline.push({
      date: crf.validated_at,
      label: crf.validation_status === 'approved' ? 'CRF approved' : 'Returned for correction',
      detail: crf.validation_note || undefined,
      kind: crf.validation_status === 'approved' ? 'approved' : 'returned',
    })
  }
  timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const { studyTitle } = await import('@/features/crf/studyMeta')

  return {
    patient: {
      id: p.id,
      patient_name: p.patient_name,
      study_patient_id: p.study_patient_id,
      age: p.age ?? null,
      gender: p.gender ?? null,
      phone: p.phone ?? null,
      hospital_cr_number: p.hospital_cr_number ?? null,
      opd_number: p.opd_number ?? null,
      created_at: p.created_at,
      investigator_name: p.user_profiles?.full_name ?? null,
    },
    studyCode,
    studyTitle: studyTitle(studyCode) || p.studies?.study_title || studyCode,
    groupName: p.research_groups?.group_name ?? null,
    durationDays: p.studies?.duration_days ?? null,
    crf: {
      id: crf?.id ?? null,
      validation_status: crf?.validation_status ?? 'pending',
      validation_note: crf?.validation_note ?? '',
      validated_at: crf?.validated_at ?? null,
      updated_at: crf?.updated_at ?? null,
    },
    completionPct,
    assessments,
    investigations,
    tabs: buildReviewTabs(template, values),
    sections: sectionOptions(template),
    followUp,
    timeline,
    comments,
    bookmarked: !!bm,
  }
}
