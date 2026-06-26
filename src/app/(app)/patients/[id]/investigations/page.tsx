import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { InvestigationUpload } from '@/features/investigations/components/InvestigationUpload'
import { APP_NAME } from '@/constants'
import { ChevronLeft } from 'lucide-react'

export const metadata = { title: `Investigations | ${APP_NAME}` }

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PatientInvestigationsPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: raw } = await supabase
    .from('patients')
    .select('id, patient_name, study_patient_id, studies(study_code)')
    .eq('id', id)
    .single()

  const patient = raw as { id: string; patient_name: string; study_patient_id: string; studies: { study_code: string } | null } | null
  if (!patient) notFound()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link
          href="/investigations"
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
        >
          <ChevronLeft size={14} /> Investigations
        </Link>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {patient.study_patient_id} · {patient.studies?.study_code}
        </p>
        <h1 className="text-xl font-semibold text-slate-900">{patient.patient_name}</h1>
        <p className="text-xs text-slate-400 mt-0.5">Investigation Reports</p>
      </div>

      <div className="flex gap-3">
        <Link
          href={`/patients/${id}/crf`}
          className="text-xs text-blue-600 hover:underline"
        >
          Open CRF →
        </Link>
      </div>

      <InvestigationUpload patientId={id} patientName={patient.patient_name} />
    </div>
  )
}
