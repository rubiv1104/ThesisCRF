'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { ECZ2026_TEMPLATE } from '../definitions/ecz2026'
import { CrfSectionAccordion } from './CrfSectionAccordion'
import { SaveIndicator } from './SaveIndicator'
import type { SaveStatus } from '../hooks/useCrfResponses'

interface CrfViewProps {
  patientId: string
  studyCode: string
}

interface SectionMeta {
  id: string
  section_key: string
  completed: boolean
  locked: boolean
}

export function CrfView({ patientId, studyCode }: CrfViewProps) {
  const [crfId, setCrfId] = useState<string | null>(null)
  const [sections, setSections] = useState<SectionMeta[]>([])
  const [values, setValues] = useState<Record<string, string>>({})
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [loading, setLoading] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any

  const template = studyCode === 'ECZ2026' ? ECZ2026_TEMPLATE : null

  // Initialise or load CRF + sections + all responses
  useEffect(() => {
    if (!template) return
    let cancelled = false

    async function init() {
      setLoading(true)

      // Get or create CRF
      let { data: crf } = await supabase
        .from('crfs')
        .select('id')
        .eq('patient_id', patientId)
        .single()

      if (!crf) {
        const { data: newCrf, error } = await supabase
          .from('crfs')
          .insert({ patient_id: patientId, template_version: template!.version })
          .select('id')
          .single()
        if (error || !newCrf) {
          toast.error('Could not create CRF: ' + error?.message)
          setLoading(false)
          return
        }
        crf = newCrf
      }

      if (cancelled) return
      setCrfId(crf.id)

      // Get or create sections
      const { data: existingSections } = await supabase
        .from('crf_sections')
        .select('id, section_name, completed, locked')
        .eq('crf_id', crf.id)
        .order('section_order')

      let sectionMeta: SectionMeta[] = []

      if (!existingSections || existingSections.length === 0) {
        const toInsert = template!.sections.map((s, i) => ({
          crf_id: crf!.id,
          section_name: s.key,
          section_order: i,
          completed: false,
          locked: false,
        }))
        const { data: created } = await supabase
          .from('crf_sections')
          .insert(toInsert)
          .select('id, section_name, completed, locked')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sectionMeta = (created ?? []).map((r: any) => ({
          id: r.id,
          section_key: r.section_name,
          completed: r.completed,
          locked: r.locked,
        }))
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sectionMeta = existingSections.map((r: any) => ({
          id: r.id,
          section_key: r.section_name,
          completed: r.completed,
          locked: r.locked,
        }))
      }

      if (cancelled) return
      setSections(sectionMeta)

      // Load all responses for this CRF
      const sectionIds = sectionMeta.map((s) => s.id)
      if (sectionIds.length > 0) {
        const { data: responses } = await supabase
          .from('crf_responses')
          .select('section_id, field_key, response')
          .in('section_id', sectionIds)

        const loaded: Record<string, string> = {}
        for (const r of responses ?? []) {
          if (r.field_key && r.response !== null) {
            loaded[r.field_key] = r.response
          }
        }
        if (!cancelled) {
          setValues(loaded)
          setSaveStatus('saved')
        }
      }

      setLoading(false)
    }

    init()
    return () => { cancelled = true }
  }, [patientId]) // eslint-disable-line react-hooks/exhaustive-deps

  const onChange = useCallback(
    async (key: string, value: string) => {
      setValues((prev) => ({ ...prev, [key]: value }))
      setSaveStatus('unsaved')

      // Find which section owns this field key
      if (!template || sections.length === 0) return

      let ownerSectionId: string | null = null
      let fieldLabel = key
      let fieldType = 'text'

      for (const sectionDef of template.sections) {
        for (const field of sectionDef.fields) {
          // handle assessment_grid cell keys: fieldKey__row__col
          const isGridCell = key.startsWith(field.key + '__')
          if (field.key === key || isGridCell) {
            const meta = sections.find((s) => s.section_key === sectionDef.key)
            if (meta) {
              ownerSectionId = meta.id
              fieldLabel = isGridCell ? key : field.label
              fieldType = isGridCell ? 'number' : field.type
            }
            break
          }
        }
        if (ownerSectionId) break
      }

      if (!ownerSectionId) return

      setSaveStatus('saving')
      const { error } = await supabase.from('crf_responses').upsert(
        {
          section_id: ownerSectionId,
          field_key: key,
          field_label: fieldLabel,
          field_type: fieldType,
          response: value,
          visit_number: 0,
        },
        { onConflict: 'section_id,field_key,visit_number' }
      )

      setSaveStatus(error ? 'unsaved' : 'saved')
      if (error) toast.error('Save failed: ' + error.message)
    },
    [template, sections] // eslint-disable-line react-hooks/exhaustive-deps
  )

  if (!template) {
    return <p className="text-sm text-slate-500">CRF template not found for study {studyCode}.</p>
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-slate-400">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500" />
        Loading CRF…
      </div>
    )
  }

  const completedSections = new Set(sections.filter((s) => s.completed).map((s) => s.section_key))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Case Report Form</h2>
          <p className="text-xs text-slate-500">
            {template.study_code} v{template.version} · Click a section to expand
          </p>
        </div>
        <SaveIndicator status={saveStatus} />
      </div>

      <CrfSectionAccordion
        sections={template.sections}
        values={values}
        onChange={onChange}
        completedSections={completedSections}
      />
    </div>
  )
}
