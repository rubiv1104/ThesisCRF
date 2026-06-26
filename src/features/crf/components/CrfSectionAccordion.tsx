'use client'

import { CheckCircle2, Circle } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { CrfFieldRenderer } from './CrfFieldRenderer'
import type { CrfSectionDef } from '../types'

interface CrfSectionAccordionProps {
  sections: CrfSectionDef[]
  values: Record<string, string>
  onChange: (key: string, value: string) => void
  completedSections: Set<string>
  suggestions?: Record<string, string>
  /** When set, only these section keys are rendered */
  visitSectionKeys?: string[]
  /** When set, hides individual fields that don't match the current visit */
  fieldFilter?: (sectionKey: string, fieldKey: string, fieldType: string) => boolean
}

export function CrfSectionAccordion({
  sections,
  values,
  onChange,
  completedSections,
  suggestions = {},
  visitSectionKeys,
  fieldFilter,
}: CrfSectionAccordionProps) {
  const visibleSections = visitSectionKeys
    ? sections.filter((s) => visitSectionKeys.includes(s.key))
    : sections

  // When a specific visit is selected, expand all sections by default so the
  // investigator sees the EASI grid immediately without needing extra clicks.
  const defaultOpen = visitSectionKeys ? visibleSections.map((s) => s.key) : []

  return (
    <Accordion className="w-full space-y-2" defaultValue={defaultOpen}>
      {visibleSections.map((section) => {
        const visibleFields = fieldFilter
          ? section.fields.filter((f) => fieldFilter(section.key, f.key, f.type))
          : section.fields

        if (visibleFields.length === 0) return null
        const done = completedSections.has(section.key)

        return (
          <AccordionItem
            key={section.key}
            value={section.key}
            className="rounded-lg border border-slate-200 bg-white shadow-sm"
          >
            <AccordionTrigger className="px-5 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                {done ? (
                  <CheckCircle2 size={18} className="shrink-0 text-green-500" />
                ) : (
                  <Circle size={18} className="shrink-0 text-slate-300" />
                )}
                <span className="text-sm font-semibold text-slate-800">{section.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {visibleFields.map((field) => (
                  <CrfFieldRenderer
                    key={field.key}
                    field={field}
                    value={values[field.key] ?? ''}
                    onChange={onChange}
                    allValues={values}
                    suggestion={(!values[field.key] && suggestions[field.key]) ? suggestions[field.key] : undefined}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
