'use client'

import { useState, useTransition } from 'react'
import { submitCrfForReview, recallCrfSubmission } from '@/app/(app)/patients/[id]/crf/actions'
import { CheckCircle2, Clock, AlertTriangle, Send, Loader2, XCircle, Undo2 } from 'lucide-react'

interface Props {
  patientId: string
  validationStatus: string | null
  validationNote: string | null
  validatedAt: string | null
}

export function CrfStatusBanner({ patientId, validationStatus, validationNote, validatedAt }: Props) {
  const [pending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState('')
  const status = validationStatus ?? 'pending'

  function handleSubmit() {
    setFeedback('')
    startTransition(async () => {
      const res = await submitCrfForReview(patientId)
      if ('error' in res) setFeedback(res.error)
    })
  }

  function handleRecall() {
    setFeedback('')
    startTransition(async () => {
      const res = await recallCrfSubmission(patientId)
      if ('error' in res) setFeedback(res.error)
    })
  }

  const dateStr = validatedAt
    ? new Date(validatedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })
    : null

  if (status === 'approved') {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4">
        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-green-600" />
        <div>
          <p className="font-semibold text-green-800">CRF Approved by Guide</p>
          {dateStr && <p className="text-xs text-green-600 mt-0.5">Approved on {dateStr}</p>}
          {validationNote && (
            <p className="mt-2 text-sm text-green-700 bg-green-100 rounded-lg px-3 py-2">
              {validationNote}
            </p>
          )}
        </div>
      </div>
    )
  }

  if (status === 'returned') {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <XCircle size={20} className="mt-0.5 shrink-0 text-red-500" />
          <div className="flex-1">
            <p className="font-semibold text-red-800">Returned for Correction</p>
            {dateStr && <p className="text-xs text-red-500 mt-0.5">Returned on {dateStr}</p>}
            {validationNote && (
              <p className="mt-2 text-sm text-red-700 bg-red-100 rounded-lg px-3 py-2">
                {validationNote}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={pending}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          {pending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          Re-submit after Corrections
        </button>
        {feedback && <p className="text-xs text-red-600">{feedback}</p>}
      </div>
    )
  }

  if (status === 'submitted') {
    return (
      <div className="space-y-2">
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <Clock size={20} className="mt-0.5 shrink-0 text-amber-500" />
          <div className="flex-1">
            <p className="font-semibold text-amber-800">Submitted — Awaiting Guide Review</p>
            {dateStr && <p className="text-xs text-amber-600 mt-0.5">Submitted on {dateStr}</p>}
            <p className="text-xs text-amber-600 mt-1">
              Your guide will review and either approve or return with corrections.
            </p>
          </div>
          <button
            onClick={handleRecall}
            disabled={pending}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50 disabled:opacity-60 transition-colors"
            title="Recall submission to make edits"
          >
            {pending ? <Loader2 size={12} className="animate-spin" /> : <Undo2 size={12} />}
            Recall
          </button>
        </div>
        {feedback && <p className="text-xs text-red-600">{feedback}</p>}
      </div>
    )
  }

  // pending / not submitted yet
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
      <div className="flex items-start gap-3">
        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-slate-400" />
        <div>
          <p className="text-sm font-semibold text-slate-700">Not submitted yet</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Fill all sections, then submit to your guide for review and approval.
          </p>
          {feedback && <p className="mt-1 text-xs text-red-600">{feedback}</p>}
        </div>
      </div>
      <button
        onClick={handleSubmit}
        disabled={pending}
        className="flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
      >
        {pending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        Submit for Review
      </button>
    </div>
  )
}
