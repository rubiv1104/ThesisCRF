import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layout/AppShell'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let role: 'admin' | 'teacher' | 'investigator' = 'investigator'
  if (user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .single()
    const p = profile as { role: string; is_active: boolean } | null
    if (p?.is_active === false) redirect('/deactivated')
    const r = p?.role
    if (r === 'admin') role = 'admin'
    else if (r === 'teacher') role = 'teacher'
  }

  return <AppShell role={role}>{children}</AppShell>
}
