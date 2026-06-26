import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CrfView } from '@/features/crf/components/CrfView'
import { CRF_REGISTRY } from '@/features/crf/registry'
import { APP_NAME } from '@/constants'

export const metadata = { title: `CRF Preview | ${APP_NAME}` }

export default async function CrfPreviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles').select('role').eq('id', user.id).single()
  const role = (profile as any)?.role
  if (role === 'admin') redirect('/admin/template')
  if (role === 'teacher') redirect('/teacher/template')

  // Get investigator's assigned study
  const { data: linkRaw } = await supabase
    .from('study_investigators')
    .select('study_id, studies(study_code, study_title)')
    .eq('investigator_id', user.id)
    .single()

  const link = linkRaw as any
  const studyCode: string = link?.studies?.study_code ?? ''
  const studyTitle: string = link?.studies?.study_title ?? ''

  return (
    <div className="space-y-4">
      <div>
        {studyCode && (
          <p className="text-xs font-mono font-bold text-blue-700">{studyCode}</p>
        )}
        <h1 className="text-xl font-semibold text-slate-900">CRF Template Preview</h1>
        {studyTitle && (
          <p className="mt-0.5 text-xs text-slate-400 max-w-xl">{studyTitle}</p>
        )}
      </div>

      <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
        Blank template — shows the CRF structure for your study. No patient data is saved here.
        To fill and submit a CRF, open a patient from <a href="/dashboard" className="underline font-medium">My Patients</a>.
      </div>

      {!studyCode ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 py-16 text-center">
          <p className="text-sm font-medium text-slate-600">No study assigned yet</p>
          <p className="mt-1 text-xs text-slate-400">Contact your administrator to be assigned to a study.</p>
        </div>
      ) : !CRF_REGISTRY[studyCode] ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 py-16 text-center">
          <p className="text-sm font-medium text-slate-600">CRF template not available for {studyCode}</p>
          <p className="mt-1 text-xs text-slate-400">Contact your administrator.</p>
        </div>
      ) : (
        <CrfView studyCode={studyCode} readOnly previewMode />
      )}
    </div>
  )
}
