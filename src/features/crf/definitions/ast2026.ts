import type { CrfTemplateDef } from '../types'

export const AST2026_TEMPLATE: CrfTemplateDef = {
  study_code: 'AST2026',
  version: '1.0',
  visitSchedule: ['Day 0 (BT)', 'Day 7', 'Day 14', 'Day 30', 'Day 45', 'Day 60', 'Day 90 (AT)'],
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
          label: '1. Patients diagnosed with Tamaka Shwasa / Bronchial Asthma (ICD-10: J45) as per standard criteria',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
          required: true,
        },
        {
          key: 'ic_2',
          label: '2. Age between 18–65 years, either gender',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
          required: true,
        },
        {
          key: 'ic_3',
          label: '3. FEV1/FVC ratio < 0.70 (reversible airflow obstruction confirmed)',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
          required: true,
        },
        {
          key: 'ic_4',
          label: '4. Mild-to-moderate persistent asthma (GINA Step 2–3)',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        { key: 'ec_heading', label: 'Exclusion Criteria', type: 'heading' },
        {
          key: 'ec_1',
          label: '1. Severe / life-threatening asthma attack, status asthmaticus',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        {
          key: 'ec_2',
          label: '2. COPD, bronchiectasis, or other obstructive lung disease',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        {
          key: 'ec_3',
          label: '3. Active respiratory tract infection within past 2 weeks',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        {
          key: 'ec_4',
          label: '4. Comorbidities: uncontrolled HTN, DM, cardiac/hepatic/renal disease',
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
          label: '6. On systemic corticosteroids or immunosuppressants within 1 month',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        {
          key: 'ec_7',
          label: '7. Enrolled in another clinical trial within past 6 months',
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
          key: 'marital_status',
          label: 'Marital Status',
          type: 'radio',
          options: [
            { value: 'married', label: 'Married' },
            { value: 'unmarried', label: 'Unmarried' },
            { value: 'widow', label: 'Widow(er)' },
            { value: 'divorcee', label: 'Divorcee' },
          ],
        },
        {
          key: 'education',
          label: 'Educational Status',
          type: 'select',
          options: [
            { value: 'illiterate', label: 'Illiterate' },
            { value: 'primary', label: 'Primary' },
            { value: 'secondary', label: 'Secondary' },
            { value: 'higher_secondary', label: 'Higher Secondary' },
            { value: 'graduate', label: 'Graduate' },
            { value: 'postgraduate', label: 'Postgraduate' },
          ],
        },
        { key: 'occupation', label: 'Occupation', type: 'text' },
        {
          key: 'socioeconomic',
          label: 'Socio-economic Status',
          type: 'radio',
          options: [
            { value: 'upper', label: 'Upper' },
            { value: 'middle', label: 'Middle' },
            { value: 'lower', label: 'Lower' },
          ],
        },
        {
          key: 'habitat',
          label: 'Habitat',
          type: 'radio',
          options: [
            { value: 'urban', label: 'Urban' },
            { value: 'semi_urban', label: 'Semi-Urban' },
            { value: 'rural', label: 'Rural' },
          ],
        },
        { key: 'address', label: 'Address', type: 'textarea' },
      ],
    },

    // 4. HISTORY
    {
      key: 'history',
      title: '4. History',
      fields: [
        { key: 'chief_complaint_heading', label: 'Chief Complaints', type: 'heading' },
        {
          key: 'cc_shwasa',
          label: 'Shwasa (Breathlessness)',
          type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        { key: 'cc_shwasa_duration', label: 'Duration', type: 'text', dependsOn: { key: 'cc_shwasa', value: 'present' } },
        {
          key: 'cc_kasa',
          label: 'Kasa (Cough)',
          type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        { key: 'cc_kasa_duration', label: 'Duration', type: 'text', dependsOn: { key: 'cc_kasa', value: 'present' } },
        {
          key: 'cc_wheeze',
          label: 'Wheeze / Ghurghurak Shabda',
          type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        { key: 'cc_wheeze_duration', label: 'Duration', type: 'text', dependsOn: { key: 'cc_wheeze', value: 'present' } },
        {
          key: 'cc_chest_tightness',
          label: 'Chest Tightness / Uras Gaurava',
          type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        { key: 'cc_chest_duration', label: 'Duration', type: 'text', dependsOn: { key: 'cc_chest_tightness', value: 'present' } },
        {
          key: 'cc_nocturnal',
          label: 'Nocturnal Symptoms (Ratrikaala Vriddhi)',
          type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'cc_sputum',
          label: 'Sputum Production (Kapha)',
          type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        { key: 'cc_sputum_character', label: 'Sputum character (colour, viscosity)', type: 'text', dependsOn: { key: 'cc_sputum', value: 'present' } },
        {
          key: 'cc_fever',
          label: 'Jwara (Fever)',
          type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'cc_fatigue',
          label: 'Fatigue / Daurbalya',
          type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'cc_rhinitis',
          label: 'Allergic Rhinitis / Pratishyaya',
          type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'cc_eczema',
          label: 'Eczema / Atopic Dermatitis',
          type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'cc_other',
          label: 'Any other complaint',
          type: 'textarea',
        },
        { key: 'hpi_heading', label: 'History of Present Illness (HPI)', type: 'heading' },
        {
          key: 'hpi_onset',
          label: 'Mode of Onset',
          type: 'radio',
          options: [
            { value: 'sudden', label: 'Sudden' },
            { value: 'gradual', label: 'Gradual' },
            { value: 'insidious', label: 'Insidious' },
          ],
        },
        { key: 'hpi_duration_illness', label: 'Duration of Illness', type: 'text' },
        {
          key: 'hpi_course',
          label: 'Course of Illness',
          type: 'radio',
          options: [
            { value: 'intermittent', label: 'Intermittent' },
            { value: 'persistent', label: 'Persistent' },
            { value: 'progressive', label: 'Progressive' },
          ],
        },
        {
          key: 'hpi_anupashaya',
          label: 'Anupashaya (Aggravating factors)',
          type: 'checkbox_group',
          options: [
            { value: 'cold_air', label: 'Cold air / Sheeta Vayu' },
            { value: 'dust', label: 'Dust' },
            { value: 'smoke', label: 'Smoke' },
            { value: 'exertion', label: 'Exertion' },
            { value: 'night', label: 'Night / Early morning' },
            { value: 'diet', label: 'Diet (heavy/cold food)' },
            { value: 'pollen', label: 'Pollen / allergens' },
            { value: 'other', label: 'Other' },
          ],
        },
        {
          key: 'hpi_upashaya',
          label: 'Upashaya (Relieving factors)',
          type: 'checkbox_group',
          options: [
            { value: 'bronchodilator', label: 'Bronchodilator' },
            { value: 'sitting_upright', label: 'Sitting upright' },
            { value: 'steam', label: 'Steam inhalation' },
            { value: 'warm_diet', label: 'Warm diet' },
            { value: 'other', label: 'Other' },
          ],
        },
        { key: 'past_history', label: 'Past History (medical / surgical / allergic)', type: 'textarea' },
        { key: 'treatment_history', label: 'Treatment History', type: 'textarea' },
        { key: 'family_history', label: 'Family History', type: 'textarea' },
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
        { key: 'pulse', label: 'Pulse Rate', type: 'number', unit: '/min' },
        { key: 'bp_systolic', label: 'BP Systolic', type: 'number', unit: 'mmHg' },
        { key: 'bp_diastolic', label: 'BP Diastolic', type: 'number', unit: 'mmHg' },
        { key: 'respiratory_rate', label: 'Respiratory Rate', type: 'number', unit: '/min' },
        { key: 'temperature', label: 'Temperature', type: 'number', unit: '°F' },
        { key: 'spo2', label: 'SpO₂ (pulse oximetry)', type: 'number', unit: '%' },
        {
          key: 'pallor', label: 'Pallor', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'icterus', label: 'Icterus', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'cyanosis', label: 'Cyanosis', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'clubbing', label: 'Clubbing', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'oedema', label: 'Oedema', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'lymphadenopathy', label: 'Lymphadenopathy', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'nasal_polyp', label: 'Nasal Polyp', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
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
            { value: 'vata', label: 'Vata' },
            { value: 'pitta', label: 'Pitta' },
            { value: 'kapha', label: 'Kapha' },
            { value: 'vata_pitta', label: 'Vata-Pitta' },
            { value: 'vata_kapha', label: 'Vata-Kapha' },
            { value: 'pitta_kapha', label: 'Pitta-Kapha' },
            { value: 'tridoshaja', label: 'Tridoshaja' },
          ],
        },
        { key: 'mutra', label: 'Mutra (Colour, Quantity)', type: 'text' },
        { key: 'mala', label: 'Mala (Frequency, Consistency)', type: 'text' },
        {
          key: 'jihwa', label: 'Jihwa', type: 'radio',
          options: [{ value: 'sama', label: 'Sama (clean)' }, { value: 'nirama', label: 'Nirama' }, { value: 'sama_coated', label: 'Coated' }],
        },
        { key: 'shabda', label: 'Shabda', type: 'text', placeholder: 'Voice quality' },
        {
          key: 'sparsha', label: 'Sparsha', type: 'radio',
          options: [{ value: 'sheeta', label: 'Sheeta' }, { value: 'ushna', label: 'Ushna' }, { value: 'snigdha', label: 'Snigdha' }, { value: 'ruksha', label: 'Ruksha' }],
        },
        { key: 'drik', label: 'Drik (Eyes)', type: 'text' },
        {
          key: 'akriti', label: 'Akriti', type: 'radio',
          options: [{ value: 'krisha', label: 'Krisha' }, { value: 'sthool', label: 'Sthool' }, { value: 'madhyama', label: 'Madhyama' }],
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
        { key: 'vikriti', label: 'Vikriti (Hetu / Dosha / Dushya)', type: 'textarea' },
        {
          key: 'sara', label: 'Sara', type: 'select',
          options: [
            { value: 'twaka', label: 'Twaka' }, { value: 'rakta', label: 'Rakta' },
            { value: 'mansa', label: 'Mansa' }, { value: 'meda', label: 'Meda' },
            { value: 'asthi', label: 'Asthi' }, { value: 'majja', label: 'Majja' },
            { value: 'shukra', label: 'Shukra' }, { value: 'satwa', label: 'Satwa' },
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
        {
          key: 'resp_inspection', label: 'Respiratory – Inspection', type: 'textarea',
          placeholder: 'Chest shape, deformity, respiratory pattern, accessory muscle use',
        },
        { key: 'resp_palpation', label: 'Respiratory – Palpation', type: 'textarea', placeholder: 'TVF, trachea, expansion' },
        { key: 'resp_percussion', label: 'Respiratory – Percussion', type: 'textarea', placeholder: 'Resonance, hyperresonance, dullness' },
        { key: 'resp_auscultation', label: 'Respiratory – Auscultation', type: 'textarea', placeholder: 'Breath sounds, wheeze, rhonchi, crackles' },
        { key: 'cvs', label: 'Cardio-Vascular System', type: 'textarea' },
        { key: 'abdomen', label: 'Abdomen / Digestive System', type: 'textarea' },
        { key: 'cns', label: 'Central Nervous System', type: 'textarea' },
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
        { key: 'dlc_e_bt', label: 'DLC E% (Eosinophils) – BT', type: 'number' },
        { key: 'dlc_e_at', label: 'DLC E% (Eosinophils) – AT', type: 'number' },
        { key: 'aec_bt', label: 'AEC – BT', type: 'number', unit: 'cells/cumm' },
        { key: 'aec_at', label: 'AEC – AT', type: 'number', unit: 'cells/cumm' },
        { key: 'esr_bt', label: 'ESR – BT', type: 'number', unit: 'mm/hr' },
        { key: 'esr_at', label: 'ESR – AT', type: 'number', unit: 'mm/hr' },
        { key: 'sr_ige_bt', label: 'Sr. IgE – BT', type: 'number', unit: 'IU/mL' },
        { key: 'sr_ige_at', label: 'Sr. IgE – AT', type: 'number', unit: 'IU/mL' },

        { key: 'inv_kft_heading', label: 'Kidney Function Test (KFT)', type: 'heading' },
        { key: 'urea_bt', label: 'Blood Urea – BT', type: 'number', unit: 'mg/dL' },
        { key: 'urea_at', label: 'Blood Urea – AT', type: 'number', unit: 'mg/dL' },
        { key: 'creatinine_bt', label: 'Serum Creatinine – BT', type: 'number', unit: 'mg/dL' },
        { key: 'creatinine_at', label: 'Serum Creatinine – AT', type: 'number', unit: 'mg/dL' },

        { key: 'inv_lft_heading', label: 'Liver Function Test (LFT)', type: 'heading' },
        { key: 'sgot_bt', label: 'SGOT/AST – BT', type: 'number', unit: 'U/L' },
        { key: 'sgot_at', label: 'SGOT/AST – AT', type: 'number', unit: 'U/L' },
        { key: 'sgpt_bt', label: 'SGPT/ALT – BT', type: 'number', unit: 'U/L' },
        { key: 'sgpt_at', label: 'SGPT/ALT – AT', type: 'number', unit: 'U/L' },
        { key: 'total_bili_bt', label: 'Total Bilirubin – BT', type: 'number', unit: 'mg/dL' },
        { key: 'total_bili_at', label: 'Total Bilirubin – AT', type: 'number', unit: 'mg/dL' },

        { key: 'inv_pft_heading', label: 'Pulmonary Function Test (PFT)', type: 'heading' },
        { key: 'fev1_bt', label: 'FEV1 – BT', type: 'number', unit: 'L', hint: 'Forced expiratory volume in 1 second' },
        { key: 'fev1_at', label: 'FEV1 – AT', type: 'number', unit: 'L' },
        { key: 'fvc_bt', label: 'FVC – BT', type: 'number', unit: 'L', hint: 'Forced vital capacity' },
        { key: 'fvc_at', label: 'FVC – AT', type: 'number', unit: 'L' },
        { key: 'fev1_fvc_bt', label: 'FEV1/FVC ratio – BT', type: 'number' },
        { key: 'fev1_fvc_at', label: 'FEV1/FVC ratio – AT', type: 'number' },
        { key: 'pef_bt', label: 'PEFR – BT', type: 'number', unit: 'L/min', hint: 'Peak expiratory flow rate' },
        { key: 'pef_at', label: 'PEFR – AT', type: 'number', unit: 'L/min' },
      ],
    },

    // 10. DISEASE ASSESSMENT
    {
      key: 'disease_assessment',
      title: '10. Disease Assessment',
      fields: [
        { key: 'tamaka_note', label: 'Tamaka Shwasa clinical symptom severity is scored at every visit in the Assessment Scales panel (Tamaka Sx).', type: 'heading' },
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
        { key: 'adr_end_date', label: 'End Date', type: 'date', dependsOn: { key: 'adr_present', value: 'yes' } },
        {
          key: 'adr_severity', label: 'Severity', type: 'radio',
          options: [
            { value: '1', label: '1 — Mild (tolerable)' },
            { value: '2', label: '2 — Moderate (interferes with activity)' },
            { value: '3', label: '3 — Severe (prevents activity)' },
            { value: '4', label: '4 — Life-threatening' },
          ],
          dependsOn: { key: 'adr_present', value: 'yes' },
        },
        {
          key: 'adr_outcome', label: 'Outcome', type: 'radio',
          options: [
            { value: 'resolved', label: 'Resolved' },
            { value: 'resolving', label: 'Resolving' },
            { value: 'not_resolved', label: 'Not Resolved' },
            { value: 'fatal', label: 'Fatal' },
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
            { value: 'improved', label: 'Improved' },
            { value: 'not_improved', label: 'Not Improved' },
            { value: 'unchanged', label: 'Unchanged' },
            { value: 'lama', label: 'LAMA' },
          ],
        },
        { key: 'remarks', label: 'Remarks', type: 'textarea' },
        { key: 'date_completion', label: 'Date of Completion', type: 'date' },
      ],
    },
  ],
}
