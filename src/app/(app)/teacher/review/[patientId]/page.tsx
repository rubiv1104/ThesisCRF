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

  // Load CRF record for validation status
  const { data: crfRaw } = await (supabase as any)
    .from('crfs')
    .select('id, validation_status, validation_note, validated_at')
    .eq('patient_id', patientId)
    .single()

  const crf = crfRaw as any
  const studyCode: string = patient.studies?.study_code ?? 'ECZ2026'
  const groupName: string = patient.research_groups?.group_name ?? ''

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/teacher" className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800">
          <ChevronLeft size={14} /> My Students&apos; CRFs
        </Link>
      </div>

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
          </div>
          <h1 className="text-xl font-semibold text-slate-900">{patient.patient_name}</h1>
          <p className="text-xs text-slate-400">{studyCode} CRF — Guide Review Mode</p>
        </div>
        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200">
          Read-only view
        </span>
      </div>

      {/* Validation + Corrections panel at the top for teacher */}
      <CrfReviewPanel
        patientId={patientId}
        crfId={crf?.id ?? null}
        teacherId={user.id}
        teacherName={(profile as any)?.full_name ?? 'Guide'}
        currentValidationStatus={crf?.validation_status ?? 'pending'}
        currentValidationNote={crf?.validation_note ?? ''}
        validatedAt={crf?.validated_at ?? null}
      />

      {/* CRF form — read-only for teacher, but fully navigable */}
      <div>
        <p className="mb-2 text-xs text-slate-400 italic">CRF data shown below is read-only. Use visit tabs to navigate. Add corrections above.</p>
        <CrfView patientId={patientId} studyCode={studyCode} readOnly />
      </div>
    </div>
  )
}
