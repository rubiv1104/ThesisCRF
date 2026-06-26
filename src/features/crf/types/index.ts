export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'checkbox_group'
  | 'heading'
  | 'divider'
  | 'investigation_table'
  | 'assessment_grid'
  | 'calculated'

export interface FieldOption {
  value: string
  label: string
}

export interface CrfField {
  key: string
  label: string
  type: FieldType
  options?: FieldOption[]
  placeholder?: string
  unit?: string
  required?: boolean
  /** sub-fields rendered inline (e.g. "If yes, specify") */
  dependsOn?: { key: string; value: string }
  /** columns for investigation_table / assessment_grid */
  columns?: string[]
  /** rows for investigation_table / assessment_grid */
  rows?: string[]
  /** helper text shown below the field */
  hint?: string
  /** pre-filled value applied automatically when the field has no saved response */
  defaultValue?: string
  /** for type='calculated': list of field keys to sum */
  sumKeys?: string[]
  /** for type='calculated': named formula to apply ('easi_bt' | 'easi_at') */
  formulaId?: string
  /** for formulaId='date_plus_days': number of days to add to date_induction */
  formulaDays?: number
}

export interface CrfSectionDef {
  key: string
  title: string
  fields: CrfField[]
}

export interface CrfTemplateDef {
  study_code: string
  version: string
  sections: CrfSectionDef[]
  /** Visit schedule labels shown as info panel. If absent, ECZ2026-style 15-day tab navigation is used. */
  visitSchedule?: string[]
}
