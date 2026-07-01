import type { CrfTemplateDef } from '../types'

// Scholar: Dr. Anjali Saroha · Guide: Dr. Sujata Yadav · Co-Guide: Dr. Rashmi Tokas Rana
// Faithful reproduction of the approved CASE REPORT FORM:
// "Amrutarajanyadi Kashaya and Agnimantha Yoga along with Siddharthadi Yoga in the
//  management of Sheetapitta w.s.r. Urticaria". Mirrors the proforma section-by-section.
// NOTE: the proforma is a modern CRF — it does NOT contain Ashtavidha/Dashavidha
// Pariksha or a separate local skin-exam section, so none are added here.

const YN = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
const PA = [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }]

export const SHP2026_TEMPLATE: CrfTemplateDef = {
  study_code: 'SHP2026',
  version: '2.0',
  visitSchedule: ['Baseline', 'Day 7', 'Day 14', 'Day 21', 'Day 43', 'Day 58', 'Day 73', 'Day 90'],
  sections: [
    // 1. STUDY INFORMATION
    {
      key: 'study_info',
      title: '1. Study Information',
      fields: [
        { key: 'trial_group', label: 'Trial Group', type: 'text' },
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
        { key: 'ic_1', label: '1. Patient of any gender aged 18 to 60 years having confirmed symptoms of Sheetapitta', type: 'radio', options: [{ value: 'yes', label: 'Yes (1)' }, { value: 'no', label: 'No (0)' }], required: true },
        { key: 'ic_2', label: '2. Urticaria Activity Score (UAS7) between ≥3 and ≤27 at the time of screening', type: 'radio', options: [{ value: 'yes', label: 'Yes (1)' }, { value: 'no', label: 'No (0)' }], required: true },
        { key: 'ic_3', label: '3. Subjects who are able to come for follow up', type: 'radio', options: [{ value: 'yes', label: 'Yes (1)' }, { value: 'no', label: 'No (0)' }], required: true },
        { key: 'eligible', label: 'Patient is eligible for the study', type: 'radio', options: [{ value: 'yes', label: 'Yes — eligible' }, { value: 'no', label: 'No — not eligible' }], required: true },
      ],
    },

    // 3. INVESTIGATIONS
    {
      key: 'investigations',
      title: '3. Investigations',
      fields: [
        { key: 'inv_haem_heading', label: 'Haematological Investigation', type: 'heading' },
        { key: 'hb_bt', label: 'Hb% – BT', type: 'number', unit: 'g/dL' },
        { key: 'hb_at', label: 'Hb% – AT', type: 'number', unit: 'g/dL' },
        { key: 'tlc_bt', label: 'TLC – BT', type: 'number', unit: 'cells/cumm' },
        { key: 'tlc_at', label: 'TLC – AT', type: 'number', unit: 'cells/cumm' },
        { key: 'sr_ige_bt', label: 'Sr. IgE – BT', type: 'number', unit: 'IU/mL' },
        { key: 'sr_ige_at', label: 'Sr. IgE – AT', type: 'number', unit: 'IU/mL' },
        { key: 'esr_bt', label: 'ESR – BT', type: 'number', unit: 'mm/hr' },
        { key: 'esr_at', label: 'ESR – AT', type: 'number', unit: 'mm/hr' },
        { key: 'aec_bt', label: 'A.E.C. – BT', type: 'number', unit: 'cells/cumm' },
        { key: 'aec_at', label: 'A.E.C. – AT', type: 'number', unit: 'cells/cumm' },
        { key: 'crp_bt', label: 'CRP – BT', type: 'number', unit: 'mg/L' },
        { key: 'crp_at', label: 'CRP – AT', type: 'number', unit: 'mg/L' },
        { key: 'dlc_n_bt', label: 'DLC N% – BT', type: 'number' },
        { key: 'dlc_n_at', label: 'DLC N% – AT', type: 'number' },
        { key: 'dlc_l_bt', label: 'DLC L% – BT', type: 'number' },
        { key: 'dlc_l_at', label: 'DLC L% – AT', type: 'number' },
        { key: 'dlc_e_bt', label: 'DLC E% – BT', type: 'number' },
        { key: 'dlc_e_at', label: 'DLC E% – AT', type: 'number' },
        { key: 'dlc_b_bt', label: 'DLC B% – BT', type: 'number' },
        { key: 'dlc_b_at', label: 'DLC B% – AT', type: 'number' },
        { key: 'dlc_m_bt', label: 'DLC M% – BT', type: 'number' },
        { key: 'dlc_m_at', label: 'DLC M% – AT', type: 'number' },
        { key: 'upt_result', label: 'UPT (Urine Pregnancy Test)', type: 'radio', options: [{ value: 'positive', label: 'Positive' }, { value: 'negative', label: 'Negative' }, { value: 'na', label: 'N/A' }] },

        { key: 'inv_kft_heading', label: 'Biochemical — KFT', type: 'heading' },
        { key: 'urea_bt', label: 'Blood Urea – BT', type: 'number', unit: 'mg/dL' },
        { key: 'urea_at', label: 'Blood Urea – AT', type: 'number', unit: 'mg/dL' },
        { key: 'uric_acid_bt', label: 'Serum Uric Acid – BT', type: 'number', unit: 'mg/dL' },
        { key: 'uric_acid_at', label: 'Serum Uric Acid – AT', type: 'number', unit: 'mg/dL' },
        { key: 'creatinine_bt', label: 'Serum Creatinine – BT', type: 'number', unit: 'mg/dL' },
        { key: 'creatinine_at', label: 'Serum Creatinine – AT', type: 'number', unit: 'mg/dL' },

        { key: 'inv_lft_heading', label: 'Biochemical — LFT', type: 'heading' },
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
        { key: 'direct_bili_bt', label: 'Direct Bilirubin – BT', type: 'number', unit: 'mg/dL' },
        { key: 'direct_bili_at', label: 'Direct Bilirubin – AT', type: 'number', unit: 'mg/dL' },
        { key: 'indirect_bili_bt', label: 'Indirect Bilirubin – BT', type: 'number', unit: 'mg/dL' },
        { key: 'indirect_bili_at', label: 'Indirect Bilirubin – AT', type: 'number', unit: 'mg/dL' },
        { key: 'total_bili_bt', label: 'Total Bilirubin – BT', type: 'number', unit: 'mg/dL' },
        { key: 'total_bili_at', label: 'Total Bilirubin – AT', type: 'number', unit: 'mg/dL' },

        { key: 'inv_sugar_heading', label: 'Blood Sugar', type: 'heading' },
        { key: 'fbs_bt', label: 'FBS – BT', type: 'number', unit: 'mg/dL' },
        { key: 'fbs_at', label: 'FBS – AT', type: 'number', unit: 'mg/dL' },
        { key: 'rbs_bt', label: 'RBS – BT', type: 'number', unit: 'mg/dL' },
        { key: 'rbs_at', label: 'RBS – AT', type: 'number', unit: 'mg/dL' },
      ],
    },

    // 4. DISEASE-SPECIFIC PARAMETERS
    {
      key: 'disease_assessment',
      title: '4. Disease-Specific Parameters',
      fields: [
        {
          key: 'symptom_grid', label: 'Symptom Grading across visits', type: 'assessment_grid',
          rows: [
            'Kandu (Pruritus)',
            'Varti Damshta Samsthana Shotha (Inflammation like an insect bite)',
            'Toda (Excessive pain like pricking)',
            'Vidaha (Burning Sensation)',
            'Kshanikotpattivinash (Transient patches)',
            'UAS Score',
            'UCT (Urticaria Control Test)',
          ],
          columns: ['Baseline', 'Day 7', 'Day 14', 'Day 21', 'Day 43', 'Day 58', 'Day 73', 'Day 90'],
        },
        {
          key: 'bt_at_grid', label: 'Before / After Treatment', type: 'assessment_grid',
          rows: ['CRP', 'Sr. IgE', 'AEC', 'UAS7 Score', 'UCT Score', 'Dermatology Life Quality Index (DLQI)'],
          columns: ['BT', 'AT'],
        },
        {
          key: 'overall_effect', label: 'Overall Effect of Therapy', type: 'select',
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

    // 5. DEMOGRAPHIC PROFILE
    {
      key: 'demographics',
      title: '5. Demographic Profile',
      fields: [
        {
          key: 'marital_status', label: 'Marital Status', type: 'radio',
          options: [
            { value: 'married', label: 'Married (1)' }, { value: 'unmarried', label: 'Unmarried (2)' },
            { value: 'widow', label: 'Widow(er) (3)' }, { value: 'divorcee', label: 'Divorcee (4)' },
          ],
        },
        { key: 'education', label: 'Educational Status', type: 'radio', options: [{ value: 'illiterate', label: 'Illiterate (1)' }, { value: 'literate', label: 'Literate (2)' }] },
        { key: 'education_qualification', label: 'If literate, specify qualification', type: 'text', dependsOn: { key: 'education', value: 'literate' } },
        { key: 'occupation', label: 'Occupation', type: 'radio', options: [{ value: 'physical_labour', label: 'Physical Labour (1)' }, { value: 'desk_job', label: 'Desk Job (2)' }] },
        { key: 'socioeconomic', label: 'Socio-economic Status', type: 'radio', options: [{ value: 'apl', label: 'Above Poverty Line (1)' }, { value: 'bpl', label: 'Below Poverty Line (2)' }] },
        { key: 'habitat', label: 'Habitat', type: 'radio', options: [{ value: 'urban', label: 'Urban (1)' }, { value: 'rural', label: 'Rural (2)' }] },
      ],
    },

    // 6. HISTORY
    {
      key: 'history',
      title: '6. History',
      fields: [
        { key: 'hpi_duration', label: 'History of Present Illness — Duration of Illness', type: 'text' },
        { key: 'hpi_other', label: 'Any other information', type: 'textarea' },
        { key: 'past_history_yn', label: 'History of Previous Illness', type: 'radio', options: YN },
        { key: 'past_history_details', label: 'Any significant medical / surgical history (specify)', type: 'textarea', dependsOn: { key: 'past_history_yn', value: 'yes' } },
      ],
    },

    // 7. PERSONAL / CLINICAL HISTORY
    {
      key: 'personal_history',
      title: '7. Personal / Clinical History',
      fields: [
        { key: 'diet', label: 'Dietary Habits', type: 'radio', options: [{ value: 'vegetarian', label: 'Vegetarian (1)' }, { value: 'non_veg', label: 'Non-Vegetarian (2)' }] },
        {
          key: 'addiction', label: 'Addictions', type: 'checkbox_group',
          options: [
            { value: 'smoking', label: 'Smoking' }, { value: 'tobacco', label: 'Tobacco' },
            { value: 'alcohol', label: 'Alcohol' }, { value: 'substance_abuse', label: 'Substance abuse' }, { value: 'none', label: 'None' },
          ],
        },
        {
          key: 'smoking', label: 'Smoking', type: 'radio',
          options: [
            { value: 'regular', label: 'Regular (1)' }, { value: 'occasional', label: 'Occasional (2)' },
            { value: 'ex_smoker', label: 'Ex-smoker (no smoking past 1 year) (3)' }, { value: 'never', label: 'Never Smoked (4)' },
          ],
        },
        { key: 'smoking_qty', label: 'Smoking — Quantity/day & Duration', type: 'text' },
        { key: 'alcohol', label: 'Alcohol Intake', type: 'radio', options: [{ value: 'no', label: 'No (0)' }, { value: 'habitual', label: 'Habitual (1)' }, { value: 'occasional', label: 'Occasional (2)' }] },
        { key: 'alcohol_qty', label: 'Alcohol — Quantity/day & Duration', type: 'text' },
        { key: 'sleep', label: 'Sleep', type: 'radio', options: [{ value: 'normal', label: 'Normal (1)' }, { value: 'disturbed', label: 'Disturbed (2)' }] },
        { key: 'bowel_habits', label: 'Bowel Habits', type: 'radio', options: [{ value: 'regular', label: 'Regular (1)' }, { value: 'irregular', label: 'Irregular (2)' }] },
        { key: 'stool_consistency', label: 'Stool Consistency', type: 'radio', options: [{ value: 'normal', label: 'Normal (1)' }, { value: 'loose', label: 'Loose (2)' }, { value: 'constipated', label: 'Constipated (3)' }] },
        {
          key: 'urine_output', label: 'Urine Output', type: 'checkbox_group',
          options: [
            { value: 'normal', label: 'Normal (1)' }, { value: 'frequent', label: 'Frequent (2)' }, { value: 'urgency', label: 'Urgency (3)' },
            { value: 'strangury', label: 'Strangury (4)' }, { value: 'nocturia', label: 'Nocturia (5)' },
          ],
        },
        {
          key: 'physical_exercise', label: 'Physical Exercise', type: 'radio',
          options: [
            { value: 'heavy', label: 'Heavy Labour (1)' }, { value: 'moderate', label: 'Moderate Labour (2)' },
            { value: 'office', label: 'Office Job (3)' }, { value: 'sedentary', label: 'Sedentary (4)' },
          ],
        },
        { key: 'emotional_stress', label: 'Emotional Stresses', type: 'radio', options: [{ value: 'average', label: 'Average (1)' }, { value: 'moderate', label: 'Moderate (2)' }, { value: 'high', label: 'Too Much (3)' }] },
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

    // 8. GENERAL PHYSICAL EXAMINATION
    {
      key: 'general_examination',
      title: '8. General Physical Examination',
      fields: [
        { key: 'built', label: 'Built', type: 'radio', options: [{ value: 'average', label: 'Average (1)' }, { value: 'emaciated', label: 'Emaciated (2)' }, { value: 'well_built', label: 'Well built (3)' }] },
        {
          key: 'nutrition', label: 'Nutrition', type: 'radio',
          options: [{ value: 'moderately_nourished', label: 'Moderately nourished (1)' }, { value: 'malnourished', label: 'Malnourished (2)' }, { value: 'well_nourished', label: 'Well nourished (3)' }],
        },
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
        { key: 'any_other', label: 'Any Other', type: 'textarea' },
      ],
    },

    // 9. SYSTEMIC EXAMINATION
    {
      key: 'systemic_examination',
      title: '9. Systemic Examination',
      fields: [
        { key: 'sys_respiratory', label: 'Respiratory System', type: 'textarea' },
        { key: 'sys_gi', label: 'Gastro-Intestinal System', type: 'textarea' },
        { key: 'sys_cvs', label: 'Cardio-Vascular System', type: 'textarea' },
        { key: 'sys_nervous', label: 'Nervous System', type: 'textarea' },
        { key: 'sys_msk', label: 'Musculo-Skeletal System', type: 'textarea' },
        { key: 'sys_gu', label: 'Genito-Urinary System', type: 'textarea' },
      ],
    },

    // 10. CONCOMITANT / RESCUE MEDICATION
    {
      key: 'concomitant_medication',
      title: '10. Concomitant & Rescue Medication',
      fields: [
        { key: 'concomitant_needed', label: 'Need for Concomitant Medication?', type: 'radio', options: YN },
        {
          key: 'concomitant_table', label: 'Concomitant Medication', type: 'assessment_grid',
          rows: ['1', '2', '3'], columns: ['Medicine', 'Dose', 'Duration', 'Reason for Taking'],
          dependsOn: { key: 'concomitant_needed', value: 'yes' },
        },
        { key: 'rescue_needed', label: 'Need for Rescue Medication?', type: 'radio', options: YN },
        {
          key: 'rescue_table', label: 'Rescue Medication', type: 'assessment_grid',
          rows: ['1', '2', '3'], columns: ['Medicine', 'Dose', 'Duration', 'Reason for Taking'],
          dependsOn: { key: 'rescue_needed', value: 'yes' },
        },
      ],
    },

    // 11. ADVERSE DRUG REACTIONS
    {
      key: 'adr',
      title: '11. Adverse Drug Reactions / Events',
      fields: [
        { key: 'adr_present', label: 'Any adverse effects / other complaints?', type: 'radio', options: YN },
        {
          key: 'adr_table', label: 'Adverse Drug Reactions / Events', type: 'assessment_grid',
          rows: ['1', '2', '3'], columns: ['Date', 'Complaint', 'Treatment Given', 'Remarks'],
          dependsOn: { key: 'adr_present', value: 'yes' },
        },
      ],
    },

    // 12. COMPLETION
    {
      key: 'completion',
      title: '12. Completion',
      fields: [
        { key: 'treatment_completed', label: 'Treatment', type: 'radio', options: [{ value: 'completed', label: 'Completed' }, { value: 'not_completed', label: 'Not Completed' }], required: true },
        { key: 'dropout', label: 'Did the patient drop out on his/her own?', type: 'radio', options: YN },
        { key: 'dropout_reason', label: 'Date & reason for dropout (in detail)', type: 'textarea', dependsOn: { key: 'dropout', value: 'yes' } },
        { key: 'withdrawn', label: 'Was the patient withdrawn from the trial?', type: 'radio', options: YN },
        { key: 'withdrawal_reason', label: 'Date & reason for withdrawal (in detail)', type: 'textarea', dependsOn: { key: 'withdrawn', value: 'yes' } },
        { key: 'result', label: 'Result', type: 'text' },
        { key: 'improved', label: 'Improved / Not Improved', type: 'radio', options: [{ value: 'improved', label: 'Improved' }, { value: 'not_improved', label: 'Not Improved' }] },
        { key: 'adverse_effects_final', label: 'Adverse effects (if any)', type: 'textarea' },
      ],
    },
  ],
}
