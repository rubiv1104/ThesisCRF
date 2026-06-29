import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { APP_NAME } from '@/constants'
import { ChevronLeft } from 'lucide-react'
import { PatientsSearch } from './PatientsSearch'
import { studyTitle, studyBatch, expectedSlots } from '@/features/crf/studyMeta'

export const metadata = { title: `All Patients | ${APP_NAME}` }

export default async function AdminPatientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single()
  if ((profile as any)?.role !== 'admin') redirect('/dashboard')

  const { data: patientsRaw } = await (supabase as any)
    .from('patients')
    .select(`
      id, patient_name, study_patient_id, age, gender,
      studies(study_code, study_title),
      research_groups(group_name),
      user_profiles!patients_created_by_fkey(full_name, email)
    `)
    .order('created_at', { ascending: false })

  const patientIds = ((patientsRaw ?? []) as any[]).map((p: any) => p.id)
  const { data: crfsRaw } = patientIds.length > 0
    ? await (supabase as any).from('crfs').select('patient_id, validation_status').in('patient_id', patientIds)
    : { data: [] }
  const crfMap: Record<string, string> = {}
  for (const c of (crfsRaw ?? []) as any[]) {
    crfMap[c.patient_id] = c.validation_status ?? 'pending'
  }

  // Filled-response counts per patient (for completion %)
  const { data: fillRaw } = await (supabase as any).rpc('crf_fill_counts')
  const fillMap: Record<string, number> = {}
  for (const f of (fillRaw ?? []) as any[]) {
    fillMap[f.patient_id] = f.filled ?? 0
  }

  const patients = ((patientsRaw ?? []) as any[]).map((p: any) => {
    const code = p.studies?.study_code ?? '?'
    const expected = expectedSlots(code)
    const filled = fillMap[p.id] ?? 0
    const percent = expected > 0 ? Math.min(100, Math.round((filled / expected) * 100)) : 0
    return {
      id: p.id,
      patient_name: p.patient_name,
      study_patient_id: p.study_patient_id,
      age: p.age,
      gender: p.gender,
      study_code: code,
      study_title: studyTitle(code),
      batch: studyBatch(code),
      group_name: p.research_groups?.group_name ?? null,
      investigator_name: p.user_profiles?.full_name ?? null,
      investigator_email: p.user_profiles?.email ?? null,
      crf_status: crfMap[p.id] ?? 'not_started',
      fill_percent: percent,
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin" className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800">
          <ChevronLeft size={14} /> Admin Overview
        </Link>
      </div>

      <div>
        <h1 className="text-xl font-bold text-slate-900">All Patients & CRFs</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          {patients.length} patient{patients.length !== 1 ? 's' : ''} across all studies and years
        </p>
      </div>

      <PatientsSearch patients={patients} />
    </div>
  )
}
