import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { APP_NAME } from '@/constants'
import { AddPatientDialog } from '@/features/patients/components/AddPatientDialog'
import { DeletePatientButton } from '@/app/(app)/admin/patients/DeletePatientButton'

export const metadata = { title: `Dashboard | ${APP_NAME}` }

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Redirect non-investigators to their own home
  const { data: profileCheck } = await supabase
    .from('user_profiles').select('role').eq('id', user.id).single()
  const checkRole = (profileCheck as any)?.role
  if (checkRole === 'admin') redirect('/admin')
  if (checkRole === 'teacher') redirect('/teacher')

  // Get investigator's study
  const { data: linkRaw } = await supabase
    .from('study_investigators')
    .select('study_id, studies(id, study_code, study_title, research_groups(id, group_name))')
    .eq('investigator_id', user.id)
    .single()

  const link = linkRaw as any
  const study = link?.studies
  const groups: { id: string; group_name: string }[] = study?.research_groups ?? []

  // Get patients for this study
  const patients: any[] = []
  if (study?.id) {
    const { data } = await supabase
      .from('patients')
      .select('id, study_patient_id, patient_name, age, gender, status, research_group_id, research_groups(group_name)')
      .eq('study_id', study.id)
      .order('created_at', { ascending: false })
    if (data) patients.push(...(data as any[]))
  }

  // CRF validation status for each patient
  const patientIds = patients.map((p) => p.id)
  const crfStatuses: Record<string, string> = {}
  if (patientIds.length > 0) {
    const { data: crfsData } = await supabase
      .from('crfs')
      .select('patient_id, validation_status')
      .in('patient_id', patientIds)
    for (const c of (crfsData ?? []) as any[]) {
      crfStatuses[c.patient_id] = c.validation_status ?? 'pending'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Patients</h1>
          {study ? (
            <p className="mt-0.5 text-sm text-slate-500 max-w-xl">{study.study_title}</p>
          ) : (
            <p className="mt-0.5 text-sm text-amber-600">No study assigned yet. Contact admin.</p>
          )}
        </div>
        {study && (
          <AddPatientDialog
            studyId={study.id}
            studyCode={study.study_code}
            groups={groups}
            investigatorId={user.id}
          />
        )}
      </div>

      {/* Stats row */}
      {study && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Total</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{patients.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Group A</p>
            <p className="mt-1 text-2xl font-bold text-purple-700">
              {patients.filter((p) => (p.research_groups as any)?.group_name === 'Group A').length}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Group B</p>
            <p className="mt-1 text-2xl font-bold text-blue-700">
              {patients.filter((p) => (p.research_groups as any)?.group_name === 'Group B').length}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Approved</p>
            <p className="mt-1 text-2xl font-bold text-green-700">
              {Object.values(crfStatuses).filter((s) => s === 'approved').length}
            </p>
          </div>
        </div>
      )}

      {/* Patient list */}
      {patients.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 py-16 text-center">
          <p className="text-sm font-medium text-slate-500">No patients yet</p>
          <p className="mt-1 text-xs text-slate-400">Click &ldquo;Add Patient&rdquo; to enrol your first patient</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[680px] text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 text-left font-medium">ID</th>
                <th className="px-5 py-3 text-left font-medium">Patient Name</th>
                <th className="px-5 py-3 text-left font-medium">Age / Gender</th>
                <th className="px-5 py-3 text-left font-medium">Group</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-left font-medium">CRF Status</th>
                <th className="px-5 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{p.study_patient_id}</td>
                  <td className="px-5 py-3 font-medium text-slate-900">{p.patient_name}</td>
                  <td className="px-5 py-3 text-slate-600">{p.age}y / {p.gender}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      (p.research_groups as any)?.group_name === 'Group A'
                        ? 'bg-purple-50 text-purple-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {(p.research_groups as any)?.group_name ?? '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 capitalize">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {(() => {
                      const s = crfStatuses[p.id] ?? 'not started'
                      return (
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                          s === 'approved' ? 'bg-green-50 text-green-700'
                          : s === 'submitted' ? 'bg-amber-50 text-amber-700'
                          : s === 'returned' ? 'bg-red-50 text-red-600'
                          : 'bg-slate-100 text-slate-500'
                        }`}>
                          {s === 'pending' ? 'In Progress' : s === 'not started' ? 'Not Started' : s}
                        </span>
                      )
                    })()}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/patients/${p.id}/crf`}
                        className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
                      >
                        Open CRF
                      </Link>
                      <DeletePatientButton patientId={p.id} patientName={p.patient_name} redirectTo="/dashboard" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
