import type { CrfTemplateDef } from '../types'
import { sf12Section } from './shared/sf12'

export const DM2026_TEMPLATE: CrfTemplateDef = {
  study_code: 'DM2026',
  version: '1.0',
  visitSchedule: ['BT (Baseline)', 'Week 4', 'Week 8', 'Week 12 (AT)'],
  sections: [
    // 1. STUDY INFORMATION
    {
      key: 'study_info',
      title: '1. Study Information',
      fields: [
        { key: 'centre', label: 'Centre', type: 'text', required: true },
        { key: 'date_induction', label: 'Date of Induction into Study', type: 'date', required: true },
        { key: 'date_expected_completion', label: 'Expected Date of Completion', type: 'date' },
        { key: 'iec_number', label: 'IEC Number', type: 'text' },
        { key: 'ctri_number', label: 'CTRI Number', type: 'text' },
      ],
    },

    // 2. ELIGIBILITY CRITERIA
    {
      key: 'eligibility',
      title: '2. Eligibility Criteria',
      fields: [
        { key: 'ic_heading', label: 'Inclusion Criteria', type: 'heading' },
        {
          key: 'ic_1',
          label: '1. Patients with Type 2 DM / Madhumeha (ICD-10: E11) confirmed per ADA 2023 criteria',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
          required: true,
        },
        {
          key: 'ic_2',
          label: '2. Age 30–65 years, either gender',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
          required: true,
        },
        {
          key: 'ic_fbs',
          label: '3. FBS ≥ 126 mg/dL AND ≤ 179 mg/dL',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
          required: true,
        },
        {
          key: 'ic_fbs_value',
          label: 'FBS value (mg/dL)',
          type: 'number',
          unit: 'mg/dL',
        },
        {
          key: 'ic_hba1c',
          label: '4. HbA1c ≥ 6.5% AND ≤ 7.9%',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
          required: true,
        },
        {
          key: 'ic_hba1c_value',
          label: 'HbA1c value (%)',
          type: 'number',
          unit: '%',
        },
        {
          key: 'ic_4',
          label: '5. Willing to give written informed consent and complete 12 weeks of treatment',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
          required: true,
        },
        { key: 'ec_heading', label: 'Exclusion Criteria', type: 'heading' },
        {
          key: 'ec_1',
          label: '1. Type 1 DM, LADA, MODY, secondary diabetes',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        {
          key: 'ec_2',
          label: '2. FBS > 179 mg/dL or HbA1c > 7.9% (poor glycaemic control)',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        {
          key: 'ec_3',
          label: '3. Diabetic ketoacidosis, hyperosmolar hyperglycaemic state',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        {
          key: 'ec_4',
          label: '4. Severe hepatic, renal, or cardiac disease',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        {
          key: 'ec_5',
          label: '5. Pregnant or lactating women',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        {
          key: 'ec_6',
          label: '6. On insulin therapy or any other antidiabetic drug not part of the study protocol',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        {
          key: 'ec_7',
          label: '7. Active malignancy, TB, HIV, or systemic infection',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        {
          key: 'ec_8',
          label: '8. Enrolled in another clinical trial within past 6 months',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        {
          key: 'eligible',
          label: 'Patient is eligible for the study',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes — eligible' }, { value: 'no', label: 'No — not eligible' }],
          required: true,
        },
      ],
    },

    // 3. DEMOGRAPHIC PROFILE
    {
      key: 'demographics',
      title: '3. Demographic Profile',
      fields: [
        {
          key: 'marital_status', label: 'Marital Status', type: 'radio',
          options: [
            { value: 'married', label: 'Married' }, { value: 'unmarried', label: 'Unmarried' },
            { value: 'widow', label: 'Widow(er)' }, { value: 'divorcee', label: 'Divorcee' },
          ],
        },
        {
          key: 'education', label: 'Education', type: 'select',
          options: [
            { value: 'illiterate', label: 'Illiterate' }, { value: 'primary', label: 'Primary' },
            { value: 'secondary', label: 'Secondary' }, { value: 'higher_secondary', label: 'Higher Secondary' },
            { value: 'graduate', label: 'Graduate' }, { value: 'postgraduate', label: 'Postgraduate' },
          ],
        },
        { key: 'occupation', label: 'Occupation', type: 'text' },
        {
          key: 'socioeconomic', label: 'Socio-economic Status', type: 'radio',
          options: [{ value: 'upper', label: 'Upper' }, { value: 'middle', label: 'Middle' }, { value: 'lower', label: 'Lower' }],
        },
        {
          key: 'habitat', label: 'Habitat', type: 'radio',
          options: [{ value: 'urban', label: 'Urban' }, { value: 'semi_urban', label: 'Semi-Urban' }, { value: 'rural', label: 'Rural' }],
        },
        { key: 'dob', label: 'Date of Birth', type: 'date' },
        { key: 'duration_dm', label: 'Duration of DM', type: 'text', placeholder: 'e.g. 3 years, 6 months' },
        { key: 'address', label: 'Address', type: 'textarea' },
      ],
    },

    // 4. HISTORY
    {
      key: 'history',
      title: '4. History',
      fields: [
        { key: 'cc_heading', label: 'Chief Complaints', type: 'heading' },
        {
          key: 'cc_prameha', label: 'Prabhuta Mutra (Polyuria)', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        { key: 'cc_prameha_duration', label: 'Duration', type: 'text', dependsOn: { key: 'cc_prameha', value: 'present' } },
        {
          key: 'cc_trishna', label: 'Ati Trishna (Polydipsia)', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'cc_kshudha', label: 'Ati Kshudha (Polyphagia)', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'cc_dourbalya', label: 'Daurbalya (Weakness / Fatigue)', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'cc_weight_loss', label: 'Weight Loss (unexplained)', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'cc_neuropathy', label: 'Tingling / Numbness (neuropathy symptoms)', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'cc_slow_healing', label: 'Slow wound healing', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'cc_blurred_vision', label: 'Blurred vision', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'cc_skin_infections', label: 'Recurrent skin / urinary infections', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        { key: 'cc_other', label: 'Other complaints', type: 'textarea' },
        { key: 'hpi_heading', label: 'History of Present Illness', type: 'heading' },
        {
          key: 'hpi_onset', label: 'Mode of Onset', type: 'radio',
          options: [{ value: 'insidious', label: 'Insidious' }, { value: 'gradual', label: 'Gradual' }, { value: 'sudden', label: 'Sudden' }],
        },
        { key: 'hpi_duration', label: 'Duration of Illness', type: 'text' },
        { key: 'past_history', label: 'Past History (HTN, cardiac, renal, etc.)', type: 'textarea' },
        { key: 'treatment_history', label: 'Treatment History (current medications, dosage)', type: 'textarea' },
        { key: 'family_history', label: 'Family History (DM, HTN, CAD)', type: 'textarea' },
        { key: 'personal_heading', label: 'Personal History', type: 'heading' },
        {
          key: 'diet_type', label: 'Diet', type: 'radio',
          options: [{ value: 'vegetarian', label: 'Vegetarian' }, { value: 'mixed', label: 'Mixed (non-veg)' }],
        },
        {
          key: 'physical_activity', label: 'Physical Activity', type: 'radio',
          options: [
            { value: 'sedentary', label: 'Sedentary' },
            { value: 'light', label: 'Light' },
            { value: 'moderate', label: 'Moderate' },
            { value: 'heavy', label: 'Heavy' },
          ],
        },
        {
          key: 'addiction', label: 'Addiction', type: 'checkbox_group',
          options: [
            { value: 'tobacco', label: 'Tobacco' }, { value: 'alcohol', label: 'Alcohol' },
            { value: 'smoking', label: 'Smoking' }, { value: 'none', label: 'None' },
          ],
        },
      ],
    },

    // 5. GENERAL PHYSICAL EXAMINATION
    {
      key: 'general_examination',
      title: '5. General Physical Examination',
      fields: [
        { key: 'height', label: 'Height', type: 'number', unit: 'cm' },
        { key: 'weight', label: 'Weight', type: 'number', unit: 'kg' },
        { key: 'bmi', label: 'BMI', type: 'number', unit: 'kg/m²' },
        { key: 'waist_circumference', label: 'Waist Circumference', type: 'number', unit: 'cm' },
        { key: 'hip_circumference', label: 'Hip Circumference', type: 'number', unit: 'cm' },
        { key: 'waist_hip_ratio', label: 'Waist-Hip Ratio', type: 'number' },
        { key: 'pulse', label: 'Pulse Rate', type: 'number', unit: '/min' },
        { key: 'bp_systolic', label: 'BP Systolic', type: 'number', unit: 'mmHg' },
        { key: 'bp_diastolic', label: 'BP Diastolic', type: 'number', unit: 'mmHg' },
        { key: 'respiratory_rate', label: 'Respiratory Rate', type: 'number', unit: '/min' },
        { key: 'temperature', label: 'Temperature', type: 'number', unit: '°F' },
        {
          key: 'pallor', label: 'Pallor', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'oedema', label: 'Oedema', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'acanthosis', label: 'Acanthosis Nigricans', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        { key: 'skin_lesions', label: 'Other skin changes (xanthoma, necrobiosis, etc.)', type: 'textarea' },
      ],
    },

    // 6. ASHTAVIDHA PARIKSHA
    {
      key: 'ashtavidha_pariksha',
      title: '6. Ashtavidha Pariksha',
      fields: [
        {
          key: 'nadi', label: 'Nadi', type: 'select',
          options: [
            { value: 'vata', label: 'Vata' }, { value: 'pitta', label: 'Pitta' }, { value: 'kapha', label: 'Kapha' },
            { value: 'vata_pitta', label: 'Vata-Pitta' }, { value: 'vata_kapha', label: 'Vata-Kapha' },
            { value: 'pitta_kapha', label: 'Pitta-Kapha' }, { value: 'tridoshaja', label: 'Tridoshaja' },
          ],
        },
        { key: 'mutra', label: 'Mutra (Colour, Quantity, Frequency)', type: 'textarea' },
        { key: 'mala', label: 'Mala', type: 'text' },
        {
          key: 'jihwa', label: 'Jihwa', type: 'radio',
          options: [{ value: 'clean', label: 'Clean' }, { value: 'coated', label: 'Coated' }, { value: 'dry', label: 'Dry' }],
        },
        { key: 'shabda', label: 'Shabda', type: 'text' },
        {
          key: 'sparsha', label: 'Sparsha', type: 'radio',
          options: [
            { value: 'snigdha', label: 'Snigdha (oily)' }, { value: 'ruksha', label: 'Ruksha (dry)' },
            { value: 'ushna', label: 'Ushna' }, { value: 'sheeta', label: 'Sheeta' },
          ],
        },
        { key: 'drik', label: 'Drik (visual acuity / eye changes)', type: 'text' },
        {
          key: 'akriti', label: 'Akriti', type: 'radio',
          options: [{ value: 'krisha', label: 'Krisha (thin)' }, { value: 'sthool', label: 'Sthool (obese)' }, { value: 'madhyama', label: 'Madhyama' }],
        },
      ],
    },

    // 7. DASHAVIDHA PARIKSHA
    {
      key: 'dashavidha_pariksha',
      title: '7. Dashavidha Pariksha',
      fields: [
        {
          key: 'prakriti_sharirik', label: 'Prakriti — Sharirik', type: 'radio',
          options: [
            { value: 'V', label: 'Vata' }, { value: 'P', label: 'Pitta' }, { value: 'K', label: 'Kapha' },
            { value: 'VP', label: 'Vata-Pitta' }, { value: 'VK', label: 'Vata-Kapha' },
            { value: 'PK', label: 'Pitta-Kapha' }, { value: 'Samdoshaj', label: 'Samdoshaj' },
          ],
        },
        {
          key: 'prakriti_mansika', label: 'Prakriti — Mansika', type: 'radio',
          options: [{ value: 'satvic', label: 'Satvic' }, { value: 'rajas', label: 'Rajas' }, { value: 'tamas', label: 'Tamas' }],
        },
        { key: 'vikriti', label: 'Vikriti', type: 'textarea' },
        {
          key: 'sara', label: 'Sara', type: 'select',
          options: [
            { value: 'meda', label: 'Meda (predominant in DM)' }, { value: 'twaka', label: 'Twaka' },
            { value: 'rakta', label: 'Rakta' }, { value: 'mansa', label: 'Mansa' },
            { value: 'asthi', label: 'Asthi' }, { value: 'majja', label: 'Majja' }, { value: 'satwa', label: 'Satwa' },
          ],
        },
        {
          key: 'samhanana', label: 'Samhanana', type: 'radio',
          options: [{ value: 'susanhata', label: 'Susanhata' }, { value: 'madhyama', label: 'Madhyama' }, { value: 'heena', label: 'Heena' }],
        },
        {
          key: 'satmya', label: 'Satmya', type: 'radio',
          options: [{ value: 'pravar', label: 'Pravar' }, { value: 'madhyama', label: 'Madhyama' }, { value: 'avara', label: 'Avara' }],
        },
        {
          key: 'satwa', label: 'Satwa', type: 'radio',
          options: [{ value: 'pravar', label: 'Pravar' }, { value: 'madhyama', label: 'Madhyama' }, { value: 'avara', label: 'Avara' }],
        },
        {
          key: 'vyayamashakti', label: 'Vyayamashakti', type: 'radio',
          options: [{ value: 'pravar', label: 'Pravar' }, { value: 'madhyama', label: 'Madhyama' }, { value: 'avara', label: 'Avara' }],
        },
        {
          key: 'vaya', label: 'Vaya', type: 'radio',
          options: [
            { value: 'balavastha', label: 'Balavastha' },
            { value: 'madhyamavastha', label: 'Madhyamavastha' },
            { value: 'vridhavastha', label: 'Vridhavastha' },
          ],
        },
      ],
    },

    // 8. SYSTEMIC EXAMINATION
    {
      key: 'systemic_examination',
      title: '8. Systemic Examination',
      fields: [
        { key: 'sys_cvs', label: 'Cardio-Vascular System', type: 'textarea', placeholder: 'JVP, heart sounds, peripheral pulses' },
        { key: 'sys_respiratory', label: 'Respiratory System', type: 'textarea' },
        { key: 'sys_abdomen', label: 'Abdomen / Digestive System', type: 'textarea', placeholder: 'Liver size, spleen, any masses' },
        { key: 'sys_cns', label: 'Nervous System', type: 'textarea', placeholder: 'DTRs, vibration sense, monofilament test' },
        { key: 'sys_eye', label: 'Ophthalmological Findings', type: 'textarea', placeholder: 'Fundus, visual acuity, cataracts' },
        { key: 'sys_foot', label: 'Diabetic Foot Examination', type: 'textarea', placeholder: 'Callus, ulcers, pulse, neuropathy' },
      ],
    },

    // 9. INVESTIGATIONS
    {
      key: 'investigations',
      title: '9. Investigations',
      fields: [
        { key: 'inv_haem_heading', label: 'Haematological', type: 'heading' },
        { key: 'hb_bt', label: 'Hb% – BT', type: 'number', unit: 'g/dL' },
        { key: 'hb_at', label: 'Hb% – AT', type: 'number', unit: 'g/dL' },
        { key: 'tlc_bt', label: 'TLC – BT', type: 'number', unit: 'cells/cumm' },
        { key: 'tlc_at', label: 'TLC – AT', type: 'number', unit: 'cells/cumm' },
        { key: 'dlc_n_bt', label: 'DLC N% – BT', type: 'number' },
        { key: 'dlc_n_at', label: 'DLC N% – AT', type: 'number' },
        { key: 'dlc_l_bt', label: 'DLC L% – BT', type: 'number' },
        { key: 'dlc_l_at', label: 'DLC L% – AT', type: 'number' },
        { key: 'esr_bt', label: 'ESR – BT', type: 'number', unit: 'mm/hr' },
        { key: 'esr_at', label: 'ESR – AT', type: 'number', unit: 'mm/hr' },

        { key: 'inv_sugar_heading', label: 'Blood Sugar', type: 'heading' },
        { key: 'fbs_bt', label: 'FBS – BT', type: 'number', unit: 'mg/dL', hint: 'Must be 126–179 mg/dL for eligibility' },
        { key: 'fbs_w4', label: 'FBS – Week 4', type: 'number', unit: 'mg/dL' },
        { key: 'fbs_w8', label: 'FBS – Week 8', type: 'number', unit: 'mg/dL' },
        { key: 'fbs_at', label: 'FBS – AT (Week 12)', type: 'number', unit: 'mg/dL' },
        { key: 'ppbs_bt', label: 'PPBS – BT', type: 'number', unit: 'mg/dL', hint: 'Post-prandial blood sugar (2-hr)' },
        { key: 'ppbs_w4', label: 'PPBS – Week 4', type: 'number', unit: 'mg/dL' },
        { key: 'ppbs_w8', label: 'PPBS – Week 8', type: 'number', unit: 'mg/dL' },
        { key: 'ppbs_at', label: 'PPBS – AT (Week 12)', type: 'number', unit: 'mg/dL' },
        { key: 'hba1c_bt', label: 'HbA1c – BT', type: 'number', unit: '%', hint: 'Must be 6.5–7.9% for eligibility' },
        { key: 'hba1c_at', label: 'HbA1c – AT', type: 'number', unit: '%' },

        { key: 'inv_kft_heading', label: 'Kidney Function Test (KFT)', type: 'heading' },
        { key: 'urea_bt', label: 'Blood Urea – BT', type: 'number', unit: 'mg/dL' },
        { key: 'urea_at', label: 'Blood Urea – AT', type: 'number', unit: 'mg/dL' },
        { key: 'creatinine_bt', label: 'Serum Creatinine – BT', type: 'number', unit: 'mg/dL' },
        { key: 'creatinine_at', label: 'Serum Creatinine – AT', type: 'number', unit: 'mg/dL' },
        { key: 'uric_acid_bt', label: 'Serum Uric Acid – BT', type: 'number', unit: 'mg/dL' },
        { key: 'uric_acid_at', label: 'Serum Uric Acid – AT', type: 'number', unit: 'mg/dL' },

        { key: 'inv_lft_heading', label: 'Liver Function Test (LFT)', type: 'heading' },
        { key: 'sgot_bt', label: 'SGOT/AST – BT', type: 'number', unit: 'U/L' },
        { key: 'sgot_at', label: 'SGOT/AST – AT', type: 'number', unit: 'U/L' },
        { key: 'sgpt_bt', label: 'SGPT/ALT – BT', type: 'number', unit: 'U/L' },
        { key: 'sgpt_at', label: 'SGPT/ALT – AT', type: 'number', unit: 'U/L' },
        { key: 'total_bili_bt', label: 'Total Bilirubin – BT', type: 'number', unit: 'mg/dL' },
        { key: 'total_bili_at', label: 'Total Bilirubin – AT', type: 'number', unit: 'mg/dL' },
        { key: 'albumin_bt', label: 'Serum Albumin – BT', type: 'number', unit: 'g/dL' },
        { key: 'albumin_at', label: 'Serum Albumin – AT', type: 'number', unit: 'g/dL' },

        { key: 'inv_lipid_heading', label: 'Lipid Profile', type: 'heading' },
        { key: 'total_chol_bt', label: 'Total Cholesterol – BT', type: 'number', unit: 'mg/dL' },
        { key: 'total_chol_at', label: 'Total Cholesterol – AT', type: 'number', unit: 'mg/dL' },
        { key: 'hdl_bt', label: 'HDL – BT', type: 'number', unit: 'mg/dL' },
        { key: 'hdl_at', label: 'HDL – AT', type: 'number', unit: 'mg/dL' },
        { key: 'ldl_bt', label: 'LDL – BT', type: 'number', unit: 'mg/dL' },
        { key: 'ldl_at', label: 'LDL – AT', type: 'number', unit: 'mg/dL' },
        { key: 'tg_bt', label: 'Triglycerides – BT', type: 'number', unit: 'mg/dL' },
        { key: 'tg_at', label: 'Triglycerides – AT', type: 'number', unit: 'mg/dL' },
        { key: 'vldl_bt', label: 'VLDL – BT', type: 'number', unit: 'mg/dL' },
        { key: 'vldl_at', label: 'VLDL – AT', type: 'number', unit: 'mg/dL' },

        { key: 'inv_urine_heading', label: 'Urine Examination', type: 'heading' },
        {
          key: 'urine_sugar_bt', label: 'Urine Sugar – BT', type: 'radio',
          options: [{ value: 'nil', label: 'Nil' }, { value: 'trace', label: 'Trace' }, { value: 'plus1', label: '+1' }, { value: 'plus2', label: '+2' }, { value: 'plus3', label: '+3' }, { value: 'plus4', label: '+4' }],
        },
        {
          key: 'urine_sugar_at', label: 'Urine Sugar – AT', type: 'radio',
          options: [{ value: 'nil', label: 'Nil' }, { value: 'trace', label: 'Trace' }, { value: 'plus1', label: '+1' }, { value: 'plus2', label: '+2' }, { value: 'plus3', label: '+3' }, { value: 'plus4', label: '+4' }],
        },
        { key: 'urine_albumin_bt', label: 'Urine Albumin – BT', type: 'radio', options: [{ value: 'nil', label: 'Nil' }, { value: 'trace', label: 'Trace' }, { value: 'positive', label: 'Positive' }] },
        { key: 'urine_albumin_at', label: 'Urine Albumin – AT', type: 'radio', options: [{ value: 'nil', label: 'Nil' }, { value: 'trace', label: 'Trace' }, { value: 'positive', label: 'Positive' }] },
      ],
    },

    // 10. DISEASE ASSESSMENT
    {
      key: 'disease_assessment',
      title: '10. Disease Assessment',
      fields: [
        {
          key: 'metabolic_grid',
          label: 'Metabolic Parameters Grading',
          type: 'assessment_grid',
          rows: [
            'FBS (mg/dL)',
            'PPBS (mg/dL)',
            'HbA1c (%)',
            'Total Cholesterol (mg/dL)',
            'LDL (mg/dL)',
            'HDL (mg/dL)',
            'Triglycerides (mg/dL)',
            'BMI (kg/m²)',
            'Blood Pressure – Systolic (mmHg)',
            'Blood Pressure – Diastolic (mmHg)',
          ],
          columns: ['BT', 'Week 4', 'Week 8', 'Week 12 (AT)'],
        },
        {
          key: 'symptom_grid',
          label: 'Symptom Grading (0=Absent, 1=Mild, 2=Moderate, 3=Severe)',
          type: 'assessment_grid',
          rows: [
            'Prabhuta Mutra (Polyuria)',
            'Ati Trishna (Polydipsia)',
            'Ati Kshudha (Polyphagia)',
            'Daurbalya (Fatigue / Weakness)',
            'Karshya / Sthoulya (Weight change)',
            'Angamarda (Body ache)',
            'Nidra Prabodha Kastata (Sleep disturbance)',
            'Pada Daha (Burning feet)',
            'Pada Suptata (Numbness / tingling)',
            'Mukha Soshana (Dry mouth)',
          ],
          columns: ['BT', 'Week 4', 'Week 8', 'Week 12 (AT)'],
        },
        {
          key: 'overall_effect',
          label: 'Overall Effect of Therapy',
          type: 'select',
          options: [
            { value: 'complete_remission', label: 'Complete Remission (100%)' },
            { value: 'excellent', label: 'Excellent Improvement (76–99%)' },
            { value: 'marked', label: 'Marked Improvement (51–75%)' },
            { value: 'moderate', label: 'Moderate Improvement (26–50%)' },
            { value: 'mild', label: 'Mild Improvement (5–25%)' },
            { value: 'unchanged', label: 'Unchanged (<5%)' },
          ],
        },
      ],
    },

    // 11. ADVERSE DRUG REACTIONS
    {
      key: 'adr',
      title: '11. Adverse Events / ADR',
      fields: [
        {
          key: 'adr_present', label: 'Any Adverse Events?', type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        { key: 'adr_description', label: 'Description', type: 'textarea', dependsOn: { key: 'adr_present', value: 'yes' } },
        { key: 'adr_onset_date', label: 'Onset Date', type: 'date', dependsOn: { key: 'adr_present', value: 'yes' } },
        {
          key: 'adr_severity', label: 'Severity', type: 'radio',
          options: [
            { value: '1', label: '1 — Mild' }, { value: '2', label: '2 — Moderate' },
            { value: '3', label: '3 — Severe' }, { value: '4', label: '4 — Life-threatening' },
          ],
          dependsOn: { key: 'adr_present', value: 'yes' },
        },
        {
          key: 'adr_outcome', label: 'Outcome', type: 'radio',
          options: [
            { value: 'resolved', label: 'Resolved' }, { value: 'resolving', label: 'Resolving' },
            { value: 'not_resolved', label: 'Not Resolved' }, { value: 'fatal', label: 'Fatal' },
          ],
          dependsOn: { key: 'adr_present', value: 'yes' },
        },
      ],
    },

    // 12. COMPLETION
    {
      key: 'completion',
      title: '12. Completion',
      fields: [
        {
          key: 'treatment_completed', label: 'Treatment Status', type: 'radio',
          options: [{ value: 'completed', label: 'Completed' }, { value: 'not_completed', label: 'Not Completed' }],
          required: true,
        },
        {
          key: 'dropout', label: 'Dropout (self-withdrawn)?', type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        { key: 'dropout_reason', label: 'Reason for Dropout', type: 'textarea', dependsOn: { key: 'dropout', value: 'yes' } },
        {
          key: 'withdrawn', label: 'Withdrawn by investigator?', type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        { key: 'withdrawal_reason', label: 'Reason for Withdrawal', type: 'textarea', dependsOn: { key: 'withdrawn', value: 'yes' } },
        {
          key: 'result', label: 'Result', type: 'select',
          options: [
            { value: 'improved', label: 'Improved' }, { value: 'not_improved', label: 'Not Improved' },
            { value: 'unchanged', label: 'Unchanged' }, { value: 'lama', label: 'LAMA' },
          ],
        },
        { key: 'remarks', label: 'Remarks', type: 'textarea' },
        { key: 'date_completion', label: 'Date of Completion', type: 'date' },
      ],
    },
    sf12Section(),
  ],
}
