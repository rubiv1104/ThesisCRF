/**
 * ECZ2026 — faithful rebuild of the RESEARCH PROFORMA as a Word body.
 * Reproduces the original proforma's numbering, option lists (selected one
 * ticked + bold), criteria tables, investigation BT/AT tables and the
 * day-wise grading grid, filled with a patient's CRF values.
 *
 * Returns the array of docx block elements for the document body.
 */
import {
  Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, AlignmentType,
} from 'docx'

type Vals = Record<string, string>

const FONT = 'Calibri'
const BORDER = { style: BorderStyle.SINGLE, size: 1, color: '999999' }
const CELL_BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER }

// ── small text helpers ───────────────────────────────────────────────────────

function run(text: string, opts: { bold?: boolean; size?: number; color?: string; italics?: boolean; underline?: boolean } = {}) {
  return new TextRun({
    text, font: FONT,
    size: opts.size ?? 20,
    bold: opts.bold,
    italics: opts.italics,
    color: opts.color,
    underline: opts.underline ? {} : undefined,
  })
}

function para(children: TextRun[], opts: { after?: number; before?: number } = {}) {
  return new Paragraph({ spacing: { after: opts.after ?? 40, before: opts.before }, children })
}

/** "label: value" line; blank shown as underscores. */
function line(label: string, value: string, opts: { unit?: string } = {}) {
  return para([
    run(label + ': ', { color: '334155' }),
    value
      ? run(value + (opts.unit ? ' ' + opts.unit : ''), { bold: true })
      : run('______________', { color: '94A3B8' }),
  ])
}

/** Section heading like the proforma's bold sub-headers. */
function heading(text: string, opts: { before?: number } = {}) {
  return new Paragraph({
    spacing: { before: opts.before ?? 200, after: 80 },
    children: [run(text, { bold: true, size: 22, color: '111827' })],
  })
}

// ── choice line: label + every option, selected bold/underlined with ☑ ───────

interface Opt { value: string; label: string }

function choice(label: string, options: Opt[], selected: string | string[]) {
  const sel = Array.isArray(selected) ? selected : (selected ? [selected] : [])
  const runs: TextRun[] = [run(label + ': ', { color: '334155' })]
  options.forEach((o, i) => {
    if (i > 0) runs.push(run('   '))
    const on = sel.includes(o.value)
    runs.push(run((on ? '☑ ' : '☐ ') + o.label, {
      bold: on, underline: on, color: on ? '111827' : '94A3B8',
    }))
  })
  return para(runs)
}

// ── table cell builders ──────────────────────────────────────────────────────

function cell(text: string, width: number, opts: { head?: boolean; bold?: boolean; align?: (typeof AlignmentType)[keyof typeof AlignmentType] } = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: CELL_BORDERS,
    shading: opts.head ? { fill: 'EEF2F7', type: ShadingType.CLEAR, color: 'auto' } : undefined,
    margins: { top: 30, bottom: 30, left: 80, right: 80 },
    children: [new Paragraph({
      alignment: opts.align,
      children: [run(text, { bold: opts.head || opts.bold, size: 18 })],
    })],
  })
}

// ── main builder ─────────────────────────────────────────────────────────────

export interface Ecz2026Patient {
  patient_name: string
  study_patient_id: string
  age: number | null
  gender: string | null
}

const INCLUSION = [
  '1. Patients with Eczema [ICD-10 code: L20] confirmed according to the American Academy of Dermatology Criteria.',
  '2. Individuals of either gender aged 16-70 years.',
  '3. EASI score ≤50.',
]
const EXCLUSION = [
  '1. Populations with skin diseases other than eczema (Scabies, Seborrheic dermatitis, Contact dermatitis, Ichthyoses, Cutaneous T-cell lymphoma, Psoriasis, Photosensitivity dermatoses, Immune deficiency diseases, Erythroderma of other causes).',
  '2. Cutaneous infection within 1 week before screening, or any infection requiring oral/parenteral antibiotics, antivirals, antiparasitics or antifungals within 1 week before screening.',
  '3. Comorbid conditions: Diabetes mellitus (FBS <126 mg/dl), Grade 2 hypertension (BP <160/100 mmHg), Renal impairment (Sr. creatinine >1.2 mg/dl), Hepatic impairment (SGOT/SGPT > three times upper limit).',
  '4. History of any cardiovascular disease (coronary artery disease, congestive heart failure, valvular heart disease, etc.).',
  '5. Comorbidities such as tuberculosis, immunocompromised states such as HIV, history or active malignancy etc.',
  '6. Pregnant women and lactating mothers.',
  '7. Received topical corticosteroids, systemic steroids, immunosuppressants or immunomodulators one month before screening.',
  '8. History of allergic reactions to ayurvedic drugs, or sensitivity in patch test to topical medication.',
  '9. Currently participating or participated in any other drug study within the past 6 months before screening.',
]

/** Yes(1)/No(2) criteria table — marks ✔ in the answered column. */
function criteriaTable(title: string, items: string[], keyPrefix: string, v: Vals) {
  const W_CRIT = 7560, W_YN = 900
  const header = new TableRow({ tableHeader: true, children: [
    cell(title, W_CRIT, { head: true }),
    cell('Yes (1)', W_YN, { head: true, align: AlignmentType.CENTER }),
    cell('No (2)', W_YN, { head: true, align: AlignmentType.CENTER }),
  ] })
  const rows = items.map((text, i) => {
    const ans = v[`${keyPrefix}_${i + 1}`] ?? ''
    return new TableRow({ children: [
      cell(text, W_CRIT),
      cell(ans === '1' ? '✔' : '', W_YN, { bold: true, align: AlignmentType.CENTER }),
      cell(ans === '2' ? '✔' : '', W_YN, { bold: true, align: AlignmentType.CENTER }),
    ] })
  })
  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [W_CRIT, W_YN, W_YN], rows: [header, ...rows] })
}

export function buildEcz2026Body(v: Vals, patient: Ecz2026Patient): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = []
  const ageStr = patient.age != null ? String(patient.age) : ''

  // ── Title block ──
  out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [run('RESEARCH PROFORMA', { bold: true, size: 28 })] }))
  out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 }, children: [
    run('EFFICACY OF EKVIMSHATI GUGGULU AND KHADIRASHTHAK KWATHA IN COMBINATION WITH DURVADYA TAILA IN THE MANAGEMENT OF VICHARCHIKA w.s.r. ECZEMA: AN OPEN-LABEL RANDOMIZED COMPARATIVE STUDY', { bold: true, size: 18, color: '334155' }),
  ] }))

  out.push(line('IEC no.', v['iec_number'] ?? ''))
  out.push(line('CTRI no.', v['ctri_number'] ?? ''))

  // ── Identification ──
  out.push(heading('Patient Identification'))
  out.push(line('1) Centre', v['centre'] ?? ''))
  out.push(line('2) Date of Induction into the Study', v['date_induction'] ?? ''))
  out.push(line('3) Expected Date of Completion', v['date_expected_completion'] ?? ''))
  out.push(line('4) CR No', v['cr_no'] ?? ''))
  out.push(line('5) OPD No', v['opd_no'] ?? ''))
  out.push(line('6) Name of the participant', patient.patient_name))
  out.push(line('7) Age (years)', ageStr))
  out.push(line('8) Sex', patient.gender ?? ''))
  out.push(line('9) Date of birth', v['dob'] ?? ''))
  out.push(line('10) Address', v['address'] ?? ''))

  // ── Criteria tables ──
  out.push(heading('12) Criteria for Inclusion'))
  out.push(criteriaTable('Inclusion Criteria', INCLUSION, 'ic', v))
  out.push(heading('13) Criteria for Exclusion'))
  out.push(criteriaTable('Exclusion Criteria', EXCLUSION, 'ec', v))
  out.push(choice('Patient eligible for the study', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }], v['eligible'] ?? ''))

  // ── Demographic profile ──
  out.push(heading('Demographic Profile'))
  out.push(choice('14. Marital status', [
    { value: 'married', label: 'Married' }, { value: 'unmarried', label: 'Unmarried' },
    { value: 'widow', label: 'Widow(er)' }, { value: 'divorcee', label: 'Divorcee' }, { value: 'other', label: 'Any other' },
  ], v['marital_status'] ?? ''))
  out.push(choice('15. Educational status', [{ value: '0', label: 'Illiterate' }, { value: '1', label: 'Literate' }], v['education'] ?? ''))
  if (v['education_qualification']) out.push(line('     Qualification', v['education_qualification']))
  out.push(line('16. Occupation', v['occupation'] ?? ''))
  out.push(choice('17. Socio-economic status', [{ value: '0', label: 'Above Poverty Line' }, { value: '1', label: 'Below Poverty Line' }], v['socioeconomic'] ?? ''))
  out.push(choice('18. Habitat', [{ value: '0', label: 'Urban' }, { value: '1', label: 'Semi-Urban' }, { value: '2', label: 'Rural' }], v['habitat'] ?? ''))
  out.push(choice('19. Religion', [
    { value: '0', label: 'Hindu' }, { value: '1', label: 'Muslim' }, { value: '2', label: 'Sikh' },
    { value: '3', label: 'Christian' }, { value: '4', label: 'Others' },
  ], v['religion'] ?? ''))

  // ── History ──
  out.push(heading('History'))
  out.push(line('20. Chief Complaints', v['chief_complaint'] ?? ''))
  out.push(para([run('21. History of Present Illness', { bold: true })], { before: 80 }))
  out.push(line('     Mode of onset of lesion(s)', v['mode_of_onset'] ?? ''))
  out.push(line('     Site of lesion(s)', v['site_of_lesion_hpi'] ?? ''))
  out.push(choice('     Characteristic of lesion(s)', [{ value: 'intermittent', label: 'Intermittent' }, { value: 'progressive', label: 'Progressive' }], v['characteristic'] ?? ''))
  out.push(choice('     Earlier similar episodes', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }], v['earlier_episodes'] ?? ''))
  out.push(choice('     H/O aggravating / relieving factors', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }], v['aggravating_relieving'] ?? ''))
  if (v['aggravating_food']) out.push(choice('       Food', [{ value: 'veg', label: 'Veg' }, { value: 'non_veg', label: 'Non-veg' }], v['aggravating_food']))
  if (v['aggravating_season']) out.push(choice('       Season', [{ value: 'rainy', label: 'Rainy' }, { value: 'winter', label: 'Winter' }, { value: 'summer', label: 'Summer' }], v['aggravating_season']))
  if (v['aggravating_others']) out.push(line('       Others', v['aggravating_others']))
  out.push(choice('22. History of past illness', [{ value: '0', label: 'Yes' }, { value: '1', label: 'No' }], v['past_history'] ?? ''))
  if (v['past_history_details']) out.push(line('     If yes, specify', v['past_history_details']))
  out.push(line('23. Treatment History', v['treatment_history'] ?? ''))
  out.push(line('24. Family History', v['family_history'] ?? ''))
  out.push(para([run('25. Personal History', { bold: true })], { before: 80 }))
  out.push(choice('     a) Ahara', [{ value: 'samisha', label: 'Samisha' }, { value: 'niramisha', label: 'Niramisha' }], v['ahara'] ?? ''))
  out.push(choice('     b) Ahara Vidhi', [
    { value: 'samashana', label: 'Samashana' }, { value: 'adhyashana', label: 'Adhyashana' },
    { value: 'vishamashana', label: 'Vishamashana' }, { value: 'viruddhashana', label: 'Viruddhashana' },
  ], v['ahara_vidhi'] ?? ''))
  if (v['menarche'] || v['menopause'] || v['menstrual_cycle']) {
    out.push(para([run('26. Menstrual History', { bold: true })], { before: 80 }))
    out.push(line('     Menarche (yr)', v['menarche'] ?? ''))
    out.push(line('     Menopause (yr)', v['menopause'] ?? ''))
    out.push(choice('     Menstrual cycle', [{ value: 'regular', label: 'Regular' }, { value: 'irregular', label: 'Irregular' }], v['menstrual_cycle'] ?? ''))
  }
  if (v['ftnd'] || v['lscs'] || v['abortions']) {
    out.push(para([run('27. Obstetric History', { bold: true })], { before: 80 }))
    out.push(line('     FTND', v['ftnd'] ?? ''))
    out.push(line('     LSCS', v['lscs'] ?? ''))
    out.push(line('     Abortions', v['abortions'] ?? ''))
  }

  // ── General physical examination ──
  out.push(heading('28. General Physical Examination'))
  out.push(choice('a) Built', [
    { value: '1', label: 'Average' }, { value: '2', label: 'Emaciated' }, { value: '3', label: 'Well built' },
    { value: '4', label: 'Tall' }, { value: '5', label: 'Dwarf' },
  ], v['built'] ?? ''))
  out.push(choice('b) Nutrition', [
    { value: '1', label: 'Moderately nourished' }, { value: '2', label: 'Malnourished' }, { value: '3', label: 'Well-nourished' },
  ], v['nutrition'] ?? ''))
  out.push(line('c) Height', v['height'] ?? '', { unit: 'cm' }))
  out.push(line('d) Weight', v['weight'] ?? '', { unit: 'kg' }))
  out.push(line('e) BMI', v['bmi'] ?? '', { unit: 'kg/m²' }))
  out.push(line('f) Respiratory Rate', v['respiratory_rate'] ?? '', { unit: '/min' }))
  out.push(line('g) Pulse Rate', v['pulse_rate'] ?? '', { unit: '/min' }))
  out.push(line('h) Blood Pressure', (v['bp_systolic'] && v['bp_diastolic']) ? `${v['bp_systolic']}/${v['bp_diastolic']}` : '', { unit: 'mmHg' }))
  out.push(choice('i) Clubbing', [{ value: '1', label: 'Present' }, { value: '2', label: 'Absent' }], v['clubbing'] ?? ''))
  out.push(choice('j) Cyanosis', [{ value: '1', label: 'Present' }, { value: '2', label: 'Absent' }], v['cyanosis'] ?? ''))
  if (v['cyanosis_type']) out.push(choice('     Type', [{ value: '1', label: 'Central' }, { value: '2', label: 'Peripheral' }], v['cyanosis_type']))
  out.push(line('k) Temperature', v['temperature'] ?? '', { unit: '°F' }))
  out.push(choice('l) Pallor', [{ value: '1', label: 'Present' }, { value: '2', label: 'Absent' }], v['pallor'] ?? ''))
  if (v['pallor_site']) out.push(line('     Site', v['pallor_site']))
  out.push(choice('m) Lymphadenopathy', [{ value: '1', label: 'Present' }, { value: '2', label: 'Absent' }], v['lymphadenopathy'] ?? ''))
  if (v['lymph_site']) out.push(line('     Site', v['lymph_site']))
  out.push(choice('n) Edema', [{ value: '1', label: 'Present' }, { value: '2', label: 'Absent' }], v['edema'] ?? ''))
  if (v['edema_character']) out.push(choice('     Character', [{ value: '1', label: 'Pitting' }, { value: '2', label: 'Non-pitting' }], v['edema_character']))

  // ── Local examination ──
  out.push(heading('29. Local Examination'))
  out.push(choice('i. Site of lesion (Pidika Sthana)', [
    { value: 'scalp', label: 'Scalp' }, { value: 'face', label: 'Face' }, { value: 'neck', label: 'Neck' },
    { value: 'trunk', label: 'Trunk' }, { value: 'forearm', label: 'Forearm' }, { value: 'arm', label: 'Arm' },
    { value: 'back', label: 'Back' }, { value: 'hip', label: 'Hip' }, { value: 'groins', label: 'Groins' },
    { value: 'nails', label: 'Nails' }, { value: 'thigh', label: 'Thigh' }, { value: 'leg', label: 'Leg' },
    { value: 'foot', label: 'Foot' }, { value: 'others', label: 'Others' },
  ], (v['lesion_site'] ?? '').split(',').filter(Boolean)))
  out.push(choice('     Surface', [{ value: 'flexor', label: 'Flexor' }, { value: 'extensor', label: 'Extensor' }, { value: 'both', label: 'Both' }], v['lesion_surface'] ?? ''))
  out.push(choice('ii. Distribution (Vyapti)', [{ value: 'symmetrical', label: 'Symmetrical' }, { value: 'asymmetrical', label: 'Asymmetrical' }], v['distribution'] ?? ''))
  out.push(line('iii. Size of lesion', v['lesion_size'] ?? ''))
  out.push(choice('     Colour', [{ value: 'erythematous', label: 'Erythematous' }, { value: 'hyperpigmented', label: 'Hyperpigmented' }, { value: 'normal', label: 'Normal skin colour' }], v['lesion_colour'] ?? ''))
  out.push(choice('     Type', [
    { value: 'erythema', label: 'Erythema' }, { value: 'papules', label: 'Papules' }, { value: 'vesicles', label: 'Vesicles' },
    { value: 'plaques', label: 'Plaques' }, { value: 'lichenification', label: 'Lichenification' }, { value: 'scaling', label: 'Scaling' },
    { value: 'excoriation', label: 'Excoriation' }, { value: 'fissures', label: 'Fissures' }, { value: 'crusting', label: 'Crusting' },
  ], (v['lesion_type'] ?? '').split(',').filter(Boolean)))
  out.push(choice('     Arrangement', [{ value: 'single', label: 'Single' }, { value: 'grouped', label: 'Grouped' }, { value: 'scattered', label: 'Scattered' }], v['arrangement'] ?? ''))
  out.push(choice('iv. Itching (Kandu)', [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }], v['itching_present'] ?? ''))
  if (v['itching_severity']) out.push(choice('     Severity', [{ value: 'mild', label: 'Mild' }, { value: 'moderate', label: 'Moderate' }, { value: 'severe', label: 'Severe' }], v['itching_severity']))
  out.push(choice('v. Hyperpigmentation (Shyava Varna)', [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }], v['hyperpigmentation'] ?? ''))
  if (v['hyperpigmentation_severity']) out.push(choice('     Severity', [{ value: 'mild', label: 'Mild' }, { value: 'moderate', label: 'Moderate' }, { value: 'severe', label: 'Severe' }], v['hyperpigmentation_severity']))
  out.push(choice('vi. Discharge (Srava)', [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }], v['discharge'] ?? ''))
  if (v['discharge_colour']) out.push(choice('     Colour', [{ value: 'watery', label: 'Watery' }, { value: 'white', label: 'White' }, { value: 'red', label: 'Red' }], v['discharge_colour']))
  if (v['discharge_contents']) out.push(choice('     Contents', [{ value: 'blood', label: 'Blood' }, { value: 'pus', label: 'Pus' }, { value: 'clear', label: 'Clear fluid' }], v['discharge_contents']))
  out.push(choice('vii. Dryness (Rukshata)', [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }], v['dryness'] ?? ''))
  if (v['dryness_severity']) out.push(choice('     Severity', [{ value: 'mild', label: 'Mild' }, { value: 'moderate', label: 'Moderate' }, { value: 'severe', label: 'Severe' }], v['dryness_severity']))

  // ── Systemic examination ──
  out.push(heading('30. Systemic Examination'))
  out.push(line('(1) Respiratory System', v['sys_respiratory'] ?? ''))
  out.push(line('(2) Gastro-Intestinal System', v['sys_gi'] ?? ''))
  out.push(line('(3) Cardio-vascular System', v['sys_cvs'] ?? ''))
  out.push(line('(4) Nervous System', v['sys_nervous'] ?? ''))
  out.push(line('(5) Musculo-skeletal System', v['sys_musculoskeletal'] ?? ''))
  out.push(line('(6) Genito-urinary System', v['sys_genitourinary'] ?? ''))

  // ── Dashavidha Pariksha ──
  out.push(heading('31. Dashavidha Pariksha'))
  out.push(choice('1. Prakriti — Sharirik', [
    { value: 'V', label: 'V' }, { value: 'P', label: 'P' }, { value: 'K', label: 'K' },
    { value: 'VP', label: 'VP' }, { value: 'VK', label: 'VK' }, { value: 'PK', label: 'PK' }, { value: 'Samdoshaj', label: 'Samdoshaj' },
  ], v['prakriti_sharirik'] ?? ''))
  out.push(choice('   Prakriti — Mansika', [{ value: 'satvic', label: 'Satvic' }, { value: 'rajas', label: 'Rajas' }, { value: 'tamas', label: 'Tamas' }], v['prakriti_mansika'] ?? ''))
  out.push(line('2. Vikriti (Hetu, Dosha, Dushya)', v['vikriti'] ?? ''))
  out.push(choice('3. Sara', [
    { value: 'twaka', label: 'Twaka' }, { value: 'rakta', label: 'Rakta' }, { value: 'mansa', label: 'Mansa' }, { value: 'meda', label: 'Meda' },
    { value: 'asthi', label: 'Asthi' }, { value: 'majja', label: 'Majja' }, { value: 'shukra', label: 'Shukra' }, { value: 'satwa', label: 'Satwa' }, { value: 'sarvasara', label: 'Sarvasara' },
  ], v['sara'] ?? ''))
  out.push(choice('4. Samhanana', [{ value: 'susanhata', label: 'Susanhata' }, { value: 'madhyama', label: 'Madhyama' }, { value: 'heena', label: 'Heena' }], v['samhanana'] ?? ''))
  out.push(choice('5. Pramana', [{ value: 'sama', label: 'Sama' }, { value: 'madhyama', label: 'Madhyama' }, { value: 'heena', label: 'Heena' }], v['pramana'] ?? ''))
  out.push(choice('6. Satmya', [{ value: 'pravar', label: 'Pravar' }, { value: 'madhyama', label: 'Madhyama' }, { value: 'avara', label: 'Avara' }], v['satmya'] ?? ''))
  out.push(choice('7. Satwa', [{ value: 'pravar', label: 'Pravar' }, { value: 'madhyama', label: 'Madhyama' }, { value: 'avara', label: 'Avara' }], v['satwa'] ?? ''))
  out.push(choice('8. Aharashakti — Abhyavaharana', [{ value: 'pravar', label: 'Pravar' }, { value: 'madhyama', label: 'Madhyama' }, { value: 'avara', label: 'Avara' }], v['aharashakti_abhyavaharana'] ?? ''))
  out.push(choice('   Aharashakti — Jarana', [{ value: 'pravar', label: 'Pravar' }, { value: 'madhyama', label: 'Madhyama' }, { value: 'avara', label: 'Avara' }], v['aharashakti_jarana'] ?? ''))
  out.push(choice('9. Vyayamashakti', [{ value: 'pravar', label: 'Pravar' }, { value: 'madhyama', label: 'Madhyama' }, { value: 'avara', label: 'Avara' }], v['vyayamashakti'] ?? ''))
  out.push(choice('10. Vaya', [{ value: 'balavastha', label: 'Balavastha' }, { value: 'madhyamavastha', label: 'Madhyamavastha' }, { value: 'vridhavastha', label: 'Vridhavastha' }], v['vaya'] ?? ''))

  // ── Investigations ──
  out.push(heading('Investigations'))
  out.push(para([run('1. Hematological Investigation', { bold: true })]))
  out.push(hematologyTable(v))
  out.push(para([run('2. Biochemical Investigation', { bold: true })], { before: 120 }))
  out.push(biochemTable(v))

  // ── Disease-specific grading grid ──
  out.push(heading('Disease-Specific Parameters (Grading)'))
  out.push(gradingTable(v))
  out.push(line('DLQI — Before Treatment', v['dlqi_bt'] ?? ''))
  out.push(line('DLQI — After Treatment', v['dlqi_at'] ?? ''))
  out.push(choice('Overall Effect of Therapy', [
    { value: 'complete_remission', label: 'Complete Remission' }, { value: 'excellent', label: 'Excellent' },
    { value: 'marked', label: 'Marked' }, { value: 'moderate', label: 'Moderate' },
    { value: 'mild', label: 'Mild' }, { value: 'unchanged', label: 'Unchanged' },
  ], v['overall_effect'] ?? ''))

  return out
}

// ── Investigation tables ─────────────────────────────────────────────────────

function hematologyTable(v: Vals) {
  const W = [2400, 1080, 1080, 2400, 1080, 1080] // Inv|BT|AT|Inv|BT|AT
  const head = new TableRow({ tableHeader: true, children: [
    cell('Investigations', W[0]!, { head: true }), cell('B.T.', W[1]!, { head: true, align: AlignmentType.CENTER }), cell('A.T.', W[2]!, { head: true, align: AlignmentType.CENTER }),
    cell('Investigations', W[3]!, { head: true }), cell('B.T.', W[4]!, { head: true, align: AlignmentType.CENTER }), cell('A.T.', W[5]!, { head: true, align: AlignmentType.CENTER }),
  ] })
  const left: [string, string][] = [['Hb. %', 'hb'], ['T.L.C.', 'tlc'], ['Sr. IgE', 'sr_ige'], ['E.S.R.', 'esr'], ['A.E.C.', 'aec']]
  const right: [string, string][] = [['DLC — N %', 'dlc_n'], ['DLC — L %', 'dlc_l'], ['DLC — E %', 'dlc_e'], ['DLC — B %', 'dlc_b'], ['DLC — M %', 'dlc_m']]
  const rows = left.map((l, i) => {
    const r = right[i]!
    return new TableRow({ children: [
      cell(l[0], W[0]!), cell(v[`${l[1]}_bt`] ?? '', W[1]!, { align: AlignmentType.CENTER }), cell(v[`${l[1]}_at`] ?? '', W[2]!, { align: AlignmentType.CENTER }),
      cell(r[0], W[3]!), cell(v[`${r[1]}_bt`] ?? '', W[4]!, { align: AlignmentType.CENTER }), cell(v[`${r[1]}_at`] ?? '', W[5]!, { align: AlignmentType.CENTER }),
    ] })
  })
  return new Table({ width: { size: 9120, type: WidthType.DXA }, columnWidths: W, rows: [head, ...rows] })
}

function biochemTable(v: Vals) {
  const W = [5760, 1800, 1800]
  const head = new TableRow({ tableHeader: true, children: [
    cell('Tests', W[0]!, { head: true }), cell('BT', W[1]!, { head: true, align: AlignmentType.CENTER }), cell('AT', W[2]!, { head: true, align: AlignmentType.CENTER }),
  ] })
  const tests: [string, string][] = [
    ['Blood Urea (mg/dL)', 'blood_urea'], ['Serum Uric Acid (mg/dL)', 'uric_acid'], ['Serum Creatinine (mg/dL)', 'creatinine'],
    ['SGOT / AST (karmen units/dL)', 'sgot'], ['SGPT / ALT (karmen units/dL)', 'sgpt'], ['Total Protein (gm/dL)', 'total_protein'],
    ['S. Albumin (gm/dL)', 'albumin'], ['S. Globulin (gm/dL)', 'globulin'], ['A/G Ratio', 'ag_ratio'],
    ['Direct Bilirubin (mg/dL)', 'direct_bili'], ['Indirect Bilirubin (mg/dL)', 'indirect_bili'], ['Total Bilirubin (mg/dL)', 'total_bili'],
    ['FBS (mg/dL)', 'fbs'],
  ]
  const rows = tests.map(([label, key]) => new TableRow({ children: [
    cell(label, W[0]!), cell(v[`${key}_bt`] ?? '', W[1]!, { align: AlignmentType.CENTER }), cell(v[`${key}_at`] ?? '', W[2]!, { align: AlignmentType.CENTER }),
  ] }))
  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: W, rows: [head, ...rows] })
}

function gradingTable(v: Vals) {
  const toKey = (s: string) => s.replace(/\s+/g, '_').toLowerCase()
  const rowsDef = [
    'Kandu (Pruritus)', 'Srava / Lasikadhya (Oozing)', 'Rukshata (Dryness)', 'Pidikotpatti (Eruption)',
    'Shyavata (Discolouration)', 'Ruja (Pain)', 'Rajyo (Thickness / Marked lining)', 'EASI Score', 'vIGA-AD', 'Itch NRS',
  ]
  const cols = ['Baseline (0)', 'Day 15', 'Day 30', 'Day 45', 'Day 60', 'Day 75', 'Day 90']
  const W_P = 2520, W_C = Math.floor((9360 - W_P) / cols.length)
  const widths = [W_P, ...cols.map(() => W_C)]
  const head = new TableRow({ tableHeader: true, children: [
    cell('Grading', W_P, { head: true }),
    ...cols.map((c) => cell(c, W_C, { head: true, align: AlignmentType.CENTER })),
  ] })
  const rows = rowsDef.map((rowLabel) => {
    const rowKey = `grading_table__${toKey(rowLabel)}`
    return new TableRow({ children: [
      cell(rowLabel, W_P),
      ...cols.map((c) => cell(v[`${rowKey}__${toKey(c)}`] ?? '', W_C, { align: AlignmentType.CENTER })),
    ] })
  })
  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: widths, rows: [head, ...rows] })
}
