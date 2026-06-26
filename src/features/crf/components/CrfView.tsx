'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { CRF_REGISTRY } from '../registry'
import { CrfSectionAccordion } from './CrfSectionAccordion'
import { SaveIndicator } from './SaveIndicator'
import type { SaveStatus } from '../hooks/useCrfResponses'

const LS_KEY = 'crf_field_suggestions'

// ─── Visit-based navigation ───────────────────────────────────────────────────

type VisitId = 'day0' | 'day15' | 'day30' | 'day45' | 'day60' | 'day75' | 'day90' | 'all'

const VISIT_TABS: { id: VisitId; short: string; desc: string }[] = [
  { id: 'day0',  short: 'Day 0',  desc: 'Baseline — demographics, history, exam, labs BT, EASI D0, DLQI BT' },
  { id: 'day15', short: 'Day 15', desc: 'EASI grid + symptom grading' },
  { id: 'day30', short: 'Day 30', desc: 'EASI grid + symptom grading' },
  { id: 'day45', short: 'Day 45', desc: 'EASI grid + symptom grading' },
  { id: 'day60', short: 'Day 60', desc: 'EASI grid + symptom grading' },
  { id: 'day75', short: 'Day 75', desc: 'EASI grid + symptom grading' },
  { id: 'day90', short: 'Day 90', desc: 'Labs AT, EASI D90, DLQI AT, outcome, ADR, completion' },
  { id: 'all',   short: 'All',    desc: 'Show every section (guide / full review)' },
]

// Which sections are relevant per visit
const VISIT_SECTIONS: Record<VisitId, string[]> = {
  day0:  ['study_info', 'eligibility', 'demographics', 'history', 'general_examination', 'local_examination', 'systemic_examination', 'dashavidha_pariksha', 'investigations', 'easi_scoring', 'disease_assessment', 'dlqi_assessment'],
  day15: ['easi_scoring', 'disease_assessment'],
  day30: ['easi_scoring', 'disease_assessment'],
  day45: ['easi_scoring', 'disease_assessment'],
  day60: ['easi_scoring', 'disease_assessment'],
  day75: ['easi_scoring', 'disease_assessment'],
  day90: ['investigations', 'easi_scoring', 'disease_assessment', 'dlqi_assessment', 'adr', 'completion'],
  all:   [], // unused — all prop
}

// Maps visit to the substring that identifies its EASI/DLQI fields
const EASI_TAG: Record<VisitId, string> = {
  day0: '_bt', day15: 'd15', day30: 'd30', day45: 'd45',
  day60: 'd60', day75: 'd75', day90: '_at', all: '',
}

function buildFieldFilter(visitId: VisitId): ((sectionKey: string, fKey: string, fType: string) => boolean) | undefined {
  if (visitId === 'all') return undefined
  const easiTag = EASI_TAG[visitId]
  const labSuffix = visitId === 'day0' ? '_bt' : '_at'
  const dlqiTag  = visitId === 'day0' ? '_bt' : '_at'

  return (sectionKey, fKey, fType) => {
    if (sectionKey === 'investigations') {
      return fType === 'heading' || fKey.endsWith(labSuffix)
    }
    if (sectionKey === 'easi_scoring') {
      return fKey === 'easi_instructions' || fKey.includes(easiTag)
    }
    if (sectionKey === 'dlqi_assessment') {
      return fKey === 'dlqi_instructions' || fKey.includes(dlqiTag)
    }
    if (sectionKey === 'disease_assessment') {
      if (fKey === 'grading_table') return true
      if (fKey === 'dlqi_bt') return visitId === 'day0'
      if (fKey === 'dlqi_at' || fKey === 'overall_effect') return visitId === 'day90'
      return false
    }
    return true
  }
}

interface CrfViewProps {
  patientId?: string
  studyCode: string
  readOnly?: boolean
  excelData?: Record<string, string>
  /** Show blank template without loading/saving any patient data */
  previewMode?: boolean
}

interface SectionMeta {
  id: string
  section_key: string
  completed: boolean
  locked: boolean
}

export function CrfView({ patientId, studyCode, readOnly = false, excelData = {}, previewMode = false }: CrfViewProps) {
  const [crfId, setCrfId] = useState<string | null>(null)
  const [sections, setSections] = useState<SectionMeta[]>([])
  const [values, setValues] = useState<Record<string, string>>({})
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [loading, setLoading] = useState(!previewMode)
  const [suggestions, setSuggestions] = useState<Record<string, string>>({})
  const [visitId, setVisitId] = useState<VisitId>((previewMode || readOnly) ? 'all' : 'day0')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any

  const template = CRF_REGISTRY[studyCode] ?? null

  // Load suggestions: localStorage (previous patient values) merged with Excel upload data
  // Excel data takes precedence for fields it covers
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(LS_KEY) ?? '{}') as Record<string, string>
      setSuggestions({ ...stored, ...excelData })
    } catch {
      setSuggestions({ ...excelData })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Initialise or load CRF + sections + all responses
  useEffect(() => {
    if (previewMode || !template) return
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
        // Check for template sections not yet in DB (template was updated after CRF was created)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const existingKeys = new Set(existingSections.map((r: any) => r.section_name))
        const missingSections = template!.sections
          .map((s, i) => ({ ...s, order: i }))
          .filter((s) => !existingKeys.has(s.key))

        if (missingSections.length > 0) {
          const startOrder = existingSections.length
          await supabase.from('crf_sections').insert(
            missingSections.map((s, j) => ({
              crf_id: crf!.id,
              section_name: s.key,
              section_order: startOrder + j,
              completed: false,
              locked: false,
            }))
          )
          const { data: refetched } = await supabase
            .from('crf_sections')
            .select('id, section_name, completed, locked')
            .eq('crf_id', crf!.id)
            .order('section_order')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          sectionMeta = (refetched ?? []).map((r: any) => ({
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

        // Apply defaultValues for any field not yet saved
        if (template) {
          for (const section of template.sections) {
            const meta = sectionMeta.find((s) => s.section_key === section.key)
            if (!meta) continue
            for (const field of section.fields) {
              if (field.defaultValue && !loaded[field.key]) {
                loaded[field.key] = field.defaultValue
                // Persist to DB so it's not blank next time
                await supabase.from('crf_responses').upsert(
                  { section_id: meta.id, field_key: field.key, field_label: field.label, field_type: field.type, response: field.defaultValue, visit_number: 0 },
                  { onConflict: 'section_id,field_key,visit_number' }
                )
              }
            }
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
      if (readOnly) return
      setValues((prev) => ({ ...prev, [key]: value }))
      setSaveStatus('unsaved')

      // Persist to localStorage for future patient suggestions (skip calculated/grid cells with __)
      if (value && !key.includes('__')) {
        try {
          const stored = JSON.parse(localStorage.getItem(LS_KEY) ?? '{}')
          localStorage.setItem(LS_KEY, JSON.stringify({ ...stored, [key]: value }))
        } catch { /* ignore */ }
      }

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

  // Visit-based filtering — must be before any early returns (Rules of Hooks)
  // Studies with visitSchedule show all sections at once (no day-specific filtering)
  const visitSectionKeys = (template?.visitSchedule || visitId === 'all') ? undefined : VISIT_SECTIONS[visitId]
  const fieldFilter = useMemo(() => template?.visitSchedule ? undefined : buildFieldFilter(visitId), [visitId, template])
  const currentVisitTab = VISIT_TABS.find((v) => v.id === visitId)

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
            {template.study_code} v{template.version} · {readOnly ? 'Read-only' : 'Select a visit below, then expand sections'}
          </p>
        </div>
        {!readOnly && <SaveIndicator status={saveStatus} />}
      </div>

      {/* Visit selector — ECZ2026 gets day-specific tabs; other studies show their actual schedule */}
      {template.visitSchedule ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">Visit schedule</p>
          <div className="flex flex-wrap gap-1.5">
            {template.visitSchedule.map((label, i) => (
              <span key={i} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
                {label}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-slate-500">All sections are shown below. Assessment grids capture data across all visits.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">Select visit</p>
          <div className="flex flex-wrap gap-1.5">
            {VISIT_TABS.map((v) => (
              <button
                key={v.id}
                onClick={() => setVisitId(v.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  visitId === v.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {v.short}
              </button>
            ))}
          </div>
          {currentVisitTab && (
            <p className="mt-2 text-[11px] text-slate-500">{currentVisitTab.desc}</p>
          )}
        </div>
      )}

      <CrfSectionAccordion
        key={visitId}
        sections={template.sections}
        values={values}
        onChange={onChange}
        completedSections={completedSections}
        suggestions={suggestions}
        visitSectionKeys={visitSectionKeys}
        fieldFilter={fieldFilter}
        openAll={readOnly}
      />
    </div>
  )
}
