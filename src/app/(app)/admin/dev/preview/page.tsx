import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { APP_NAME } from '@/constants'
import { CrfView } from '@/features/crf/components/CrfView'
import { CRF_REGISTRY } from '@/features/crf/registry'
import { studyTitle, getStudyMeta } from '@/features/crf/studyMeta'
import { ChevronLeft } from 'lucide-react'

export const metadata = { title: `CRF Preview | ${APP_NAME}` }

interface PageProps { searchParams: Promise<{ study?: string }> }

export default async function DevCrfPreviewPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single()
  if ((profile as any)?.role !== 'admin') redirect('/dashboard')

  const codes = Object.keys(CRF_REGISTRY)
  const { study } = await searchParams
  const studyCode = study && codes.includes(study) ? study : (codes[0] ?? 'ECZ2026')

  return (
    <div className="space-y-4">
      <Link href="/admin/dev" className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800">
        <ChevronLeft size={14} /> Developer Tools
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-bold text-blue-700">{studyCode}</p>
          <h1 className="text-xl font-semibold text-slate-900">CRF Template Preview</h1>
          <p className="max-w-xl text-xs text-slate-400">{studyTitle(studyCode)} · {getStudyMeta(studyCode).scholar}</p>
        </div>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">Blank template — no patient</span>
      </div>

      {/* Study switcher — every registered template */}
      <div className="flex flex-wrap gap-1.5">
        {codes.map((code) => (
          <Link key={code} href={`/admin/dev/preview?study=${code}`}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              code === studyCode ? 'bg-blue-600 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}>
            {code}
          </Link>
        ))}
      </div>

      <CrfView studyCode={studyCode} readOnly previewMode />
    </div>
  )
}
