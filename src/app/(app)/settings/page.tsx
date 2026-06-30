import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { APP_NAME } from '@/constants'
import { DevModeToggle } from '@/features/dev/DevModeToggle'

export const metadata = { title: `Settings | ${APP_NAME}` }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name, email, role, department')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Your account information</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Full Name</p>
          <p className="mt-1 text-sm font-medium text-slate-900">{profile?.full_name ?? '—'}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Email</p>
          <p className="mt-1 text-sm text-slate-900">{profile?.email ?? user.email}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Role</p>
          <span className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
            profile?.role === 'admin'
              ? 'bg-purple-50 text-purple-700'
              : 'bg-blue-50 text-blue-700'
          }`}>
            {profile?.role ?? 'investigator'}
          </span>
        </div>
        {profile?.department && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Department</p>
            <p className="mt-1 text-sm text-slate-900">{profile.department}</p>
          </div>
        )}
      </div>

      {profile?.role === 'admin' && <DevModeToggle />}

      <p className="text-xs text-slate-400">
        To update your account details, contact the system administrator.
      </p>
    </div>
  )
}
