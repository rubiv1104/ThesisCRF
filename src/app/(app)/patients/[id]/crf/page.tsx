import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CrfView } from '@/features/crf/components/CrfView'
import { APP_NAME } from '@/constants'

export const metadata = { title: `CRF | ${APP_NAME}` }

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CrfPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: patientRaw } = await supabase
    .from('patients')
    .select('id, patient_name, study_patient_id, study_id')
    .eq('id', id)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const patient = patientRaw as any
  if (!patient) notFound()

  // Resolve study code — default to ECZ2026 for this batch
  const studyCode = 'ECZ2026'

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {patient.study_patient_id}
        </p>
        <h1 className="text-xl font-semibold text-slate-900">{patient.patient_name}</h1>
      </div>
      <CrfView patientId={id} studyCode={studyCode} />
    </div>
  )
}
