'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ShieldCheck, ShieldAlert, Upload, Eye, Trash2, Loader2, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

interface ConsentDoc {
  id: string
  file_name: string
  file_path: string
  created_at: string
}

interface Props {
  patientId: string
  /** When true, hides upload/replace/remove (guide / admin view) */
  readOnly?: boolean
}

export function ConsentUpload({ patientId, readOnly = false }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any
  const fileRef = useRef<HTMLInputElement>(null)
  const [doc, setDoc] = useState<ConsentDoc | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('investigation_documents')
      .select('id, file_name, file_path, created_at')
      .eq('patient_id', patientId)
      .eq('doc_type', 'consent')
      .order('created_at', { ascending: false })
      .limit(1)
    setDoc((data?.[0] as ConsentDoc) ?? null)
    setLoading(false)
  }, [patientId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load() }, [load])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 50 * 1024 * 1024) { toast.error('File too large. Maximum 50 MB.'); return }
    setBusy(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const ext = file.name.split('.').pop()
      const filePath = `${user?.id ?? 'anon'}/${patientId}/consent_${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('investigation-docs').upload(filePath, file)
      if (upErr) throw upErr

      // Remove any previous consent rows + files (keep a single current consent)
      const { data: old } = await supabase
        .from('investigation_documents').select('id, file_path')
        .eq('patient_id', patientId).eq('doc_type', 'consent')
      const oldRows = (old ?? []) as { id: string; file_path: string }[]
      if (oldRows.length) {
        await supabase.storage.from('investigation-docs').remove(oldRows.map((r) => r.file_path))
        await supabase.from('investigation_documents').delete().in('id', oldRows.map((r) => r.id))
      }

      const { error: dbErr } = await supabase.from('investigation_documents').insert({
        patient_id: patientId,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        visit_label: 'Consent Form',
        uploaded_by: user?.id,
        doc_type: 'consent',
      })
      if (dbErr) throw dbErr
      toast.success('Consent form uploaded.')
      if (fileRef.current) fileRef.current.value = ''
      await load()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setBusy(false)
    }
  }

  async function openConsent() {
    if (!doc) return
    const { data, error } = await supabase.storage.from('investigation-docs').createSignedUrl(doc.file_path, 300)
    if (error || !data) { toast.error('Could not open file.'); return }
    window.open(data.signedUrl, '_blank', 'noopener,noreferrer')
  }

  async function removeConsent() {
    if (!doc || !confirm('Remove the uploaded consent form?')) return
    await supabase.storage.from('investigation-docs').remove([doc.file_path])
    await supabase.from('investigation_documents').delete().eq('id', doc.id)
    toast.success('Consent form removed.')
    await load()
  }

  return (
    <div className={`rounded-xl border p-4 ${doc ? 'border-green-200 bg-green-50/50' : 'border-amber-200 bg-amber-50/50'}`}>
      <div className="flex flex-wrap items-center gap-3">
        {doc ? <ShieldCheck size={18} className="shrink-0 text-green-600" /> : <ShieldAlert size={18} className="shrink-0 text-amber-600" />}
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-semibold ${doc ? 'text-green-800' : 'text-amber-800'}`}>
            {loading ? 'Checking consent…' : doc ? 'Consent form on file' : 'Consent form not uploaded'}
          </p>
          {doc && <p className="truncate text-xs text-slate-500">{doc.file_name} · {new Date(doc.created_at).toLocaleDateString('en-IN')}</p>}
        </div>

        <div className="flex items-center gap-2">
          {doc && (
            <button onClick={openConsent} className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
              <Eye size={13} /> View
            </button>
          )}
          {!readOnly && (
            <>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={busy}
                className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {busy ? <Loader2 size={13} className="animate-spin" /> : doc ? <RefreshCw size={13} /> : <Upload size={13} />}
                {doc ? 'Replace' : 'Upload'}
              </button>
              {doc && (
                <button onClick={removeConsent} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50" title="Remove">
                  <Trash2 size={14} />
                </button>
              )}
              <input ref={fileRef} type="file" accept=".pdf,application/pdf,image/jpeg,image/png" className="hidden" onChange={handleUpload} disabled={busy} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
