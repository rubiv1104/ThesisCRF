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

export default async function TeacherTemplatePreviewPage({ searchParams }: PageProps) {
  const { study: studyParam } = await searchParams
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

  // Get all studies this teacher supervises (for the study switcher)
  const { data: linksRaw } = await (supabase as any)
    .from('study_teachers')
    .select('studies(id, study_code, study_title)')
    .eq('teacher_id', user.id)

  const links = ((linksRaw ?? []) as any[])

  // Use ?study= param if valid, else first assigned study
  const allCodes = links.map((l: any) => l.studies?.study_code).filter(Boolean)
  const studyCode: string = (studyParam && allCodes.includes(studyParam))
    ? studyParam
    : (allCodes[0] ?? 'ECZ2026')
  const studyTitle: string = links.find((l: any) => l.studies?.study_code === studyCode)?.studies?.study_title ?? ''

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/teacher" className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800">
          <ChevronLeft size={14} /> Back to Dashboard
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

      {/* Study switcher — shown when supervising multiple studies */}
      {links.length > 1 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">Switch study template</p>
          <div className="flex flex-wrap gap-2">
            {links.map((l: any) => {
              const code: string = l.studies?.study_code ?? ''
              const hasTemplate = !!CRF_REGISTRY[code]
              return (
                <Link
                  key={code}
                  href={`/teacher/template?study=${code}`}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    code === studyCode
                      ? 'bg-blue-600 text-white shadow-sm'
                      : hasTemplate
                      ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      : 'bg-white border border-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {code}
                  {!hasTemplate && <span className="ml-1 text-[10px]">(no template)</span>}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
        This is a read-only preview of the Case Report Form. Use the visit tabs to navigate between data collection points. All fields are empty — this shows the structure your students fill in.
      </div>

      {CRF_REGISTRY[studyCode] ? (
        <CrfView studyCode={studyCode} readOnly previewMode />
      ) : (
        <div className="rounded-xl border-2 border-dashed border-slate-200 py-16 text-center">
          <p className="text-sm font-medium text-slate-600">No CRF template found for {studyCode}</p>
          <p className="mt-1 text-xs text-slate-400">Contact the administrator to add this template.</p>
        </div>
      )}
    </div>
  )
}
