import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { APP_NAME } from '@/constants'
import { FeedbackStatusForm } from '@/features/feedback/components/FeedbackStatusForm'
import { ChevronLeft } from 'lucide-react'

export const metadata = { title: `Feedback Inbox | ${APP_NAME}` }

const CATEGORY_LABEL: Record<string, string> = {
  scale_request: 'Scale / Assessment Request',
  bug: 'Bug Report',
  general: 'General Feedback',
  feature: 'Feature Request',
}

const STATUS_COLOR: Record<string, string> = {
  open: 'bg-amber-50 text-amber-700',
  in_progress: 'bg-blue-50 text-blue-700',
  resolved: 'bg-green-50 text-green-700',
}

export default async function FeedbackInboxPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single()
  if ((profile as any)?.role !== 'admin') redirect('/dashboard')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawFeedbacks } = await (supabase as any)
    .from('feedbacks')
    .select('*')
    .order('created_at', { ascending: false })

  const feedbacks = (rawFeedbacks ?? []) as any[]
  const open = feedbacks.filter((f) => f.status === 'open').length
  const inProgress = feedbacks.filter((f) => f.status === 'in_progress').length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin" className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800">
          <ChevronLeft size={14} /> Admin Overview
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Feedback Inbox</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Scale/assessment requests and other messages from investigators
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-700">
            {open} open
          </span>
          <span className="rounded-full bg-blue-50 px-2.5 py-1 font-medium text-blue-700">
            {inProgress} in progress
          </span>
        </div>
      </div>

      {feedbacks.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 py-16 text-center">
          <p className="text-sm text-slate-500">No feedback submitted yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedbacks.map((fb: any) => (
            <div key={fb.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-slate-500">
                      {CATEGORY_LABEL[fb.category] ?? fb.category}
                    </span>
                    {fb.study_code && (
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-mono text-blue-700">
                        {fb.study_code}
                      </span>
                    )}
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[fb.status] ?? 'bg-slate-50 text-slate-600'}`}>
                      {fb.status?.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="mt-1 font-semibold text-slate-900">{fb.subject}</h3>
                  <p className="mt-1 text-sm text-slate-600 whitespace-pre-wrap">{fb.message}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    From: <span className="font-medium">{fb.full_name ?? 'Unknown'}</span>
                    {fb.email ? ` (${fb.email})` : ''}
                    {' · '}{new Date(fb.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              </div>

              {fb.admin_notes && (
                <div className="rounded-lg bg-purple-50 px-4 py-2.5 text-sm text-purple-800">
                  <p className="text-xs font-semibold text-purple-500 mb-1">Admin Notes</p>
                  {fb.admin_notes}
                </div>
              )}

              <FeedbackStatusForm feedbackId={fb.id} currentStatus={fb.status} currentNotes={fb.admin_notes ?? ''} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
