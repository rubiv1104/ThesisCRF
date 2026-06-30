import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { APP_NAME } from '@/constants'
import { expectedSlots } from '@/features/crf/studyMeta'
import { GuidePatients, type GuidePatient } from './GuidePatients'

export const metadata = { title: `Guide Dashboard | ${APP_NAME}` }

export default async function TeacherDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Run profile and study assignments in parallel
  const [{ data: profile }, { data: linksRaw }] = await Promise.all([
    supabase.from('user_profiles').select('role, full_name').eq('id', user.id).single(),
    (supabase as any).from('study_teachers')
      .select('role_label, studies(id, study_code, study_title, sample_size)')
      .eq('teacher_id', user.id),
  ])

  if ((profile as any)?.role !== 'teacher') redirect('/dashboard')

  const links = (linksRaw ?? []) as any[]
  const studyIds = links.map((l: any) => l.studies?.id).filter(Boolean)

  // Fetch patients (needs studyIds first)
  let patients: any[] = []
  if (studyIds.length > 0) {
    const { data } = await (supabase as any)
      .from('patients')
      .select('id, patient_name, study_patient_id, age, gender, status, study_id, studies(study_code), research_groups(group_name), user_profiles!patients_created_by_fkey(full_name, email)')
      .in('study_id', studyIds)
      .order('created_at', { ascending: false })
    patients = (data ?? []) as any[]
  }

  // Fetch CRF statuses (needs patient ids)
  const { data: crfsRaw } = patients.length > 0
    ? await (supabase as any).from('crfs').select('patient_id, validation_status').in('patient_id', patients.map((p: any) => p.id))
    : { data: [] }

  // Filled-response counts → completion %
  const { data: fillRaw } = await (supabase as any).rpc('crf_fill_counts')
  const fillMap: Record<string, number> = {}
  for (const f of (fillRaw ?? []) as any[]) fillMap[f.patient_id] = f.filled ?? 0
  function fillPercent(p: any): number {
    const code = (p.studies as any)?.study_code ?? ''
    const expected = expectedSlots(code)
    return expected > 0 ? Math.min(100, Math.round(((fillMap[p.id] ?? 0) / expected) * 100)) : 0
  }

  const crfs = (crfsRaw ?? []) as any[]
  const validatedCount = crfs.filter((c: any) => c.validation_status === 'approved').length
  const submittedCount = crfs.filter((c: any) => c.validation_status === 'submitted').length
  const returnedCount = crfs.filter((c: any) => c.validation_status === 'returned').length

  const guidePatients: GuidePatient[] = patients.map((p: any) => ({
    id: p.id,
    patient_name: p.patient_name,
    study_patient_id: p.study_patient_id,
    study_code: (p.studies as any)?.study_code ?? '',
    group_name: (p.research_groups as any)?.group_name ?? null,
    investigator_name: (p.user_profiles as any)?.full_name ?? 'Unknown',
    investigator_email: (p.user_profiles as any)?.email ?? '',
    crf_status: crfs.find((c: any) => c.patient_id === p.id)?.validation_status ?? 'not_started',
    fill_percent: fillPercent(p),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Welcome, {(profile as any)?.full_name ?? 'Dr.'}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Review and validate your students&apos; CRF submissions as their guide
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Guide
        </span>
      </div>

      {/* Awaiting review alert */}
      {submittedCount > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 font-bold text-sm">
            {submittedCount}
          </span>
          <div>
            <p className="font-semibold text-amber-800">
              {submittedCount} CRF{submittedCount > 1 ? 's' : ''} awaiting your review
            </p>
            <p className="text-xs text-amber-600">Students have submitted their CRFs — scroll down to review them.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Patients', value: patients.length, color: 'text-slate-900' },
          { label: 'Awaiting Review', value: submittedCount, color: 'text-amber-600' },
          { label: 'Approved', value: validatedCount, color: 'text-green-700' },
          { label: 'Returned', value: returnedCount, color: 'text-red-600' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Supervised studies */}
      {links.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Studies Under Supervision</h2>
          <div className="space-y-2">
            {links.map((l: any, i: number) => (
              <div key={l.studies?.id ?? i} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5">
                <div>
                  <span className="font-mono text-xs font-bold text-blue-700">{l.studies?.study_code}</span>
                  <span className="ml-3 text-xs text-slate-600">{l.studies?.study_title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/teacher/template?study=${l.studies?.study_code ?? ''}`}
                    className="rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    View CRF Template
                  </Link>
                  <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                    {l.role_label ?? 'Guide'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Patient list with CRF review links */}
      {patients.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 py-16 text-center">
          {studyIds.length === 0 ? (
            <>
              <p className="text-sm font-medium text-slate-600">You are not assigned to any study yet.</p>
              <p className="mt-1 text-xs text-slate-400">Ask the administrator to assign you to a study via Admin → Users.</p>
            </>
          ) : (
            <>
              <p className="text-sm text-slate-500">No patients enrolled in your supervised studies yet.</p>
              <p className="mt-1 text-xs text-slate-400">Patients will appear here once investigators register them.</p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Investigators</h2>
            {returnedCount > 0 && (
              <span className="text-xs text-amber-600 font-medium">{returnedCount} returned for correction</span>
            )}
          </div>
          <GuidePatients patients={guidePatients} />
        </div>
      )}
    </div>
  )
}
