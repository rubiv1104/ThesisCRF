'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, FileText, Trash2, Loader2, Download, Eye, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface Doc {
  id: string
  file_name: string
  file_path: string
  file_size: number | null
  visit_label: string | null
  description: string | null
  created_at: string
}

interface InvestigationUploadProps {
  patientId: string
  patientName: string
  /** When true, hides upload form and delete buttons (guide / admin view) */
  readOnly?: boolean
}

const VISIT_OPTIONS = [
  'Before Treatment (BT)',
  'Visit 1 (15 days)',
  'Visit 2 (30 days)',
  'Visit 3 (45 days)',
  'Visit 4 (60 days)',
  'Visit 5 (75 days)',
  'After Treatment (AT)',
  'Other',
]

function fmtSize(bytes: number | null) {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function InvestigationUpload({ patientId, patientName: _patientName, readOnly = false }: InvestigationUploadProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any
  const fileRef = useRef<HTMLInputElement>(null)
  const [docs, setDocs] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [visitLabel, setVisitLabel] = useState(VISIT_OPTIONS[0])
  const [description, setDescription] = useState('')
  const [viewer, setViewer] = useState<{ url: string; name: string; isImage: boolean } | null>(null)
  const [viewerLoading, setViewerLoading] = useState(false)

  const loadDocs = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('investigation_documents')
      .select('id, file_name, file_path, file_size, visit_label, description, created_at')
      .eq('patient_id', patientId)
      .eq('doc_type', 'investigation')
      .order('created_at', { ascending: false })
    setDocs((data as Doc[]) ?? [])
    setLoading(false)
  }, [patientId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { loadDocs() }, [loadDocs])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File too large. Maximum 50 MB.')
      return
    }

    setUploading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const ext = file.name.split('.').pop()
      const filePath = `${user?.id ?? 'anon'}/${patientId}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('investigation-docs')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { error: dbError } = await supabase
        .from('investigation_documents')
        .insert({
          patient_id: patientId,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          visit_label: visitLabel,
          description: description.trim() || null,
          uploaded_by: user?.id,
          doc_type: 'investigation',
        })

      if (dbError) throw dbError

      toast.success('File uploaded successfully.')
      setDescription('')
      if (fileRef.current) fileRef.current.value = ''
      await loadDocs()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed.'
      toast.error(msg)
    } finally {
      setUploading(false)
    }
  }

  async function handleDownload(doc: Doc) {
    const { data, error } = await supabase.storage
      .from('investigation-docs')
      .createSignedUrl(doc.file_path, 60)
    if (error || !data) { toast.error('Could not generate download link.'); return }
    const a = document.createElement('a')
    a.href = data.signedUrl
    a.download = doc.file_name
    a.click()
  }

  async function handleView(doc: Doc) {
    setViewerLoading(true)
    const { data, error } = await supabase.storage
      .from('investigation-docs')
      .createSignedUrl(doc.file_path, 300)
    setViewerLoading(false)
    if (error || !data) { toast.error('Could not open file.'); return }
    const ext = (doc.file_name.split('.').pop() ?? '').toLowerCase()
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)
    setViewer({ url: data.signedUrl, name: doc.file_name, isImage })
  }

  async function handleDelete(doc: Doc) {
    if (!confirm(`Delete "${doc.file_name}"?`)) return
    const { error: storageErr } = await supabase.storage
      .from('investigation-docs')
      .remove([doc.file_path])
    if (storageErr) { toast.error('Could not delete file from storage.'); return }
    await supabase.from('investigation_documents').delete().eq('id', doc.id)
    toast.success('File deleted.')
    await loadDocs()
  }

  return (
    <div className="space-y-5">
      {/* Upload form — hidden for guides / admin (read-only view) */}
      {!readOnly && (
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-slate-800">Upload Investigation Report</h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">Visit / Timepoint</label>
            <select
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={visitLabel}
              onChange={(e) => setVisitLabel(e.target.value)}
              suppressHydrationWarning
            >
              {VISIT_OPTIONS.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">Description (optional)</label>
            <input
              type="text"
              placeholder="e.g. CBC, LFT, HbA1c..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              suppressHydrationWarning
            />
          </div>
        </div>

        <div
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-8 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          <Upload size={24} className="text-slate-400" />
          <p className="text-sm font-medium text-slate-600">Click to select PDF or image</p>
          <p className="text-xs text-slate-400">PDF, JPEG, PNG · Max 50 MB</p>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,application/pdf,image/jpeg,image/png"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </div>

        {uploading && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Loader2 size={16} className="animate-spin" />
            Uploading…
          </div>
        )}
      </div>
      )}

      {/* Document list */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Uploaded Documents
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 px-5 py-6 text-sm text-slate-400">
            <Loader2 size={16} className="animate-spin" /> Loading…
          </div>
        ) : docs.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-slate-400">
            No investigation documents uploaded yet.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {docs.map((doc) => (
              <li key={doc.id} className="flex items-center gap-3 px-5 py-3">
                <FileText size={18} className="shrink-0 text-red-400" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">{doc.file_name}</p>
                  <p className="text-xs text-slate-400">
                    {doc.visit_label}
                    {doc.description ? ` · ${doc.description}` : ''}
                    {doc.file_size ? ` · ${fmtSize(doc.file_size)}` : ''}
                    {' · '}{new Date(doc.created_at).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleView(doc)}
                  title="View"
                >
                  <Eye size={15} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(doc)}
                  title="Download"
                >
                  <Download size={15} />
                </Button>
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(doc)}
                    title="Delete"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={15} />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {viewerLoading && (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <Loader2 size={16} className="animate-spin" /> Opening…
        </div>
      )}

      {/* Inline viewer — shows the PDF/image as-is */}
      {viewer && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/70 p-2 sm:p-6"
          onClick={() => setViewer(null)}
        >
          <div
            className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-2.5">
              <FileText size={16} className="shrink-0 text-red-400" />
              <span className="flex-1 truncate text-sm font-medium text-slate-800">{viewer.name}</span>
              <a
                href={viewer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Open in new tab
              </a>
              <button onClick={() => setViewer(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" title="Close">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-slate-100">
              {viewer.isImage ? (
                <div className="flex min-h-full items-center justify-center p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={viewer.url} alt={viewer.name} className="max-h-full max-w-full object-contain" />
                </div>
              ) : (
                <iframe src={viewer.url} title={viewer.name} className="h-full w-full" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
