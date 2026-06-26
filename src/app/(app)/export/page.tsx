import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { APP_NAME } from '@/constants'

export const metadata = { title: `Export | ${APP_NAME}` }

export default async function ExportPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Export Data</h1>
        <p className="mt-1 text-sm text-slate-500">
          Export CRF data and investigation reports
        </p>
      </div>

      <div className="rounded-xl border-2 border-dashed border-slate-200 py-20 text-center">
        <div className="text-4xl">📊</div>
        <p className="mt-3 text-sm font-medium text-slate-600">Export — Coming Soon</p>
        <p className="mt-1 text-xs text-slate-400">
          Export to Excel, PDF print view, and SPSS will be available here.
        </p>
      </div>
    </div>
  )
}
