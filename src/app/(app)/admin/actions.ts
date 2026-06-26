'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function setStudyDuration(studyId: string, days: number) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('studies')
    .update({ duration_days: days })
    .eq('id', studyId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}

export async function updateStudyStatus(
  studyId: string,
  status: 'active' | 'completed'
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient() as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('user_profiles').select('role').eq('id', user.id).single()
  if ((profile as any)?.role !== 'admin') return { error: 'Admin only.' }

  const { error } = await supabase
    .from('studies')
    .update({ study_status: status })
    .eq('id', studyId)

  if (error) return { error: error.message }
  revalidatePath('/admin')
  return { success: true }
}
