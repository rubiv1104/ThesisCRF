import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { APP_NAME } from '@/constants'
import { AddPatientDialog } from '@/features/patients/components/AddPatientDialog'
import { DeletePatientButton } from '@/app/(app)/admin/patients/DeletePatientButton'
import { relevantVisitWindow } from '@/features/crf/visitSchedule'
import { CalendarClock } from 'lucide-react'

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

  // CRF validation status + induction date for each patient
  const patientIds = patients.map((p) => p.id)
  const crfStatuses: Record<string, string> = {}
  const inductionByPatient: Record<string, string> = {}
  if (patientIds.length > 0) {
    const { data: crfsData } = await supabase
      .from('crfs')
      .select('id, patient_id, validation_status')
      .in('patient_id', patientIds)
    const crfs = (crfsData ?? []) as any[]
    const crfToPatient: Record<string, string> = {}
    for (const c of crfs) {
      crfStatuses[c.patient_id] = c.validation_status ?? 'pending'
      crfToPatient[c.id] = c.patient_id
    }
    if (crfs.length > 0) {
      const { data: secData } = await supabase.from('crf_sections').select('id, crf_id').in('crf_id', crfs.map((c: any) => c.id))
      const sections = (secData ?? []) as any[]
      const secToCrf: Record<string, string> = {}
      for (const s of sections) secToCrf[s.id] = s.crf_id
      if (sections.length > 0) {
        const { data: respData } = await supabase
          .from('crf_responses').select('section_id, response')
          .eq('field_key', 'date_induction')
          .in('section_id', sections.map((s: any) => s.id))
        for (const r of (respData ?? []) as any[]) {
          const crfId = secToCrf[r.section_id]
          const pid = crfId ? crfToPatient[crfId] : null
          if (pid && r.response) inductionByPatient[pid] = r.response
        }
      }
    }
  }

  // Project follow-ups due within ±10 days of today (schedule reminder)
  const studyCode: string = study?.study_code ?? ''
  const dueVisits = patients
    .map((p) => ({ p, w: relevantVisitWindow(studyCode, inductionByPatient[p.id]) }))
    .filter((x): x is { p: any; w: NonNullable<ReturnType<typeof relevantVisitWindow>> } => x.w !== null)
    .sort((a, b) => a.w.daysUntil - b.w.daysUntil)

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

      {/* Follow-ups due — schedule reminder (±10 days) */}
      {dueVisits.length > 0 && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
          <div className="mb-2 flex items-center gap-2">
            <CalendarClock size={16} className="text-blue-600" />
            <h2 className="text-sm font-semibold text-blue-900">Follow-ups around now</h2>
            <span className="text-xs text-blue-500">(projected from induction date — confirm in CRF)</span>
          </div>
          <ul className="divide-y divide-blue-100">
            {dueVisits.map(({ p, w }) => {
              const chip = w.daysUntil === 0
                ? { text: 'Today', cls: 'bg-green-100 text-green-700' }
                : w.daysUntil > 0
                ? { text: `in ${w.daysUntil} day${w.daysUntil > 1 ? 's' : ''}`, cls: 'bg-blue-100 text-blue-700' }
                : { text: `${-w.daysUntil} day${-w.daysUntil > 1 ? 's' : ''} ago — confirm`, cls: 'bg-red-100 text-red-700' }
              return (
                <li key={p.id} className="flex items-center gap-3 py-2">
                  <div className="min-w-0 flex-1">
                    <Link href={`/patients/${p.id}/crf`} className="text-sm font-medium text-slate-900 hover:text-blue-700">
                      {p.patient_name}
                    </Link>
                    <p className="text-xs text-slate-500">
                      <span className="font-mono">{p.study_patient_id}</span> · {w.label} · {new Date(w.date + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${chip.cls}`}>{chip.text}</span>
                </li>
              )
            })}
          </ul>
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
