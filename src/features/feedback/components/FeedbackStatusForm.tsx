'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface Props {
  feedbackId: string
  currentStatus: string
  currentNotes: string
}

export function FeedbackStatusForm({ feedbackId, currentStatus, currentNotes }: Props) {
  const [status, setStatus] = useState(currentStatus)
  const [notes, setNotes] = useState(currentNotes)
  const [saving, setSaving] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any

  async function save() {
    setSaving(true)
    const { error } = await supabase
      .from('feedbacks')
      .update({ status, admin_notes: notes, updated_at: new Date().toISOString() })
      .eq('id', feedbackId)
    setSaving(false)
    if (error) toast.error('Failed to save: ' + error.message)
    else toast.success('Feedback updated.')
  }

  return (
    <div className="space-y-2 pt-1 border-t border-slate-100">
      <div className="flex items-center gap-3">
        <label className="text-xs font-medium text-slate-500">Status:</label>
        <select
          className="rounded-md border border-slate-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
      <textarea
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        rows={2}
        placeholder="Add notes (e.g. 'Scale added in next update')"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <Button size="sm" onClick={save} disabled={saving}>
        {saving && <Loader2 size={13} className="mr-1.5 animate-spin" />}
        Save
      </Button>
    </div>
  )
}
