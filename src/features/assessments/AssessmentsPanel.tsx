'use client'

import { assessmentsForStudy } from './library'
import { AssessmentCard } from './AssessmentCard'

/**
 * Renders the assessment scales registered for a study as compact cards.
 * The CRF references scales by study — it never embeds questionnaire logic.
 */
export function AssessmentsPanel({ patientId, studyCode, readOnly = false }: { patientId: string; studyCode: string; readOnly?: boolean }) {
  const defs = assessmentsForStudy(studyCode)
  if (defs.length === 0) return null

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-base font-semibold text-slate-800">Assessment Scales</h2>
        <p className="text-xs text-slate-400">
          {readOnly
            ? 'This CRF is locked (approved or read-only) — tap a filled visit to view it. To edit, the guide can re-open the CRF for correction.'
            : 'Tap a visit to enter or edit. Score & interpretation are computed and saved automatically.'}
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {defs.map((def) => (
          <AssessmentCard key={def.code} patientId={patientId} def={def} readOnly={readOnly} />
        ))}
      </div>
    </div>
  )
}
