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
}

export function CrfSectionAccordion({
  sections,
  values,
  onChange,
  completedSections,
}: CrfSectionAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {sections.map((section) => {
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
                {section.fields.map((field) => (
                  <CrfFieldRenderer
                    key={field.key}
                    field={field}
                    value={values[field.key] ?? ''}
                    onChange={onChange}
                    allValues={values}
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
