import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { APP_NAME } from '@/constants'
import { ChevronLeft } from 'lucide-react'
import { DeletePatientButton } from './DeletePatientButton'

export const metadata = { title: `All Patients | ${APP_NAME}` }

export default async function AdminPatientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single()
  if ((profile as any)?.role !== 'admin') redirect('/dashboard')

  // Fetch all studies and all patients in parallel
  const [{ data: studiesRaw }, { data: patientsRaw }] = await Promise.all([
    supabase.from('studies').select('id, study_code, study_title, study_status').order('study_code'),
    (supabase as any)
      .from('patients')
      .select(`
        id, patient_name, study_patient_id, age, gender, status, study_id, created_at,
        studies(study_code, study_title),
        research_groups(group_name),
        user_profiles!patients_created_by_fkey(full_name, email)
      `)
      .order('created_at', { ascending: false }),
  ])

  const studies = (studiesRaw ?? []) as { id: string; study_code: string; study_title: string; study_status: string }[]
  const patients = (patientsRaw ?? []) as any[]

  // Group patients by study_id
  const byStudyId: Record<string, any[]> = {}
  for (const p of patients) {
    const sid = p.study_id
    if (!byStudyId[sid]) byStudyId[sid] = []
    byStudyId[sid].push(p)
  }

  // Fetch CRF statuses for all patients at once
  const patientIds = patients.map((p: any) => p.id)
  const { data: crfsRaw } = patientIds.length > 0
    ? await (supabase as any).from('crfs').select('patient_id, validation_status').in('patient_id', patientIds)
    : { data: [] }
  const crfMap: Record<string, string> = {}
  for (const c of (crfsRaw ?? []) as any[]) {
    crfMap[c.patient_id] = c.validation_status ?? 'pending'
  }

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
          {patients.length} patient{patients.length !== 1 ? 's' : ''} across {studies.length} studies
        </p>
      </div>

      {studies.map((study) => {
        const pts = byStudyId[study.id] ?? []
        return (
          <div key={study.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Study header */}
            <div className="border-b border-slate-100 bg-slate-50 px-5 py-3 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-blue-700">{study.study_code}</span>
                <span className="ml-3 text-xs text-slate-500">{study.study_title}</span>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/template?study=${study.study_code}`}
                  className="rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  View Template
                </Link>
                <span className="text-xs text-slate-400">{pts.length} patient{pts.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Patient rows */}
            {pts.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-slate-400">No patients enrolled yet</p>
                <p className="mt-0.5 text-xs text-slate-300">Investigators will enrol patients when they register</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-5 py-2 text-left font-medium">ID</th>
                    <th className="px-5 py-2 text-left font-medium">Patient</th>
                    <th className="px-5 py-2 text-left font-medium">Age/Sex</th>
                    <th className="px-5 py-2 text-left font-medium">Group</th>
                    <th className="px-5 py-2 text-left font-medium">Investigator</th>
                    <th className="px-5 py-2 text-left font-medium">CRF Status</th>
                    <th className="px-5 py-2 text-left font-medium">CRF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pts.map((p: any) => {
                    const vstatus = crfMap[p.id] ?? 'pending'
                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-2.5 font-mono text-xs text-slate-500">{p.study_patient_id}</td>
                        <td className="px-5 py-2.5 font-medium text-slate-900">{p.patient_name}</td>
                        <td className="px-5 py-2.5 text-slate-600 text-xs">{p.age}y / {p.gender}</td>
                        <td className="px-5 py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            p.research_groups?.group_name === 'Group A'
                              ? 'bg-purple-50 text-purple-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}>
                            {p.research_groups?.group_name ?? '—'}
                          </span>
                        </td>
                        <td className="px-5 py-2.5">
                          <div className="text-xs font-medium text-slate-800">{p.user_profiles?.full_name ?? '—'}</div>
                          <div className="text-[11px] text-slate-400">{p.user_profiles?.email ?? ''}</div>
                        </td>
                        <td className="px-5 py-2.5">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                            vstatus === 'approved' ? 'bg-green-50 text-green-700'
                            : vstatus === 'submitted' ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-300'
                            : vstatus === 'returned' ? 'bg-red-50 text-red-600'
                            : 'bg-slate-100 text-slate-500'
                          }`}>
                            {vstatus === 'pending' ? 'In Progress' : vstatus}
                          </span>
                        </td>
                        <td className="px-5 py-2.5">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/patients/${p.id}/crf`}
                              className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
                            >
                              Open CRF
                            </Link>
                            <DeletePatientButton patientId={p.id} patientName={p.patient_name} />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        )
      })}
    </div>
  )
}
