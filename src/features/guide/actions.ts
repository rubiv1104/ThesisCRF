'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getViewer } from '@/lib/viewer'

interface ActionResult { ok: boolean; error?: string }

async function guideContext() {
  const supabase = await createClient()
  const viewer = await getViewer(supabase)
  if (!viewer) return { error: 'Not signed in' as const }
  if (viewer.effectiveRole !== 'teacher' && viewer.effectiveRole !== 'admin') {
    return { error: 'Not authorised' as const }
  }
  return { supabase: supabase as any, viewer }
}

export async function setCrfDecision(
  crfId: string,
  patientId: string,
  status: 'approved' | 'returned' | 'pending',
  note: string,
): Promise<ActionResult> {
  const ctx = await guideContext()
  if ('error' in ctx) return { ok: false, error: ctx.error }
  const { supabase, viewer } = ctx

  if (status === 'returned' && !note.trim()) {
    return { ok: false, error: 'A note is required when returning a CRF for correction.' }
  }

  const { error } = await supabase
    .from('crfs')
    .update({
      validation_status: status,
      validation_note: note,
      validated_by: viewer.effectiveUserId,
      validated_at: new Date().toISOString(),
    })
    .eq('id', crfId)
  if (error) return { ok: false, error: error.message }

  revalidatePath(`/teacher/review/${patientId}`)
  revalidatePath('/teacher')
  return { ok: true }
}

export async function addGuideComment(
  crfId: string,
  patientId: string,
  sectionKey: string,
  fieldKey: string | null,
  text: string,
): Promise<ActionResult> {
  const ctx = await guideContext()
  if ('error' in ctx) return { ok: false, error: ctx.error }
  const { supabase, viewer } = ctx
  if (!text.trim()) return { ok: false, error: 'Comment cannot be empty.' }

  const { error } = await supabase.from('crf_corrections').insert({
    crf_id: crfId,
    section_key: sectionKey || 'General',
    field_key: fieldKey,
    correction: text.trim(),
    corrected_by: viewer.effectiveUserId,
    corrector_name: viewer.effectiveName,
    status: 'open',
  })
  if (error) return { ok: false, error: error.message }
  revalidatePath(`/teacher/review/${patientId}`)
  return { ok: true }
}

export async function resolveGuideComment(id: string, patientId: string): Promise<ActionResult> {
  const ctx = await guideContext()
  if ('error' in ctx) return { ok: false, error: ctx.error }
  const { error } = await ctx.supabase
    .from('crf_corrections')
    .update({ status: 'resolved', updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidatePath(`/teacher/review/${patientId}`)
  return { ok: true }
}

export async function deleteGuideComment(id: string, patientId: string): Promise<ActionResult> {
  const ctx = await guideContext()
  if ('error' in ctx) return { ok: false, error: ctx.error }
  const { error } = await ctx.supabase.from('crf_corrections').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidatePath(`/teacher/review/${patientId}`)
  return { ok: true }
}

export async function toggleBookmark(patientId: string, studyCode: string): Promise<ActionResult & { bookmarked?: boolean }> {
  const ctx = await guideContext()
  if ('error' in ctx) return { ok: false, error: ctx.error }
  const { supabase, viewer } = ctx

  const { data: existing } = await supabase
    .from('guide_bookmarks')
    .select('id')
    .eq('user_id', viewer.effectiveUserId)
    .eq('patient_id', patientId)
    .maybeSingle()

  if (existing) {
    await supabase.from('guide_bookmarks').delete().eq('id', existing.id)
    revalidatePath(`/teacher/review/${patientId}`)
    return { ok: true, bookmarked: false }
  }
  const { error } = await supabase.from('guide_bookmarks').insert({
    user_id: viewer.effectiveUserId, patient_id: patientId, study_code: studyCode,
  })
  if (error) return { ok: false, error: error.message }
  revalidatePath(`/teacher/review/${patientId}`)
  return { ok: true, bookmarked: true }
}

export async function markNotificationsRead(ids?: string[]): Promise<ActionResult> {
  const ctx = await guideContext()
  if ('error' in ctx) return { ok: false, error: ctx.error }
  const { supabase, viewer } = ctx
  let q = supabase.from('notifications').update({ read: true }).eq('user_id', viewer.effectiveUserId).eq('read', false)
  if (ids && ids.length > 0) q = q.in('id', ids)
  const { error } = await q
  if (error) return { ok: false, error: error.message }
  revalidatePath('/teacher')
  revalidatePath('/notifications')
  return { ok: true }
}
