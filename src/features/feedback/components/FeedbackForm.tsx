'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Loader2, Send } from 'lucide-react'

interface Props {
  userId: string
  fullName: string
  email: string
  studyCode: string
}

const CATEGORIES = [
  { value: 'scale_request', label: 'Request a Scale / Assessment Tool' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'bug', label: 'Bug Report' },
  { value: 'general', label: 'General Feedback' },
]

export function FeedbackForm({ userId, fullName, email, studyCode }: Props) {
  const [category, setCategory] = useState('scale_request')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) {
      toast.error('Please fill in both Subject and Message.')
      return
    }

    setSubmitting(true)
    const { error } = await supabase.from('feedbacks').insert({
      submitted_by: userId,
      full_name: fullName,
      email,
      study_code: studyCode || null,
      category,
      subject: subject.trim(),
      message: message.trim(),
      status: 'open',
    })
    setSubmitting(false)

    if (error) {
      toast.error('Failed to submit: ' + error.message)
    } else {
      toast.success('Submitted! The admin will review your request.')
      setSubject('')
      setMessage('')
      setCategory('scale_request')
    }
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <h2 className="text-sm font-semibold text-slate-800">New Request / Feedback</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">Category</label>
          <select
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {studyCode && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">Your Study</label>
            <input
              readOnly
              value={studyCode}
              className="w-full rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-500"
            />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-600">Subject <span className="text-red-500">*</span></label>
        <input
          type="text"
          placeholder={category === 'scale_request'
            ? 'e.g. Please add SF-36 Quality of Life Scale'
            : 'Brief summary of your request'}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          maxLength={200}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-600">Message <span className="text-red-500">*</span></label>
        <textarea
          rows={5}
          placeholder={category === 'scale_request'
            ? 'Describe the scale: name, what it measures, number of items, scoring method, and why you need it for your study...'
            : 'Describe your feedback or request in detail...'}
          className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={2000}
        />
        <p className="text-right text-xs text-slate-400">{message.length}/2000</p>
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting
          ? <><Loader2 size={15} className="mr-2 animate-spin" /> Submitting…</>
          : <><Send size={15} className="mr-2" /> Submit Request</>
        }
      </Button>
    </form>
  )
}
