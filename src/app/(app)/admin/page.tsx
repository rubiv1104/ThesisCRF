import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { APP_NAME } from '@/constants'
import { DurationEditor } from './DurationEditor'
import { StudyStatusButton } from './StudyStatusButton'

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

  const studies = (studiesRaw ?? []) as any[]

  // Feedback stats
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count: openFeedbacks } = await (supabase as any)
    .from('feedbacks')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'open')

  const totalPatients = studies.reduce((n, s) => n + (s.patients?.length ?? 0), 0)
  const totalInvestigators = new Set(
    studies.flatMap((s: any) => s.study_investigators?.map((si: any) => si.investigator_id) ?? [])
  ).size

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
          { label: 'Studies', value: studies.length, color: 'text-blue-700' },
          { label: 'Investigators', value: totalInvestigators, color: 'text-green-700' },
          { label: 'Total Patients', value: totalPatients, color: 'text-slate-900' },
          { label: 'Open Feedback', value: openFeedbacks ?? 0, color: 'text-amber-600' },
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
        <Link href="/admin/feedback"
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100 transition-colors">
          Feedback Inbox {openFeedbacks ? `(${openFeedbacks} open)` : ''}
        </Link>
      </div>

      {/* Studies table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">All Studies</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 text-left font-medium">Code</th>
              <th className="px-5 py-3 text-left font-medium">Study Title</th>
              <th className="px-5 py-3 text-left font-medium">Investigator</th>
              <th className="px-5 py-3 text-center font-medium">Enrolled</th>
              <th className="px-5 py-3 text-center font-medium">Target</th>
              <th className="px-5 py-3 text-center font-medium">Duration</th>
              <th className="px-5 py-3 text-left font-medium">Status</th>
              <th className="px-5 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {studies.map((s: any) => {
              const inv = s.study_investigators?.[0]?.user_profiles
              return (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs font-medium text-blue-700">{s.study_code}</td>
                  <td className="px-5 py-3 text-slate-700 max-w-xs">
                    <p className="line-clamp-2 text-xs">{s.study_title}</p>
                  </td>
                  <td className="px-5 py-3">
                    {inv ? (
                      <div>
                        <p className="text-xs font-medium text-slate-800">{inv.full_name}</p>
                        <p className="text-xs text-slate-400">{inv.email}</p>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Not assigned</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-center font-semibold text-slate-900">
                    {s.patients?.length ?? 0}
                  </td>
                  <td className="px-5 py-3 text-center text-slate-500">{s.sample_size ?? '—'}</td>
                  <td className="px-5 py-3 text-center">
                    <DurationEditor studyId={s.id} initialDays={s.duration_days ?? null} />
                  </td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                      s.study_status === 'active'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {s.study_status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2 flex-wrap">
                      <Link
                        href="/admin/patients"
                        className="rounded-md bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
                      >
                        CRFs
                      </Link>
                      <Link
                        href={`/admin/template?study=${s.study_code}`}
                        className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        Template
                      </Link>
                      <StudyStatusButton
                        studyId={s.id}
                        studyCode={s.study_code}
                        currentStatus={s.study_status}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
