import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layout/AppShell'
import { getViewer } from '@/lib/viewer'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Deactivated-account guard uses the real user
  if (user) {
    const { data: profile } = await supabase.from('user_profiles').select('is_active').eq('id', user.id).single()
    if ((profile as { is_active: boolean } | null)?.is_active === false) redirect('/deactivated')
  }

  const viewer = await getViewer(supabase)
  const role = viewer?.effectiveRole ?? 'investigator'
  const impersonation = viewer?.impersonating ? { name: viewer.effectiveName, role: viewer.effectiveRole } : null

  return <AppShell role={role} impersonation={impersonation}>{children}</AppShell>
}
