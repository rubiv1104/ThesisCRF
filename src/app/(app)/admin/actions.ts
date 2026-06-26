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
