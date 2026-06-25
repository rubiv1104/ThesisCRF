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

  const { data: raw } = await supabase
    .from('patients')
    .select('id, patient_name, study_patient_id, study_id, studies(study_code), research_groups(group_name)')
    .eq('id', id)
    .single()

  const patient = raw as any
  if (!patient) notFound()

  const studyCode: string = patient.studies?.study_code ?? 'ECZ2026'
  const groupName: string = patient.research_groups?.group_name ?? ''

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {patient.study_patient_id}
          </p>
          {groupName && (
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              groupName === 'Group A' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
            }`}>
              {groupName}
            </span>
          )}
        </div>
        <h1 className="text-xl font-semibold text-slate-900">{patient.patient_name}</h1>
        <p className="text-xs text-slate-400">{studyCode} CRF</p>
      </div>
      <CrfView patientId={id} studyCode={studyCode} />
    </div>
  )
}
