import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CrfView } from '@/features/crf/components/CrfView'
import { CRF_REGISTRY } from '@/features/crf/registry'
import { APP_NAME } from '@/constants'
import { ChevronLeft } from 'lucide-react'

export const metadata = { title: `CRF Template Preview | ${APP_NAME}` }

interface PageProps {
  searchParams: Promise<{ study?: string }>
}

export default async function AdminTemplatePreviewPage({ searchParams }: PageProps) {
  const { study: studyParam } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles').select('role').eq('id', user.id).single()
  if ((profile as any)?.role !== 'admin') redirect('/dashboard')

  // All studies from DB
  const { data: studiesRaw } = await supabase
    .from('studies').select('id, study_code, study_title').order('study_code')
  const studies = (studiesRaw ?? []) as { id: string; study_code: string; study_title: string }[]

  const allCodes = studies.map((s) => s.study_code)
  const studyCode: string = (studyParam && allCodes.includes(studyParam))
    ? studyParam
    : (allCodes[0] ?? 'ECZ2026')
  const studyTitle = studies.find((s) => s.study_code === studyCode)?.study_title ?? ''

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/admin/patients" className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800">
          <ChevronLeft size={14} /> All Patients
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-mono font-bold text-blue-700">{studyCode}</p>
          <h1 className="text-xl font-semibold text-slate-900">CRF Template Preview</h1>
          {studyTitle && <p className="text-xs text-slate-400 max-w-xl">{studyTitle}</p>}
        </div>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
          Blank template — no patient data
        </span>
      </div>

      {/* Study switcher */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">All studies</p>
        <div className="flex flex-wrap gap-2">
          {studies.map((s) => {
            const hasTemplate = !!CRF_REGISTRY[s.study_code]
            return (
              <Link
                key={s.study_code}
                href={`/admin/template?study=${s.study_code}`}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  s.study_code === studyCode
                    ? 'bg-blue-600 text-white shadow-sm'
                    : hasTemplate
                    ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    : 'bg-white border border-dashed border-slate-300 text-slate-400'
                }`}
                title={s.study_title}
              >
                {s.study_code}
                {!hasTemplate && <span className="ml-1 text-[10px]">(no template)</span>}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
        Read-only blank template — shows the CRF structure for this study. No patient data.
      </div>

      {CRF_REGISTRY[studyCode] ? (
        <CrfView studyCode={studyCode} readOnly previewMode />
      ) : (
        <div className="rounded-xl border-2 border-dashed border-slate-200 py-16 text-center">
          <p className="text-sm font-medium text-slate-600">No CRF template registered for {studyCode}</p>
          <p className="mt-1 text-xs text-slate-400">Add the template definition to the CRF registry to enable it.</p>
        </div>
      )}
    </div>
  )
}
