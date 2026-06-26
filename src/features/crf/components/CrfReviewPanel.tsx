'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { CheckCircle2, XCircle, MessageSquare, Trash2, Loader2, RotateCcw } from 'lucide-react'

interface Correction {
  id: string
  section_key: string
  field_key: string | null
  correction: string
  corrector_name: string | null
  status: string
  created_at: string
}

interface Props {
  patientId: string
  crfId: string | null
  teacherId: string
  teacherName: string
  currentValidationStatus: string
  currentValidationNote: string
  validatedAt: string | null
}

export function CrfReviewPanel({
  patientId, crfId, teacherId, teacherName,
  currentValidationStatus, currentValidationNote, validatedAt,
}: Props) {
  const supabase = createClient() as any
  const [corrections, setCorrections] = useState<Correction[]>([])
  const [loadingCorrections, setLoadingCorrections] = useState(true)
  const [newSection, setNewSection] = useState('')
  const [newNote, setNewNote] = useState('')
  const [addingCorrection, setAddingCorrection] = useState(false)
  const [validationStatus, setValidationStatus] = useState(currentValidationStatus)
  const [validationNote, setValidationNote] = useState(currentValidationNote)
  const [savingValidation, setSavingValidation] = useState(false)

  async function loadCorrections() {
    if (!crfId) { setLoadingCorrections(false); return }
    const { data } = await supabase
      .from('crf_corrections')
      .select('id, section_key, field_key, correction, corrector_name, status, created_at')
      .eq('crf_id', crfId)
      .order('created_at', { ascending: false })
    setCorrections((data ?? []) as Correction[])
    setLoadingCorrections(false)
  }

  useEffect(() => { loadCorrections() }, [crfId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function addComment() {
    if (!newNote.trim()) {
      toast.error('Please enter a comment.')
      return
    }
    if (!crfId) {
      toast.error('CRF not found for this patient.')
      return
    }
    setAddingCorrection(true)
    const { error } = await supabase.from('crf_corrections').insert({
      crf_id: crfId,
      section_key: newSection.trim() || 'General',
      field_key: null,
      correction: newNote.trim(),
      corrected_by: teacherId,
      corrector_name: teacherName,
      status: 'open',
    })
    setAddingCorrection(false)
    if (error) { toast.error('Failed: ' + error.message); return }
    toast.success('Comment added.')
    setNewNote('')
    setNewSection('')
    await loadCorrections()
  }

  async function resolveComment(id: string) {
    await supabase.from('crf_corrections').update({ status: 'resolved', updated_at: new Date().toISOString() }).eq('id', id)
    await loadCorrections()
  }

  async function deleteComment(id: string) {
    await supabase.from('crf_corrections').delete().eq('id', id)
    await loadCorrections()
  }

  async function saveValidation(status: string) {
    if (!crfId) { toast.error('No CRF record found for this patient.'); return }
    setSavingValidation(true)
    const { error } = await supabase
      .from('crfs')
      .update({
        validation_status: status,
        validation_note: validationNote,
        validated_by: teacherId,
        validated_at: new Date().toISOString(),
      })
      .eq('id', crfId)
    setSavingValidation(false)
    if (error) { toast.error('Failed: ' + error.message); return }
    setValidationStatus(status)
    toast.success(
      status === 'approved' ? 'CRF approved and student notified.' :
      status === 'returned' ? 'CRF returned to student for correction.' :
      'Status reset.'
    )
  }

  const openComments = corrections.filter((c) => c.status === 'open')
  const resolvedComments = corrections.filter((c) => c.status === 'resolved')

  return (
    <div className="space-y-4">

      {/* ── Approve / Return panel ── */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">Guide Review &amp; Decision</h2>
          <span className={`rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${
            validationStatus === 'approved' ? 'bg-green-50 text-green-700 ring-1 ring-green-200' :
            validationStatus === 'returned' ? 'bg-red-50 text-red-600 ring-1 ring-red-200' :
            'bg-amber-50 text-amber-600 ring-1 ring-amber-200'
          }`}>
            {validationStatus === 'pending' ? 'Pending Review' : validationStatus}
          </span>
        </div>

        {validatedAt && (
          <p className="text-xs text-slate-400">
            Last action: {new Date(validatedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600">
            Overall note to student <span className="text-slate-400 font-normal">(shown when you approve or return)</span>
          </label>
          <textarea
            rows={3}
            className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="e.g. 'CRF data is complete and verified. Approved.' or 'Please correct the EASI scores for Day 45 — values seem incorrect.'"
            value={validationNote}
            onChange={(e) => setValidationNote(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            disabled={savingValidation || validationStatus === 'approved'}
            onClick={() => saveValidation('approved')}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {savingValidation ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
            Approve CRF {validationStatus === 'approved' && '✓'}
          </button>
          <button
            disabled={savingValidation || validationStatus === 'returned'}
            onClick={() => saveValidation('returned')}
            className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
          >
            {savingValidation ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
            Return for Correction {validationStatus === 'returned' && '✓'}
          </button>
          {(validationStatus === 'approved' || validationStatus === 'returned') && (
            <button
              disabled={savingValidation}
              onClick={() => saveValidation('pending')}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              <RotateCcw size={14} />
              Reset to Pending
            </button>
          )}
        </div>
      </div>

      {/* ── Comments panel ── */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50 px-5 py-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Comments &amp; Corrections</h2>
            <p className="text-xs text-slate-400 mt-0.5">Add notes about specific sections. Student sees these when the CRF is returned.</p>
          </div>
          {openComments.length > 0 && (
            <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600">
              {openComments.length} open
            </span>
          )}
        </div>

        {/* Add comment form */}
        <div className="p-5 border-b border-slate-100 space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">
              Section <span className="text-slate-400 font-normal">(optional — e.g. "Investigations", "EASI Scoring")</span>
            </label>
            <input
              type="text"
              placeholder="Which section does this comment relate to?"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={newSection}
              onChange={(e) => setNewSection(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">
              Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Describe what needs to be checked or corrected by the student…"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
          </div>
          <button
            onClick={addComment}
            disabled={addingCorrection || !newNote.trim()}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {addingCorrection ? <Loader2 size={14} className="animate-spin" /> : <MessageSquare size={14} />}
            Add Comment
          </button>
        </div>

        {/* Comments list */}
        {loadingCorrections ? (
          <div className="flex items-center gap-2 px-5 py-4 text-sm text-slate-400">
            <Loader2 size={14} className="animate-spin" /> Loading…
          </div>
        ) : corrections.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-slate-400">No comments yet.</p>
            <p className="text-xs text-slate-300 mt-0.5">Add a comment above to flag something for the student.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-50">
            {[...openComments, ...resolvedComments].map((c) => (
              <li key={c.id} className={`px-5 py-4 flex items-start gap-3 ${c.status === 'resolved' ? 'opacity-50' : ''}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {c.section_key && c.section_key !== 'General' && (
                      <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">{c.section_key}</span>
                    )}
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      c.status === 'resolved' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-800">{c.correction}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {c.corrector_name} · {new Date(c.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  {c.status === 'open' && (
                    <button
                      onClick={() => resolveComment(c.id)}
                      title="Mark as resolved"
                      className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-50 transition-colors"
                    >
                      <CheckCircle2 size={13} /> Resolve
                    </button>
                  )}
                  <button
                    onClick={() => deleteComment(c.id)}
                    title="Delete comment"
                    className="rounded-md p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
