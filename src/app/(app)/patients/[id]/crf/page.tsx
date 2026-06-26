import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CrfView } from '@/features/crf/components/CrfView'
import { CrfStatusBanner } from '@/features/crf/components/CrfStatusBanner'
import { InvestigationUpload } from '@/features/investigations/components/InvestigationUpload'
import { APP_NAME } from '@/constants'

export const metadata = { title: `CRF | ${APP_NAME}` }

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CrfPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient() as any

  const { data: { user } } = await supabase.auth.getUser()

  // Run viewer role check and patient fetch in parallel
  const [{ data: viewerProfile }, { data: raw }] = await Promise.all([
    supabase.from('user_profiles').select('role').eq('id', user?.id).single(),
    supabase.from('patients')
      .select('id, patient_name, study_patient_id, study_id, studies(study_code), research_groups(group_name)')
      .eq('id', id)
      .single(),
  ])

  const patient = raw as any
  if (!patient) notFound()

  const viewerRole: string = (viewerProfile as any)?.role ?? 'investigator'
  const isReadOnly = viewerRole === 'admin' || viewerRole === 'teacher'
  const studyCode: string = patient.studies?.study_code ?? 'ECZ2026'
  const groupName: string = patient.research_groups?.group_name ?? ''

  // Run CRF status and Excel data fetch in parallel
  const [{ data: crf }, { data: uploadedRaw }] = await Promise.all([
    supabase.from('crfs')
      .select('validation_status, validation_note, validated_at')
      .eq('patient_id', id)
      .maybeSingle(),
    supabase.from('master_chart_uploads')
      .select('data')
      .eq('study_id', patient.study_id)
      .ilike('patient_name', patient.patient_name.trim())
      .maybeSingle(),
  ])

  const crfData = crf as any
  const excelData: Record<string, string> = (uploadedRaw as any)?.data ?? {}

  return (
    <div className="space-y-4">
      {/* Patient header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href={viewerRole === 'admin' ? '/admin/patients' : viewerRole === 'teacher' ? '/teacher' : '/dashboard'}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              ← {viewerRole === 'admin' ? 'All Patients' : viewerRole === 'teacher' ? 'My Students' : 'My Patients'}
            </Link>
            <span className="text-xs text-slate-300">/</span>
            <p className="text-xs font-medium text-slate-500">{patient.study_patient_id}</p>
            {groupName && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                groupName === 'Group A' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
              }`}>
                {groupName}
              </span>
            )}
          </div>
          <h1 className="mt-1 text-xl font-semibold text-slate-900">{patient.patient_name}</h1>
          <p className="text-xs text-slate-400">{studyCode} — Case Report Form</p>
        </div>
      </div>

      {/* Status banner — guide feedback + submit button (investigators only) */}
      {!isReadOnly && (
        <CrfStatusBanner
          patientId={id}
          validationStatus={crfData?.validation_status ?? null}
          validationNote={crfData?.validation_note ?? null}
          validatedAt={crfData?.validated_at ?? null}
        />
      )}
      {isReadOnly && crfData?.validation_status && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-500">
          CRF status: <span className="font-medium capitalize text-slate-700">{crfData.validation_status}</span>
        </div>
      )}

      {/* CRF form — locked once approved */}
      <CrfView
        patientId={id}
        studyCode={studyCode}
        excelData={excelData}
        readOnly={isReadOnly || crfData?.validation_status === 'approved'}
      />

      {/* Investigation documents */}
      <div className="mt-8 border-t border-slate-200 pt-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-800">Investigation Reports</h2>
            <p className="text-xs text-slate-400">
              Upload lab reports, USG, ECG etc. Included when printing this CRF.
            </p>
          </div>
          <Link href={`/patients/${id}/investigations`} className="text-xs text-blue-600 hover:underline">
            Full page view →
          </Link>
        </div>
        <InvestigationUpload patientId={id} patientName={patient.patient_name} />
      </div>
    </div>
  )
}
