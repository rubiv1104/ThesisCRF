/**
 * Server loader for the Guide home dashboard — the six headline metrics,
 * per-study cards, the working patient list, and unread-notification count.
 */
import { expectedSlots } from '@/features/crf/studyMeta'
import type { GuidePatient } from '@/app/(app)/teacher/GuidePatients'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseLike = any

export interface StudyCard {
  id: string
  code: string
  title: string
  sampleSize: number | null
  enrolled: number
  pendingReview: number
  approved: number
  investigators: string[]
  roleLabel: string
}

export interface GuideHomeData {
  counts: {
    studies: number
    patients: number
    pendingReview: number
    correctionsPending: number
    approvedToday: number
    overdue: number
  }
  studies: StudyCard[]
  patients: GuidePatient[]
  unread: number
}

export async function loadGuideHome(supabase: SupabaseLike, teacherId: string): Promise<GuideHomeData> {
  const empty: GuideHomeData = {
    counts: { studies: 0, patients: 0, pendingReview: 0, correctionsPending: 0, approvedToday: 0, overdue: 0 },
    studies: [], patients: [], unread: 0,
  }

  const { data: linksRaw } = await supabase
    .from('study_teachers')
    .select('role_label, studies(id, study_code, study_title, sample_size, duration_days)')
    .eq('teacher_id', teacherId)
  const links = (linksRaw ?? []) as any[]
  const studyMap = new Map<string, any>()
  for (const l of links) if (l.studies?.id) studyMap.set(l.studies.id, { ...l.studies, roleLabel: l.role_label ?? 'Guide' })
  const studyIds = Array.from(studyMap.keys())

  // Unread notifications (always available)
  const { count: unread } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', teacherId)
    .eq('read', false)

  if (studyIds.length === 0) return { ...empty, unread: unread ?? 0 }

  const { data: patientsRaw } = await supabase
    .from('patients')
    .select('id, patient_name, study_patient_id, age, gender, status, created_at, study_id, studies(study_code, duration_days), research_groups(group_name), user_profiles!patients_created_by_fkey(full_name, email)')
    .in('study_id', studyIds)
    .order('created_at', { ascending: false })
  const patientRows = (patientsRaw ?? []) as any[]

  const patientIds = patientRows.map((p) => p.id)
  const { data: crfsRaw } = patientIds.length > 0
    ? await supabase.from('crfs').select('id, patient_id, validation_status, validated_at').in('patient_id', patientIds)
    : { data: [] }
  const crfs = (crfsRaw ?? []) as any[]
  const crfByPatient = new Map<string, any>(crfs.map((c) => [c.patient_id, c]))

  // Fill counts → completion %
  const { data: fillRaw } = await supabase.rpc('crf_fill_counts')
  const fillMap: Record<string, number> = {}
  for (const f of (fillRaw ?? []) as any[]) fillMap[f.patient_id] = f.filled ?? 0

  // Open corrections across these CRFs
  const crfIds = crfs.map((c) => c.id).filter(Boolean)
  let correctionsPending = 0
  if (crfIds.length > 0) {
    const { count } = await supabase
      .from('crf_corrections')
      .select('id', { count: 'exact', head: true })
      .in('crf_id', crfIds)
      .eq('status', 'open')
    correctionsPending = count ?? 0
  }

  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
  const now = Date.now()

  let pendingReview = 0, approvedToday = 0, overdue = 0
  for (const p of patientRows) {
    const c = crfByPatient.get(p.id)
    const status = c?.validation_status ?? 'not_started'
    if (status === 'submitted') pendingReview++
    if (status === 'approved' && c?.validated_at && new Date(c.validated_at) >= todayStart) approvedToday++
    const duration = p.studies?.duration_days ?? 90
    const daysSince = (now - new Date(p.created_at).getTime()) / 86400000
    if (status !== 'approved' && daysSince > duration) overdue++
  }

  const patients: GuidePatient[] = patientRows.map((p) => {
    const code = p.studies?.study_code ?? ''
    const expected = expectedSlots(code)
    const fill = expected > 0 ? Math.min(100, Math.round(((fillMap[p.id] ?? 0) / expected) * 100)) : 0
    return {
      id: p.id,
      patient_name: p.patient_name,
      study_patient_id: p.study_patient_id,
      study_code: code,
      group_name: p.research_groups?.group_name ?? null,
      investigator_name: p.user_profiles?.full_name ?? 'Unknown',
      investigator_email: p.user_profiles?.email ?? '',
      crf_status: crfByPatient.get(p.id)?.validation_status ?? 'not_started',
      fill_percent: fill,
    }
  })

  // Per-study cards
  const studies: StudyCard[] = Array.from(studyMap.values()).map((s) => {
    const ps = patientRows.filter((p) => p.study_id === s.id)
    const pendingCount = ps.filter((p) => crfByPatient.get(p.id)?.validation_status === 'submitted').length
    const approvedCount = ps.filter((p) => crfByPatient.get(p.id)?.validation_status === 'approved').length
    const invs = Array.from(new Set(ps.map((p) => p.user_profiles?.full_name).filter(Boolean))) as string[]
    return {
      id: s.id,
      code: s.study_code,
      title: s.study_title ?? s.study_code,
      sampleSize: s.sample_size ?? null,
      enrolled: ps.length,
      pendingReview: pendingCount,
      approved: approvedCount,
      investigators: invs,
      roleLabel: s.roleLabel,
    }
  }).sort((a, b) => b.pendingReview - a.pendingReview || a.code.localeCompare(b.code))

  return {
    counts: {
      studies: studyIds.length,
      patients: patientRows.length,
      pendingReview,
      correctionsPending,
      approvedToday,
      overdue,
    },
    studies,
    patients,
    unread: unread ?? 0,
  }
}
