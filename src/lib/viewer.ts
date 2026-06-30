import { cookies } from 'next/headers'

export const IMP_COOKIE = 'imp_uid'

export interface Viewer {
  realUserId: string
  realRole: string
  effectiveUserId: string
  effectiveRole: 'admin' | 'teacher' | 'investigator'
  effectiveName: string
  impersonating: boolean
}

/**
 * Resolves the "effective" viewer. Only an Administrator can impersonate (via an
 * httpOnly cookie). RLS still runs as the real admin — this changes which user's
 * DATA the role pages scope to, not the database privileges. View-only testing.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getViewer(supabase: any): Promise<Viewer | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: realProfile } = await supabase.from('user_profiles').select('role, full_name').eq('id', user.id).single()
  const realRole: string = realProfile?.role ?? 'investigator'

  let effectiveUserId = user.id
  let effectiveRole = realRole
  let effectiveName: string = realProfile?.full_name ?? ''
  let impersonating = false

  if (realRole === 'admin') {
    const imp = (await cookies()).get(IMP_COOKIE)?.value
    if (imp && imp !== user.id) {
      const { data: ip } = await supabase.from('user_profiles').select('role, full_name').eq('id', imp).single()
      if (ip) {
        effectiveUserId = imp
        effectiveRole = ip.role
        effectiveName = ip.full_name
        impersonating = true
      }
    }
  }

  return {
    realUserId: user.id,
    realRole,
    effectiveUserId,
    effectiveRole: (effectiveRole === 'admin' || effectiveRole === 'teacher' ? effectiveRole : 'investigator'),
    effectiveName,
    impersonating,
  }
}
