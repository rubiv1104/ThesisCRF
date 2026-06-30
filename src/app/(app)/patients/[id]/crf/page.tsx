import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CrfView } from '@/features/crf/components/CrfView'
import { CrfStatusBanner } from '@/features/crf/components/CrfStatusBanner'
import { InvestigationUpload } from '@/features/investigations/components/InvestigationUpload'
import { ConsentUpload } from '@/features/investigations/components/ConsentUpload'
import { AssessmentsPanel } from '@/features/assessments/AssessmentsPanel'
import { APP_NAME } from '@/constants'
import { Printer, FileDown } from 'lucide-react'
import { studyTitle, studyBatch, getStudyMeta, expectedSlots } from '@/features/crf/studyMeta'

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
      .select('id, patient_name, study_patient_id, age, gender, study_id, studies(study_code), research_groups(group_name)')
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

  // Patient-summary metrics (at-a-glance strip)
  const [consentRes, invRes, assessRes, fillRes] = await Promise.all([
    supabase.from('investigation_documents').select('id', { count: 'exact', head: true }).eq('patient_id', id).eq('doc_type', 'consent'),
    supabase.from('investigation_documents').select('id', { count: 'exact', head: true }).eq('patient_id', id).eq('doc_type', 'investigation'),
    supabase.from('assessment_results').select('id', { count: 'exact', head: true }).eq('patient_id', id),
    supabase.rpc('crf_fill_counts'),
  ])
  const hasConsent = (consentRes.count ?? 0) > 0
  const investigationCount = invRes.count ?? 0
  const assessmentCount = assessRes.count ?? 0
  const filled = ((fillRes.data ?? []) as any[]).find((f) => f.patient_id === id)?.filled ?? 0
  const expected = expectedSlots(studyCode)
  const completionPct = expected > 0 ? Math.min(100, Math.round((filled / expected) * 100)) : 0
  const pctColor = completionPct >= 90 ? 'bg-green-500' : completionPct >= 50 ? 'bg-blue-500' : completionPct >= 20 ? 'bg-amber-500' : 'bg-slate-300'
  const statusLabel = crfData?.validation_status === 'approved' ? 'Approved'
    : crfData?.validation_status === 'submitted' ? 'Awaiting Review'
    : crfData?.validation_status === 'returned' ? 'Returned' : 'In Progress'
  const statusCls = crfData?.validation_status === 'approved' ? 'bg-green-50 text-green-700'
    : crfData?.validation_status === 'submitted' ? 'bg-amber-100 text-amber-700'
    : crfData?.validation_status === 'returned' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
  const excelData: Record<string, string> = (uploadedRaw as any)?.data ?? {}

  return (
    <div className="space-y-4">
      {/* Patient header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
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
          <p className="mt-1 max-w-2xl text-sm font-medium text-slate-700">{studyTitle(studyCode)}</p>
          <p className="text-xs text-slate-400">
            {getStudyMeta(studyCode).scholar}{getStudyMeta(studyCode).scholar ? ' · ' : ''}Batch {studyBatch(studyCode)}
          </p>
          {(getStudyMeta(studyCode).iec || getStudyMeta(studyCode).ctri) && (
            <p className="text-xs text-slate-400">
              {getStudyMeta(studyCode).iec && <>IEC No.: {getStudyMeta(studyCode).iec}</>}
              {getStudyMeta(studyCode).iec && getStudyMeta(studyCode).ctri ? ' · ' : ''}
              {getStudyMeta(studyCode).ctri && <>CTRI No.: {getStudyMeta(studyCode).ctri}</>}
            </p>
          )}
        </div>

        {/* Export actions */}
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={`/print/crf/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Printer size={14} /> Print / PDF
          </a>
          <a
            href={`/api/crf/${id}/docx`}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <FileDown size={14} /> Word
          </a>
        </div>
      </div>

      {/* Patient summary — at-a-glance metrics */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Age / Sex</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-800">{patient.age != null ? `${patient.age}y` : '—'} / {patient.gender ?? '—'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Group</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-800">{groupName || '—'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">CRF Status</p>
          <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusCls}`}>{statusLabel}</span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Completion</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100"><span className={`block h-full rounded-full ${pctColor}`} style={{ width: `${completionPct}%` }} /></span>
            <span className="text-xs font-semibold text-slate-700">{completionPct}%</span>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Consent</p>
          <p className={`mt-0.5 text-sm font-semibold ${hasConsent ? 'text-green-700' : 'text-amber-600'}`}>{hasConsent ? '✓ On file' : 'Missing'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Reports / Scales</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-800">{investigationCount} / {assessmentCount}</p>
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

      {/* Consent form — required before data collection */}
      <ConsentUpload patientId={id} readOnly={isReadOnly} />

      {/* Assessment scales (Assessment Engine) */}
      <AssessmentsPanel patientId={id} studyCode={studyCode} readOnly={isReadOnly || crfData?.validation_status === 'approved'} />

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
        <InvestigationUpload patientId={id} patientName={patient.patient_name} readOnly={isReadOnly} />
      </div>

      {/* Signatories */}
      <div className="mt-8 border-t border-slate-200 pt-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="border-t border-slate-300 pt-1 text-sm font-medium text-slate-800">{getStudyMeta(studyCode).scholar || '—'}</p>
            <p className="text-xs text-slate-400">Research Scholar</p>
          </div>
          <div>
            <p className="border-t border-slate-300 pt-1 text-sm font-medium text-slate-800">{getStudyMeta(studyCode).supervisor || '—'}</p>
            <p className="text-xs text-slate-400">Supervisor</p>
          </div>
        </div>
      </div>
    </div>
  )
}
