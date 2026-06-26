'use client'

import { useTransition } from 'react'
import { CheckCircle2, RotateCcw, Loader2 } from 'lucide-react'
import { updateStudyStatus } from './actions'
import { toast } from 'sonner'

interface Props {
  studyId: string
  studyCode: string
  currentStatus: string
}

export function StudyStatusButton({ studyId, studyCode, currentStatus }: Props) {
  const [pending, startTransition] = useTransition()
  const isActive = currentStatus === 'active'

  function handleClick() {
    const nextStatus = isActive ? 'completed' : 'active'
    const msg = isActive
      ? `Mark "${studyCode}" as completed? CRF data will remain accessible but the study will be closed.`
      : `Reactivate "${studyCode}"? This will set the study back to active.`
    if (!confirm(msg)) return

    startTransition(async () => {
      const res = await updateStudyStatus(studyId, nextStatus)
      if ('error' in res) toast.error(res.error)
      else toast.success(isActive ? `${studyCode} marked as completed.` : `${studyCode} reactivated.`)
    })
  }

  if (pending) {
    return (
      <button disabled className="flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-400 opacity-60">
        <Loader2 size={11} className="animate-spin" />
        Saving…
      </button>
    )
  }

  if (isActive) {
    return (
      <button
        onClick={handleClick}
        className="flex items-center gap-1 rounded-md border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors"
        title="Mark study as completed"
      >
        <CheckCircle2 size={11} />
        Complete
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
      title="Reactivate this study"
    >
      <RotateCcw size={11} />
      Reactivate
    </button>
  )
}
