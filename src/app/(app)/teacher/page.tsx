import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { APP_NAME } from '@/constants'
import { studyTitle } from '@/features/crf/studyMeta'
import { getViewer } from '@/lib/viewer'
import { loadGuideHome } from '@/features/guide/loadGuideHome'
import { GuidePatients } from './GuidePatients'
import { Bell, ClipboardCheck, AlertTriangle, CheckCircle2, Clock, FolderOpen, Users } from 'lucide-react'

export const metadata = { title: `Guide Dashboard | ${APP_NAME}` }

export default async function TeacherDashboardPage() {
  const supabase = await createClient()
  const viewer = await getViewer(supabase)
  if (!viewer) redirect('/login')
  if (viewer.effectiveRole !== 'teacher') redirect('/dashboard')

  const home = await loadGuideHome(supabase, viewer.effectiveUserId)
  const { counts, studies, patients, unread } = home

  const metrics = [
    { label: 'Studies', value: counts.studies, icon: FolderOpen, color: 'text-slate-900', ring: 'ring-slate-200' },
    { label: 'Patients', value: counts.patients, icon: Users, color: 'text-slate-900', ring: 'ring-slate-200' },
    { label: 'Pending Reviews', value: counts.pendingReview, icon: ClipboardCheck, color: 'text-amber-600', ring: 'ring-amber-200', href: '#patients' },
    { label: 'Corrections', value: counts.correctionsPending, icon: AlertTriangle, color: 'text-red-600', ring: 'ring-red-200' },
    { label: 'Approved Today', value: counts.approvedToday, icon: CheckCircle2, color: 'text-green-700', ring: 'ring-green-200' },
    { label: 'Follow-ups Overdue', value: counts.overdue, icon: Clock, color: 'text-orange-600', ring: 'ring-orange-200' },
  ]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Welcome, {viewer.effectiveName ?? 'Dr.'}</h1>
          <p className="mt-0.5 text-sm text-slate-500">Review, comment and approve your scholars&apos; CRFs.</p>
        </div>
        <Link href="/notifications" className="relative shrink-0 rounded-lg border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-slate-50" title="Notifications">
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{unread > 9 ? '9+' : unread}</span>
          )}
        </Link>
      </div>

      {/* 6 metrics */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 lg:grid-cols-6">
        {metrics.map((m) => {
          const Icon = m.icon
          const inner = (
            <>
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{m.label}</p>
                <Icon size={14} className="text-slate-300" />
              </div>
              <p className={`mt-1 text-2xl font-bold ${m.color}`}>{m.value}</p>
            </>
          )
          return (
            <div key={m.label} className={`rounded-xl border border-slate-200 bg-white p-3 shadow-sm ring-1 ${m.ring}`}>{inner}</div>
          )
        })}
      </div>

      {/* My Studies */}
      {studies.length > 0 && (
        <div>
          <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">My Studies</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {studies.map((s) => {
              const pct = s.sampleSize && s.sampleSize > 0 ? Math.min(100, Math.round((s.enrolled / s.sampleSize) * 100)) : 0
              return (
                <div key={s.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="font-mono text-xs font-bold text-green-700">{s.code}</span>
                      <p className="mt-0.5 line-clamp-2 text-sm font-medium text-slate-700">{studyTitle(s.code) || s.title}</p>
                    </div>
                    {s.pendingReview > 0 && (
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-300">
                        <ClipboardCheck size={12} /> {s.pendingReview}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-green-500" style={{ width: `${pct}%` }} /></span>
                    <span className="font-medium text-slate-600">{s.enrolled}{s.sampleSize ? `/${s.sampleSize}` : ''}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                    <span>{s.approved} approved</span>
                    {s.investigators.length > 0 && <span className="truncate">· {s.investigators.join(', ')}</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Working patient list */}
      <div id="patients">
        {patients.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-slate-200 py-16 text-center">
            {counts.studies === 0 ? (
              <>
                <p className="text-sm font-medium text-slate-600">You are not assigned to any study yet.</p>
                <p className="mt-1 text-xs text-slate-400">Ask the administrator to assign you via Admin → Users.</p>
              </>
            ) : (
              <p className="text-sm text-slate-500">No patients enrolled in your supervised studies yet.</p>
            )}
          </div>
        ) : (
          <>
            <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Patients by Investigator</h2>
            <GuidePatients patients={patients} />
          </>
        )}
      </div>
    </div>
  )
}
