export const APP_NAME = 'ThesisCRF'
export const APP_VERSION = '1.0.0'
export const DEPARTMENT_NAME = 'PG Department of Kayachikitsa'
export const INSTITUTION_NAME = 'Ayurvedic & Unani Tibbia College and Hospital, New Delhi'
export const UNIVERSITY_NAME = 'University of Delhi'

export const VISIT_NAMES = ['Baseline', 'Day 15', 'Day 30', 'Day 45', 'Day 60', 'Day 75', 'Day 90'] as const

export const PATIENT_STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  completed: 'Completed',
  dropped: 'Dropped Out',
  withdrawn: 'Withdrawn',
}

export const CRF_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  correction_required: 'Correction Required',
  approved: 'Approved',
  locked: 'Locked',
}

export const STUDY_STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  completed: 'Completed',
  archived: 'Archived',
}

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
] as const

export const PAGINATION_PAGE_SIZE = 20

export const SESSION_TIMEOUT_MINUTES = 60

export const MAX_FILE_SIZE_MB = 10
export const ALLOWED_FILE_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] as const
