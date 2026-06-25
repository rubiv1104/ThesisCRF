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
}
