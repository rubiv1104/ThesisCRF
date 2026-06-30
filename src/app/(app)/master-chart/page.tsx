import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Upload } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { APP_NAME } from '@/constants'
import { MasterChartTable } from './MasterChartTable'

export const metadata = { title: `Master Chart | ${APP_NAME}` }

interface PageProps {
  searchParams: Promise<{ study?: string }>
}

export default async function MasterChartPage({ searchParams }: PageProps) {
  const { study: studyParam } = await searchParams
  const supabase = await createClient() as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles').select('role').eq('id', user.id).single()
  const role = (profile as any)?.role
  if (role === 'admin') redirect('/admin')

  // Build the list of studies available to this user
  let studies: { id: string; code: string }[] = []
  if (role === 'teacher') {
    const { data: links } = await supabase
      .from('study_teachers').select('studies(id, study_code)').eq('teacher_id', user.id)
    studies = ((links ?? []) as any[]).map((l: any) => ({ id: l.studies?.id, code: l.studies?.study_code })).filter((s) => s.id)
  } else {
    const { data: link } = await supabase
      .from('study_investigators').select('studies(id, study_code)').eq('investigator_id', user.id).single()
    const s = (link as any)?.studies
    if (s) studies = [{ id: s.id, code: s.study_code }]
  }

  if (studies.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-slate-200 py-16 text-center">
        <p className="text-sm text-slate-500">No study assigned. Contact admin.</p>
      </div>
    )
  }

  // Active study = ?study= if valid, else first
  const active = studies.find((s) => s.code === studyParam) ?? studies[0]!
  const studyId = active.id
  const studyCode = active.code

  // Patients for the ACTIVE study only
  const { data: patientsRaw } = await supabase
    .from('patients')
    .select('id, study_patient_id, patient_name, age, gender, research_groups(group_name)')
    .eq('study_id', studyId)
    .order('study_patient_id')
  const patients = (patientsRaw ?? []) as any[]

  // Responses → patientId → fieldKey → value
  const crfData: Record<string, Record<string, string>> = {}
  const crfStatus: Record<string, string> = {}
  if (patients.length > 0) {
    const { data: crfsRaw } = await supabase.from('crfs').select('id, patient_id, validation_status').in('patient_id', patients.map((p: any) => p.id))
    const crfs = (crfsRaw ?? []) as any[]
    for (const c of crfs) crfStatus[c.patient_id] = c.validation_status ?? 'pending'
    const crfToPatient: Record<string, string> = {}
    for (const c of crfs) crfToPatient[c.id] = c.patient_id

    const { data: sectionsRaw } = await supabase.from('crf_sections').select('id, crf_id').in('crf_id', crfs.map((c: any) => c.id))
    const sections = (sectionsRaw ?? []) as any[]
    const sectionToCrf: Record<string, string> = {}
    for (const s of sections) sectionToCrf[s.id] = s.crf_id

    if (sections.length > 0) {
      const { data: respRaw } = await supabase.from('crf_responses').select('section_id, field_key, response').in('section_id', sections.map((s: any) => s.id))
      for (const r of (respRaw ?? []) as any[]) {
        const crfId = sectionToCrf[r.section_id]
        if (!crfId) continue
        const pid = crfToPatient[crfId]
        if (!pid) continue
        ;(crfData[pid] ??= {})[r.field_key] = r.response
      }
    }
  }

  // Uploaded Excel (gap-fill, by patient name)
  const { data: uploadsRaw } = await supabase.from('master_chart_uploads').select('patient_name, data').eq('study_id', studyId)
  const uploadByName: Record<string, Record<string, string>> = {}
  for (const u of (uploadsRaw ?? []) as any[]) {
    const key = String(u.patient_name ?? '').trim().toLowerCase()
    if (key) uploadByName[key] = u.data ?? {}
  }

  // Assessment Engine scores → injected as synthetic master-chart fields
  const assessByPatient: Record<string, Record<string, string>> = {}
  if (patients.length > 0) {
    const { data: aRaw } = await supabase
      .from('assessment_results')
      .select('patient_id, assessment_code, visit_label, total')
      .in('patient_id', patients.map((p: any) => p.id))
    for (const a of (aRaw ?? []) as any[]) {
      ;(assessByPatient[a.patient_id] ??= {})[`assess__${a.assessment_code}__${a.visit_label}`] = a.total != null ? String(a.total) : ''
    }
  }

  const rows = patients.map((p: any) => {
    const nameKey = String(p.patient_name ?? '').trim().toLowerCase()
    return {
      id: p.id,
      study_patient_id: p.study_patient_id,
      patient_name: p.patient_name,
      age: p.age,
      gender: p.gender,
      group: (p.research_groups as any)?.group_name ?? '—',
      crf_status: crfStatus[p.id] ?? 'pending',
      fields: { ...(uploadByName[nameKey] ?? {}), ...(crfData[p.id] ?? {}), ...(assessByPatient[p.id] ?? {}) },
      has_upload: !!uploadByName[nameKey],
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Master Chart — {studyCode}</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {patients.length} patient{patients.length !== 1 ? 's' : ''} · Columns auto-generated from this study&apos;s CRF
          </p>
        </div>
        <Link
          href="/master-chart/upload"
          className="flex w-fit items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <Upload size={14} /> Upload Excel
        </Link>
      </div>

      {/* Study switcher — guides supervising more than one study pick one at a time */}
      {studies.length > 1 && (
        <div className="flex flex-wrap gap-1.5">
          {studies.map((s) => (
            <Link
              key={s.id}
              href={`/master-chart?study=${s.code}`}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                s.code === studyCode ? 'bg-blue-600 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s.code}
            </Link>
          ))}
        </div>
      )}

      {patients.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 py-16 text-center">
          <p className="text-sm text-slate-500">No patients enrolled in {studyCode} yet.</p>
        </div>
      ) : (
        <MasterChartTable rows={rows} studyCode={studyCode} />
      )}
    </div>
  )
}
