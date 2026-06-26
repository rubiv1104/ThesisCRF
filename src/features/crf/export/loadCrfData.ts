/**
 * Server-side loader: given a patient id and an authenticated Supabase client,
 * returns everything needed to render/export a CRF — patient header, study code,
 * a flat values map, and the list of uploaded investigation documents.
 * RLS enforces that the caller may only read patients they are entitled to.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseLike = any

export interface InvestigationDoc {
  id: string
  file_name: string
  file_path: string
  file_size: number | null
  visit_label: string | null
  description: string | null
  created_at: string
}

export interface CrfData {
  patient: {
    id: string
    patient_name: string
    study_patient_id: string
    age: number | null
    gender: string | null
  }
  studyCode: string
  groupName: string | null
  validationStatus: string | null
  validatedAt: string | null
  values: Record<string, string>
  investigations: InvestigationDoc[]
}

export async function loadCrfData(supabase: SupabaseLike, patientId: string): Promise<CrfData | null> {
  const { data: raw } = await supabase
    .from('patients')
    .select('id, patient_name, study_patient_id, age, gender, studies(study_code), research_groups(group_name)')
    .eq('id', patientId)
    .single()

  if (!raw) return null
  const patient = raw as any

  const { data: crf } = await supabase
    .from('crfs')
    .select('id, validation_status, validated_at')
    .eq('patient_id', patientId)
    .maybeSingle()

  const values: Record<string, string> = {}
  let investigations: InvestigationDoc[] = []

  if (crf?.id) {
    const { data: sections } = await supabase
      .from('crf_sections')
      .select('id')
      .eq('crf_id', crf.id)

    const sectionIds = (sections ?? []).map((s: any) => s.id)
    if (sectionIds.length > 0) {
      const { data: responses } = await supabase
        .from('crf_responses')
        .select('field_key, response')
        .in('section_id', sectionIds)

      for (const r of responses ?? []) {
        if (r.field_key && r.response !== null && r.response !== '') {
          values[r.field_key] = r.response
        }
      }
    }
  }

  const { data: docs } = await supabase
    .from('investigation_documents')
    .select('id, file_name, file_path, file_size, visit_label, description, created_at')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: true })

  investigations = (docs as InvestigationDoc[]) ?? []

  return {
    patient: {
      id: patient.id,
      patient_name: patient.patient_name,
      study_patient_id: patient.study_patient_id,
      age: patient.age ?? null,
      gender: patient.gender ?? null,
    },
    studyCode: patient.studies?.study_code ?? '',
    groupName: patient.research_groups?.group_name ?? null,
    validationStatus: crf?.validation_status ?? null,
    validatedAt: crf?.validated_at ?? null,
    values,
    investigations,
  }
}
