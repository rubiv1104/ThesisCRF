import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { APP_NAME } from '@/constants'
import { FeedbackForm } from '@/features/feedback/components/FeedbackForm'

export const metadata = { title: `Feedback | ${APP_NAME}` }

export default async function FeedbackPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name, email, role')
    .eq('id', user.id)
    .single()

  const p = profile as { full_name: string; email: string; role: string } | null

  // Only investigators use feedback — teachers and admins are redirected
  if (p?.role === 'teacher') redirect('/teacher')
  if (p?.role === 'admin') redirect('/admin')

  const { data: linkRaw } = await supabase
    .from('study_investigators')
    .select('studies(study_code)')
    .eq('investigator_id', user.id)
    .single()
  const studyCode = (linkRaw as any)?.studies?.study_code ?? ''

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: mine } = await (supabase as any)
    .from('feedbacks')
    .select('id, subject, category, status, created_at')
    .eq('submitted_by', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const myFeedbacks = (mine ?? []) as any[]

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Feedback & Requests</h1>
        <p className="mt-1 text-sm text-slate-500">
          Request new scales, assessments, or report issues. The admin will review and update your CRF accordingly.
        </p>
      </div>

      <FeedbackForm
        userId={user.id}
        fullName={p?.full_name ?? ''}
        email={p?.email ?? user.email ?? ''}
        studyCode={studyCode}
      />

      {myFeedbacks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-700">Your Previous Submissions</h2>
          {myFeedbacks.map((fb: any) => (
            <div key={fb.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
              <div>
                <p className="font-medium text-slate-800">{fb.subject}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {new Date(fb.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                </p>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                fb.status === 'resolved' ? 'bg-green-50 text-green-700' :
                fb.status === 'in_progress' ? 'bg-blue-50 text-blue-700' :
                'bg-amber-50 text-amber-700'
              }`}>
                {fb.status?.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
