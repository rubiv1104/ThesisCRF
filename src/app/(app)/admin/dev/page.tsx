import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { APP_NAME } from '@/constants'
import { CRF_REGISTRY } from '@/features/crf/registry'
import { getStudyMeta } from '@/features/crf/studyMeta'
import { PermissionMatrix } from '@/features/dev/PermissionMatrix'
import { FlaskConical, FileText, ClipboardList, Printer, Database, Layers, Activity } from 'lucide-react'

export const metadata = { title: `Developer Tools | ${APP_NAME}` }

function fmtBytes(b: number) {
  if (!b) return '0 B'
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`
  return `${(b / 1024 / 1024).toFixed(1)} MB`
}

export default async function DevToolsPage() {
  const supabase = await createClient() as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single()
  if ((profile as any)?.role !== 'admin') redirect('/dashboard')

  // ── System counts ──
  const [studies, users, patients, crfsRaw, docsRaw, statusAudit, fieldAudit] = await Promise.all([
    supabase.from('studies').select('id', { count: 'exact', head: true }),
    supabase.from('user_profiles').select('id, role'),
    supabase.from('patients').select('id', { count: 'exact', head: true }),
    supabase.from('crfs').select('validation_status'),
    supabase.from('investigation_documents').select('file_size'),
    supabase.from('crf_status_audit').select('patient_id, old_status, new_status, note, changed_at').order('changed_at', { ascending: false }).limit(12),
    supabase.from('crf_response_audit').select('field_key, old_response, new_response, operation, changed_at').order('changed_at', { ascending: false }).limit(12),
  ])

  const crfs = (crfsRaw.data ?? []) as any[]
  const approved = crfs.filter((c) => c.validation_status === 'approved').length
  const submitted = crfs.filter((c) => c.validation_status === 'submitted').length
  const returned = crfs.filter((c) => c.validation_status === 'returned').length
  const storage = ((docsRaw.data ?? []) as any[]).reduce((s, d) => s + (d.file_size ?? 0), 0)
  const usersArr = (users.data ?? []) as any[]
  const roleCounts = usersArr.reduce((m: Record<string, number>, u) => { m[u.role] = (m[u.role] ?? 0) + 1; return m }, {})

  const stats: { label: string; value: string | number; color?: string }[] = [
    { label: 'Studies', value: studies.count ?? 0 },
    { label: 'Users', value: usersArr.length },
    { label: 'Patients', value: patients.count ?? 0 },
    { label: 'CRFs', value: crfs.length },
    { label: 'Approved / Locked', value: approved, color: 'text-green-700' },
    { label: 'Pending Review', value: submitted, color: 'text-amber-600' },
    { label: 'Returned', value: returned, color: 'text-red-600' },
    { label: 'Storage Used', value: fmtBytes(storage) },
  ]

  const tools = [
    { label: 'CRF Preview (all templates)', href: '/admin/dev/preview', icon: FileText, desc: 'Open any study CRF blank — UI, layout & print testing.' },
    { label: 'Assessment Library', href: '/assessments', icon: ClipboardList, desc: 'Open, complete, reset & test every scale calculation.' },
    { label: 'All Patients & CRFs', href: '/admin/patients', icon: Layers, desc: 'Open any patient / CRF / visit regardless of owner.' },
    { label: 'Feedback Inbox', href: '/admin/feedback', icon: Activity, desc: 'Requests and reports from investigators.' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FlaskConical size={20} className="text-purple-600" />
        <div>
          <h1 className="text-xl font-bold text-slate-900">Developer Tools</h1>
          <p className="text-xs text-slate-500">Administrator-only testing & QA. Not visible to guides or investigators.</p>
        </div>
      </div>

      {/* System Dashboard */}
      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">System Dashboard</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{s.label}</p>
              <p className={`mt-1 text-2xl font-bold ${s.color ?? 'text-slate-900'}`}>{s.value}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Users by role: {Object.entries(roleCounts).map(([r, n]) => `${n} ${r}`).join(' · ') || '—'}
        </p>
      </section>

      {/* Tools */}
      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Test Centres</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {tools.map((t) => (
            <Link key={t.href} href={t.href} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-50 transition-colors">
              <t.icon size={18} className="mt-0.5 shrink-0 text-purple-600" />
              <div>
                <p className="text-sm font-semibold text-slate-900">{t.label}</p>
                <p className="text-xs text-slate-500">{t.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Registered CRF templates */}
      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Registered CRF Templates ({Object.keys(CRF_REGISTRY).length})</h2>
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(CRF_REGISTRY).map((code) => (
            <Link key={code} href={`/admin/dev/preview?study=${code}`}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
              <span className="font-mono font-bold text-blue-700">{code}</span>
              <span className="ml-2 text-slate-400">{getStudyMeta(code).scholar || ''}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Audit Log viewer */}
      <section>
        <h2 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500"><Database size={13} /> Audit Logs (most recent)</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600">CRF Status Changes</div>
            <ul className="divide-y divide-slate-50 text-xs">
              {((statusAudit.data ?? []) as any[]).map((a, i) => (
                <li key={i} className="px-4 py-2">
                  <span className="font-medium text-slate-700">{a.old_status ?? '∅'} → {a.new_status}</span>
                  {a.note && <span className="text-slate-400"> · {String(a.note).slice(0, 50)}</span>}
                  <span className="block text-[11px] text-slate-400">{new Date(a.changed_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                </li>
              ))}
              {(statusAudit.data ?? []).length === 0 && <li className="px-4 py-3 text-slate-400">No status changes yet.</li>}
            </ul>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600">CRF Field Changes</div>
            <ul className="divide-y divide-slate-50 text-xs">
              {((fieldAudit.data ?? []) as any[]).map((a, i) => (
                <li key={i} className="px-4 py-2">
                  <span className="font-mono text-slate-700">{a.field_key}</span>
                  <span className="text-slate-400"> · {a.operation} {a.old_response ? `"${String(a.old_response).slice(0, 12)}"→` : ''}"{String(a.new_response ?? '').slice(0, 12)}"</span>
                  <span className="block text-[11px] text-slate-400">{new Date(a.changed_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                </li>
              ))}
              {(fieldAudit.data ?? []).length === 0 && <li className="px-4 py-3 text-slate-400">No field changes yet.</li>}
            </ul>
          </div>
        </div>
      </section>

      {/* Permission Matrix */}
      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Permission Matrix</h2>
        <PermissionMatrix />
      </section>

      <p className="flex items-center gap-1.5 text-xs text-slate-400">
        <Printer size={12} /> Tip: open any CRF preview, then use Print / PDF to test print layout without entering data.
      </p>
    </div>
  )
}
