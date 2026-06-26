'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
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

const VALIDATION_OPTIONS = [
  { value: 'approved', label: 'Approve CRF', icon: CheckCircle2, color: 'bg-green-600 hover:bg-green-700 text-white' },
  { value: 'returned', label: 'Return for Correction', icon: XCircle, color: 'bg-red-500 hover:bg-red-600 text-white' },
  { value: 'pending', label: 'Reset to Pending', icon: RotateCcw, color: 'bg-slate-200 hover:bg-slate-300 text-slate-700' },
]

export function CrfReviewPanel({
  patientId, crfId, teacherId, teacherName,
  currentValidationStatus, currentValidationNote, validatedAt,
}: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any
  const [corrections, setCorrections] = useState<Correction[]>([])
  const [loadingCorrections, setLoadingCorrections] = useState(true)
  const [newSection, setNewSection] = useState('')
  const [newField, setNewField] = useState('')
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

  async function addCorrection() {
    if (!newNote.trim() || !newSection.trim()) {
      toast.error('Section and correction note are required.')
      return
    }
    if (!crfId) {
      toast.error('CRF not found for this patient. Open the CRF first to initialise it.')
      return
    }
    setAddingCorrection(true)
    const { error } = await supabase.from('crf_corrections').insert({
      crf_id: crfId,
      section_key: newSection.trim(),
      field_key: newField.trim() || null,
      correction: newNote.trim(),
      corrected_by: teacherId,
      corrector_name: teacherName,
      status: 'open',
    })
    setAddingCorrection(false)
    if (error) { toast.error('Failed: ' + error.message); return }
    toast.success('Correction added.')
    setNewNote('')
    setNewField('')
    await loadCorrections()
  }

  async function resolveCorrection(id: string) {
    await supabase.from('crf_corrections').update({ status: 'resolved', updated_at: new Date().toISOString() }).eq('id', id)
    await loadCorrections()
  }

  async function deleteCorrection(id: string) {
    await supabase.from('crf_corrections').delete().eq('id', id)
    await loadCorrections()
  }

  async function saveValidation(status: string) {
    if (!crfId) { toast.error('CRF not initialised yet.'); return }
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
      status === 'approved' ? 'CRF approved!' :
      status === 'returned' ? 'CRF returned for correction.' :
      'Status reset to pending.'
    )
  }

  const openCorrections = corrections.filter((c) => c.status === 'open')
  const resolvedCorrections = corrections.filter((c) => c.status === 'resolved')

  return (
    <div className="space-y-4">
      {/* Validation panel */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">CRF Validation</h2>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
            validationStatus === 'approved' ? 'bg-green-50 text-green-700' :
            validationStatus === 'returned' ? 'bg-red-50 text-red-600' :
            'bg-amber-50 text-amber-600'
          }`}>
            {validationStatus === 'pending' ? 'Pending Review' : validationStatus}
          </span>
        </div>

        {validatedAt && (
          <p className="text-xs text-slate-400">
            Last action: {new Date(validatedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        )}

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">Validation Note (shown to investigator)</label>
          <textarea
            rows={3}
            className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Overall comments for the investigator, e.g. 'CRF complete and data verified. Approved.' or 'Section 3 values need correction.'"
            value={validationNote}
            onChange={(e) => setValidationNote(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {VALIDATION_OPTIONS.map((opt) => {
            const Icon = opt.icon
            const isCurrent = validationStatus === opt.value
            return (
              <Button
                key={opt.value}
                className={opt.color}
                disabled={savingValidation || isCurrent}
                onClick={() => saveValidation(opt.value)}
                size="sm"
              >
                {savingValidation
                  ? <Loader2 size={14} className="mr-1.5 animate-spin" />
                  : <Icon size={14} className="mr-1.5" />
                }
                {opt.label}
                {isCurrent && ' ✓'}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Corrections panel */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50 px-5 py-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Corrections & Annotations
          </h2>
          {openCorrections.length > 0 && (
            <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600">
              {openCorrections.length} open
            </span>
          )}
        </div>

        {/* Add correction form */}
        <div className="p-5 border-b border-slate-100 space-y-3">
          <p className="text-xs font-medium text-slate-600">Add Correction / Annotation</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs text-slate-500">Section</label>
              <input
                type="text"
                placeholder="e.g. Chief Complaints, Investigations"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-500">Field / Parameter (optional)</label>
              <input
                type="text"
                placeholder="e.g. HbA1c, Pulse Rate"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                value={newField}
                onChange={(e) => setNewField(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Correction Note <span className="text-red-500">*</span></label>
            <textarea
              rows={2}
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Describe what needs to be corrected or clarified..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
          </div>
          <Button size="sm" onClick={addCorrection} disabled={addingCorrection}>
            {addingCorrection
              ? <Loader2 size={14} className="mr-1.5 animate-spin" />
              : <MessageSquare size={14} className="mr-1.5" />
            }
            Add Correction
          </Button>
        </div>

        {/* Corrections list */}
        {loadingCorrections ? (
          <div className="flex items-center gap-2 px-5 py-4 text-sm text-slate-400">
            <Loader2 size={14} className="animate-spin" /> Loading…
          </div>
        ) : corrections.length === 0 ? (
          <div className="px-5 py-6 text-center text-sm text-slate-400">
            No corrections yet. CRF looks good!
          </div>
        ) : (
          <ul className="divide-y divide-slate-50">
            {[...openCorrections, ...resolvedCorrections].map((c) => (
              <li key={c.id} className={`px-5 py-3 flex items-start gap-3 ${c.status === 'resolved' ? 'opacity-50' : ''}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-slate-700">{c.section_key}</span>
                    {c.field_key && (
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">{c.field_key}</span>
                    )}
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      c.status === 'resolved' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-700">{c.correction}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {c.corrector_name} · {new Date(c.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  {c.status === 'open' && (
                    <Button variant="ghost" size="sm" onClick={() => resolveCorrection(c.id)} title="Mark resolved"
                      className="text-green-600 hover:bg-green-50">
                      <CheckCircle2 size={15} />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => deleteCorrection(c.id)} title="Delete"
                    className="text-red-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 size={15} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
