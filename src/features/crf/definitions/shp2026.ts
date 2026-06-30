import type { CrfTemplateDef } from '../types'

export const SHP2026_TEMPLATE: CrfTemplateDef = {
  study_code: 'SHP2026',
  version: '1.0',
  visitSchedule: ['Day 0 (Baseline)', 'Day 7', 'Day 14', 'Day 21', 'Day 43', 'Day 58', 'Day 73', 'Day 90 (AT)'],
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
          label: '1. Patients with Sheetapitta / Urticaria (ICD-10: L50) as per clinical diagnosis',
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
          label: '3. Chronic urticaria lasting > 6 weeks (CU) or acute episode documented',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
          required: true,
        },
        { key: 'ec_heading', label: 'Exclusion Criteria', type: 'heading' },
        {
          key: 'ec_1',
          label: '1. Urticarial vasculitis, hereditary angioedema, anaphylaxis requiring epinephrine',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        {
          key: 'ec_2',
          label: '2. Pregnant or lactating women',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        {
          key: 'ec_3',
          label: '3. Severe hepatic, renal, cardiac, or autoimmune disease',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        {
          key: 'ec_4',
          label: '4. On systemic corticosteroids, immunosuppressants, or omalizumab within 1 month',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        {
          key: 'ec_5',
          label: '5. Enrolled in another clinical trial within 6 months',
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
            { value: 'married', label: 'Married' },
            { value: 'unmarried', label: 'Unmarried' },
            { value: 'widow', label: 'Widow(er)' },
            { value: 'divorcee', label: 'Divorcee' },
          ],
        },
        {
          key: 'education', label: 'Education', type: 'select',
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
          key: 'socioeconomic', label: 'Socio-economic Status', type: 'radio',
          options: [{ value: 'upper', label: 'Upper' }, { value: 'middle', label: 'Middle' }, { value: 'lower', label: 'Lower' }],
        },
        {
          key: 'habitat', label: 'Habitat', type: 'radio',
          options: [{ value: 'urban', label: 'Urban' }, { value: 'semi_urban', label: 'Semi-Urban' }, { value: 'rural', label: 'Rural' }],
        },
        { key: 'dob', label: 'Date of Birth', type: 'date' },
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
          key: 'cc_kandu', label: 'Kandu (Pruritus / Itching)', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        { key: 'cc_kandu_duration', label: 'Duration', type: 'text', dependsOn: { key: 'cc_kandu', value: 'present' } },
        {
          key: 'cc_shotha', label: 'Shotha (Wheals / Swelling)', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        { key: 'cc_shotha_duration', label: 'Duration', type: 'text', dependsOn: { key: 'cc_shotha', value: 'present' } },
        {
          key: 'cc_toda', label: 'Toda (Pricking sensation)', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'cc_daha', label: 'Daha (Burning sensation)', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'cc_samsthana', label: 'Samsthana (Distribution / Spread)', type: 'radio',
          options: [{ value: 'localised', label: 'Localised' }, { value: 'widespread', label: 'Widespread / Generalised' }],
        },
        {
          key: 'cc_damshta', label: 'Damshta (Bite-like appearance)', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'cc_angioedema', label: 'Angioedema', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        { key: 'hpi_heading', label: 'History of Present Illness', type: 'heading' },
        {
          key: 'hpi_onset', label: 'Mode of Onset', type: 'radio',
          options: [
            { value: 'sudden', label: 'Sudden' },
            { value: 'gradual', label: 'Gradual' },
            { value: 'insidious', label: 'Insidious' },
          ],
        },
        { key: 'hpi_duration', label: 'Duration of Illness', type: 'text' },
        {
          key: 'hpi_pattern', label: 'Pattern', type: 'radio',
          options: [
            { value: 'episodic', label: 'Episodic (acute)' },
            { value: 'chronic_intermittent', label: 'Chronic intermittent' },
            { value: 'chronic_continuous', label: 'Chronic continuous' },
          ],
        },
        {
          key: 'hpi_anupashaya',
          label: 'Anupashaya (Aggravating factors)',
          type: 'checkbox_group',
          options: [
            { value: 'cold', label: 'Cold exposure / Sheeta' },
            { value: 'heat', label: 'Heat / Ushna' },
            { value: 'exercise', label: 'Exercise' },
            { value: 'stress', label: 'Mental stress' },
            { value: 'food', label: 'Specific food (seafood, nuts, dairy)' },
            { value: 'drugs', label: 'Drugs (NSAIDs, antibiotics)' },
            { value: 'contact', label: 'Contact / Physical friction' },
            { value: 'night', label: 'Night / Late evening' },
            { value: 'other', label: 'Other' },
          ],
        },
        {
          key: 'hpi_upashaya',
          label: 'Upashaya (Relieving factors)',
          type: 'checkbox_group',
          options: [
            { value: 'antihistamine', label: 'Antihistamine' },
            { value: 'cold_compress', label: 'Cold compress' },
            { value: 'rest', label: 'Rest' },
            { value: 'warm_compress', label: 'Warm compress' },
            { value: 'other', label: 'Other' },
          ],
        },
        { key: 'past_history', label: 'Past History', type: 'textarea' },
        { key: 'treatment_history', label: 'Treatment History', type: 'textarea' },
        { key: 'family_history', label: 'Family History (atopy, urticaria)', type: 'textarea' },
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
        {
          key: 'pallor', label: 'Pallor', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'icterus', label: 'Icterus', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'lymphadenopathy', label: 'Lymphadenopathy', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'oedema', label: 'Oedema', type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
      ],
    },

    // 6. LOCAL EXAMINATION (Skin)
    {
      key: 'local_examination',
      title: '6. Local / Skin Examination',
      fields: [
        {
          key: 'lesion_site', label: 'Site(s) of Lesion', type: 'checkbox_group',
          options: [
            { value: 'face', label: 'Face' }, { value: 'neck', label: 'Neck' },
            { value: 'trunk', label: 'Trunk (chest/abdomen)' }, { value: 'back', label: 'Back' },
            { value: 'upper_limb', label: 'Upper Limbs' }, { value: 'lower_limb', label: 'Lower Limbs' },
            { value: 'scalp', label: 'Scalp' }, { value: 'palms_soles', label: 'Palms / Soles' },
            { value: 'generalised', label: 'Generalised' },
          ],
        },
        {
          key: 'lesion_colour', label: 'Colour of Wheals', type: 'radio',
          options: [
            { value: 'erythematous', label: 'Erythematous (red)' },
            { value: 'pale', label: 'Pale / Whitish' },
            { value: 'normal', label: 'Skin-coloured' },
          ],
        },
        {
          key: 'lesion_size', label: 'Size of Wheals', type: 'radio',
          options: [
            { value: 'pinpoint', label: 'Pinpoint (<1 cm)' },
            { value: 'medium', label: 'Medium (1–5 cm)' },
            { value: 'large', label: 'Large (>5 cm)' },
            { value: 'variable', label: 'Variable / Confluent' },
          ],
        },
        {
          key: 'dermographism', label: 'Dermographism', type: 'radio',
          options: [{ value: 'positive', label: 'Positive' }, { value: 'negative', label: 'Negative' }],
        },
        {
          key: 'angioedema_site', label: 'Angioedema Site (if present)', type: 'checkbox_group',
          options: [
            { value: 'lips', label: 'Lips' }, { value: 'eyelids', label: 'Eyelids' },
            { value: 'tongue', label: 'Tongue' }, { value: 'throat', label: 'Throat/Larynx' },
            { value: 'hands', label: 'Hands' }, { value: 'feet', label: 'Feet' },
            { value: 'genitalia', label: 'Genitalia' },
          ],
        },
        { key: 'local_other', label: 'Other findings', type: 'textarea' },
      ],
    },

    // 7. ASHTAVIDHA PARIKSHA
    {
      key: 'ashtavidha_pariksha',
      title: '7. Ashtavidha Pariksha',
      fields: [
        {
          key: 'nadi', label: 'Nadi', type: 'select',
          options: [
            { value: 'vata', label: 'Vata' }, { value: 'pitta', label: 'Pitta' }, { value: 'kapha', label: 'Kapha' },
            { value: 'vata_pitta', label: 'Vata-Pitta' }, { value: 'vata_kapha', label: 'Vata-Kapha' },
            { value: 'pitta_kapha', label: 'Pitta-Kapha' }, { value: 'tridoshaja', label: 'Tridoshaja' },
          ],
        },
        { key: 'mutra', label: 'Mutra (Colour, Quantity)', type: 'text' },
        { key: 'mala', label: 'Mala (Frequency, Consistency)', type: 'text' },
        {
          key: 'jihwa', label: 'Jihwa', type: 'radio',
          options: [{ value: 'clean', label: 'Clean' }, { value: 'coated', label: 'Coated' }],
        },
        { key: 'shabda', label: 'Shabda', type: 'text' },
        {
          key: 'sparsha', label: 'Sparsha (Skin texture)', type: 'radio',
          options: [{ value: 'sheeta', label: 'Sheeta' }, { value: 'ushna', label: 'Ushna' }, { value: 'normal', label: 'Normal' }],
        },
        { key: 'drik', label: 'Drik (Eyes)', type: 'text' },
        {
          key: 'akriti', label: 'Akriti', type: 'radio',
          options: [{ value: 'krisha', label: 'Krisha' }, { value: 'sthool', label: 'Sthool' }, { value: 'madhyama', label: 'Madhyama' }],
        },
      ],
    },

    // 8. DASHAVIDHA PARIKSHA
    {
      key: 'dashavidha_pariksha',
      title: '8. Dashavidha Pariksha',
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

    // 9. SYSTEMIC EXAMINATION
    {
      key: 'systemic_examination',
      title: '9. Systemic Examination',
      fields: [
        { key: 'sys_cvs', label: 'Cardio-Vascular System', type: 'textarea' },
        { key: 'sys_respiratory', label: 'Respiratory System', type: 'textarea' },
        { key: 'sys_digestive', label: 'Digestive System / Abdomen', type: 'textarea' },
        { key: 'sys_cns', label: 'Central Nervous System', type: 'textarea' },
      ],
    },

    // 10. INVESTIGATIONS
    {
      key: 'investigations',
      title: '10. Investigations',
      fields: [
        { key: 'inv_haem_heading', label: 'Haematological', type: 'heading' },
        { key: 'hb_bt', label: 'Hb% – BT', type: 'number', unit: 'g/dL' },
        { key: 'hb_at', label: 'Hb% – AT', type: 'number', unit: 'g/dL' },
        { key: 'tlc_bt', label: 'TLC – BT', type: 'number', unit: 'cells/cumm' },
        { key: 'tlc_at', label: 'TLC – AT', type: 'number', unit: 'cells/cumm' },
        { key: 'dlc_e_bt', label: 'DLC E% (Eosinophils) – BT', type: 'number' },
        { key: 'dlc_e_at', label: 'DLC E% (Eosinophils) – AT', type: 'number' },
        { key: 'aec_bt', label: 'AEC – BT', type: 'number', unit: 'cells/cumm' },
        { key: 'aec_at', label: 'AEC – AT', type: 'number', unit: 'cells/cumm' },
        { key: 'esr_bt', label: 'ESR – BT', type: 'number', unit: 'mm/hr' },
        { key: 'esr_at', label: 'ESR – AT', type: 'number', unit: 'mm/hr' },
        { key: 'sr_ige_bt', label: 'Sr. IgE – BT', type: 'number', unit: 'IU/mL' },
        { key: 'sr_ige_at', label: 'Sr. IgE – AT', type: 'number', unit: 'IU/mL' },
        { key: 'crp_bt', label: 'CRP – BT', type: 'number', unit: 'mg/L' },
        { key: 'crp_at', label: 'CRP – AT', type: 'number', unit: 'mg/L' },
        { key: 'upt_result', label: 'Urine Pregnancy Test (UPT)', type: 'radio', options: [{ value: 'positive', label: 'Positive' }, { value: 'negative', label: 'Negative' }, { value: 'na', label: 'N/A (male)' }] },

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

        { key: 'inv_fbs_heading', label: 'Blood Sugar', type: 'heading' },
        { key: 'fbs_bt', label: 'FBS – BT', type: 'number', unit: 'mg/dL' },
        { key: 'fbs_at', label: 'FBS – AT', type: 'number', unit: 'mg/dL' },
        { key: 'rbs_bt', label: 'RBS – BT', type: 'number', unit: 'mg/dL' },
        { key: 'rbs_at', label: 'RBS – AT', type: 'number', unit: 'mg/dL' },
      ],
    },

    // 11. DISEASE ASSESSMENT
    {
      key: 'disease_assessment',
      title: '11. Disease Assessment',
      fields: [
        { key: 'sp_scale_heading', label: 'Subjective Parameter Scoring Criteria (Annexure V) — grade 0–3 at every visit', type: 'heading' },
        { key: 'sp_kandu', label: 'Kandu (Pruritus): 0 = No itching · 1 = Mild, not disturbing normal activity · 2 = Occasional, disturbs normal activity · 3 = Continuous, even disturbs sleep', type: 'heading' },
        { key: 'sp_toda', label: 'Toda (Colic / Pricking pain): 0 = No discomfort · 1 = Mild discomfort · 2 = Moderate discomfort · 3 = Severe discomfort', type: 'heading' },
        { key: 'sp_daha', label: 'Daha (Burning sensation): 0 = No burning · 1 = Burning without discomfort · 2 = Burning with discomfort · 3 = Severe burning sensation', type: 'heading' },
        { key: 'sp_mandala', label: 'Mandalotpatti (Wheals / skin involvement): 0 = <25% · 1 = 26–50% · 2 = 51–75% · 3 = >75% of skin', type: 'heading' },
        { key: 'sp_kshanika', label: 'Kshanikotpatti-Vinash (Time to subside): 0 = <1 hr · 1 = 1–6 hr · 2 = 7–12 hr · 3 = 13–24 hr', type: 'heading' },
        { key: 'sp_interval', label: 'Interval of attacks (Itch / Swelling): 0 = No attacks · 1 = Once in 4–5 days · 2 = Once on alternate days · 3 = Once a day', type: 'heading' },
        { key: 'sp_associate', label: 'Associated symptoms (Jvara / Chhardi): 0 = Absent · 1 = Mild · 2 = Moderate · 3 = Severe', type: 'heading' },
        {
          key: 'symptom_grid',
          label: 'Sheetapitta Symptom Grading across visits (score 0–3 per criteria above)',
          type: 'assessment_grid',
          rows: [
            'Kandu (Pruritus)',
            'Toda (Colic / Pricking)',
            'Daha (Burning)',
            'Mandalotpatti (Wheals %)',
            'Kshanikotpatti-Vinash (Subsiding time)',
            'Interval of attacks',
            'Associated symptoms (Jvara/Chhardi)',
          ],
          columns: ['Baseline', 'Day 7', 'Day 14', 'Day 21', 'Day 43', 'Day 58', 'Day 73', 'Day 90'],
        },
        { key: 'scales_note', label: 'UAS7, UCT and DLQI are scored in the Assessment Scales panel (with automatic totals).', type: 'heading' },
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

    // 12. ADVERSE DRUG REACTIONS
    {
      key: 'adr',
      title: '12. Adverse Events / ADR',
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
            { value: '1', label: '1 — Mild' },
            { value: '2', label: '2 — Moderate' },
            { value: '3', label: '3 — Severe' },
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

    // 13. COMPLETION
    {
      key: 'completion',
      title: '13. Completion',
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
