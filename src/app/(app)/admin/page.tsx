import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { APP_NAME } from '@/constants'
import { StudiesTable } from './StudiesTable'

export const metadata = { title: `Admin Overview | ${APP_NAME}` }

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if ((profile as { role: string } | null)?.role !== 'admin') redirect('/dashboard')

  // All studies with investigator + patient counts
  const { data: studiesRaw } = await supabase
    .from('studies')
    .select(`
      id, study_code, study_title, sample_size, study_status, duration_days,
      study_investigators(
        investigator_id,
        user_profiles!inner(full_name, email)
      ),
      patients(id)
    `)
    .order('study_code')

  const studiesRawArr = (studiesRaw ?? []) as any[]

  const studies = studiesRawArr.map((s: any) => ({
    id: s.id,
    study_code: s.study_code,
    study_title: s.study_title,
    sample_size: s.sample_size ?? null,
    study_status: s.study_status,
    duration_days: s.duration_days ?? null,
    patientCount: s.patients?.length ?? 0,
    investigator: s.study_investigators?.[0]?.user_profiles ?? null,
  }))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count: openFeedbacks } = await (supabase as any)
    .from('feedbacks')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'open')

  const totalPatients = studies.reduce((n, s) => n + s.patientCount, 0)
  const totalInvestigators = new Set(
    studiesRawArr.flatMap((s: any) => s.study_investigators?.map((si: any) => si.investigator_id) ?? [])
  ).size
  const activeStudies = studies.filter((s) => s.study_status === 'active').length
  const completedStudies = studies.filter((s) => s.study_status !== 'active').length

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Admin Overview</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            ThesisCRF — PG Dept. of Kayachikitsa, AUTCH, University of Delhi
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 ring-1 ring-purple-200">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
          Administrator
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Active Studies', value: activeStudies, color: 'text-green-700' },
          { label: 'Completed Studies', value: completedStudies, color: 'text-slate-500' },
          { label: 'Total Patients', value: totalPatients, color: 'text-slate-900' },
          { label: 'Investigators', value: totalInvestigators, color: 'text-blue-700' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="flex gap-3 flex-wrap">
        <Link href="/admin/patients"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          View All Patients & CRFs
        </Link>
        <Link href="/admin/users"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          Manage Users
        </Link>
        <Link href="/admin/feedback"
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100 transition-colors">
          Feedback Inbox {openFeedbacks ? `(${openFeedbacks} open)` : ''}
        </Link>
      </div>

      {/* Studies table with filter */}
      <StudiesTable studies={studies} />
    </div>
  )
}
