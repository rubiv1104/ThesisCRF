import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { APP_NAME } from '@/constants'

export const metadata = { title: `Investigations | ${APP_NAME}` }

export default async function InvestigationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get all patients for this investigator's study
  const { data: linkRaw } = await supabase
    .from('study_investigators')
    .select('study_id')
    .eq('investigator_id', user.id)
    .single()

  const link = linkRaw as { study_id: string } | null
  const patients: { id: string; study_patient_id: string; patient_name: string }[] = []

  if (link?.study_id) {
    const { data } = await supabase
      .from('patients')
      .select('id, study_patient_id, patient_name')
      .eq('study_id', link.study_id)
      .order('study_patient_id')
    if (data) patients.push(...(data as typeof patients))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Investigations</h1>
        <p className="mt-1 text-sm text-slate-500">
          Select a patient to upload or view their investigation reports
        </p>
      </div>

      {patients.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 py-16 text-center">
          <p className="text-sm text-slate-500">No patients enrolled yet.</p>
          <Link href="/dashboard" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
            Go to Dashboard to add patients
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {patients.map((p) => (
            <Link
              key={p.id}
              href={`/patients/${p.id}/investigations`}
              className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50/40"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700">
                {p.study_patient_id.slice(-2)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">{p.patient_name}</p>
                <p className="text-xs text-slate-400">{p.study_patient_id}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
