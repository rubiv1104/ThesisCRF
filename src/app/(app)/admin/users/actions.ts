'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data: p } = await supabase.from('user_profiles').select('role').eq('id', user.id).single()
  if ((p as any)?.role !== 'admin') throw new Error('Not authorised')
  return supabase as any
}

export async function updateUserRole(userId: string, role: 'admin' | 'teacher' | 'investigator') {
  const supabase = await assertAdmin()
  const { error } = await supabase
    .from('user_profiles')
    .update({ role })
    .eq('id', userId)
  if (error) return { error: error.message }
  revalidatePath('/admin/users')
  return { success: true }
}

export async function assignToStudy(userId: string, studyId: string, role: 'teacher' | 'investigator') {
  const supabase = await assertAdmin()

  if (role === 'investigator') {
    // Remove existing assignment first (one investigator → one study)
    await supabase.from('study_investigators').delete().eq('investigator_id', userId)
    const { error } = await supabase.from('study_investigators').insert({
      investigator_id: userId,
      study_id: studyId,
    })
    if (error) return { error: error.message }
  } else {
    // Teachers can supervise multiple studies — just add (ignore duplicate)
    const { error } = await supabase.from('study_teachers').upsert(
      { teacher_id: userId, study_id: studyId },
      { onConflict: 'teacher_id,study_id', ignoreDuplicates: true }
    )
    if (error) return { error: error.message }
  }

  revalidatePath('/admin/users')
  return { success: true }
}

export async function removeFromStudy(userId: string, studyId: string, role: 'teacher' | 'investigator') {
  const supabase = await assertAdmin()

  if (role === 'investigator') {
    await supabase.from('study_investigators').delete()
      .eq('investigator_id', userId).eq('study_id', studyId)
  } else {
    await supabase.from('study_teachers').delete()
      .eq('teacher_id', userId).eq('study_id', studyId)
  }

  revalidatePath('/admin/users')
  return { success: true }
}

export async function toggleUserActive(userId: string, isActive: boolean) {
  const supabase = await assertAdmin()
  const { error } = await supabase
    .from('user_profiles')
    .update({ is_active: isActive })
    .eq('id', userId)
  if (error) return { error: error.message }
  revalidatePath('/admin/users')
  return { success: true }
}
