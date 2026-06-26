import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CrfView } from '@/features/crf/components/CrfView'
import { CrfReviewPanel } from '@/features/crf/components/CrfReviewPanel'
import { APP_NAME } from '@/constants'
import { ChevronLeft } from 'lucide-react'

export const metadata = { title: `CRF Review | ${APP_NAME}` }

interface PageProps {
  params: Promise<{ patientId: string }>
}

export default async function TeacherCrfReviewPage({ params }: PageProps) {
  const { patientId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  const role = (profile as any)?.role
  if (role !== 'teacher' && role !== 'admin') redirect('/dashboard')

  const { data: raw } = await supabase
    .from('patients')
    .select('id, patient_name, study_patient_id, study_id, studies(study_code), research_groups(group_name)')
    .eq('id', patientId)
    .single()

  const patient = raw as any
  if (!patient) notFound()

  const { data: crfRaw } = await (supabase as any)
    .from('crfs')
    .select('id, validation_status, validation_note, validated_at')
    .eq('patient_id', patientId)
    .single()

  const crf = crfRaw as any
  const studyCode: string = patient.studies?.study_code ?? 'ECZ2026'
  const groupName: string = patient.research_groups?.group_name ?? ''

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div className="space-y-3">
        <Link href="/teacher" className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800">
          <ChevronLeft size={14} /> Students&apos; CRFs
        </Link>
        <div className="flex items-start justify-between gap-4">
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
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                {studyCode}
              </span>
            </div>
            <h1 className="text-xl font-semibold text-slate-900">{patient.patient_name}</h1>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${
            crf?.validation_status === 'submitted'
              ? 'bg-amber-50 text-amber-700 ring-amber-200'
              : crf?.validation_status === 'approved'
              ? 'bg-green-50 text-green-700 ring-green-200'
              : crf?.validation_status === 'returned'
              ? 'bg-red-50 text-red-600 ring-red-200'
              : 'bg-slate-100 text-slate-500 ring-slate-200'
          }`}>
            {crf?.validation_status === 'submitted' ? 'Awaiting Review'
              : crf?.validation_status ?? 'In Progress'}
          </span>
        </div>
      </div>

      {/* CRF data — all sections expanded so guide can read everything */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-1">
        <CrfView patientId={patientId} studyCode={studyCode} readOnly />
      </div>

      {/* Review panel — approve / return / add comments — below the CRF */}
      <CrfReviewPanel
        patientId={patientId}
        crfId={crf?.id ?? null}
        teacherId={user.id}
        teacherName={(profile as any)?.full_name ?? 'Guide'}
        currentValidationStatus={crf?.validation_status ?? 'pending'}
        currentValidationNote={crf?.validation_note ?? ''}
        validatedAt={crf?.validated_at ?? null}
      />
    </div>
  )
}
