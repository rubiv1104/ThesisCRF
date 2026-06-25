export type UserRole = 'admin' | 'investigator'

export type StudyStatus = 'active' | 'completed' | 'archived'

export type PatientStatus = 'active' | 'completed' | 'dropped' | 'withdrawn'

export type CrfStatus = 'draft' | 'submitted' | 'correction_required' | 'approved' | 'locked'

export type Gender = 'male' | 'female' | 'other'

export type FileType = 'pdf' | 'png' | 'jpeg' | 'docx'

export type ExportFormat = 'xlsx' | 'docx' | 'pdf' | 'csv'

export type CorrectionStatus = 'pending' | 'resolved'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: UserRole
  department: string | null
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface Study {
  id: string
  study_code: string
  study_title: string
  scholar_name: string
  guide_name: string
  co_guide_name: string | null
  department: string
  sample_size: number
  study_status: StudyStatus
  created_by: string
  created_at: string
  updated_at: string
}

export interface ResearchGroup {
  id: string
  study_id: string
  group_name: string
  description: string | null
}

export interface Patient {
  id: string
  study_id: string
  research_group_id: string
  study_patient_id: string
  hospital_cr_number: string
  opd_number: string
  patient_name: string
  age: number
  gender: Gender
  phone: string | null
  status: PatientStatus
  created_by: string
  created_at: string
  updated_at: string
}

export interface Crf {
  id: string
  patient_id: string
  template_version: string
  status: CrfStatus
  submitted: boolean
  approved: boolean
  locked: boolean
  created_at: string
  updated_at: string
}

export interface CrfSection {
  id: string
  crf_id: string
  section_name: string
  section_order: number
  completed: boolean
  locked: boolean
}

export interface CrfResponse {
  id: string
  section_id: string
  field_key: string
  field_label: string
  field_type: string
  response: string | null
  visit_number: number
  created_at: string
  updated_at: string
}

export interface Investigation {
  id: string
  patient_id: string
  visit_number: number
  investigation_name: string
  result: string | null
  unit: string | null
  reference_range: string | null
  remarks: string | null
}

export interface Attachment {
  id: string
  patient_id: string
  visit_number: number
  file_name: string
  file_url: string
  file_type: FileType
  uploaded_by: string
  uploaded_at: string
}

export interface FollowUp {
  id: string
  patient_id: string
  visit_name: string
  visit_date: string
  status: 'scheduled' | 'completed' | 'missed'
}

export interface Correction {
  id: string
  crf_id: string
  section: string
  comment: string
  status: CorrectionStatus
  created_by: string
  resolved_by: string | null
}

export interface AuditLog {
  id: string
  table_name: string
  record_id: string
  field_name: string
  old_value: string | null
  new_value: string | null
  user_id: string
  timestamp: string
}
