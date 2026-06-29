/**
 * SF-12 Health Survey (Standard, v1 — 4-week recall).
 * Licensed instrument (MOS / Medical Outcomes Trust). Used here under academic
 * permission granted to the diabetes-study scholars — included ONLY in the
 * DM2026 and DMA2026 CRFs, NOT exposed on the public Assessments page.
 *
 * Captured at two timepoints: Before Treatment (BT) and After Treatment (AT).
 */
import type { CrfField, CrfSectionDef } from '../../types'

function opts(labels: string[]) {
  return labels.map((label, i) => ({ value: String(i + 1), label }))
}

const YES_NO = opts(['Yes', 'No'])
const HEALTH = opts(['Excellent', 'Very good', 'Good', 'Fair', 'Poor'])
const LIMIT3 = opts(['Yes, limited a lot', 'Yes, limited a little', 'No, not limited at all'])
const PAIN5 = opts(['Not at all', 'A little bit', 'Moderately', 'Quite a bit', 'Extremely'])
const TIME6 = opts(['All of the time', 'Most of the time', 'A good bit of the time', 'Some of the time', 'A little of the time', 'None of the time'])
const TIME5 = opts(['All of the time', 'Most of the time', 'Some of the time', 'A little of the time', 'None of the time'])

// The 12 items, in order, with their response option sets.
const SF12_ITEMS: { key: string; label: string; options: { value: string; label: string }[] }[] = [
  { key: 'q1_genhealth', label: '1. In general, would you say your health is:', options: HEALTH },
  { key: 'q2_moderate', label: '2. Moderate activities (moving a table, pushing a vacuum cleaner, bowling, or playing golf) — does your health now limit you?', options: LIMIT3 },
  { key: 'q3_stairs', label: '3. Climbing several flights of stairs — does your health now limit you?', options: LIMIT3 },
  { key: 'q4_phys_less', label: '4. (Physical health, past 4 weeks) Accomplished less than you would like?', options: YES_NO },
  { key: 'q5_phys_limited', label: '5. (Physical health, past 4 weeks) Were limited in the kind of work or other activities?', options: YES_NO },
  { key: 'q6_emot_less', label: '6. (Emotional problems, past 4 weeks) Accomplished less than you would like?', options: YES_NO },
  { key: 'q7_emot_careless', label: '7. (Emotional problems, past 4 weeks) Did work or activities less carefully than usual?', options: YES_NO },
  { key: 'q8_pain', label: '8. During the past 4 weeks, how much did pain interfere with your normal work (including work outside the home and housework)?', options: PAIN5 },
  { key: 'q9_calm', label: '9. How much of the time during the past 4 weeks have you felt calm and peaceful?', options: TIME6 },
  { key: 'q10_energy', label: '10. How much of the time during the past 4 weeks did you have a lot of energy?', options: TIME6 },
  { key: 'q11_blue', label: '11. How much of the time during the past 4 weeks have you felt downhearted and blue?', options: TIME6 },
  { key: 'q12_social', label: '12. During the past 4 weeks, how much of the time has your physical health or emotional problems interfered with your social activities (visiting friends, relatives, etc.)?', options: TIME5 },
]

function itemFields(suffix: 'bt' | 'at'): CrfField[] {
  return SF12_ITEMS.map((it) => ({
    key: `sf12_${it.key}_${suffix}`,
    label: it.label,
    type: 'radio' as const,
    options: it.options,
  }))
}

/** Returns the SF-12 section definition (BT + AT) for inclusion in a template. */
export function sf12Section(): CrfSectionDef {
  return {
    key: 'sf12',
    title: 'SF-12 Health Survey (Quality of Life)',
    fields: [
      { key: 'sf12_note', label: 'SF-12® Health Survey — used under academic permission from the Medical Outcomes Trust / John Ware Research Group. Recall period: past 4 weeks.', type: 'heading' },
      { key: 'sf12_bt_heading', label: 'Before Treatment (BT)', type: 'heading' },
      ...itemFields('bt'),
      { key: 'sf12_at_heading', label: 'After Treatment (AT)', type: 'heading' },
      ...itemFields('at'),
    ],
  }
}
