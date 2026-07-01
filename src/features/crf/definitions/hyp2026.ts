import type { CrfTemplateDef } from '../types'

// Scholar: Dr. Kirti Garg
// Study: Agnimukha Choorna and Yavakshara-Shunthi Choorna in management of
//        Dhatvagnimandhya w.s.r. Subclinical Hypothyroidism

export const HYP2026_TEMPLATE: CrfTemplateDef = {
  study_code: 'HYP2026',
  version: '1.0',
  visitSchedule: ['Basal (BT)', '1st Visit', '2nd Visit', '3rd Visit', '4th Visit', '5th Visit', '6th Visit (AT)'],
  sections: [
    // 1. STUDY INFORMATION
    {
      key: 'study_info',
      title: '1. Study Information',
      fields: [
        { key: 'trial_group', label: 'Trial Group', type: 'text', required: true },
        { key: 'centre', label: 'Centre', type: 'text', required: true },
        { key: 'cr_no', label: 'CR No.', type: 'text' },
        { key: 'opd_no', label: 'OPD No.', type: 'text' },
        { key: 'address', label: 'Address', type: 'textarea' },
        { key: 'phone', label: 'Telephone No.', type: 'text' },
        { key: 'iec_number', label: 'IEC Number', type: 'text' },
        { key: 'ctri_number', label: 'CTRI Number', type: 'text' },
      ],
    },

    // 2. ELIGIBILITY / INCLUSION CRITERIA
    {
      key: 'eligibility',
      title: '2. Eligibility Criteria (Inclusion)',
      fields: [
        {
          key: 'ic_1',
          label: '1. Patients of any gender aged 18 to 60 years diagnosed with subclinical hypothyroidism',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes (1)' }, { value: 'no', label: 'No (0)' }],
          required: true,
        },
        {
          key: 'ic_tsh',
          label: '2. Serum TSH level ≥ 4.5 mIU/L and < 10 mIU/L',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes (1)' }, { value: 'no', label: 'No (0)' }],
          required: true,
        },
        { key: 'ic_tsh_value', label: 'TSH value (mIU/L)', type: 'number', unit: 'mIU/L' },
        {
          key: 'ic_followup',
          label: '3. Subject able to come for follow-up visits',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes (1)' }, { value: 'no', label: 'No (0)' }],
        },
        {
          key: 'ic_consent',
          label: '4. Willing to participate and able to provide written informed consent',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes (1)' }, { value: 'no', label: 'No (0)' }],
          required: true,
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

    // 3. INVESTIGATIONS — BASELINE (these are done FIRST per the CRF layout)
    {
      key: 'investigations',
      title: '3. Laboratory Investigations',
      fields: [
        { key: 'inv_thyroid_heading', label: 'Serum TSH', type: 'heading' },
        { key: 'tsh_bt', label: 'Serum TSH – BT', type: 'number', unit: 'mIU/L', hint: 'Must be ≥4.5 and <10 mIU/L for inclusion' },
        { key: 'tsh_at', label: 'Serum TSH – AT', type: 'number', unit: 'mIU/L' },

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

        { key: 'inv_lft_heading', label: 'Liver Function Tests (LFT)', type: 'heading' },
        { key: 'total_bili_bt', label: 'Total Bilirubin – BT', type: 'number', unit: 'mg/dL' },
        { key: 'total_bili_at', label: 'Total Bilirubin – AT', type: 'number', unit: 'mg/dL' },
        { key: 'direct_bili_bt', label: 'Direct Bilirubin – BT', type: 'number', unit: 'mg/dL' },
        { key: 'direct_bili_at', label: 'Direct Bilirubin – AT', type: 'number', unit: 'mg/dL' },
        { key: 'indirect_bili_bt', label: 'Indirect Bilirubin – BT', type: 'number', unit: 'mg/dL' },
        { key: 'indirect_bili_at', label: 'Indirect Bilirubin – AT', type: 'number', unit: 'mg/dL' },
        { key: 'alp_bt', label: 'Serum Alkaline Phosphatase – BT', type: 'number', unit: 'U/L' },
        { key: 'alp_at', label: 'Serum Alkaline Phosphatase – AT', type: 'number', unit: 'U/L' },
        { key: 'sgot_bt', label: 'SGOT (AST) – BT', type: 'number', unit: 'U/L' },
        { key: 'sgot_at', label: 'SGOT (AST) – AT', type: 'number', unit: 'U/L' },
        { key: 'sgpt_bt', label: 'SGPT (ALT) – BT', type: 'number', unit: 'U/L' },
        { key: 'sgpt_at', label: 'SGPT (ALT) – AT', type: 'number', unit: 'U/L' },
        { key: 'total_protein_bt', label: 'Total Protein – BT', type: 'number', unit: 'gm/dL' },
        { key: 'total_protein_at', label: 'Total Protein – AT', type: 'number', unit: 'gm/dL' },
        { key: 'albumin_bt', label: 'S. Albumin – BT', type: 'number', unit: 'gm/dL' },
        { key: 'albumin_at', label: 'S. Albumin – AT', type: 'number', unit: 'gm/dL' },
        { key: 'globulin_bt', label: 'S. Globulin – BT', type: 'number', unit: 'gm/dL' },
        { key: 'globulin_at', label: 'S. Globulin – AT', type: 'number', unit: 'gm/dL' },
        { key: 'ag_ratio_bt', label: 'A/G Ratio – BT', type: 'number' },
        { key: 'ag_ratio_at', label: 'A/G Ratio – AT', type: 'number' },

        { key: 'inv_kft_heading', label: 'Kidney Function Tests (KFT)', type: 'heading' },
        { key: 'urea_bt', label: 'Serum Urea – BT', type: 'number', unit: 'mg/dL' },
        { key: 'urea_at', label: 'Serum Urea – AT', type: 'number', unit: 'mg/dL' },
        { key: 'creatinine_bt', label: 'Serum Creatinine – BT', type: 'number', unit: 'mg/dL' },
        { key: 'creatinine_at', label: 'Serum Creatinine – AT', type: 'number', unit: 'mg/dL' },
        { key: 'uric_acid_bt', label: 'Uric Acid – BT', type: 'number', unit: 'mg/dL' },
        { key: 'uric_acid_at', label: 'Uric Acid – AT', type: 'number', unit: 'mg/dL' },

        { key: 'inv_lipid_heading', label: 'Serum Lipid Profile', type: 'heading' },
        { key: 'cholesterol_bt', label: 'Serum Cholesterol – BT', type: 'number', unit: 'mg/dL' },
        { key: 'cholesterol_at', label: 'Serum Cholesterol – AT', type: 'number', unit: 'mg/dL' },
        { key: 'hdl_bt', label: 'HDL – BT', type: 'number', unit: 'mg/dL' },
        { key: 'hdl_at', label: 'HDL – AT', type: 'number', unit: 'mg/dL' },
        { key: 'ldl_bt', label: 'LDL – BT', type: 'number', unit: 'mg/dL' },
        { key: 'ldl_at', label: 'LDL – AT', type: 'number', unit: 'mg/dL' },
        { key: 'vldl_bt', label: 'VLDL – BT', type: 'number', unit: 'mg/dL' },
        { key: 'vldl_at', label: 'VLDL – AT', type: 'number', unit: 'mg/dL' },
        { key: 'tg_bt', label: 'Serum Triglycerides – BT', type: 'number', unit: 'mg/dL' },
        { key: 'tg_at', label: 'Serum Triglycerides – AT', type: 'number', unit: 'mg/dL' },
        { key: 'chol_hdl_ratio_bt', label: 'Cholesterol / HDL Ratio – BT', type: 'number' },
        { key: 'chol_hdl_ratio_at', label: 'Cholesterol / HDL Ratio – AT', type: 'number' },
        { key: 'ldl_hdl_ratio_bt', label: 'LDL / HDL Ratio – BT', type: 'number' },
        { key: 'ldl_hdl_ratio_at', label: 'LDL / HDL Ratio – AT', type: 'number' },

        { key: 'inv_bmi_heading', label: 'BMI Assessment', type: 'heading' },
        { key: 'height_bt', label: 'Height – BT', type: 'number', unit: 'm' },
        { key: 'height_at', label: 'Height – AT', type: 'number', unit: 'm' },
        { key: 'weight_bt', label: 'Weight – BT', type: 'number', unit: 'kg' },
        { key: 'weight_at', label: 'Weight – AT', type: 'number', unit: 'kg' },
        { key: 'bmi_bt', label: 'BMI – BT', type: 'number', unit: 'kg/m²' },
        { key: 'bmi_at', label: 'BMI – AT', type: 'number', unit: 'kg/m²' },
      ],
    },

    // 4. DEMOGRAPHIC PROFILE
    {
      key: 'demographics',
      title: '4. Demographic Profile',
      fields: [
        {
          key: 'marital_status', label: 'Marital Status', type: 'radio',
          options: [
            { value: 'married', label: 'Married' }, { value: 'unmarried', label: 'Unmarried' },
            { value: 'widow', label: 'Widow(er)' }, { value: 'divorcee', label: 'Divorcee' },
          ],
        },
        {
          key: 'education', label: 'Educational Status', type: 'radio',
          options: [{ value: 'illiterate', label: 'Illiterate' }, { value: 'literate', label: 'Literate' }],
        },
        { key: 'education_qualification', label: 'If literate, specify qualification', type: 'text', dependsOn: { key: 'education', value: 'literate' } },
        {
          key: 'occupation', label: 'Occupation', type: 'radio',
          options: [{ value: 'physical_labour', label: 'Physical Labour' }, { value: 'desk_job', label: 'Desk Job' }],
        },
        {
          key: 'socioeconomic', label: 'Socio-economic Status', type: 'radio',
          options: [{ value: 'apl', label: 'Above Poverty Line' }, { value: 'bpl', label: 'Below Poverty Line' }],
        },
        {
          key: 'habitat', label: 'Habitat', type: 'radio',
          options: [{ value: 'urban', label: 'Urban' }, { value: 'rural', label: 'Rural' }],
        },
      ],
    },

    // 5. HISTORY
    {
      key: 'history',
      title: '5. History',
      fields: [
        { key: 'hpi_duration', label: 'Duration of Illness', type: 'text' },
        { key: 'hpi_other', label: 'Any other information', type: 'textarea' },
        {
          key: 'past_history_yn', label: 'History of Previous Illness', type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        { key: 'past_history_details', label: 'Medical / Surgical history details', type: 'textarea', dependsOn: { key: 'past_history_yn', value: 'yes' } },
        {
          key: 'family_history_grid', label: 'Family History', type: 'assessment_grid',
          rows: ['Mother', 'Father', 'Sibling'], columns: ['DM', 'HTN', 'CAD'],
        },
        { key: 'gynaecological_history', label: 'Gynaecological & Obstetric History', type: 'textarea' },
        { key: 'lmp', label: 'LMP', type: 'date' },
        { key: 'live_children', label: 'Number of Live Children', type: 'number' },
        { key: 'live_children_sons', label: 'Son(s)', type: 'number' },
        { key: 'live_children_daughters', label: 'Daughter(s)', type: 'number' },
        { key: 'surgical_history', label: 'Surgical History', type: 'textarea' },
      ],
    },

    // 6. PERSONAL / CLINICAL HISTORY
    {
      key: 'personal_history',
      title: '6. Personal / Clinical History',
      fields: [
        {
          key: 'diet', label: 'Dietary Habits', type: 'radio',
          options: [{ value: 'vegetarian', label: 'Vegetarian' }, { value: 'non_veg', label: 'Non-Vegetarian' }],
        },
        {
          key: 'smoking', label: 'Smoking', type: 'radio',
          options: [
            { value: 'regular', label: 'Regular' }, { value: 'occasional', label: 'Occasional' },
            { value: 'ex_smoker', label: 'Ex-smoker (no smoking past 1 year)' }, { value: 'never', label: 'Never Smoked' },
          ],
        },
        { key: 'smoking_qty', label: 'Smoking Quantity/day & Duration', type: 'text', placeholder: 'e.g. 5 cigarettes/day, 3 years' },
        {
          key: 'alcohol', label: 'Alcohol Intake', type: 'radio',
          options: [{ value: 'no', label: 'No' }, { value: 'habitual', label: 'Habitual' }, { value: 'occasional', label: 'Occasional' }],
        },
        { key: 'alcohol_qty', label: 'Alcohol Quantity/day & Duration', type: 'text' },
        {
          key: 'addiction_other', label: 'Other addictions', type: 'checkbox_group',
          options: [{ value: 'tobacco', label: 'Tobacco' }, { value: 'substance_abuse', label: 'Substance abuse' }, { value: 'none', label: 'None' }],
        },
        {
          key: 'sleep', label: 'Sleep', type: 'radio',
          options: [{ value: 'normal', label: 'Normal' }, { value: 'disturbed', label: 'Disturbed' }],
        },
        {
          key: 'bowel_habits', label: 'Bowel Habits', type: 'radio',
          options: [{ value: 'regular', label: 'Regular' }, { value: 'irregular', label: 'Irregular' }],
        },
        {
          key: 'stool_consistency', label: 'Stool Consistency', type: 'radio',
          options: [{ value: 'normal', label: 'Normal' }, { value: 'loose', label: 'Loose' }, { value: 'constipated', label: 'Constipated' }],
        },
        {
          key: 'urine_output', label: 'Urine Output', type: 'checkbox_group',
          options: [
            { value: 'normal', label: 'Normal' }, { value: 'frequent', label: 'Frequent' },
            { value: 'urgency', label: 'Urgency' }, { value: 'strangury', label: 'Strangury' }, { value: 'nocturia', label: 'Nocturia' },
          ],
        },
        {
          key: 'physical_exercise', label: 'Physical Exercise', type: 'radio',
          options: [
            { value: 'heavy', label: 'Heavy Labour' }, { value: 'moderate', label: 'Moderate Labour' },
            { value: 'office', label: 'Office Job' }, { value: 'sedentary', label: 'Sedentary' },
          ],
        },
        {
          key: 'emotional_stress', label: 'Emotional Stresses', type: 'radio',
          options: [{ value: 'average', label: 'Average' }, { value: 'moderate', label: 'Moderate' }, { value: 'high', label: 'Too Much' }],
        },
      ],
    },

    // 7. GENERAL PHYSICAL EXAMINATION
    {
      key: 'general_examination',
      title: '7. General Physical Examination',
      fields: [
        {
          key: 'built', label: 'Built', type: 'radio',
          options: [{ value: 'average', label: 'Average' }, { value: 'emaciated', label: 'Emaciated' }, { value: 'well_built', label: 'Well Built' }],
        },
        {
          key: 'nutrition', label: 'Nutrition', type: 'radio',
          options: [
            { value: 'moderately_nourished', label: 'Moderately nourished' },
            { value: 'malnourished', label: 'Malnourished' },
            { value: 'well_nourished', label: 'Well nourished' },
          ],
        },
        { key: 'waist_circumference', label: 'Waist Circumference', type: 'number', unit: 'cm' },
        { key: 'respiratory_rate', label: 'Respiratory Rate', type: 'number', unit: '/min' },
        { key: 'pulse_rate', label: 'Pulse Rate', type: 'number', unit: '/min' },
        { key: 'bp', label: 'Blood Pressure', type: 'text', placeholder: 'e.g. 120/80 mmHg' },
        {
          key: 'clubbing', label: 'Clubbing', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'cyanosis', label: 'Cyanosis', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'cyanosis_type', label: 'Cyanosis Type', type: 'radio',
          options: [{ value: 'central', label: 'Central' }, { value: 'peripheral', label: 'Peripheral' }],
          dependsOn: { key: 'cyanosis', value: 'present' },
        },
        { key: 'temperature', label: 'Temperature', type: 'number', unit: '°F' },
        {
          key: 'pallor', label: 'Pallor', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'lymphadenopathy', label: 'Lymphadenopathy', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        { key: 'lymph_site', label: 'Site of lymphadenopathy', type: 'text', dependsOn: { key: 'lymphadenopathy', value: 'present' } },
        {
          key: 'oedema', label: 'Oedema', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'oedema_character', label: 'Oedema Character', type: 'radio',
          options: [{ value: 'pitting', label: 'Pitting' }, { value: 'non_pitting', label: 'Non-pitting' }],
          dependsOn: { key: 'oedema', value: 'present' },
        },
        { key: 'oedema_site', label: 'Oedema Site', type: 'text', dependsOn: { key: 'oedema', value: 'present' } },
        { key: 'any_other', label: 'Any Other', type: 'textarea' },
      ],
    },

    // 8. SYSTEMIC EXAMINATION
    {
      key: 'systemic_examination',
      title: '8. Systemic Examination',
      fields: [
        { key: 'sys_respiratory', label: 'Respiratory System', type: 'textarea' },
        { key: 'sys_gi', label: 'Gastro-Intestinal System', type: 'textarea' },
        { key: 'sys_cvs', label: 'Cardio-Vascular System', type: 'textarea' },
        { key: 'sys_nervous', label: 'Nervous System', type: 'textarea', placeholder: 'DTRs, ankle reflex, cognitive status' },
        { key: 'sys_msk', label: 'Musculo-Skeletal System', type: 'textarea' },
        { key: 'sys_gu', label: 'Genito-Urinary System', type: 'textarea' },
      ],
    },

    // 9. DISEASE ASSESSMENT (Symptom Grading across 6 visits)
    {
      key: 'disease_assessment',
      title: '9. Disease Assessment',
      fields: [
        {
          key: 'followup_dates', label: 'Follow-up — Date of Assessment', type: 'assessment_grid',
          rows: ['Date of Assessment'],
          columns: ['Basal', '1st Visit', '2nd Visit', '3rd Visit', '4th Visit', '5th Visit', '6th Visit'],
        },
        {
          key: 'symptom_grid',
          label: 'Symptom Grading across visits (0=Absent, 1=Mild, 2=Moderate, 3=Severe)',
          type: 'assessment_grid',
          rows: [
            'Slow movements / Mandagati',
            'Delayed ankle reflexes',
            'Coarse Skin / Sthira Twak',
            'Periorbital Puffiness / Netrakupa Shotha',
            'Cold skin / Sheetasparsha',
            'Diminished Sweating / Alpasweda',
            'Hoarseness / Swarabheda',
            'Paraesthesia / Sparsha Jnana Hrasa',
            'Dry skin / Ruksha Twak',
            'Constipation / Vibandha',
            'Impairment of hearing / Shravanahani',
            'Weight increase / Sthoulya',
          ],
          columns: ['Basal', '1st Visit', '2nd Visit', '3rd Visit', '4th Visit', '5th Visit', '6th Visit'],
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

    // 10. SF-12 HEALTH SURVEY (Quality of Life)
    {
      key: 'sf12',
      title: '10. SF-12 Health Survey (Quality of Life)',
      fields: [
        { key: 'sf12_heading', label: 'SF-12 is administered at Baseline and at end of treatment', type: 'heading' },
        {
          key: 'sf12_q1_bt', label: 'Q1 BT – General health rating', type: 'radio',
          options: [
            { value: '1', label: '1 – Excellent' }, { value: '2', label: '2 – Very Good' },
            { value: '3', label: '3 – Good' }, { value: '4', label: '4 – Fair' }, { value: '5', label: '5 – Poor' },
          ],
        },
        {
          key: 'sf12_q1_at', label: 'Q1 AT – General health rating', type: 'radio',
          options: [
            { value: '1', label: '1 – Excellent' }, { value: '2', label: '2 – Very Good' },
            { value: '3', label: '3 – Good' }, { value: '4', label: '4 – Fair' }, { value: '5', label: '5 – Poor' },
          ],
        },
        {
          key: 'sf12_q2a_bt', label: 'Q2a BT – Moderate activities limited (moving table, bowling)', type: 'radio',
          options: [{ value: '1', label: '1 – Yes, limited a lot' }, { value: '2', label: '2 – Yes, limited a little' }, { value: '3', label: '3 – No, not limited at all' }],
        },
        {
          key: 'sf12_q2a_at', label: 'Q2a AT – Moderate activities limited', type: 'radio',
          options: [{ value: '1', label: '1 – Yes, limited a lot' }, { value: '2', label: '2 – Yes, limited a little' }, { value: '3', label: '3 – No, not limited at all' }],
        },
        {
          key: 'sf12_q2b_bt', label: 'Q2b BT – Climbing several flights of stairs', type: 'radio',
          options: [{ value: '1', label: '1 – Yes, limited a lot' }, { value: '2', label: '2 – Yes, limited a little' }, { value: '3', label: '3 – No, not limited at all' }],
        },
        {
          key: 'sf12_q2b_at', label: 'Q2b AT – Climbing several flights of stairs', type: 'radio',
          options: [{ value: '1', label: '1 – Yes, limited a lot' }, { value: '2', label: '2 – Yes, limited a little' }, { value: '3', label: '3 – No, not limited at all' }],
        },
        {
          key: 'sf12_q3a_bt', label: 'Q3a BT – Accomplished less due to physical health (past 4 weeks)', type: 'radio',
          options: [{ value: '1', label: 'Yes' }, { value: '2', label: 'No' }],
        },
        {
          key: 'sf12_q3a_at', label: 'Q3a AT – Accomplished less due to physical health', type: 'radio',
          options: [{ value: '1', label: 'Yes' }, { value: '2', label: 'No' }],
        },
        {
          key: 'sf12_q3b_bt', label: 'Q3b BT – Limited in kind of work due to physical health', type: 'radio',
          options: [{ value: '1', label: 'Yes' }, { value: '2', label: 'No' }],
        },
        {
          key: 'sf12_q3b_at', label: 'Q3b AT – Limited in kind of work due to physical health', type: 'radio',
          options: [{ value: '1', label: 'Yes' }, { value: '2', label: 'No' }],
        },
        {
          key: 'sf12_q4a_bt', label: 'Q4a BT – Accomplished less due to emotional problems', type: 'radio',
          options: [{ value: '1', label: 'Yes' }, { value: '2', label: 'No' }],
        },
        {
          key: 'sf12_q4a_at', label: 'Q4a AT – Accomplished less due to emotional problems', type: 'radio',
          options: [{ value: '1', label: 'Yes' }, { value: '2', label: 'No' }],
        },
        {
          key: 'sf12_q4b_bt', label: 'Q4b BT – Did work less carefully due to emotional problems', type: 'radio',
          options: [{ value: '1', label: 'Yes' }, { value: '2', label: 'No' }],
        },
        {
          key: 'sf12_q4b_at', label: 'Q4b AT – Did work less carefully due to emotional problems', type: 'radio',
          options: [{ value: '1', label: 'Yes' }, { value: '2', label: 'No' }],
        },
        {
          key: 'sf12_q5_bt', label: 'Q5 BT – Pain interference with normal work (past 4 weeks)', type: 'radio',
          options: [
            { value: '1', label: '1 – Not at all' }, { value: '2', label: '2 – A little bit' },
            { value: '3', label: '3 – Moderately' }, { value: '4', label: '4 – Quite a bit' }, { value: '5', label: '5 – Extremely' },
          ],
        },
        {
          key: 'sf12_q5_at', label: 'Q5 AT – Pain interference with normal work', type: 'radio',
          options: [
            { value: '1', label: '1 – Not at all' }, { value: '2', label: '2 – A little bit' },
            { value: '3', label: '3 – Moderately' }, { value: '4', label: '4 – Quite a bit' }, { value: '5', label: '5 – Extremely' },
          ],
        },
        {
          key: 'sf12_q6a_bt', label: 'Q6a BT – Felt calm & peaceful (past 4 weeks)', type: 'radio',
          options: [
            { value: '1', label: '1 – All of the time' }, { value: '2', label: '2 – Most of the time' },
            { value: '3', label: '3 – A good bit' }, { value: '4', label: '4 – Some of the time' },
            { value: '5', label: '5 – A little of the time' }, { value: '6', label: '6 – None of the time' },
          ],
        },
        {
          key: 'sf12_q6a_at', label: 'Q6a AT – Felt calm & peaceful', type: 'radio',
          options: [
            { value: '1', label: '1 – All of the time' }, { value: '2', label: '2 – Most of the time' },
            { value: '3', label: '3 – A good bit' }, { value: '4', label: '4 – Some of the time' },
            { value: '5', label: '5 – A little of the time' }, { value: '6', label: '6 – None of the time' },
          ],
        },
        {
          key: 'sf12_q6b_bt', label: 'Q6b BT – Had a lot of energy', type: 'radio',
          options: [
            { value: '1', label: '1 – All of the time' }, { value: '2', label: '2 – Most of the time' },
            { value: '3', label: '3 – A good bit' }, { value: '4', label: '4 – Some of the time' },
            { value: '5', label: '5 – A little of the time' }, { value: '6', label: '6 – None of the time' },
          ],
        },
        {
          key: 'sf12_q6b_at', label: 'Q6b AT – Had a lot of energy', type: 'radio',
          options: [
            { value: '1', label: '1 – All of the time' }, { value: '2', label: '2 – Most of the time' },
            { value: '3', label: '3 – A good bit' }, { value: '4', label: '4 – Some of the time' },
            { value: '5', label: '5 – A little of the time' }, { value: '6', label: '6 – None of the time' },
          ],
        },
        {
          key: 'sf12_q6c_bt', label: 'Q6c BT – Felt down-hearted and blue', type: 'radio',
          options: [
            { value: '1', label: '1 – All of the time' }, { value: '2', label: '2 – Most of the time' },
            { value: '3', label: '3 – A good bit' }, { value: '4', label: '4 – Some of the time' },
            { value: '5', label: '5 – A little of the time' }, { value: '6', label: '6 – None of the time' },
          ],
        },
        {
          key: 'sf12_q6c_at', label: 'Q6c AT – Felt down-hearted and blue', type: 'radio',
          options: [
            { value: '1', label: '1 – All of the time' }, { value: '2', label: '2 – Most of the time' },
            { value: '3', label: '3 – A good bit' }, { value: '4', label: '4 – Some of the time' },
            { value: '5', label: '5 – A little of the time' }, { value: '6', label: '6 – None of the time' },
          ],
        },
        {
          key: 'sf12_q7_bt', label: 'Q7 BT – Health / emotional problems interfered with social activities', type: 'radio',
          options: [
            { value: '1', label: '1 – All of the time' }, { value: '2', label: '2 – Most of the time' },
            { value: '3', label: '3 – Some of the time' }, { value: '4', label: '4 – A little of the time' }, { value: '5', label: '5 – None of the time' },
          ],
        },
        {
          key: 'sf12_q7_at', label: 'Q7 AT – Health / emotional problems interfered with social activities', type: 'radio',
          options: [
            { value: '1', label: '1 – All of the time' }, { value: '2', label: '2 – Most of the time' },
            { value: '3', label: '3 – Some of the time' }, { value: '4', label: '4 – A little of the time' }, { value: '5', label: '5 – None of the time' },
          ],
        },
        { key: 'sf12_pcs_bt', label: 'PCS Score – BT', type: 'number', hint: 'Physical Component Summary — calculated by scorer' },
        { key: 'sf12_pcs_at', label: 'PCS Score – AT', type: 'number' },
        { key: 'sf12_mcs_bt', label: 'MCS Score – BT', type: 'number', hint: 'Mental Component Summary' },
        { key: 'sf12_mcs_at', label: 'MCS Score – AT', type: 'number' },
      ],
    },

    // 11. CONCOMITANT / RESCUE MEDICATION
    {
      key: 'concomitant_medication',
      title: '11. Concomitant & Rescue Medication',
      fields: [
        {
          key: 'concomitant_needed', label: 'Need for Concomitant Medication?', type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        {
          key: 'concomitant_table', label: 'Concomitant Medication', type: 'assessment_grid',
          rows: ['1', '2', '3'], columns: ['Medicine', 'Dose', 'Duration', 'Reason for Taking'],
          dependsOn: { key: 'concomitant_needed', value: 'yes' },
        },
        {
          key: 'rescue_needed', label: 'Need for Rescue Medication?', type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        {
          key: 'rescue_table', label: 'Rescue Medication', type: 'assessment_grid',
          rows: ['1', '2', '3'], columns: ['Medicine', 'Dose', 'Duration', 'Reason for Taking'],
          dependsOn: { key: 'rescue_needed', value: 'yes' },
        },
      ],
    },

    // 12. ADVERSE DRUG REACTIONS
    {
      key: 'adr',
      title: '12. Adverse Events / ADR',
      fields: [
        {
          key: 'adr_present', label: 'Any adverse effects / complaints?', type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        {
          key: 'adr_table', label: 'Adverse Drug Reactions / Events', type: 'assessment_grid',
          rows: ['1', '2', '3'], columns: ['Date', 'Complaint', 'Treatment Given', 'Remarks'],
          dependsOn: { key: 'adr_present', value: 'yes' },
        },
      ],
    },

    // 13. COMPLETION
    {
      key: 'completion',
      title: '13. Completion',
      fields: [
        {
          key: 'treatment_completed', label: 'Treatment', type: 'radio',
          options: [{ value: 'completed', label: 'Completed' }, { value: 'not_completed', label: 'Not Completed' }],
          required: true,
        },
        {
          key: 'dropout', label: 'Did the patient drop out on own?', type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        { key: 'dropout_reason', label: 'Date & reason for dropout', type: 'textarea', dependsOn: { key: 'dropout', value: 'yes' } },
        {
          key: 'withdrawn', label: 'Was the patient withdrawn from the trial?', type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        { key: 'withdrawal_reason', label: 'Date & reason for withdrawal', type: 'textarea', dependsOn: { key: 'withdrawn', value: 'yes' } },
        { key: 'result', label: 'Result', type: 'text' },
        {
          key: 'improved', label: 'Improved / Not Improved', type: 'radio',
          options: [{ value: 'improved', label: 'Improved' }, { value: 'not_improved', label: 'Not Improved' }],
        },
        { key: 'adverse_effects_final', label: 'Adverse effects (if any)', type: 'textarea' },
      ],
    },
  ],
}
