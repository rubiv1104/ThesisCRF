'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
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
  if ((profile as any)?.role !== 'admin') return { error: 'Only admins can delete patients.' }

  // Delete cascade: crf_responses → crf_sections → crfs → patient
  const { data: crfRow } = await supabase.from('crfs').select('id').eq('patient_id', patientId).maybeSingle()
  if (crfRow) {
    const { data: sections } = await supabase.from('crf_sections').select('id').eq('crf_id', crfRow.id)
    if (sections?.length) {
      const sectionIds = sections.map((s: any) => s.id)
      await supabase.from('crf_responses').delete().in('section_id', sectionIds)
    }
    await supabase.from('crf_sections').delete().eq('crf_id', crfRow.id)
    await supabase.from('crfs').delete().eq('id', crfRow.id)
  }
  await supabase.from('investigation_documents').delete().eq('patient_id', patientId)
  const { error } = await supabase.from('patients').delete().eq('id', patientId)
  if (error) return { error: error.message }

  redirect('/admin/patients')
}
