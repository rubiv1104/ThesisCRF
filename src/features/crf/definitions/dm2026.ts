import type { CrfTemplateDef } from '../types'

// Scholar: Dr. Nisha Uke · Supervisor: Dr. Umesh Patil · Co-Supervisor: Dr. Amit Kumar Rai
// Faithful reproduction of the approved CASE REPORT FORM:
// "Vyoshadi Choorna and Shuddha Shilajatu in the management of newly diagnosed cases
//  of Madhumeha w.s.r. Type 2 Diabetes Mellitus" — a single-arm study.

const YN = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
const PA = [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }]
const PMA = [{ value: 'pravara', label: 'Pravara (1)' }, { value: 'madhyama', label: 'Madhyama (2)' }, { value: 'avara', label: 'Avara (3)' }]
// SF-12 shared option sets
const SF_GH = [{ value: '1', label: '1 – Excellent' }, { value: '2', label: '2 – Very Good' }, { value: '3', label: '3 – Good' }, { value: '4', label: '4 – Fair' }, { value: '5', label: '5 – Poor' }]
const SF_LIM = [{ value: '1', label: '1 – Yes, limited a lot' }, { value: '2', label: '2 – Yes, limited a little' }, { value: '3', label: '3 – No, not limited at all' }]
const SF_YN = [{ value: '1', label: 'Yes' }, { value: '2', label: 'No' }]
const SF_PAIN = [{ value: '1', label: '1 – Not at all' }, { value: '2', label: '2 – A little bit' }, { value: '3', label: '3 – Moderately' }, { value: '4', label: '4 – Quite a bit' }, { value: '5', label: '5 – Extremely' }]
const SF_TIME6 = [{ value: '1', label: '1 – All of the time' }, { value: '2', label: '2 – Most of the time' }, { value: '3', label: '3 – A good bit' }, { value: '4', label: '4 – Some of the time' }, { value: '5', label: '5 – A little of the time' }, { value: '6', label: '6 – None of the time' }]
const SF_SOCIAL = [{ value: '1', label: '1 – All of the time' }, { value: '2', label: '2 – Most of the time' }, { value: '3', label: '3 – Some of the time' }, { value: '4', label: '4 – A little of the time' }, { value: '5', label: '5 – None of the time' }]

export const DM2026_TEMPLATE: CrfTemplateDef = {
  study_code: 'DM2026',
  version: '2.0',
  visitSchedule: ['Baseline', '1st Visit', '2nd Visit', '3rd Visit', '4th Visit', '5th Visit', '6th Visit'],
  sections: [
    // 1. STUDY INFORMATION
    {
      key: 'study_info',
      title: '1. Study Information',
      fields: [
        { key: 'centre', label: 'Centre', type: 'text', required: true },
        { key: 'cr_no', label: 'CR No.', type: 'text' },
        { key: 'opd_no', label: 'OPD No.', type: 'text' },
        { key: 'address', label: 'Address', type: 'textarea' },
        { key: 'phone', label: 'Telephone No.', type: 'text' },
        { key: 'iec_number', label: 'IEC Number', type: 'text' },
        { key: 'ctri_number', label: 'CTRI Number', type: 'text' },
      ],
    },

    // 2. CRITERIA FOR INCLUSION
    {
      key: 'eligibility',
      title: '2. Criteria for Inclusion',
      fields: [
        { key: 'ic_1', label: '1. Patient of any gender aged 35 to 65 years diagnosed with Type 2 DM', type: 'radio', options: [{ value: 'yes', label: 'Yes (1)' }, { value: 'no', label: 'No (0)' }], required: true },
        { key: 'ic_fbs', label: '2. Blood Sugar Fasting ≥ 126 and ≤ 179 mg/dL', type: 'radio', options: [{ value: 'yes', label: 'Yes (1)' }, { value: 'no', label: 'No (0)' }] },
        { key: 'ic_hba1c', label: '3. HbA1c ≥ 6.5% and ≤ 7.9%', type: 'radio', options: [{ value: 'yes', label: 'Yes (1)' }, { value: 'no', label: 'No (0)' }] },
        { key: 'ic_followup', label: '4. Subjects who are able to come for follow up', type: 'radio', options: [{ value: 'yes', label: 'Yes (1)' }, { value: 'no', label: 'No (0)' }] },
        { key: 'ic_consent', label: '5. Willing to participate and able to provide written informed consent', type: 'radio', options: [{ value: 'yes', label: 'Yes (1)' }, { value: 'no', label: 'No (0)' }], required: true },
        { key: 'eligible', label: 'Patient is eligible for the study', type: 'radio', options: [{ value: 'yes', label: 'Yes — eligible' }, { value: 'no', label: 'No — not eligible' }], required: true },
      ],
    },

    // 3. CHIEF COMPLAINTS
    {
      key: 'chief_complaints',
      title: '3. Chief Complaints',
      fields: [
        {
          key: 'chief_complaints_table', label: 'Chief Complaints (mark Yes/No and duration in months)', type: 'assessment_grid',
          rows: [
            'Polyuria (Excessive Urine)',
            'Polyphagia (Excessive Hunger)',
            'Polydipsia (Excessive Thirst)',
            'Exhaustion / Tiredness',
            'Body ache',
            'Giddiness',
            'Polyneuritis (Numbness / Tingling)',
            'Visual disturbance',
          ],
          columns: ['Yes / No', 'Duration (months)'],
        },
        { key: 'cc_any_other', label: 'Any other complaint', type: 'text' },
      ],
    },

    // 4. HISTORY
    {
      key: 'history',
      title: '4. History',
      fields: [
        { key: 'hpi_duration', label: 'History of Present Illness — Duration of Illness', type: 'text' },
        { key: 'hpi_other', label: 'Any other information', type: 'textarea' },
        { key: 'past_history_yn', label: 'History of Previous Illness', type: 'radio', options: YN },
        { key: 'past_history_details', label: 'Any significant medical / surgical history (specify)', type: 'textarea', dependsOn: { key: 'past_history_yn', value: 'yes' } },
      ],
    },

    // 5. LABORATORY INVESTIGATIONS
    {
      key: 'investigations',
      title: '5. Laboratory Investigations',
      fields: [
        { key: 'inv_haem_heading', label: 'Haematology', type: 'heading' },
        { key: 'hb_bt', label: 'Haemoglobin – BT', type: 'number', unit: 'gm/dL' },
        { key: 'hb_at', label: 'Haemoglobin – AT', type: 'number', unit: 'gm/dL' },
        { key: 'tlc_bt', label: 'TLC – BT', type: 'number', unit: 'cells/cumm' },
        { key: 'tlc_at', label: 'TLC – AT', type: 'number', unit: 'cells/cumm' },
        { key: 'dlc_n_bt', label: 'DLC N% – BT', type: 'number' },
        { key: 'dlc_n_at', label: 'DLC N% – AT', type: 'number' },
        { key: 'dlc_e_bt', label: 'DLC E% – BT', type: 'number' },
        { key: 'dlc_e_at', label: 'DLC E% – AT', type: 'number' },
        { key: 'dlc_b_bt', label: 'DLC B% – BT', type: 'number' },
        { key: 'dlc_b_at', label: 'DLC B% – AT', type: 'number' },
        { key: 'dlc_l_bt', label: 'DLC L% – BT', type: 'number' },
        { key: 'dlc_l_at', label: 'DLC L% – AT', type: 'number' },
        { key: 'dlc_m_bt', label: 'DLC M% – BT', type: 'number' },
        { key: 'dlc_m_at', label: 'DLC M% – AT', type: 'number' },
        { key: 'esr_bt', label: 'ESR – BT', type: 'number', unit: 'mm/hr' },
        { key: 'esr_at', label: 'ESR – AT', type: 'number', unit: 'mm/hr' },
        { key: 'fbs_bt', label: 'Blood Sugar Fasting – BT', type: 'number', unit: 'mg/dL' },
        { key: 'fbs_at', label: 'Blood Sugar Fasting – AT', type: 'number', unit: 'mg/dL' },
        { key: 'ppbs_bt', label: 'Blood Sugar PP – BT', type: 'number', unit: 'mg/dL' },
        { key: 'ppbs_at', label: 'Blood Sugar PP – AT', type: 'number', unit: 'mg/dL' },
        { key: 'hba1c_bt', label: 'HbA1c – BT', type: 'number', unit: '%' },
        { key: 'hba1c_at', label: 'HbA1c – AT', type: 'number', unit: '%' },

        { key: 'inv_biochem_heading', label: 'Bio-chemistry', type: 'heading' },
        { key: 'insulin_bt', label: 'Fasting Serum Insulin – BT', type: 'number', unit: 'mIU/L' },
        { key: 'insulin_at', label: 'Fasting Serum Insulin – AT', type: 'number', unit: 'mIU/L' },
        { key: 'homa_ir_bt', label: 'HOMA-IR – BT', type: 'number' },
        { key: 'homa_ir_at', label: 'HOMA-IR – AT', type: 'number' },
        { key: 'total_bili_bt', label: 'Total Bilirubin – BT', type: 'number', unit: 'mg/dL' },
        { key: 'total_bili_at', label: 'Total Bilirubin – AT', type: 'number', unit: 'mg/dL' },
        { key: 'direct_bili_bt', label: 'Direct Bilirubin – BT', type: 'number', unit: 'mg/dL' },
        { key: 'direct_bili_at', label: 'Direct Bilirubin – AT', type: 'number', unit: 'mg/dL' },
        { key: 'indirect_bili_bt', label: 'Indirect Bilirubin – BT', type: 'number', unit: 'mg/dL' },
        { key: 'indirect_bili_at', label: 'Indirect Bilirubin – AT', type: 'number', unit: 'mg/dL' },
        { key: 'alp_bt', label: 'Serum Alkaline Phosphatase – BT', type: 'number', unit: 'U/L' },
        { key: 'alp_at', label: 'Serum Alkaline Phosphatase – AT', type: 'number', unit: 'U/L' },
        { key: 'sgot_bt', label: 'SGOT (AST) – BT', type: 'number', unit: 'karmen units/dL' },
        { key: 'sgot_at', label: 'SGOT (AST) – AT', type: 'number', unit: 'karmen units/dL' },
        { key: 'sgpt_bt', label: 'SGPT (ALT) – BT', type: 'number', unit: 'karmen units/dL' },
        { key: 'sgpt_at', label: 'SGPT (ALT) – AT', type: 'number', unit: 'karmen units/dL' },
        { key: 'total_protein_bt', label: 'Total Protein – BT', type: 'number', unit: 'gm/dL' },
        { key: 'total_protein_at', label: 'Total Protein – AT', type: 'number', unit: 'gm/dL' },
        { key: 'albumin_bt', label: 'S. Albumin – BT', type: 'number', unit: 'gm/dL' },
        { key: 'albumin_at', label: 'S. Albumin – AT', type: 'number', unit: 'gm/dL' },
        { key: 'globulin_bt', label: 'S. Globulin – BT', type: 'number', unit: 'gm/dL' },
        { key: 'globulin_at', label: 'S. Globulin – AT', type: 'number', unit: 'gm/dL' },
        { key: 'ag_ratio_bt', label: 'A/G Ratio – BT', type: 'number' },
        { key: 'ag_ratio_at', label: 'A/G Ratio – AT', type: 'number' },
        { key: 'urea_bt', label: 'Serum Urea – BT', type: 'number', unit: 'mg/dL' },
        { key: 'urea_at', label: 'Serum Urea – AT', type: 'number', unit: 'mg/dL' },
        { key: 'creatinine_bt', label: 'Serum Creatinine – BT', type: 'number', unit: 'mg/dL' },
        { key: 'creatinine_at', label: 'Serum Creatinine – AT', type: 'number', unit: 'mg/dL' },
        { key: 'uric_acid_bt', label: 'Uric Acid – BT', type: 'number', unit: 'mg/dL' },
        { key: 'uric_acid_at', label: 'Uric Acid – AT', type: 'number', unit: 'mg/dL' },
        { key: 'cholesterol_bt', label: 'Serum Cholesterol – BT', type: 'number', unit: 'mg/dL' },
        { key: 'cholesterol_at', label: 'Serum Cholesterol – AT', type: 'number', unit: 'mg/dL' },
        { key: 'hdl_bt', label: 'HDLc – BT', type: 'number', unit: 'mg/dL' },
        { key: 'hdl_at', label: 'HDLc – AT', type: 'number', unit: 'mg/dL' },
        { key: 'ldl_bt', label: 'LDLc – BT', type: 'number', unit: 'mg/dL' },
        { key: 'ldl_at', label: 'LDLc – AT', type: 'number', unit: 'mg/dL' },
        { key: 'vldl_bt', label: 'VLDL – BT', type: 'number', unit: 'mg/dL' },
        { key: 'vldl_at', label: 'VLDL – AT', type: 'number', unit: 'mg/dL' },
        { key: 'tg_bt', label: 'Serum Triglycerides – BT', type: 'number', unit: 'mg/dL' },
        { key: 'tg_at', label: 'Serum Triglycerides – AT', type: 'number', unit: 'mg/dL' },
        { key: 'chol_hdl_bt', label: 'Cholesterol / HDLc Ratio – BT', type: 'number' },
        { key: 'chol_hdl_at', label: 'Cholesterol / HDLc Ratio – AT', type: 'number' },
        { key: 'ldl_hdl_bt', label: 'LDL / HDL Ratio – BT', type: 'number' },
        { key: 'ldl_hdl_at', label: 'LDL / HDL Ratio – AT', type: 'number' },

        { key: 'inv_urine_heading', label: 'Urine Examination', type: 'heading' },
        { key: 'urine_sugar_bt', label: 'Urine Sugar – BT', type: 'select', options: [{ value: '0', label: 'Nil' }, { value: '1', label: '+' }, { value: '2', label: '++' }, { value: '3', label: '+++' }] },
        { key: 'urine_sugar_at', label: 'Urine Sugar – AT', type: 'select', options: [{ value: '0', label: 'Nil' }, { value: '1', label: '+' }, { value: '2', label: '++' }, { value: '3', label: '+++' }] },
        { key: 'urine_protein_bt', label: 'Urine Protein – BT', type: 'select', options: [{ value: '0', label: 'Nil' }, { value: '1', label: '+' }, { value: '2', label: '++' }, { value: '3', label: '+++' }] },
        { key: 'urine_protein_at', label: 'Urine Protein – AT', type: 'select', options: [{ value: '0', label: 'Nil' }, { value: '1', label: '+' }, { value: '2', label: '++' }, { value: '3', label: '+++' }] },
        { key: 'urine_wbc_bt', label: 'Urine WBC – BT', type: 'number', unit: 'cells/hpf' },
        { key: 'urine_wbc_at', label: 'Urine WBC – AT', type: 'number', unit: 'cells/hpf' },
        { key: 'urine_rbc_bt', label: 'Urine RBC – BT', type: 'number', unit: 'cells/hpf' },
        { key: 'urine_rbc_at', label: 'Urine RBC – AT', type: 'number', unit: 'cells/hpf' },
      ],
    },

    // 6. DISEASE-SPECIFIC PARAMETERS (Madhumeha symptom grading)
    {
      key: 'disease_assessment',
      title: '6. Disease-Specific Parameters',
      fields: [
        {
          key: 'followup_dates', label: 'Follow-up — Date of Assessment', type: 'assessment_grid',
          rows: ['Date of Assessment'],
          columns: ['Basal', '1st Visit', '2nd Visit', '3rd Visit', '4th Visit', '5th Visit', '6th Visit'],
        },
        {
          key: 'madhumeha_grid', label: 'Madhumeha Symptom Grading across visits', type: 'assessment_grid',
          rows: [
            'Prabhoota mootrata (Excessive urine)',
            'Avila mootrata (Turbid urine)',
            'Kshudhaadhikya (Polyphagia)',
            'Pipasaadhikya (Polydipsia)',
            'Mutramadhurya (Glycosuria)',
            'Suptaangta / Daha (Polyneuritis — numbness/burning of soles)',
            'Pindikodveshtana (Cramps / calf muscle pain)',
            'Purishabaddhata (Constipation)',
            'Swedadhikya (Excess perspiration)',
            'Anga gandha (Bad odour)',
            'Nidraadhikya (Excessive sleep)',
            'Hasta paad tal daha (Burning of palms & soles)',
          ],
          columns: ['Baseline', '1st Visit', '2nd Visit', '3rd Visit', '4th Visit', '5th Visit', '6th Visit'],
        },
        { key: 'total_score', label: 'Total Score', type: 'text' },
        { key: 'result', label: 'Result', type: 'text' },
        { key: 'improved', label: 'Improved / Not Improved', type: 'radio', options: [{ value: 'improved', label: 'Improved' }, { value: 'not_improved', label: 'Not Improved' }] },
      ],
    },

    // 7. DEMOGRAPHIC PROFILE
    {
      key: 'demographics',
      title: '7. Demographic Profile',
      fields: [
        {
          key: 'marital_status', label: 'Marital Status', type: 'radio',
          options: [{ value: 'married', label: 'Married (1)' }, { value: 'unmarried', label: 'Unmarried (2)' }, { value: 'widow', label: 'Widow(er) (3)' }, { value: 'divorcee', label: 'Divorcee (4)' }],
        },
        { key: 'education', label: 'Educational Status', type: 'radio', options: [{ value: 'illiterate', label: 'Illiterate (1)' }, { value: 'literate', label: 'Literate (2)' }] },
        { key: 'education_qualification', label: 'If literate, specify qualification', type: 'text', dependsOn: { key: 'education', value: 'literate' } },
        { key: 'occupation', label: 'Occupation', type: 'radio', options: [{ value: 'physical_labour', label: 'Physical Labour (1)' }, { value: 'desk_job', label: 'Desk Job (2)' }] },
        { key: 'socioeconomic', label: 'Socio-economic Status', type: 'radio', options: [{ value: 'apl', label: 'Above Poverty Line (1)' }, { value: 'bpl', label: 'Below Poverty Line (2)' }] },
        { key: 'habitat', label: 'Habitat', type: 'radio', options: [{ value: 'urban', label: 'Urban (1)' }, { value: 'rural', label: 'Rural (2)' }] },
      ],
    },

    // 8. PERSONAL / CLINICAL HISTORY
    {
      key: 'personal_history',
      title: '8. Personal / Clinical History',
      fields: [
        { key: 'diet', label: 'Dietary Habits', type: 'radio', options: [{ value: 'vegetarian', label: 'Vegetarian (1)' }, { value: 'non_veg', label: 'Non-Vegetarian (2)' }] },
        {
          key: 'addiction', label: 'Addictions', type: 'checkbox_group',
          options: [{ value: 'smoking', label: 'Smoking' }, { value: 'tobacco', label: 'Tobacco' }, { value: 'alcohol', label: 'Alcohol' }, { value: 'substance_abuse', label: 'Substance abuse' }, { value: 'none', label: 'None' }],
        },
        {
          key: 'smoking', label: 'Smoking', type: 'radio',
          options: [{ value: 'regular', label: 'Regular (1)' }, { value: 'occasional', label: 'Occasional (2)' }, { value: 'ex_smoker', label: 'Ex-smoker (3)' }, { value: 'never', label: 'Never Smoked (4)' }],
        },
        { key: 'smoking_qty', label: 'Smoking — Quantity/day & Duration', type: 'text' },
        { key: 'alcohol', label: 'Alcohol Intake', type: 'radio', options: [{ value: 'no', label: 'No (0)' }, { value: 'habitual', label: 'Habitual (1)' }, { value: 'occasional', label: 'Occasional (2)' }] },
        { key: 'alcohol_qty', label: 'Alcohol — Quantity/day & Duration', type: 'text' },
        { key: 'sleep', label: 'Sleep', type: 'radio', options: [{ value: 'normal', label: 'Normal (1)' }, { value: 'disturbed', label: 'Disturbed (2)' }] },
        { key: 'bowel_habits', label: 'Bowel Habits', type: 'radio', options: [{ value: 'regular', label: 'Regular (1)' }, { value: 'irregular', label: 'Irregular (2)' }] },
        { key: 'stool_consistency', label: 'Stool Consistency', type: 'radio', options: [{ value: 'normal', label: 'Normal (1)' }, { value: 'loose', label: 'Loose (2)' }, { value: 'constipated', label: 'Constipated (3)' }] },
        {
          key: 'urine_output', label: 'Urine Output', type: 'checkbox_group',
          options: [{ value: 'normal', label: 'Normal (1)' }, { value: 'frequent', label: 'Frequent (2)' }, { value: 'urgency', label: 'Urgency (3)' }, { value: 'strangury', label: 'Strangury (4)' }, { value: 'nocturia', label: 'Nocturia (5)' }],
        },
        {
          key: 'physical_exercise', label: 'Physical Exercise', type: 'radio',
          options: [{ value: 'heavy', label: 'Heavy Labour (1)' }, { value: 'moderate', label: 'Moderate Labour (2)' }, { value: 'office', label: 'Office Job (3)' }, { value: 'sedentary', label: 'Sedentary (4)' }],
        },
        { key: 'emotional_stress', label: 'Emotional Stresses', type: 'radio', options: [{ value: 'average', label: 'Average (1)' }, { value: 'moderate', label: 'Moderate (2)' }, { value: 'high', label: 'Too Much (3)' }] },
        { key: 'family_history_grid', label: 'Family History', type: 'assessment_grid', rows: ['Mother', 'Father', 'Sibling'], columns: ['DM', 'HTN', 'CAD'] },
        { key: 'gynaecological_history', label: 'Gynaecological & Obstetric History', type: 'textarea' },
        { key: 'lmp', label: 'LMP', type: 'date' },
        { key: 'live_children', label: 'Number of Live Children', type: 'number' },
        { key: 'live_children_sons', label: 'Son(s)', type: 'number' },
        { key: 'live_children_daughters', label: 'Daughter(s)', type: 'number' },
        { key: 'surgical_history', label: 'Surgical History', type: 'textarea' },
      ],
    },

    // 9. GENERAL PHYSICAL EXAMINATION
    {
      key: 'general_examination',
      title: '9. General Physical Examination',
      fields: [
        { key: 'built', label: 'Built', type: 'radio', options: [{ value: 'average', label: 'Average (1)' }, { value: 'emaciated', label: 'Emaciated (2)' }, { value: 'well_built', label: 'Well built (3)' }] },
        { key: 'nutrition', label: 'Nutrition', type: 'radio', options: [{ value: 'moderately_nourished', label: 'Moderately nourished (1)' }, { value: 'malnourished', label: 'Malnourished (2)' }, { value: 'well_nourished', label: 'Well nourished (3)' }] },
        { key: 'height', label: 'Height', type: 'number', unit: 'm' },
        { key: 'weight', label: 'Weight', type: 'number', unit: 'kg' },
        { key: 'bmi', label: 'Body Mass Index (BMI)', type: 'calculated', formulaId: 'bmi', hint: 'Auto-calculated from height & weight' },
        { key: 'waist_circumference', label: 'Waist Circumference', type: 'number', unit: 'cm' },
        { key: 'respiratory_rate', label: 'Respiratory Rate', type: 'number', unit: '/min' },
        { key: 'pulse_rate', label: 'Pulse Rate', type: 'number', unit: '/min' },
        { key: 'bp', label: 'Blood Pressure', type: 'text', placeholder: 'e.g. 120/80 mmHg' },
        { key: 'clubbing', label: 'Clubbing', type: 'radio', options: PA },
        { key: 'cyanosis', label: 'Cyanosis', type: 'radio', options: PA },
        { key: 'cyanosis_type', label: 'Cyanosis Type', type: 'radio', options: [{ value: 'central', label: 'Central (1)' }, { value: 'peripheral', label: 'Peripheral (2)' }], dependsOn: { key: 'cyanosis', value: 'present' } },
        { key: 'temperature', label: 'Temperature', type: 'number', unit: '°F' },
        { key: 'pallor', label: 'Pallor', type: 'radio', options: PA },
        { key: 'lymphadenopathy', label: 'Lymphadenopathy', type: 'radio', options: PA },
        { key: 'lymph_site', label: 'Site of lymphadenopathy', type: 'text', dependsOn: { key: 'lymphadenopathy', value: 'present' } },
        { key: 'oedema', label: 'Edema', type: 'radio', options: PA },
        { key: 'oedema_character', label: 'Character of Edema', type: 'radio', options: [{ value: 'pitting', label: 'Pitting (1)' }, { value: 'non_pitting', label: 'Non-pitting (2)' }], dependsOn: { key: 'oedema', value: 'present' } },
        { key: 'oedema_site', label: 'Site of Edema', type: 'text', dependsOn: { key: 'oedema', value: 'present' } },
        { key: 'hair', label: 'Hair', type: 'text' },
        { key: 'nails', label: 'Nails', type: 'text' },
        { key: 'vertebral_column', label: 'Vertebral Column', type: 'radio', options: [{ value: 'normal', label: 'Normal (1)' }, { value: 'abnormal', label: 'Abnormal' }] },
        { key: 'joints', label: 'Joints', type: 'radio', options: [{ value: 'normal', label: 'Normal (1)' }, { value: 'abnormal', label: 'Abnormal (2)' }] },
        { key: 'joints_detail', label: 'If abnormal, specify joint & abnormality', type: 'text', dependsOn: { key: 'joints', value: 'abnormal' } },
        { key: 'any_other', label: 'Any Other', type: 'textarea' },
      ],
    },

    // 10. SYSTEMIC EXAMINATION
    {
      key: 'systemic_examination',
      title: '10. Systemic Examination',
      fields: [
        { key: 'sys_respiratory', label: 'Respiratory System', type: 'textarea' },
        { key: 'sys_gi', label: 'Gastro-Intestinal System', type: 'textarea' },
        { key: 'sys_cvs', label: 'Cardio-Vascular System', type: 'textarea' },
        { key: 'sys_nervous', label: 'Nervous System', type: 'textarea' },
        { key: 'sys_msk', label: 'Musculo-Skeletal System', type: 'textarea' },
        { key: 'sys_gu', label: 'Genito-Urinary System', type: 'textarea' },
      ],
    },

    // 11. AYURVEDIC PARAMETERS
    {
      key: 'ayurvedic_parameters',
      title: '11. Ayurvedic Parameters',
      fields: [
        { key: 'aahar_heading', label: 'Aahar', type: 'heading' },
        { key: 'appetite', label: 'Appetite', type: 'radio', options: [{ value: 'good', label: 'Good' }, { value: 'moderate', label: 'Moderate' }, { value: 'poor', label: 'Poor' }] },
        {
          key: 'rasa_dominance', label: 'Dominance of Rasa in Diet', type: 'checkbox_group',
          options: [{ value: 'madhura', label: 'Madhura (M)' }, { value: 'amla', label: 'Amla (A)' }, { value: 'lavana', label: 'Lavana (L)' }, { value: 'katu', label: 'Katu (Kt)' }, { value: 'tikta', label: 'Tikta (T)' }, { value: 'kashaya', label: 'Kashaya (Ks)' }],
        },
        {
          key: 'dietary_habits', label: 'Dietary Habits', type: 'checkbox_group',
          options: [{ value: 'samasana', label: 'Samasana' }, { value: 'adhyasana', label: 'Adhyasana' }, { value: 'vishamasana', label: 'Vishamasana' }, { value: 'pramitashan', label: 'Pramitashan' }, { value: 'virudhahara', label: 'Virudhahara' }],
        },
        { key: 'viharaja_heading', label: 'Viharaja', type: 'heading' },
        {
          key: 'vyayama', label: 'Vyayama', type: 'radio',
          options: [{ value: 'regular', label: 'Regularly' }, { value: 'irregular', label: 'Irregularly' }, { value: 'no', label: 'No' }, { value: 'less', label: 'Less' }, { value: 'proper', label: 'Proper' }, { value: 'excess', label: 'Excess' }],
        },
        { key: 'vishrama_day', label: 'Vishrama – Day (hrs)', type: 'number', unit: 'hrs' },
        { key: 'vishrama_night', label: 'Vishrama – Night (hrs)', type: 'number', unit: 'hrs' },
        { key: 'snana', label: 'Snana', type: 'radio', options: [{ value: 'daily', label: 'Daily' }, { value: 'irregular', label: 'Irregular' }] },
        { key: 'abhyanga', label: 'Abhyanga', type: 'radio', options: [{ value: 'daily', label: 'Daily' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'nil', label: 'Nil' }] },
        { key: 'koshtha', label: 'Koshtha', type: 'radio', options: [{ value: 'mridu', label: 'Mridu' }, { value: 'madhya', label: 'Madhya' }, { value: 'krura', label: 'Krura' }] },
        { key: 'mala_pravritti', label: 'Mala Pravritti (times/day)', type: 'text' },
        {
          key: 'mootra_pravritti', label: 'Mootra Pravritti', type: 'checkbox_group',
          options: [{ value: 'samyak', label: 'Samyak' }, { value: 'krucchra', label: 'Krucchra' }, { value: 'vaivarnya', label: 'Vaivarnya' }, { value: 'daaha', label: 'Daaha' }, { value: 'alpa', label: 'Alpa' }, { value: 'prabhuta', label: 'Prabhuta' }, { value: 'avila', label: 'Avila' }],
        },
        { key: 'mootra_freq_day', label: 'Mootra Frequency – Day (times)', type: 'number' },
        { key: 'mootra_freq_night', label: 'Mootra Frequency – Night (times)', type: 'number' },
        {
          key: 'prakriti', label: 'Prakriti', type: 'radio',
          options: [
            { value: 'vataja', label: 'Vataja (1)' }, { value: 'pittaja', label: 'Pittaja (2)' }, { value: 'kaphaja', label: 'Kaphaja (3)' },
            { value: 'vata_pittaja', label: 'Vata-Pittaja (4)' }, { value: 'vata_kaphaja', label: 'Vata-Kaphaja (5)' },
            { value: 'pitta_kaphaja', label: 'Pitta-Kaphaja (6)' }, { value: 'sannipataja', label: 'Sannipataja (7)' },
          ],
        },
        {
          key: 'saara', label: 'Saara', type: 'select',
          options: [
            { value: 'rasa_twaka', label: 'Rasa/Twaka Saara (1)' }, { value: 'rakta', label: 'Rakta Saara (2)' }, { value: 'mamsa', label: 'Mamsa Saara (3)' },
            { value: 'meda', label: 'Meda Saara (4)' }, { value: 'asthi', label: 'Asthi Saara (5)' }, { value: 'majja', label: 'Majja Saara (6)' }, { value: 'shukra', label: 'Shukra Saara (7)' },
          ],
        },
        { key: 'samhanana', label: 'Samhanana', type: 'radio', options: PMA },
        { key: 'satmya', label: 'Satmya', type: 'radio', options: PMA },
        { key: 'satva', label: 'Satva', type: 'radio', options: PMA },
        { key: 'ahara_shakti', label: 'Ahara Shakti', type: 'radio', options: PMA },
        { key: 'vyayama_shakti', label: 'Vyayama Shakti', type: 'radio', options: PMA },
      ],
    },

    // 12. CONCOMITANT / RESCUE MEDICATION
    {
      key: 'concomitant_medication',
      title: '12. Concomitant & Rescue Medication',
      fields: [
        { key: 'concomitant_needed', label: 'Need for Concomitant Medication?', type: 'radio', options: YN },
        { key: 'concomitant_table', label: 'Concomitant Medication', type: 'assessment_grid', rows: ['1', '2', '3'], columns: ['Medicine', 'Dose', 'Duration', 'Reason for Taking'], dependsOn: { key: 'concomitant_needed', value: 'yes' } },
        { key: 'rescue_needed', label: 'Need for Rescue Medication?', type: 'radio', options: YN },
        { key: 'rescue_table', label: 'Rescue Medication', type: 'assessment_grid', rows: ['1', '2', '3'], columns: ['Medicine', 'Dose', 'Duration', 'Reason for Taking'], dependsOn: { key: 'rescue_needed', value: 'yes' } },
      ],
    },

    // 13. ADVERSE DRUG REACTIONS
    {
      key: 'adr',
      title: '13. Adverse Drug Reactions / Events',
      fields: [
        { key: 'adr_present', label: 'Any adverse effects / other complaints?', type: 'radio', options: YN },
        { key: 'adr_table', label: 'Adverse Drug Reactions / Events', type: 'assessment_grid', rows: ['1', '2', '3'], columns: ['Date', 'Complaint', 'Treatment Given', 'Remarks'], dependsOn: { key: 'adr_present', value: 'yes' } },
      ],
    },

    // 14. COMPLETION
    {
      key: 'completion',
      title: '14. Completion',
      fields: [
        { key: 'treatment_completed', label: 'Treatment', type: 'radio', options: [{ value: 'completed', label: 'Completed' }, { value: 'not_completed', label: 'Not Completed' }], required: true },
        { key: 'dropout', label: 'Did the patient drop out on his/her own?', type: 'radio', options: YN },
        { key: 'dropout_reason', label: 'Date & reason for dropout (in detail)', type: 'textarea', dependsOn: { key: 'dropout', value: 'yes' } },
        { key: 'withdrawn', label: 'Was the patient withdrawn from the trial?', type: 'radio', options: YN },
        { key: 'withdrawal_reason', label: 'Date & reason for withdrawal (in detail)', type: 'textarea', dependsOn: { key: 'withdrawn', value: 'yes' } },
        { key: 'adverse_effects_final', label: 'Adverse effects (if any)', type: 'textarea' },
      ],
    },

    // 15. SF-12 HEALTH SURVEY
    {
      key: 'sf12',
      title: '15. SF-12 Health Survey (Quality of Life)',
      fields: [
        { key: 'sf12_heading', label: 'SF-12 is administered at Baseline (BT) and end of treatment (AT)', type: 'heading' },
        { key: 'sf12_q1_bt', label: 'Q1 BT – In general, your health is', type: 'radio', options: SF_GH },
        { key: 'sf12_q1_at', label: 'Q1 AT – In general, your health is', type: 'radio', options: SF_GH },
        { key: 'sf12_q2a_bt', label: 'Q2a BT – Moderate activities limited (moving a table, bowling)', type: 'radio', options: SF_LIM },
        { key: 'sf12_q2a_at', label: 'Q2a AT – Moderate activities limited', type: 'radio', options: SF_LIM },
        { key: 'sf12_q2b_bt', label: 'Q2b BT – Climbing several flights of stairs', type: 'radio', options: SF_LIM },
        { key: 'sf12_q2b_at', label: 'Q2b AT – Climbing several flights of stairs', type: 'radio', options: SF_LIM },
        { key: 'sf12_q3a_bt', label: 'Q3a BT – Accomplished less (physical health)', type: 'radio', options: SF_YN },
        { key: 'sf12_q3a_at', label: 'Q3a AT – Accomplished less (physical health)', type: 'radio', options: SF_YN },
        { key: 'sf12_q3b_bt', label: 'Q3b BT – Limited in kind of work (physical health)', type: 'radio', options: SF_YN },
        { key: 'sf12_q3b_at', label: 'Q3b AT – Limited in kind of work (physical health)', type: 'radio', options: SF_YN },
        { key: 'sf12_q4a_bt', label: 'Q4a BT – Accomplished less (emotional)', type: 'radio', options: SF_YN },
        { key: 'sf12_q4a_at', label: 'Q4a AT – Accomplished less (emotional)', type: 'radio', options: SF_YN },
        { key: 'sf12_q4b_bt', label: 'Q4b BT – Did work less carefully (emotional)', type: 'radio', options: SF_YN },
        { key: 'sf12_q4b_at', label: 'Q4b AT – Did work less carefully (emotional)', type: 'radio', options: SF_YN },
        { key: 'sf12_q5_bt', label: 'Q5 BT – Pain interference with normal work', type: 'radio', options: SF_PAIN },
        { key: 'sf12_q5_at', label: 'Q5 AT – Pain interference with normal work', type: 'radio', options: SF_PAIN },
        { key: 'sf12_q6a_bt', label: 'Q6a BT – Felt calm & peaceful', type: 'radio', options: SF_TIME6 },
        { key: 'sf12_q6a_at', label: 'Q6a AT – Felt calm & peaceful', type: 'radio', options: SF_TIME6 },
        { key: 'sf12_q6b_bt', label: 'Q6b BT – Had a lot of energy', type: 'radio', options: SF_TIME6 },
        { key: 'sf12_q6b_at', label: 'Q6b AT – Had a lot of energy', type: 'radio', options: SF_TIME6 },
        { key: 'sf12_q6c_bt', label: 'Q6c BT – Felt down-hearted and blue', type: 'radio', options: SF_TIME6 },
        { key: 'sf12_q6c_at', label: 'Q6c AT – Felt down-hearted and blue', type: 'radio', options: SF_TIME6 },
        { key: 'sf12_q7_bt', label: 'Q7 BT – Health/emotional problems interfered with social activities', type: 'radio', options: SF_SOCIAL },
        { key: 'sf12_q7_at', label: 'Q7 AT – Health/emotional problems interfered with social activities', type: 'radio', options: SF_SOCIAL },
        { key: 'sf12_pcs_bt', label: 'PCS Score – BT', type: 'number', hint: 'Physical Component Summary' },
        { key: 'sf12_pcs_at', label: 'PCS Score – AT', type: 'number' },
        { key: 'sf12_mcs_bt', label: 'MCS Score – BT', type: 'number', hint: 'Mental Component Summary' },
        { key: 'sf12_mcs_at', label: 'MCS Score – AT', type: 'number' },
      ],
    },
  ],
}
