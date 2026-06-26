import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Upload } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { APP_NAME } from '@/constants'
import { MasterChartTable } from './MasterChartTable'

export const metadata = { title: `Master Chart | ${APP_NAME}` }


export default async function MasterChartPage() {
  const supabase = await createClient() as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles').select('role').eq('id', user.id).single()
  const role = (profile as any)?.role
  if (role === 'admin') redirect('/admin')

  // Get study
  const { data: linkRaw } = await supabase
    .from('study_investigators')
    .select('studies(id, study_code, study_title)')
    .eq('investigator_id', user.id)
    .single()
  const study = (linkRaw as any)?.studies

  // For teacher: get all supervised study IDs
  let studyIds: string[] = []
  let studyLabel = ''
  if (role === 'teacher') {
    const { data: teacherLinks } = await supabase
      .from('study_teachers')
      .select('studies(id, study_code)')
      .eq('teacher_id', user.id)
    studyIds = ((teacherLinks ?? []) as any[]).map((l: any) => l.studies?.id).filter(Boolean)
    studyLabel = ((teacherLinks ?? []) as any[]).map((l: any) => l.studies?.study_code).join(', ')
  } else if (study) {
    studyIds = [study.id]
    studyLabel = study.study_code
  }

  if (studyIds.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-slate-200 py-16 text-center">
        <p className="text-sm text-slate-500">No study assigned. Contact admin.</p>
      </div>
    )
  }

  // Patients
  const { data: patientsRaw } = await supabase
    .from('patients')
    .select('id, study_patient_id, patient_name, age, gender, research_groups(group_name)')
    .in('study_id', studyIds)
    .order('study_patient_id')
  const patients = (patientsRaw ?? []) as any[]

  if (patients.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-slate-900">Master Chart — {studyLabel}</h1>
        <div className="rounded-xl border-2 border-dashed border-slate-200 py-16 text-center">
          <p className="text-sm text-slate-500">No patients enrolled yet.</p>
        </div>
      </div>
    )
  }

  // CRFs for all patients
  const { data: crfsRaw } = await supabase
    .from('crfs')
    .select('id, patient_id, validation_status')
    .in('patient_id', patients.map((p: any) => p.id))
  const crfs = (crfsRaw ?? []) as any[]

  // Sections for all CRFs
  const crfIds = crfs.map((c: any) => c.id)
  const { data: sectionsRaw } = await supabase
    .from('crf_sections')
    .select('id, crf_id')
    .in('crf_id', crfIds)
  const sections = (sectionsRaw ?? []) as any[]
  const sectionIds = sections.map((s: any) => s.id)

  // All responses for these patients
  let responses: any[] = []
  if (sectionIds.length > 0) {
    const { data: respRaw } = await supabase
      .from('crf_responses')
      .select('section_id, field_key, response')
      .in('section_id', sectionIds)
    responses = (respRaw ?? []) as any[]
  }

  // Build lookup: patientId → fieldKey → response (from CRF)
  const sectionToCrf: Record<string, string> = {}
  for (const s of sections) sectionToCrf[s.id] = s.crf_id
  const crfToPatient: Record<string, string> = {}
  for (const c of crfs) crfToPatient[c.id] = c.patient_id
  const crfStatus: Record<string, string> = {}
  for (const c of crfs) crfStatus[c.patient_id] = c.validation_status ?? 'pending'

  const crfData: Record<string, Record<string, string>> = {}
  for (const r of responses) {
    if (!r.section_id) continue
    const crfId = sectionToCrf[r.section_id]
    if (!crfId) continue
    const patientId = crfToPatient[crfId]
    if (!patientId) continue
    if (!crfData[patientId]) crfData[patientId] = {}
    crfData[patientId][r.field_key] = r.response
  }

  // Fetch uploaded Excel data and build name → fields lookup
  const { data: uploadsRaw } = await supabase
    .from('master_chart_uploads')
    .select('patient_name, data')
    .in('study_id', studyIds)
  const uploads = (uploadsRaw ?? []) as any[]

  // Build name-normalised lookup from uploads
  const uploadByName: Record<string, Record<string, string>> = {}
  for (const u of uploads) {
    const key = String(u.patient_name ?? '').trim().toLowerCase()
    if (key) uploadByName[key] = u.data ?? {}
  }

  // Merge: uploaded Excel fills gaps; CRF data (actual entered values) takes precedence
  const rows = patients.map((p: any) => {
    const nameKey = String(p.patient_name ?? '').trim().toLowerCase()
    const fromUpload = uploadByName[nameKey] ?? {}
    const fromCrf = crfData[p.id] ?? {}
    return {
      id: p.id,
      study_patient_id: p.study_patient_id,
      patient_name: p.patient_name,
      age: p.age,
      gender: p.gender,
      group: (p.research_groups as any)?.group_name ?? '—',
      crf_status: crfStatus[p.id] ?? 'pending',
      fields: { ...fromUpload, ...fromCrf }, // CRF overwrites upload where both exist
      has_upload: Object.keys(fromUpload).length > 0,
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Master Chart</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {studyLabel} — {patients.length} patient{patients.length !== 1 ? 's' : ''} · Values from CRF entries{uploads.length > 0 ? ` + ${uploads.length} uploaded Excel rows` : ' (upload Excel to fill gaps)'}
          </p>
        </div>
        <Link
          href="/master-chart/upload"
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <Upload size={14} />
          Upload Excel
        </Link>
      </div>
      <MasterChartTable rows={rows} />
    </div>
  )
}
