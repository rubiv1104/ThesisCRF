'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

interface UploadRow {
  patient_name: string
  patient_sr_no: string
  data: Record<string, string>
}

export async function saveExcelUploads(studyId: string, rows: UploadRow[]) {
  const supabase = await createClient() as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verify user belongs to this study
  const { data: link } = await supabase
    .from('study_investigators')
    .select('study_id')
    .eq('investigator_id', user.id)
    .eq('study_id', studyId)
    .single()

  const { data: teacherLink } = await supabase
    .from('study_teachers')
    .select('study_id')
    .eq('teacher_id', user.id)
    .eq('study_id', studyId)
    .single()

  if (!link && !teacherLink) {
    return { error: 'Not authorised for this study' }
  }

  // Delete existing uploads for this study by this user, then re-insert
  await supabase
    .from('master_chart_uploads')
    .delete()
    .eq('study_id', studyId)
    .eq('uploaded_by', user.id)

  if (rows.length === 0) return { success: true, count: 0 }

  const toInsert = rows.map((r) => ({
    study_id: studyId,
    uploaded_by: user.id,
    patient_name: r.patient_name,
    patient_sr_no: r.patient_sr_no,
    data: r.data,
  }))

  const { error } = await supabase.from('master_chart_uploads').insert(toInsert)
  if (error) return { error: error.message }

  return { success: true, count: rows.length }
}

export async function getStudyForUser() {
  const supabase = await createClient() as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: link } = await supabase
    .from('study_investigators')
    .select('study_id, studies(id, study_code, study_title)')
    .eq('investigator_id', user.id)
    .single()

  if (link?.studies) return link.studies as any

  const { data: teacherLink } = await supabase
    .from('study_teachers')
    .select('study_id, studies(id, study_code, study_title)')
    .eq('teacher_id', user.id)
    .single()

  return teacherLink?.studies ?? null
}
