'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Loader2, Send, Paperclip, X, FileText } from 'lucide-react'

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

const ACCEPTED = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
const MAX_MB = 10

export function FeedbackForm({ userId, fullName, email, studyCode }: Props) {
  const [category, setCategory] = useState('scale_request')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null
    if (!f) { setFile(null); return }
    if (f.size > MAX_MB * 1024 * 1024) {
      toast.error(`File too large — max ${MAX_MB} MB`)
      e.target.value = ''
      return
    }
    setFile(f)
  }

  function removeFile() {
    setFile(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) {
      toast.error('Please fill in both Subject and Message.')
      return
    }

    setSubmitting(true)
    let attachmentUrl: string | null = null

    // Upload file if attached
    if (file) {
      const ext = file.name.split('.').pop() ?? 'bin'
      const path = `${userId}/${Date.now()}.${ext}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('feedback-attachments')
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (uploadError) {
        toast.error('File upload failed: ' + uploadError.message)
        setSubmitting(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('feedback-attachments')
        .getPublicUrl(uploadData.path)
      attachmentUrl = urlData?.publicUrl ?? null
    }

    const { error } = await supabase.from('feedbacks').insert({
      submitted_by: userId,
      full_name: fullName,
      email,
      study_code: studyCode || null,
      category,
      subject: subject.trim(),
      message: message.trim(),
      status: 'open',
      attachment_url: attachmentUrl,
    })
    setSubmitting(false)

    if (error) {
      toast.error('Failed to submit: ' + error.message)
    } else {
      toast.success('Submitted! The admin will review your request.')
      setSubject('')
      setMessage('')
      setCategory('scale_request')
      removeFile()
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

      {/* File attachment */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-600">
          Attachment <span className="text-slate-400 font-normal">(optional — PDF or Word, max {MAX_MB} MB)</span>
        </label>
        {file ? (
          <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5">
            <FileText size={16} className="shrink-0 text-blue-600" />
            <span className="flex-1 truncate text-sm text-blue-800">{file.name}</span>
            <span className="text-xs text-blue-500">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
            <button type="button" onClick={removeFile} className="text-blue-400 hover:text-red-500 transition-colors">
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
            <Paperclip size={15} />
            <span>Click to attach a PDF or Word document</span>
            <input
              ref={fileRef}
              type="file"
              accept={ACCEPTED}
              onChange={handleFile}
              className="hidden"
            />
          </label>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
      >
        {submitting
          ? <><Loader2 size={15} className="animate-spin" /> {file ? 'Uploading & Submitting…' : 'Submitting…'}</>
          : <><Send size={15} /> Submit Request</>
        }
      </button>
    </form>
  )
}
