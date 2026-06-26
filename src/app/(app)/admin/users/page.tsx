import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { APP_NAME } from '@/constants'
import { UserManagementPanel } from './UserManagementPanel'

export const metadata = { title: `User Management | ${APP_NAME}` }

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles').select('role').eq('id', user.id).single()
  if ((profile as any)?.role !== 'admin') redirect('/dashboard')

  // All users with their study assignments
  const { data: usersRaw } = await (supabase as any)
    .from('user_profiles')
    .select(`
      id, full_name, email, role,
      study_investigators(study_id, studies(id, study_code)),
      study_teachers(study_id, studies(id, study_code))
    `)
    .order('role')
    .order('full_name')

  const users = ((usersRaw ?? []) as any[]).map((u: any) => ({
    id: u.id,
    full_name: u.full_name ?? '(no name)',
    email: u.email ?? '',
    role: u.role ?? 'investigator',
    inv_studies: (u.study_investigators ?? []).map((si: any) => ({
      id: si.studies?.id ?? si.study_id,
      code: si.studies?.study_code ?? '?',
    })),
    teacher_studies: (u.study_teachers ?? []).map((st: any) => ({
      id: st.studies?.id ?? st.study_id,
      code: st.studies?.study_code ?? '?',
    })),
  }))

  // All studies for assignment dropdown
  const { data: studiesRaw } = await supabase
    .from('studies')
    .select('id, study_code')
    .eq('study_status', 'active')
    .order('study_code')
  const studies = (studiesRaw ?? []) as { id: string; study_code: string }[]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">User Management</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Assign roles, link guides to studies, and manage investigator access.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600 space-y-1">
          <p className="font-semibold text-slate-700">Registration Links</p>
          <p>Investigator: <span className="font-mono text-blue-600">/register?role=investigator</span></p>
          <p>Guide / Faculty: <span className="font-mono text-green-600">/register?role=teacher</span></p>
        </div>
      </div>

      <UserManagementPanel users={users} studies={studies} />
    </div>
  )
}
