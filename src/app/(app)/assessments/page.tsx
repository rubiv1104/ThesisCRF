import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { APP_NAME } from '@/constants'

export const metadata = { title: `Assessments & Scales | ${APP_NAME}` }

const SCALES = [
  {
    group: 'Dermatology Scales (ECZ2026)',
    items: [
      {
        code: 'EASI',
        name: 'Eczema Area and Severity Index',
        items: 20,
        studies: ['ECZ2026'],
        domains: '4 body regions: Head/Neck (×0.1), Upper Limbs (×0.2), Trunk (×0.3), Lower Limbs (×0.4). For each region: Area score (0–6) × sum of 4 intensity signs (Erythema, Edema/Papulation, Excoriation, Lichenification — each 0–3)',
        scoring: 'Area (A): 0=0%, 1=1–9%, 2=10–29%, 3=30–49%, 4=50–69%, 5=70–89%, 6=90–100%. Intensity: 0=None, 1=Mild, 2=Moderate, 3=Severe. Sub-score = A×(E+I+Ex+L)×multiplier. Total EASI = Σ 4 sub-scores. Range: 0–72. 0=Clear, 0.1–1.0=Almost Clear, 1.1–7.0=Mild, 7.1–21.0=Moderate, 21.1–50=Severe, >50=Very Severe.',
        note: 'Recorded at Baseline, Day 15, 30, 45, 60, 75, 90 (in Disease Assessment grid). Full calculation grid in EASI Scoring section (BT and AT).',
      },
      {
        code: 'DLQI',
        name: 'Dermatology Life Quality Index',
        items: 10,
        studies: ['ECZ2026'],
        domains: '10 questions covering: Symptoms & Feelings (Q1–2), Daily Activities (Q3–4), Leisure (Q5–6), Work & School (Q7), Personal Relationships (Q8–9), Treatment (Q10)',
        scoring: 'Each item scored 0–3: 0=Not at all/Not relevant, 1=A little, 2=A lot, 3=Very much. Total = sum of Q1–Q10 (range 0–30). 0–1: No effect; 2–5: Small effect; 6–10: Moderate effect; 11–20: Very large effect; 21–30: Extremely large effect on quality of life.',
        note: 'Administered BT and AT. Full 10-item questionnaire in DLQI Assessment section of CRF.',
      },
      {
        code: 'vIGA-AD',
        name: 'Validated Investigator Global Assessment for Atopic Dermatitis',
        items: 1,
        studies: ['ECZ2026'],
        domains: 'Single clinician-rated global assessment of overall atopic dermatitis severity at time of evaluation',
        scoring: '0 = Clear (no inflammatory signs); 1 = Almost Clear (barely perceptible erythema/papulation); 2 = Mild (faint erythema, few papules); 3 = Moderate (moderate erythema, papulo-vesicular lesions); 4 = Severe (severe erythema, vesiculation, oozing). A response is defined as achieving 0 or 1.',
        note: 'Recorded at each visit (Baseline through Day 90) in the Disease Assessment grid.',
      },
      {
        code: 'Itch NRS',
        name: 'Itch Numeric Rating Scale (Pruritus NRS)',
        items: 1,
        studies: ['ECZ2026'],
        domains: 'Patient-reported worst itch intensity in the past 24 hours on a 0–10 numeric scale',
        scoring: '0 = No itch; 10 = Worst imaginable itch. Clinically meaningful improvement threshold: ≥3-point reduction from baseline. Scores 0–3 = Mild; 4–6 = Moderate; 7–10 = Severe pruritus.',
        note: 'Recorded at each visit (Baseline through Day 90) in the Disease Assessment grid. Patient-reported.',
      },
    ],
  },
  {
    group: 'Quality of Life',
    items: [
      {
        code: 'SF-12',
        name: 'Short Form-12 Health Survey',
        items: 12,
        studies: ['DM2026', 'DMA2026'],
        domains: 'Physical Component Summary (PCS), Mental Component Summary (MCS)',
        scoring: 'Norm-based scoring. PCS and MCS scored 0–100. Higher = better QoL. Calculated using standard algorithm with US/UK norms.',
        note: 'Used BT and AT only.',
      },
      {
        code: 'CLDQ-NASH',
        name: 'Chronic Liver Disease Questionnaire — NAFLD/NASH',
        items: 36,
        studies: ['FLD2026'],
        domains: '6 domains: Abdominal Symptoms, Fatigue, Systemic Symptoms, Activity, Emotional Function, Worry',
        scoring: '7-point Likert (1=all the time, 7=never). Higher = better QoL. Total score = mean of all items. Domain scores = mean of items in domain.',
        note: 'Administered at Day 1, 45 days, 90 days.',
      },
    ],
  },
  {
    group: 'Ayurvedic Assessments',
    items: [
      {
        code: 'PRAKRITI',
        name: 'Prakriti Assessment (Constitution)',
        items: null,
        studies: ['ECZ2026', 'AST2026', 'SHP2026', 'DM2026', 'DMA2026', 'HTN2026', 'HYP2026'],
        domains: 'Saara, Samhanana, Satmya, Satva, Ahara Shakti, Vyayama Shakti (Vata/Pitta/Kapha dominance)',
        scoring: 'Qualitative classification. No numeric score. Record dominant dosha (Vata/Pitta/Kapha/mixed).',
        note: 'Assessed once at enrollment.',
      },
      {
        code: 'ASHTAVIDHA',
        name: 'Ashtavidha Pariksha (8-fold examination)',
        items: 8,
        studies: ['FLD2026'],
        domains: 'Nadi, Mutra, Mala, Jihwa, Shabda, Sparsha, Drik, Akriti',
        scoring: 'Qualitative description per parameter. No numeric score.',
        note: '',
      },
      {
        code: 'DASHAVIDHA',
        name: 'Dashavidha Pariksha (10-fold patient examination)',
        items: 10,
        studies: ['FLD2026'],
        domains: 'Prakriti, Saara, Samhanana, Satmya, Satwa, Ahara Shakti, Vyayama Shakti, Vaya + Desha, Kala',
        scoring: 'Qualitative. Each parameter recorded descriptively.',
        note: '',
      },
    ],
  },
  {
    group: 'Symptom Grading',
    items: [
      {
        code: 'LIKERT-3',
        name: '3-Point Symptom Severity Scale',
        items: null,
        studies: ['ECZ2026', 'AST2026', 'SHP2026', 'HTN2026', 'HYP2026'],
        domains: '0 = Absent, 1 = Mild, 2 = Moderate, 3 = Severe',
        scoring: 'Sum of all symptom scores gives total severity score. Compare BT vs AT.',
        note: 'Different studies grade different symptom sets. ECZ2026 also uses EASI, DLQI, vIGA-AD, and Itch NRS (see Dermatology Scales above).',
      },
      {
        code: 'LIKERT-7',
        name: '7-Point Likert Scale',
        items: null,
        studies: ['FLD2026'],
        domains: 'Used in CLDQ-NASH: 1=All the time → 7=Never',
        scoring: 'Higher scores indicate better outcome (less symptoms).',
        note: 'Applied to 36 CLDQ-NASH items across 3 timepoints.',
      },
    ],
  },
  {
    group: 'Investigations',
    items: [
      {
        code: 'FIBROSCAN',
        name: 'FibroScan (Transient Elastography)',
        items: null,
        studies: ['FLD2026'],
        domains: 'Liver stiffness measurement (LSM) in kPa; CAP score for steatosis',
        scoring: 'LSM: <7.0 kPa = F0-F1 (no/minimal fibrosis), 7.0–9.5 = F2, 9.5–12.5 = F3, >12.5 = F4 (cirrhosis). CAP: <248 = S0, 248–268 = S1, 268–280 = S2, >280 = S3.',
        note: 'Recorded BT and AT.',
      },
      {
        code: 'HbA1c',
        name: 'Glycated Haemoglobin (HbA1c)',
        items: null,
        studies: ['DM2026', 'DMA2026'],
        domains: 'Reflects average blood glucose over ~3 months',
        scoring: 'Normal: <5.7%. Pre-diabetic: 5.7–6.4%. Diabetic: ≥6.5%. Target for T2DM management: <7%.',
        note: 'Recorded BT and AT.',
      },
    ],
  },
]

export default async function AssessmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Assessments & Scales</h1>
        <p className="mt-1 text-sm text-slate-500">
          Reference guide for all scales and assessment tools used across studies.
          To request a new scale, use the <a href="/feedback" className="text-blue-600 hover:underline">Feedback</a> page.
        </p>
      </div>

      {SCALES.map((group) => (
        <div key={group.group} className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 border-b border-slate-100 pb-2">
            {group.group}
          </h2>
          <div className="space-y-3">
            {group.items.map((scale) => (
              <div key={scale.code} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-blue-50 px-2 py-0.5 font-mono text-xs font-bold text-blue-700">
                        {scale.code}
                      </span>
                      {scale.items && (
                        <span className="text-xs text-slate-400">{scale.items} items</span>
                      )}
                    </div>
                    <h3 className="mt-1 font-semibold text-slate-900">{scale.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1 shrink-0">
                    {scale.studies.map((s) => (
                      <span key={s} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 text-sm">
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-0.5">Domains / Parameters</p>
                    <p className="text-slate-700 text-xs">{scale.domains}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-0.5">Scoring Guide</p>
                    <p className="text-slate-700 text-xs">{scale.scoring}</p>
                  </div>
                </div>

                {scale.note && (
                  <p className="text-xs text-amber-700 bg-amber-50 rounded-md px-3 py-1.5">
                    {scale.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="rounded-xl border-2 border-dashed border-blue-100 bg-blue-50/40 p-5 text-center">
        <p className="text-sm font-medium text-blue-800">Need a scale added to your CRF?</p>
        <p className="mt-1 text-xs text-blue-600">
          Submit a request via <a href="/feedback" className="underline font-medium">Feedback & Requests</a> and the admin will add it to your study.
        </p>
      </div>
    </div>
  )
}
