'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { IMP_COOKIE } from '@/lib/viewer'

/** Admin-only: begin viewing the app as another user. Logged to dev_audit. */
export async function impersonate(userId: string) {
  const supabase = await createClient() as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const { data: me } = await supabase.from('user_profiles').select('role').eq('id', user.id).single()
  if (me?.role !== 'admin') return
  const { data: target } = await supabase.from('user_profiles').select('id, role, full_name').eq('id', userId).single()
  if (!target) return

  ;(await cookies()).set(IMP_COOKIE, userId, { httpOnly: true, sameSite: 'lax', path: '/' })
  await supabase.from('dev_audit').insert({
    admin_id: user.id, action: 'impersonate', target_user_id: userId,
    detail: `${target.full_name} (${target.role})`,
  })

  redirect(target.role === 'teacher' ? '/teacher' : target.role === 'admin' ? '/admin' : '/dashboard')
}

/** Stop impersonating and return to the Administrator view. */
export async function stopImpersonating() {
  const supabase = await createClient() as any
  const { data: { user } } = await supabase.auth.getUser()
  ;(await cookies()).delete(IMP_COOKIE)
  if (user) await supabase.from('dev_audit').insert({ admin_id: user.id, action: 'stop_impersonate' })
  redirect('/admin/dev')
}
