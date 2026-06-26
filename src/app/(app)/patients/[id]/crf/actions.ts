'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function submitCrfForReview(patientId: string): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient() as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get or create CRF
  let { data: crf } = await supabase
    .from('crfs')
    .select('id, validation_status')
    .eq('patient_id', patientId)
    .single()

  if (!crf) {
    const { data: newCrf, error } = await supabase
      .from('crfs')
      .insert({ patient_id: patientId, template_version: '1.1' })
      .select('id, validation_status')
      .single()
    if (error) return { error: error.message }
    crf = newCrf
  }

  if (crf.validation_status === 'approved') {
    return { error: 'This CRF is already approved by your guide.' }
  }

  const { error } = await supabase
    .from('crfs')
    .update({ validation_status: 'submitted', validated_at: new Date().toISOString() })
    .eq('id', crf.id)

  if (error) return { error: error.message }
  revalidatePath(`/patients/${patientId}/crf`)
  return { success: true }
}
