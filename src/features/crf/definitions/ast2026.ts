import type { CrfTemplateDef } from '../types'

// Scholar: Dr. Dharnendra Jain · Guide: Dr. Sujata Yadav
// Faithful reproduction of the approved CLINICAL RESEARCH PROFORMA:
// "Vasadi Kwath versus Ashwagandhadi Churna in the management of Tamaka Shwasa
//  w.s.r. Bronchial Asthma". Content mirrors the proforma section-by-section.

const YN = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
const PMA = [{ value: 'pravar', label: 'Pravar (P)' }, { value: 'madhyama', label: 'Madhyama (M)' }, { value: 'avara', label: 'Avara (A)' }]

export const AST2026_TEMPLATE: CrfTemplateDef = {
  study_code: 'AST2026',
  version: '2.0',
  visitSchedule: ['BT', 'AT'],
  sections: [
    // 1. STUDY INFORMATION
    {
      key: 'study_info',
      title: '1. Study Information',
      fields: [
        { key: 'trial_group', label: 'Group', type: 'text' },
        { key: 'centre', label: 'Centre', type: 'text', required: true },
        { key: 'date_induction', label: 'Date of Commencement', type: 'date', required: true },
        { key: 'date_completion', label: 'Date of Completion', type: 'date' },
        { key: 'followup_completion_date', label: 'Follow-up Completion Date', type: 'date' },
        { key: 'iec_number', label: 'IEC Number', type: 'text' },
        { key: 'ctri_number', label: 'CTRI Number', type: 'text' },
      ],
    },

    // 2. PERSONAL IDENTIFICATION (Particulars of Patient)
    {
      key: 'personal_identification',
      title: '2. Personal Identification',
      fields: [
        { key: 'regd_no', label: 'Regd. No.', type: 'text' },
        { key: 'opd_no', label: 'O.P.D. No.', type: 'text' },
        { key: 'ipd_no', label: 'I.P.D. No. / Ward / Bed No.', type: 'text' },
        { key: 'doa', label: 'D.O.A. (Date of Admission)', type: 'date' },
        { key: 'dod', label: 'D.O.D. (Date of Discharge)', type: 'date' },
        { key: 'address', label: 'Address', type: 'textarea' },
      ],
    },

    // 3. DEMOGRAPHIC PROFILE
    {
      key: 'demographics',
      title: '3. Demographic Profile',
      fields: [
        {
          key: 'religion', label: 'Religion', type: 'radio',
          options: [
            { value: 'hindu', label: 'Hindu (H)' }, { value: 'muslim', label: 'Muslim (M)' },
            { value: 'sikh', label: 'Sikh (S)' }, { value: 'christian', label: 'Christian (Ch)' },
            { value: 'jain', label: 'Jain (J)' },
          ],
        },
        {
          key: 'marital_status', label: 'Marital Status', type: 'radio',
          options: [
            { value: 'married', label: 'Married (M)' }, { value: 'unmarried', label: 'Unmarried (UM)' },
            { value: 'divorcee', label: 'Divorcee (D)' }, { value: 'widow', label: 'Widow(er) (W)' },
          ],
        },
        {
          key: 'education', label: 'Education', type: 'select',
          options: [
            { value: 'uneducated', label: 'Uneducated (Un)' }, { value: 'primary', label: 'Primary (P)' },
            { value: 'secondary', label: 'Secondary School (SS)' }, { value: 'higher_secondary', label: 'Higher Secondary (HS)' },
            { value: 'graduate', label: 'Graduate (G)' }, { value: 'postgraduate', label: 'Postgraduate (PG)' },
          ],
        },
        { key: 'occupation', label: 'Occupation', type: 'text' },
        {
          key: 'socioeconomic', label: 'Socio-economic Status', type: 'radio',
          options: [{ value: 'upper', label: 'Upper (U)' }, { value: 'middle', label: 'Middle (M)' }, { value: 'lower', label: 'Lower (L)' }],
        },
        {
          key: 'desha', label: 'Desha', type: 'radio',
          options: [{ value: 'jangal', label: 'Jangal' }, { value: 'anoop', label: 'Anoop' }, { value: 'sadharana', label: 'Sadharana' }],
        },
      ],
    },

    // 4. CHIEF COMPLAINTS & ASSOCIATED COMPLAINTS
    {
      key: 'chief_complaints',
      title: '4. Chief Complaints & Associated Complaints',
      fields: [
        { key: 'cc_heading', label: 'Chief Complaints with Duration', type: 'heading' },
        {
          key: 'chief_complaints_table', label: 'Chief Complaints', type: 'assessment_grid',
          rows: [
            'Breathlessness (Shwasakashtata)',
            'Nasal symptoms – cold/rhinorrhea/coryza (Pinasa)',
            'Chest tightness / pain in ribs (Urah-parshwa Pida)',
            'Wheezing / adventitious sounds (Ghurghurakam)',
            'Cough (Kasa)',
            'Congestion in throat & frontal sinuses (Griva-Shirasah Sangriha)',
            'Immediate relief after expectoration (Shlesmanam Vimokshante Muhurtam Labhate Sukham)',
            'Expectoration related with breathlessness (Shlesmanam Samudirya)',
            'Tachypnoea (Ativa Tivra Vega Shwasa)',
            'Intermittent syncope due to coughing (Pramoham Kasamanascha Muhurmuhu)',
            'Hoarseness of voice (Asyodhvansate Kantha)',
          ],
          columns: ['Present (Y/N)', 'Duration'],
        },
        { key: 'ac_heading', label: 'Associated Complaints', type: 'heading' },
        {
          key: 'associated_complaints_table', label: 'Associated Complaints', type: 'assessment_grid',
          rows: [
            'Orthopnea – discomfort in supine position (Shayanah Shwasa Piditah)',
            'Comfortable in sitting position (Asino Labhate Saukhyam)',
            'Desire for warmness (Ushna Abhinandati)',
            'Sweating on forehead (Lalatena Swidyata)',
            'Dryness of oral cavity (Vishuska Asya)',
            'Increased severity in cloudy/rainy/cold/humid weather (Meghambu Shita Pragvataishleshmalescha Abhivardhate)',
            'Intermittent choking of breathing (Muhu Shwaso Muhuschaiva Avadhamyate)',
          ],
          columns: ['Present (Y/N)', 'Duration'],
        },
        { key: 'pratamaka_heading', label: 'Associated Signs of Pratamaka Shwasa (for exclusion)', type: 'heading' },
        { key: 'pratamaka_jwara', label: 'Fever (Jwara)', type: 'radio', options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }] },
        { key: 'pratamaka_murchha', label: 'Fainting (Murchha)', type: 'radio', options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }] },
      ],
    },

    // 5. HISTORY OF PRESENT ILLNESS (Vedana Samutpatti Krama)
    {
      key: 'hpi',
      title: '5. History of Present Illness',
      fields: [
        {
          key: 'onset', label: 'Mode of Onset (Vedana Samutpatti Krama)', type: 'radio',
          options: [{ value: 'sudden', label: 'Sudden' }, { value: 'gradual', label: 'Gradual' }, { value: 'insidious', label: 'Insidious' }],
        },
        { key: 'hpi_duration', label: 'Duration', type: 'text' },
        {
          key: 'anupashaya', label: 'Anupashaya (Aggravating factors)', type: 'checkbox_group',
          options: [
            { value: 'megha', label: 'Megha (Cloudy season)' }, { value: 'ambu', label: 'Ambu (Rainy season)' },
            { value: 'sheeta', label: 'Sheeta (Cold drinks/food)' }, { value: 'pragvata', label: 'Pragvata (Wind)' },
            { value: 'shlesmal_ahara', label: 'Shlesmal Ahara-Vihara (Sweets, cold drinks)' }, { value: 'raj_dhum', label: 'Raj-Dhum (Dust, allergen foods)' },
          ],
        },
        { key: 'upashaya', label: 'Upashaya (Relieving factors) — Ushnabhinandat (comfort by warm food & drinks)', type: 'text' },
        {
          key: 'postural_aggravation', label: 'Postural Aggravation', type: 'checkbox_group',
          options: [
            { value: 'sleeping', label: 'Sleeping' }, { value: 'walking', label: 'Walking' },
            { value: 'exercise', label: 'Exercise' }, { value: 'standing', label: 'Standing' },
          ],
        },
      ],
    },

    // 6. HISTORY OF PAST ILLNESS & FAMILY HISTORY
    {
      key: 'past_family_history',
      title: '6. Past & Family History',
      fields: [
        {
          key: 'past_illness', label: 'History of Past Illness (Purva Vyadhi Vrittanta)', type: 'checkbox_group',
          options: [
            { value: 'pinasa', label: 'Pinasa (Running Nose)' }, { value: 'skin_disease', label: 'Skin disease' },
            { value: 'kasa', label: 'Kasa' }, { value: 'kshaya', label: 'Kshaya (T.B.)' }, { value: 'pneumonia', label: 'Pneumonia' },
          ],
        },
        { key: 'past_allergy', label: 'H/O Any Allergy', type: 'text' },
        { key: 'treatment_history', label: 'Treatment History', type: 'textarea' },
        {
          key: 'family_history', label: 'Family History (Kula Vritta)', type: 'radio',
          options: [{ value: 'positive', label: 'Positive' }, { value: 'negative', label: 'Negative' }],
        },
        {
          key: 'family_history_members', label: 'Affected family members', type: 'checkbox_group',
          options: [
            { value: 'father', label: 'Father' }, { value: 'mother', label: 'Mother' },
            { value: 'brother', label: 'Brother' }, { value: 'sister', label: 'Sister' },
            { value: 'grandfather', label: 'Grandfather' }, { value: 'grandmother', label: 'Grandmother' },
            { value: 'other', label: 'Other' },
          ],
          dependsOn: { key: 'family_history', value: 'positive' },
        },
      ],
    },

    // 7. PERSONAL HISTORY (Vaiyaktika Itivritta)
    {
      key: 'personal_history',
      title: '7. Personal History',
      fields: [
        { key: 'diet_type', label: 'Type of Diet', type: 'radio', options: [{ value: 'veg', label: 'Veg' }, { value: 'mixed', label: 'Mixed' }] },
        {
          key: 'dietary_habits', label: 'Dietary Habits', type: 'checkbox_group',
          options: [
            { value: 'samashana', label: 'Samashana' }, { value: 'adhyashana', label: 'Adhyashana' },
            { value: 'vishamashana', label: 'Vishamashana' }, { value: 'viruddhashana', label: 'Viruddhashana' },
          ],
        },
        {
          key: 'rasa_dominance', label: 'Dominance of Rasa', type: 'checkbox_group',
          options: [
            { value: 'madhura', label: 'Madhura (M)' }, { value: 'amla', label: 'Amla (A)' }, { value: 'lavana', label: 'Lavana (L)' },
            { value: 'katu', label: 'Katu (Kt)' }, { value: 'tikta', label: 'Tikta (T)' }, { value: 'kashaya', label: 'Kashaya (Ks)' },
            { value: 'not_specific', label: 'Not specific' },
          ],
        },
        { key: 'kostha', label: 'Kostha', type: 'radio', options: [{ value: 'mridu', label: 'Mridu' }, { value: 'madhya', label: 'Madhya' }, { value: 'krura', label: 'Krura' }] },
        { key: 'nidra', label: 'Nidra', type: 'radio', options: [{ value: 'alpa', label: 'Alpa' }, { value: 'khandit', label: 'Khandit' }, { value: 'prabhut', label: 'Prabhut' }] },
        { key: 'nidra_day', label: 'Nidra – Day (hrs)', type: 'number', unit: 'hrs' },
        { key: 'nidra_night', label: 'Nidra – Night (hrs)', type: 'number', unit: 'hrs' },
        {
          key: 'vyayama', label: 'Vyayama', type: 'radio',
          options: [
            { value: 'no', label: 'No' }, { value: 'light', label: 'Light' }, { value: 'heavy', label: 'Heavy' },
            { value: 'regular', label: 'Regular' }, { value: 'irregular', label: 'Irregular' }, { value: 'occasional', label: 'Occasional' },
          ],
        },
        {
          key: 'nature_of_work', label: 'Nature of Work', type: 'radio',
          options: [
            { value: 'moderate', label: 'Moderate' }, { value: 'heavy', label: 'Heavy' }, { value: 'sitting', label: 'Sitting' },
            { value: 'standing', label: 'Standing' }, { value: 'travelling', label: 'Travelling' },
          ],
        },
        { key: 'working_hours', label: 'Working Hours', type: 'number', unit: 'hrs/day' },
        {
          key: 'factory_work', label: 'Working in Factory', type: 'checkbox_group',
          options: [
            { value: 'asbestos', label: 'Asbestos' }, { value: 'coal', label: 'Coal' }, { value: 'mine', label: 'Mine' },
            { value: 'cotton', label: 'Cotton' }, { value: 'silicon', label: 'Silicon' },
          ],
        },
        { key: 'atmosphere', label: 'Atmosphere at Work', type: 'radio', options: [{ value: 'healthy', label: 'Healthy' }, { value: 'air_pollution', label: 'Air pollution' }] },
        {
          key: 'vyasana', label: 'Vyasana (Addiction)', type: 'checkbox_group',
          options: [
            { value: 'tea', label: 'Tea' }, { value: 'coffee', label: 'Coffee' }, { value: 'smoking', label: 'Smoking' },
            { value: 'tobacco', label: 'Tobacco' }, { value: 'supari', label: 'Supari' }, { value: 'alcohol', label: 'Alcohol' },
            { value: 'sleeping_pills', label: 'Sleeping pills' }, { value: 'analgesics', label: 'Analgesics' },
            { value: 'purgatives', label: 'Purgatives' }, { value: 'contraceptives', label: 'Contraceptives' },
          ],
        },
        {
          key: 'emotional_makeup', label: 'Emotional Make-up', type: 'checkbox_group',
          options: [
            { value: 'anxiety', label: 'Anxiety' }, { value: 'tension', label: 'Tension' }, { value: 'depression', label: 'Depression' },
            { value: 'anger', label: 'Anger' }, { value: 'fear', label: 'Fear' },
          ],
        },
        { key: 'kshudha', label: 'Kshudha', type: 'radio', options: [{ value: 'pravar', label: 'Pravar (P)' }, { value: 'madhyama', label: 'Madhyama (M)' }, { value: 'avara', label: 'Avara (A)' }] },
        { key: 'bowel_day', label: 'Bowel Frequency – Day', type: 'text' },
        { key: 'bowel_night', label: 'Bowel Frequency – Night', type: 'text' },
        { key: 'urine_day', label: 'Urine Frequency – Day', type: 'text' },
        { key: 'urine_night', label: 'Urine Frequency – Night', type: 'text' },
        { key: 'menarche_age', label: 'Age of Menarche (years)', type: 'number' },
        { key: 'menopause_age', label: 'Age of Menopause (years)', type: 'number' },
        {
          key: 'menstrual_history', label: 'Menstrual History', type: 'checkbox_group',
          options: [
            { value: 'regular', label: 'Regular' }, { value: 'irregular', label: 'Irregular' }, { value: 'early', label: 'Early' },
            { value: 'late', label: 'Late' }, { value: 'excessive', label: 'Excessive' }, { value: 'less', label: 'Less' }, { value: 'normal', label: 'Normal' },
          ],
        },
        { key: 'menstrual_cycle', label: 'Menstrual Cycle (days at interval of days; painful/not)', type: 'text' },
        { key: 'obstetric_history', label: 'Obstetric History (G / P / A / L / D)', type: 'text' },
      ],
    },

    // 8. ROGA PARIKSHA — NIDANA (Etiological / Aggravating factors)
    {
      key: 'nidana',
      title: '8. Roga Pariksha — Nidana',
      fields: [
        {
          key: 'nidana_vataja_aharaja', label: 'Vataja — Aharaja', type: 'checkbox_group',
          options: [
            { value: 'ruksha', label: 'Ruksha (Fat-free diet)' }, { value: 'vishamashana', label: 'Vishamashana (Irregular diet)' },
            { value: 'adhyashana', label: 'Adhyashana (Frequent eating)' }, { value: 'anashana', label: 'Anashana (Fasting)' },
            { value: 'dvandvatiyoga', label: 'Dvandvatiyoga (Antagonistic)' }, { value: 'vishtambhi', label: 'Vishtambhibhojana (Slowly digested)' },
            { value: 'shitasana', label: 'Shitasana / Shitambusevana (Cold diet/drinks)' }, { value: 'vishasevana', label: 'Vishasevana (Allergic food)' },
          ],
        },
        {
          key: 'nidana_pittaja_aharaja', label: 'Pittaja — Aharaja', type: 'checkbox_group',
          options: [
            { value: 'tila_taila', label: 'Tila taila' }, { value: 'vidhahi', label: 'Vidhahi' }, { value: 'katu', label: 'Katu' },
            { value: 'ushna', label: 'Ushna' }, { value: 'amla', label: 'Amla' }, { value: 'lavana', label: 'Lavana' },
          ],
        },
        {
          key: 'nidana_kaphaja_aharaja', label: 'Kaphaja — Aharaja', type: 'checkbox_group',
          options: [
            { value: 'nishapava', label: 'Nishapava (Beans)' }, { value: 'masha', label: 'Masha (Black gram)' },
            { value: 'pishtanna', label: 'Pishtanna (Paste preparations)' }, { value: 'gurubhojana', label: 'Gurubhojana (Heavy diet)' },
            { value: 'jalaja_mamsa', label: 'Jalaja/Anupa Mamsa (Meat/fish)' }, { value: 'utkledi', label: 'Utkledi/Shleshmala/Abhishyandi Ahara' },
            { value: 'dadhi', label: 'Dadhi (Curd)' }, { value: 'amakshira', label: 'Amakshira (Unboiled milk)' },
          ],
        },
        {
          key: 'nidana_viharaja', label: 'Viharaja (Environmental exposure / Physical activities)', type: 'checkbox_group',
          options: [
            { value: 'raja', label: 'Raja (Dust)' }, { value: 'dhuma', label: 'Dhuma (Smoke) / Kshobhaja vayu (Irritant gas)' },
            { value: 'ushna', label: 'Ushna (Hot)' }, { value: 'diva_swapna', label: 'Diva Swapna (Day sleeping)' },
            { value: 'abhisyandi_upachara', label: 'Abhisyandi Upachara (Channel-obstructing substances)' },
          ],
        },
      ],
    },

    // 9. DASVIDHA ATURA BALA PRAMANA PARIKSHA
    {
      key: 'dashavidha_pariksha',
      title: '9. Dasvidha Atura Bala Pramana Pariksha',
      fields: [
        {
          key: 'prakriti_sharirik', label: 'Prakriti — Sharirika', type: 'radio',
          options: [
            { value: 'V', label: 'Vata (V)' }, { value: 'P', label: 'Pitta (P)' }, { value: 'K', label: 'Kapha (K)' },
            { value: 'VP', label: 'Vata-Pitta (VP)' }, { value: 'VK', label: 'Vata-Kapha (VK)' },
            { value: 'PK', label: 'Pitta-Kapha (PK)' }, { value: 'VPK', label: 'Tridoshaja (VPK)' },
          ],
        },
        {
          key: 'prakriti_manasika', label: 'Prakriti — Manasika', type: 'radio',
          options: [{ value: 'satvika', label: 'Satvika' }, { value: 'rajsika', label: 'Rajsika' }, { value: 'tamasika', label: 'Tamasika' }],
        },
        { key: 'sara', label: 'Sara', type: 'radio', options: PMA },
        { key: 'samhanana', label: 'Samhanana', type: 'radio', options: PMA },
        { key: 'satmya', label: 'Satmya', type: 'radio', options: PMA },
        { key: 'satva', label: 'Satva', type: 'radio', options: PMA },
        { key: 'aharashakti_abhyavarana', label: 'Aharashakti — Abhyavarana Shakti', type: 'radio', options: PMA },
        { key: 'aharashakti_jarana', label: 'Aharashakti — Jarana Shakti', type: 'radio', options: PMA },
        { key: 'vyayamashakti', label: 'Vyayama Shakti', type: 'radio', options: PMA },
        {
          key: 'vaya', label: 'Vaya', type: 'radio',
          options: [{ value: 'bala', label: 'Bala' }, { value: 'yuva', label: 'Yuva' }, { value: 'vriddha', label: 'Vriddha' }],
        },
      ],
    },

    // 10. EXAMINATION — GENERAL
    {
      key: 'general_examination',
      title: '10. General Examination',
      fields: [
        { key: 'pulse', label: 'Pulse', type: 'number', unit: '/min' },
        { key: 'bp_systolic', label: 'BP Systolic', type: 'number', unit: 'mmHg' },
        { key: 'bp_diastolic', label: 'BP Diastolic', type: 'number', unit: 'mmHg' },
        { key: 'respiratory_rate', label: 'Respiratory Rate', type: 'number', unit: '/min' },
        { key: 'temperature', label: 'Temperature', type: 'number', unit: '°F' },
        { key: 'spo2', label: 'SpO₂', type: 'number', unit: '%' },
        { key: 'height', label: 'Height', type: 'number', unit: 'cm' },
        { key: 'weight', label: 'Weight', type: 'number', unit: 'kg' },
        { key: 'bmi', label: 'BMI', type: 'calculated', formulaId: 'bmi', hint: 'Auto-calculated from height & weight' },
        { key: 'pallor', label: 'Pallor', type: 'radio', options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }] },
        { key: 'clubbing', label: 'Clubbing of Nails', type: 'radio', options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }] },
        { key: 'oedema', label: 'Oedema', type: 'radio', options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }] },
        { key: 'lymphadenopathy', label: 'Lymphadenopathy', type: 'radio', options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }] },
      ],
    },

    // 11. SYSTEMIC EXAMINATION (Respiratory System)
    {
      key: 'systemic_examination',
      title: '11. Systemic Examination (Respiratory)',
      fields: [
        { key: 'insp_heading', label: 'Inspection', type: 'heading' },
        { key: 'nasal_polyp', label: 'Nasal Polyp', type: 'radio', options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }] },
        { key: 'nasal_mucosa_atrophy', label: 'Nasal Mucosa Atrophy', type: 'radio', options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }] },
        {
          key: 'nasal_septum', label: 'Nasal Septum', type: 'radio',
          options: [{ value: 'normal', label: 'Normal' }, { value: 'deviated_rt', label: 'Deviated to Rt.' }, { value: 'deviated_lt', label: 'Deviated to Lt.' }],
        },
        {
          key: 'pharynx', label: 'Pharynx', type: 'radio',
          options: [{ value: 'normal', label: 'Normal' }, { value: 'tonsillitis', label: 'Tonsillitis' }, { value: 'inflammation', label: 'Inflammation' }, { value: 'ulcer', label: 'Ulcer' }],
        },
        {
          key: 'chest_shape', label: 'Shape of Chest', type: 'radio',
          options: [
            { value: 'funnel', label: 'Funnel' }, { value: 'barrel', label: 'Barrel' }, { value: 'flat', label: 'Flat' },
            { value: 'pigeon', label: 'Pigeon' }, { value: 'normal', label: 'Normal' },
          ],
        },
        { key: 'respiration_type', label: 'Type of Respiration', type: 'text' },
        { key: 'palpation', label: 'Palpation', type: 'textarea' },
        {
          key: 'percussion', label: 'Percussion', type: 'radio',
          options: [{ value: 'dull', label: 'Dull' }, { value: 'tympanic', label: 'Tympanic' }, { value: 'resonant', label: 'Resonant' }, { value: 'hyper_resonant', label: 'Hyper-resonant' }],
        },
        {
          key: 'breath_sound', label: 'Auscultation — Breath Sound', type: 'radio',
          options: [{ value: 'vesicular', label: 'Vesicular' }, { value: 'bronchial', label: 'Bronchial' }, { value: 'bronchovesicular', label: 'Bronchovesicular' }],
        },
        { key: 'wheeze', label: 'Wheeze', type: 'radio', options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }] },
        {
          key: 'added_sound', label: 'Added Sound', type: 'checkbox_group',
          options: [
            { value: 'polyphonic_wheeze', label: 'Polyphonic expiratory wheeze' }, { value: 'rhonchi', label: 'Rhonchi' },
            { value: 'crepitations', label: 'Crepitations' }, { value: 'pleural_rub', label: 'Pleural rub' }, { value: 'other', label: 'Any other' },
          ],
        },
      ],
    },

    // 12. VIKRIT DOSHA PARIKSHA
    {
      key: 'vikrita_dosha_pariksha',
      title: '12. Vikrit Dosha Pariksha',
      fields: [
        {
          key: 'vata_vriddhi', label: 'Vata Vriddhi', type: 'checkbox_group',
          options: ['Karshya', 'Alpabala', 'Ushnakamita', 'Adhamana', 'Malasanga', 'Nidranasha', 'Shoka'].map((v) => ({ value: v.toLowerCase(), label: v })),
        },
        {
          key: 'vata_kshaya', label: 'Vata Kshaya', type: 'checkbox_group',
          options: ['Praseka', 'Aruchi', 'Angasada'].map((v) => ({ value: v.toLowerCase(), label: v })),
        },
        {
          key: 'pitta_vriddhi', label: 'Pitta Vriddhi', type: 'checkbox_group',
          options: ['Daha', 'Murchcha', 'Trisha', 'Nidraviparyaya'].map((v) => ({ value: v.toLowerCase(), label: v })),
        },
        {
          key: 'pitta_kshaya', label: 'Pitta Kshaya', type: 'checkbox_group',
          options: ['Mandagnita', 'Arochaka', 'Avipaka', 'Stambha'].map((v) => ({ value: v.toLowerCase(), label: v })),
        },
        {
          key: 'kapha_vriddhi', label: 'Kapha Vriddhi', type: 'checkbox_group',
          options: ['Kasa', 'Shwasa', 'Gauravam', 'Tandra', 'Alasya', 'Agnisadana'].map((v) => ({ value: v.toLowerCase(), label: v })),
        },
        {
          key: 'kapha_kshaya', label: 'Kapha Kshaya', type: 'checkbox_group',
          options: ['Toda', 'Trisha', 'Bhrama', 'Angamarda'].map((v) => ({ value: v.toLowerCase(), label: v })),
        },
      ],
    },

    // 13. SROTAS PARIKSHA
    {
      key: 'srotas_pariksha',
      title: '13. Srotas Pariksha',
      fields: [
        {
          key: 'srotas_table', label: 'Srotodushti (record findings per dosha)', type: 'assessment_grid',
          rows: ['Pranavaha', 'Udakavaha', 'Annavaha', 'Rasavaha'],
          columns: ['Vata', 'Pitta', 'Kapha'],
        },
      ],
    },

    // 14. INVESTIGATIONS
    {
      key: 'investigations',
      title: '14. Investigations',
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
      ],
    },

    // 15. DISEASE-SPECIFIC PARAMETERS & QUESTIONNAIRES
    {
      key: 'disease_assessment',
      title: '15. Disease-Specific Parameters & Assessment',
      fields: [
        {
          key: 'disease_params', label: 'Disease-Specific Parameters (Grading)', type: 'assessment_grid',
          rows: [
            'Frequency of Shwasa vega (attacks)',
            'Duration of attack',
            'Intensity of attack',
            'Kasa (Cough)',
            'Kapha Nishthivanam (Expectoration)',
            'Rudhho Ghur-ghurakam (Wheezing)',
            'Urashoola / Parshvashoola (Chest pain)',
            'Asino labhate Saukhyam',
            'Rhonchi / Crepts',
            'Peenasa',
            'FEV1 (Forced expiratory volume in 1 sec)',
            'FVC (Forced vital capacity)',
            'PEFR (Peak expiratory flow rate)',
            'AEC (Absolute Eosinophil count)',
            'ESR (Erythrocyte sedimentation rate)',
            'Sr. IgE',
          ],
          columns: ['BT', 'AT'],
        },
        {
          key: 'acq_grid', label: 'Asthma Control Questionnaire (ACQ)', type: 'assessment_grid',
          rows: ['ACQ Score'], columns: ['BT', 'AT', 'MID'],
        },
        {
          key: 'aqlq_grid', label: 'Asthma Quality of Life Questionnaire (AQLQ)', type: 'assessment_grid',
          rows: ['AQLQ Score'], columns: ['BT', 'AT', 'MID'],
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

    // 16. ADVERSE EVENTS
    {
      key: 'adr',
      title: '16. Adverse Events / ADR',
      fields: [
        { key: 'adr_present', label: 'Any Adverse Events?', type: 'radio', options: YN },
        {
          key: 'adr_table', label: 'Adverse Drug Reactions / Events', type: 'assessment_grid',
          rows: ['1', '2', '3'], columns: ['Date', 'Complaint', 'Treatment Given', 'Remarks'],
          dependsOn: { key: 'adr_present', value: 'yes' },
        },
      ],
    },

    // 17. COMPLETION
    {
      key: 'completion',
      title: '17. Completion',
      fields: [
        {
          key: 'treatment_completed', label: 'Treatment Status', type: 'radio',
          options: [{ value: 'completed', label: 'Completed' }, { value: 'not_completed', label: 'Not Completed' }], required: true,
        },
        { key: 'dropout', label: 'Dropout (self-withdrawn)?', type: 'radio', options: YN },
        { key: 'dropout_reason', label: 'Reason for Dropout', type: 'textarea', dependsOn: { key: 'dropout', value: 'yes' } },
        { key: 'withdrawn', label: 'Withdrawn by investigator?', type: 'radio', options: YN },
        { key: 'withdrawal_reason', label: 'Reason for Withdrawal', type: 'textarea', dependsOn: { key: 'withdrawn', value: 'yes' } },
        {
          key: 'result', label: 'Result', type: 'select',
          options: [
            { value: 'cured', label: 'Cured' }, { value: 'marked', label: 'Marked Improvement' },
            { value: 'moderate', label: 'Moderate Improvement' }, { value: 'mild', label: 'Mild Improvement' },
            { value: 'unchanged', label: 'Unchanged' }, { value: 'lama', label: 'LAMA' },
          ],
        },
        { key: 'remarks', label: 'Remarks', type: 'textarea' },
        { key: 'date_completion', label: 'Date of Completion', type: 'date' },
      ],
    },
  ],
}
