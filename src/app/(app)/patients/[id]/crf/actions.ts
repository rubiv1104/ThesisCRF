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

export async function recallCrfSubmission(patientId: string): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient() as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: crf } = await supabase
    .from('crfs').select('id, validation_status').eq('patient_id', patientId).single()

  if (!crf) return { error: 'CRF not found.' }
  if (crf.validation_status !== 'submitted') return { error: 'Only submitted CRFs can be recalled.' }

  const { error } = await supabase
    .from('crfs')
    .update({ validation_status: 'pending', validated_at: null })
    .eq('id', crf.id)

  if (error) return { error: error.message }
  revalidatePath(`/patients/${patientId}/crf`)
  return { success: true }
}

export async function deletePatient(patientId: string): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient() as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('user_profiles').select('role').eq('id', user.id).single()
  const role = (profile as any)?.role

  // Investigators can only delete their own patients; admins can delete any
  if (role === 'investigator') {
    const { data: patient } = await supabase
      .from('patients').select('created_by').eq('id', patientId).single()
    if (!patient || patient.created_by !== user.id) return { error: 'You can only delete patients you enrolled.' }
  } else if (role !== 'admin') {
    return { error: 'You do not have permission to delete patients.' }
  }

  // Deleting the patient cascades to crfs → crf_sections → crf_responses and
  // investigation_documents via ON DELETE CASCADE foreign keys.
  // Use .select() so a row blocked by RLS (0 rows, no error) is reported honestly.
  const { data: deleted, error } = await supabase
    .from('patients')
    .delete()
    .eq('id', patientId)
    .select('id')
  if (error) return { error: error.message }
  if (!deleted || deleted.length === 0) {
    return { error: 'Delete failed — you may not have permission to delete this patient.' }
  }

  return { success: true }
}
