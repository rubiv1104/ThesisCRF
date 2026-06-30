'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  ChevronLeft, Star, MessageSquare, CornerUpLeft, CheckCircle2, Printer,
  FileText, Eye, X, Loader2, TrendingDown, TrendingUp, Minus, Download, Trash2,
} from 'lucide-react'
import { REVIEW_TABS, type ReviewTabId } from './tabs'
import type { GuideReviewData, ReviewComment } from './loadGuideReview'
import type { FollowUpStatus } from './followup'
import {
  setCrfDecision, addGuideComment, resolveGuideComment, deleteGuideComment, toggleBookmark,
} from './actions'

type TabId = 'summary' | ReviewTabId | 'timeline' | 'comments'

function statusPill(s: string) {
  if (s === 'approved') return { cls: 'bg-green-50 text-green-700 ring-green-200', label: 'Approved' }
  if (s === 'submitted') return { cls: 'bg-amber-100 text-amber-700 ring-amber-300', label: 'Awaiting Review' }
  if (s === 'returned') return { cls: 'bg-red-50 text-red-600 ring-red-200', label: 'Returned' }
  return { cls: 'bg-slate-100 text-slate-500 ring-slate-200', label: 'In Progress' }
}

const FU_STYLE: Record<FollowUpStatus, { dot: string; text: string; label: string }> = {
  completed: { dot: 'bg-green-500', text: 'text-green-700', label: 'Completed' },
  overdue: { dot: 'bg-red-500', text: 'text-red-600', label: 'Overdue' },
  upcoming: { dot: 'bg-amber-400', text: 'text-amber-700', label: 'Due soon' },
  pending: { dot: 'bg-slate-300', text: 'text-slate-400', label: 'Upcoming' },
}

function fmtDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { dateStyle: 'medium' })
}

export function GuideReview({ data }: { data: GuideReviewData }) {
  const supabase = createClient() as any
  const [tab, setTab] = useState<TabId>('summary')
  const [bookmarked, setBookmarked] = useState(data.bookmarked)
  const [comments, setComments] = useState<ReviewComment[]>(data.comments)
  const [status, setStatus] = useState(data.crf.validation_status)
  const [sheet, setSheet] = useState<null | 'comment' | 'correction' | 'approve'>(null)
  const [isPending, startTransition] = useTransition()
  const [viewer, setViewer] = useState<{ url: string; name: string; isImage: boolean } | null>(null)

  const openComments = comments.filter((c) => c.status === 'open')

  // Which tabs to show: always summary/assessments/investigations/followup/timeline/comments;
  // CRF read tabs only if they have content.
  const tabs = useMemo(() => {
    const list: { id: TabId; label: string; badge?: number }[] = [{ id: 'summary', label: 'Summary' }]
    for (const t of REVIEW_TABS) {
      if (t.id === 'investigations') { list.push({ id: 'investigations', label: 'Investigations', badge: data.investigations.length || undefined }); continue }
      if (t.id === 'assessments') { list.push({ id: 'assessments', label: 'Assessments', badge: data.assessments.length || undefined }); continue }
      if (t.id === 'followup') { list.push({ id: 'followup', label: 'Follow-up' }); continue }
      if (data.tabs[t.id].length > 0) list.push({ id: t.id, label: t.label })
    }
    list.push({ id: 'timeline', label: 'Timeline' })
    list.push({ id: 'comments', label: 'Comments', badge: openComments.length || undefined })
    return list
  }, [data, openComments.length])

  async function openDoc(path: string, name: string) {
    const { data: signed, error } = await supabase.storage.from('investigation-docs').createSignedUrl(path, 300)
    if (error || !signed) { toast.error('Could not open file.'); return }
    const ext = (name.split('.').pop() ?? '').toLowerCase()
    setViewer({ url: signed.signedUrl, name, isImage: ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext) })
  }
  async function downloadDoc(path: string, name: string) {
    const { data: signed, error } = await supabase.storage.from('investigation-docs').createSignedUrl(path, 60)
    if (error || !signed) { toast.error('Could not download.'); return }
    const a = document.createElement('a'); a.href = signed.signedUrl; a.download = name; a.click()
  }

  function onBookmark() {
    startTransition(async () => {
      const r = await toggleBookmark(data.patient.id, data.studyCode)
      if (r.ok) setBookmarked(!!r.bookmarked)
      else toast.error(r.error ?? 'Failed')
    })
  }

  const pill = statusPill(status)

  return (
    <div className="pb-24">
      {/* ── Sticky header + tabs ── */}
      <div className="sticky top-0 z-20 -mx-4 border-b border-slate-200 bg-white/95 px-4 pb-0 pt-3 backdrop-blur sm:-mx-6 sm:px-6">
        <Link href="/teacher" className="mb-2 flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800">
          <ChevronLeft size={14} /> My Patients
        </Link>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-400">{data.patient.study_patient_id}</span>
              {data.groupName && (
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${data.groupName === 'Group A' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>{data.groupName}</span>
              )}
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">{data.studyCode}</span>
            </div>
            <h1 className="truncate text-lg font-semibold text-slate-900">{data.patient.patient_name}</h1>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button onClick={onBookmark} title={bookmarked ? 'Remove bookmark' : 'Bookmark'} className="rounded-lg p-1.5 hover:bg-slate-100">
              <Star size={18} className={bookmarked ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
            </button>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${pill.cls}`}>{pill.label}</span>
          </div>
        </div>

        {/* Tab strip */}
        <div className="-mx-4 mt-2 flex gap-1 overflow-x-auto px-4 sm:-mx-6 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                tab === t.id ? 'border-green-600 text-green-700' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
              {t.badge != null && (
                <span className={`rounded-full px-1.5 text-[10px] font-semibold ${tab === t.id ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{t.badge}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab body ── */}
      <div className="mt-4 space-y-4">
        {tab === 'summary' && <SummaryTab data={data} status={status} openComments={openComments.length} onGoto={setTab} />}
        {(tab === 'history' || tab === 'examination' || tab === 'treatment' || tab === 'other') && (
          <ReadTab sections={data.tabs[tab]} />
        )}
        {tab === 'investigations' && <InvestigationsTab data={data} onOpen={openDoc} onDownload={downloadDoc} />}
        {tab === 'assessments' && <AssessmentsTab data={data} />}
        {tab === 'followup' && <FollowUpTab data={data} />}
        {tab === 'timeline' && <TimelineTab data={data} />}
        {tab === 'comments' && (
          <CommentsTab
            data={data} comments={comments} setComments={setComments}
            onAdd={(section, text) => doAddComment(section, null, text)}
          />
        )}
      </div>

      {/* ── Sticky action bar ── */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-3 py-2.5">
          <button onClick={() => setSheet('comment')} className="flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-100">
            <MessageSquare size={18} /> Comment
          </button>
          <button onClick={() => setSheet('correction')} className="flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[11px] font-medium text-amber-700 hover:bg-amber-50">
            <CornerUpLeft size={18} /> Correction
          </button>
          <button
            onClick={() => setSheet('approve')}
            disabled={status === 'approved'}
            className="flex flex-[1.3] flex-col items-center gap-0.5 rounded-lg bg-green-600 py-1.5 text-[11px] font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >
            <CheckCircle2 size={18} /> {status === 'approved' ? 'Approved' : 'Approve'}
          </button>
          <a href={`/print/crf/${data.patient.id}`} target="_blank" rel="noopener noreferrer" className="flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-100">
            <Printer size={18} /> Print
          </a>
        </div>
      </div>

      {/* ── Sheets ── */}
      {sheet === 'comment' && (
        <CommentSheet
          title="Add comment" sections={data.sections} confirmLabel="Add comment" tone="blue"
          onClose={() => setSheet(null)} busy={isPending}
          onSubmit={(section, text) => doAddComment(section, null, text, () => setSheet(null))}
        />
      )}
      {sheet === 'correction' && (
        <CommentSheet
          title="Request correction" sections={data.sections} confirmLabel="Send & return CRF" tone="amber"
          hint="This adds a comment and returns the CRF to the investigator for correction."
          requireText onClose={() => setSheet(null)} busy={isPending}
          onSubmit={(section, text) => doRequestCorrection(section, text)}
        />
      )}
      {sheet === 'approve' && (
        <ApproveSheet
          note={data.crf.validation_note} busy={isPending}
          onClose={() => setSheet(null)}
          onConfirm={(note) => doDecision('approved', note)}
        />
      )}

      {/* ── Doc viewer ── */}
      {viewer && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/70 p-2 sm:p-6" onClick={() => setViewer(null)}>
          <div className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-2.5">
              <FileText size={16} className="shrink-0 text-red-400" />
              <span className="flex-1 truncate text-sm font-medium text-slate-800">{viewer.name}</span>
              <a href={viewer.url} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50">Open in new tab</a>
              <button onClick={() => setViewer(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-auto bg-slate-100">
              {viewer.isImage
                ? <div className="flex min-h-full items-center justify-center p-4">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={viewer.url} alt={viewer.name} className="max-h-full max-w-full object-contain" /></div>
                : <iframe src={viewer.url} title={viewer.name} className="h-full w-full" />}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // ── handlers ──
  function doAddComment(section: string, field: string | null, text: string, after?: () => void) {
    if (!data.crf.id) { toast.error('No CRF record for this patient.'); return }
    startTransition(async () => {
      const r = await addGuideComment(data.crf.id!, data.patient.id, section, field, text)
      if (!r.ok) { toast.error(r.error ?? 'Failed'); return }
      setComments((c) => [{
        id: `tmp-${Date.now()}`, section_key: section || 'General', field_key: field,
        correction: text, corrector_name: 'You', status: 'open', created_at: new Date().toISOString(),
      }, ...c])
      toast.success('Comment added.')
      after?.()
    })
  }
  function doRequestCorrection(section: string, text: string) {
    if (!data.crf.id) { toast.error('No CRF record for this patient.'); return }
    startTransition(async () => {
      const c = await addGuideComment(data.crf.id!, data.patient.id, section, null, text)
      if (!c.ok) { toast.error(c.error ?? 'Failed'); return }
      const d = await setCrfDecision(data.crf.id!, data.patient.id, 'returned', text)
      if (!d.ok) { toast.error(d.error ?? 'Failed'); return }
      setStatus('returned')
      setComments((cs) => [{
        id: `tmp-${Date.now()}`, section_key: section || 'General', field_key: null,
        correction: text, corrector_name: 'You', status: 'open', created_at: new Date().toISOString(),
      }, ...cs])
      toast.success('CRF returned to investigator for correction.')
      setSheet(null)
    })
  }
  function doDecision(s: 'approved' | 'returned' | 'pending', note: string) {
    if (!data.crf.id) { toast.error('No CRF record for this patient.'); return }
    startTransition(async () => {
      const r = await setCrfDecision(data.crf.id!, data.patient.id, s, note)
      if (!r.ok) { toast.error(r.error ?? 'Failed'); return }
      setStatus(s)
      toast.success(s === 'approved' ? 'CRF approved — investigator notified.' : 'Done.')
      setSheet(null)
    })
  }
}

// ─────────────────────────── Tab components ───────────────────────────

function SummaryTab({ data, status, openComments, onGoto }: { data: GuideReviewData; status: string; openComments: number; onGoto: (t: TabId) => void }) {
  const pct = data.completionPct
  const pctColor = pct >= 90 ? 'bg-green-500' : pct >= 50 ? 'bg-blue-500' : pct >= 20 ? 'bg-amber-500' : 'bg-slate-300'
  const info: [string, string][] = [
    ['Study', data.studyCode],
    ['Group', data.groupName ?? '—'],
    ['Age / Sex', `${data.patient.age != null ? data.patient.age + 'y' : '—'} / ${data.patient.gender ?? '—'}`],
    ['Recruited', fmtDate(data.patient.created_at)],
    ['Last updated', fmtDate(data.crf.updated_at)],
    ['Investigator', data.patient.investigator_name ?? '—'],
  ]
  return (
    <>
      <p className="text-xs leading-snug text-slate-500">{data.studyTitle}</p>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {info.map(([k, v]) => (
          <div key={k} className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">{k}</p>
            <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">{v}</p>
          </div>
        ))}
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-400">Completion</p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100"><span className={`block h-full rounded-full ${pctColor}`} style={{ width: `${pct}%` }} /></span>
            <span className="text-xs font-semibold text-slate-700">{pct}%</span>
          </div>
        </div>
      </div>

      {/* Assessment summary */}
      <Card title="Assessment summary" action={data.assessments.length ? { label: 'Details', onClick: () => onGoto('assessments') } : undefined}>
        {data.assessments.length === 0 ? (
          <Empty>No assessment scores recorded yet.</Empty>
        ) : (
          <ul className="divide-y divide-slate-100">
            {data.assessments.map((a) => (
              <li key={a.code} className="flex items-center gap-3 px-4 py-2.5">
                <span className="w-16 shrink-0 font-mono text-xs font-bold uppercase text-slate-700">{a.code}</span>
                <span className="flex-1 truncate text-sm text-slate-600">{a.latest?.interpretation ?? '—'}</span>
                <Trend delta={a.delta} />
                <span className="w-12 shrink-0 text-right text-sm font-semibold text-slate-900">{a.latest?.total ?? '—'}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Investigation summary */}
      <Card title="Investigations" action={data.investigations.length ? { label: 'Open', onClick: () => onGoto('investigations') } : undefined}>
        {data.investigations.length === 0 ? (
          <Empty>No reports uploaded.</Empty>
        ) : (
          <div className="px-4 py-3 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{data.investigations.length}</span> report{data.investigations.length > 1 ? 's' : ''} · latest: {data.investigations[0]?.file_name}
          </div>
        )}
      </Card>

      {/* Comments shortcut */}
      <button onClick={() => onGoto('comments')} className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left hover:bg-slate-50">
        <span className="text-sm font-medium text-slate-700">Guide comments</span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${openComments ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-400'}`}>{openComments} open</span>
      </button>

      {status === 'returned' && data.crf.validation_note && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-semibold">Returned for correction</p>
          <p className="mt-0.5 text-red-600">{data.crf.validation_note}</p>
        </div>
      )}
    </>
  )
}

function ReadTab({ sections }: { sections: GuideReviewData['tabs'][ReviewTabId] }) {
  if (!sections || sections.length === 0) return <Empty>Nothing recorded in this section yet.</Empty>
  return (
    <>
      {sections.map((s) => (
        <Card key={s.key} title={s.title}>
          <dl className="divide-y divide-slate-50">
            {s.rows.map((r) => (
              <div key={r.key} className="flex gap-3 px-4 py-2">
                <dt className="w-2/5 shrink-0 text-xs text-slate-500">{r.label}</dt>
                <dd className="flex-1 text-sm font-medium text-slate-800">{r.value || '—'}</dd>
              </div>
            ))}
          </dl>
        </Card>
      ))}
    </>
  )
}

function InvestigationsTab({ data, onOpen, onDownload }: { data: GuideReviewData; onOpen: (p: string, n: string) => void; onDownload: (p: string, n: string) => void }) {
  if (data.investigations.length === 0) return <Empty>No investigation reports uploaded.</Empty>
  return (
    <Card title="Uploaded reports">
      <ul className="divide-y divide-slate-100">
        {data.investigations.map((d) => (
          <li key={d.id} className="flex items-center gap-3 px-4 py-3">
            <FileText size={18} className="shrink-0 text-red-400" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">{d.file_name}</p>
              <p className="text-xs text-slate-400">{d.visit_label}{d.description ? ` · ${d.description}` : ''} · {fmtDate(d.created_at)}</p>
            </div>
            <button onClick={() => onOpen(d.file_path, d.file_name)} title="View" className="rounded-md p-2 text-slate-500 hover:bg-slate-100"><Eye size={16} /></button>
            <button onClick={() => onDownload(d.file_path, d.file_name)} title="Download" className="rounded-md p-2 text-slate-500 hover:bg-slate-100"><Download size={16} /></button>
          </li>
        ))}
      </ul>
    </Card>
  )
}

function AssessmentsTab({ data }: { data: GuideReviewData }) {
  if (data.assessments.length === 0) return <Empty>No assessment scores recorded yet.</Empty>
  return (
    <>
      {data.assessments.map((a) => (
        <Card key={a.code} title={a.code.toUpperCase()} right={<Trend delta={a.delta} />}>
          <div className="px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {a.points.map((p, i) => (
                <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-center">
                  <p className="text-[10px] uppercase text-slate-400">{p.visit}</p>
                  <p className="text-sm font-bold text-slate-800">{p.total ?? '—'}</p>
                </div>
              ))}
            </div>
            {a.latest?.interpretation && <p className="mt-2 text-sm text-slate-600">{a.latest.interpretation}</p>}
          </div>
        </Card>
      ))}
    </>
  )
}

function FollowUpTab({ data }: { data: GuideReviewData }) {
  return (
    <Card title="Follow-up tracker" right={<span className="text-[11px] text-slate-400">computed from visit dates</span>}>
      <ul className="divide-y divide-slate-100">
        {data.followUp.map((v, i) => {
          const st = FU_STYLE[v.status]
          return (
            <li key={i} className="flex items-center gap-3 px-4 py-2.5">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${st.dot}`} />
              <span className="flex-1 text-sm font-medium text-slate-700">{v.label}</span>
              <span className="text-xs text-slate-400">{fmtDate(v.dueDate)}</span>
              <span className={`w-20 shrink-0 text-right text-xs font-semibold ${st.text}`}>{st.label}</span>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

function TimelineTab({ data }: { data: GuideReviewData }) {
  const kindColor: Record<string, string> = {
    register: 'bg-blue-500', update: 'bg-slate-400', comment: 'bg-amber-400',
    approved: 'bg-green-500', returned: 'bg-red-500', submitted: 'bg-amber-500',
  }
  return (
    <Card title="Patient timeline">
      <ol className="relative px-5 py-4">
        <span className="absolute left-[26px] top-5 bottom-5 w-px bg-slate-200" aria-hidden />
        {data.timeline.map((e, i) => (
          <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
            <span className={`relative z-10 mt-1 h-3 w-3 shrink-0 rounded-full ring-4 ring-white ${kindColor[e.kind] ?? 'bg-slate-400'}`} />
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800">{e.label}</p>
              {e.detail && <p className="truncate text-xs text-slate-500">{e.detail}</p>}
              <p className="text-[11px] text-slate-400">{new Date(e.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  )
}

function CommentsTab({ data, comments, setComments, onAdd }: {
  data: GuideReviewData; comments: ReviewComment[]
  setComments: React.Dispatch<React.SetStateAction<ReviewComment[]>>
  onAdd: (section: string, text: string) => void
}) {
  const [section, setSection] = useState('')
  const [text, setText] = useState('')
  const [, startT] = useTransition()
  const open = comments.filter((c) => c.status === 'open')
  const resolved = comments.filter((c) => c.status === 'resolved')

  function resolve(id: string) {
    setComments((cs) => cs.map((c) => c.id === id ? { ...c, status: 'resolved' } : c))
    startT(() => { resolveGuideComment(id, data.patient.id) })
  }
  function remove(id: string) {
    setComments((cs) => cs.filter((c) => c.id !== id))
    startT(() => { deleteGuideComment(id, data.patient.id) })
  }

  return (
    <>
      <Card title="Add a comment">
        <div className="space-y-2.5 p-4">
          <select value={section} onChange={(e) => setSection(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm">
            <option value="">General (whole CRF)</option>
            {data.sections.map((s) => <option key={s.key} value={s.title}>{s.title}</option>)}
          </select>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="What should the investigator check or correct?" className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
          <button
            onClick={() => { if (!text.trim()) return; onAdd(section, text.trim()); setText(''); setSection('') }}
            disabled={!text.trim()}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <MessageSquare size={14} /> Add comment
          </button>
        </div>
      </Card>

      {comments.length === 0 ? (
        <Empty>No comments yet.</Empty>
      ) : (
        <Card title={`Comments (${open.length} open)`}>
          <ul className="divide-y divide-slate-50">
            {[...open, ...resolved].map((c) => (
              <li key={c.id} className={`flex items-start gap-3 px-4 py-3 ${c.status === 'resolved' ? 'opacity-50' : ''}`}>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    {c.section_key && c.section_key !== 'General' && <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">{c.section_key}</span>}
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.status === 'resolved' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-700'}`}>{c.status}</span>
                  </div>
                  <p className="text-sm text-slate-800">{c.correction}</p>
                  <p className="mt-1 text-xs text-slate-400">{c.corrector_name} · {fmtDate(c.created_at)}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  {c.status === 'open' && <button onClick={() => resolve(c.id)} title="Resolve" className="rounded-md px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-50"><CheckCircle2 size={13} /></button>}
                  <button onClick={() => remove(c.id)} title="Delete" className="rounded-md p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"><Trash2 size={13} /></button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  )
}

// ─────────────────────────── Sheets ───────────────────────────

function CommentSheet({ title, hint, sections, confirmLabel, tone, requireText, busy, onClose, onSubmit }: {
  title: string; hint?: string; sections: { key: string; title: string }[]
  confirmLabel: string; tone: 'blue' | 'amber'; requireText?: boolean; busy: boolean
  onClose: () => void; onSubmit: (section: string, text: string) => void
}) {
  const [section, setSection] = useState('')
  const [text, setText] = useState('')
  const btn = tone === 'amber' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
  return (
    <Sheet title={title} onClose={onClose}>
      {hint && <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">{hint}</p>}
      <select value={section} onChange={(e) => setSection(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm">
        <option value="">General (whole CRF)</option>
        {sections.map((s) => <option key={s.key} value={s.title}>{s.title}</option>)}
      </select>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} autoFocus placeholder="Type your note…" className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
      <button
        onClick={() => { if (requireText && !text.trim()) { toast.error('Please enter a note.'); return } onSubmit(section, text.trim()) }}
        disabled={busy || (requireText && !text.trim())}
        className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white disabled:opacity-50 ${btn}`}
      >
        {busy ? <Loader2 size={16} className="animate-spin" /> : <MessageSquare size={16} />} {confirmLabel}
      </button>
    </Sheet>
  )
}

function ApproveSheet({ note, busy, onClose, onConfirm }: { note: string; busy: boolean; onClose: () => void; onConfirm: (note: string) => void }) {
  const [val, setVal] = useState(note)
  return (
    <Sheet title="Approve CRF" onClose={onClose}>
      <p className="rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">Approving locks the record. The investigator is notified.</p>
      <textarea value={val} onChange={(e) => setVal(e.target.value)} rows={3} placeholder="Optional note to the investigator…" className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
      <button onClick={() => onConfirm(val)} disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">
        {busy ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} Confirm approval
      </button>
    </Sheet>
  )
}

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div className="w-full max-w-lg space-y-3 rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ─────────────────────────── Small bits ───────────────────────────

function Card({ title, right, action, children }: { title: string; right?: React.ReactNode; action?: { label: string; onClick: () => void }; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2.5">
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        {right}
        {action && <button onClick={action.onClick} className="text-xs font-medium text-green-700 hover:underline">{action.label}</button>}
      </div>
      {children}
    </div>
  )
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border-2 border-dashed border-slate-200 py-10 text-center text-sm text-slate-400">{children}</div>
}

function Trend({ delta }: { delta: number | null }) {
  if (delta == null) return <span className="flex items-center gap-0.5 text-xs text-slate-300"><Minus size={13} /></span>
  if (delta < 0) return <span className="flex items-center gap-0.5 text-xs font-medium text-green-600"><TrendingDown size={14} /> {delta}</span>
  if (delta > 0) return <span className="flex items-center gap-0.5 text-xs font-medium text-red-500"><TrendingUp size={14} /> +{delta}</span>
  return <span className="flex items-center gap-0.5 text-xs text-slate-400"><Minus size={13} /> 0</span>
}
