'use client'

import { useTransition } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { deletePatient } from '@/app/(app)/patients/[id]/crf/actions'
import { toast } from 'sonner'

export function DeletePatientButton({ patientId, patientName }: { patientId: string; patientName: string }) {
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm(`Delete patient "${patientName}" and all their CRF data permanently?\n\nThis cannot be undone.`)) return
    startTransition(async () => {
      const res = await deletePatient(patientId)
      if (res && 'error' in res) toast.error(res.error)
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="flex items-center gap-1 rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
      title="Delete patient and all CRF data"
    >
      {pending ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
      Delete
    </button>
  )
}
