import type { CrfTemplateDef } from '../types'

export const ECZ2026_TEMPLATE: CrfTemplateDef = {
  study_code: 'ECZ2026',
  version: '1.2',
  sections: [
    // ─────────────────────────────────────────────────────────
    // 1. STUDY INFORMATION
    // ─────────────────────────────────────────────────────────
    {
      key: 'study_info',
      title: 'Study Information',
      fields: [
        { key: 'centre', label: 'Centre', type: 'text', required: true },
        { key: 'study_duration_days', label: 'Duration of Study (days)', type: 'number', required: true, placeholder: 'e.g. 90' },
        { key: 'date_induction', label: 'Date of Induction into Study', type: 'date', required: true },
        { key: 'date_expected_completion', label: 'Expected Date of Completion', type: 'calculated', formulaId: 'date_plus_days', hint: 'Auto-filled: Date of Induction + Duration of Study' },
        { key: 'cr_no', label: 'CR No.', type: 'text' },
        { key: 'opd_no', label: 'OPD No.', type: 'text' },
        { key: 'iec_number', label: 'IEC Number', type: 'text', defaultValue: 'F-5(423)/2020-Co/IEC(Ayurveda)/143' },
        { key: 'ctri_number', label: 'CTRI Number', type: 'text', defaultValue: 'CTRI/2024/12/078563' },
      ],
    },

    // ─────────────────────────────────────────────────────────
    // 2. ELIGIBILITY
    // ─────────────────────────────────────────────────────────
    {
      key: 'eligibility',
      title: 'Eligibility Criteria',
      fields: [
        {
          key: 'ic_heading',
          label: 'Inclusion Criteria',
          type: 'heading',
        },
        {
          key: 'ic_1',
          label: '1. Patients with Eczema [ICD-10: L20] confirmed per American Academy of Dermatology Criteria',
          type: 'radio',
          options: [{ value: '1', label: 'Yes' }, { value: '2', label: 'No' }],
          required: true,
        },
        {
          key: 'ic_2',
          label: '2. Individuals of either gender aged 16–70 years',
          type: 'radio',
          options: [{ value: '1', label: 'Yes' }, { value: '2', label: 'No' }],
          required: true,
        },
        {
          key: 'ic_3',
          label: '3. EASI score ≤ 50',
          type: 'radio',
          options: [{ value: '1', label: 'Yes' }, { value: '2', label: 'No' }],
          required: true,
        },
        {
          key: 'ec_heading',
          label: 'Exclusion Criteria',
          type: 'heading',
        },
        {
          key: 'ec_1',
          label: '1. Skin diseases other than eczema (Scabies, Seborrheic/Contact dermatitis, Ichthyoses, Psoriasis, Photosensitivity, Immune deficiency, Erythroderma)',
          type: 'radio',
          options: [{ value: '1', label: 'Yes' }, { value: '2', label: 'No' }],
        },
        {
          key: 'ec_2',
          label: '2. Cutaneous infection within 1 week before screening, or infection requiring antibiotics/antivirals within 1 week',
          type: 'radio',
          options: [{ value: '1', label: 'Yes' }, { value: '2', label: 'No' }],
        },
        {
          key: 'ec_3',
          label: '3. Comorbidities: DM (FBS ≥126 mg/dl), Grade 2 HTN (BP ≥160/100), Renal impairment (Cr >1.2), Hepatic impairment (SGOT/SGPT >3× ULN)',
          type: 'radio',
          options: [{ value: '1', label: 'Yes' }, { value: '2', label: 'No' }],
        },
        {
          key: 'ec_4',
          label: '4. History of cardiovascular disease (CAD, CHF, valvular heart disease)',
          type: 'radio',
          options: [{ value: '1', label: 'Yes' }, { value: '2', label: 'No' }],
        },
        {
          key: 'ec_5',
          label: '5. Tuberculosis, immunocompromised state (HIV), active or history of malignancy',
          type: 'radio',
          options: [{ value: '1', label: 'Yes' }, { value: '2', label: 'No' }],
        },
        {
          key: 'ec_6',
          label: '6. Pregnant women and lactating mothers',
          type: 'radio',
          options: [{ value: '1', label: 'Yes' }, { value: '2', label: 'No' }],
        },
        {
          key: 'ec_7',
          label: '7. Received topical corticosteroids, systemic steroids, immunosuppressants or immunomodulators within 1 month before screening',
          type: 'radio',
          options: [{ value: '1', label: 'Yes' }, { value: '2', label: 'No' }],
        },
        {
          key: 'ec_8',
          label: '8. History of allergic reactions to Ayurvedic drugs, or sensitivity in patch test to topical medication',
          type: 'radio',
          options: [{ value: '1', label: 'Yes' }, { value: '2', label: 'No' }],
        },
        {
          key: 'ec_9',
          label: '9. Currently participating or participated in any other drug study within past 6 months',
          type: 'radio',
          options: [{ value: '1', label: 'Yes' }, { value: '2', label: 'No' }],
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

    // ─────────────────────────────────────────────────────────
    // 3. DEMOGRAPHIC PROFILE
    // ─────────────────────────────────────────────────────────
    {
      key: 'demographics',
      title: 'Demographic Profile',
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
            { value: 'other', label: 'Other' },
          ],
          required: true,
        },
        {
          key: 'education',
          label: 'Educational Status',
          type: 'radio',
          options: [
            { value: '0', label: 'Illiterate' },
            { value: '1', label: 'Literate' },
          ],
          required: true,
        },
        { key: 'education_qualification', label: 'If literate, specify qualification', type: 'text', dependsOn: { key: 'education', value: '1' } },
        { key: 'occupation', label: 'Occupation', type: 'text', required: true },
        {
          key: 'socioeconomic',
          label: 'Socio-economic Status',
          type: 'radio',
          options: [
            { value: '0', label: 'Above Poverty Line' },
            { value: '1', label: 'Below Poverty Line' },
          ],
          required: true,
        },
        {
          key: 'habitat',
          label: 'Habitat',
          type: 'radio',
          options: [
            { value: '0', label: 'Urban' },
            { value: '1', label: 'Semi-Urban' },
            { value: '2', label: 'Rural' },
          ],
          required: true,
        },
        {
          key: 'religion',
          label: 'Religion',
          type: 'radio',
          options: [
            { value: '0', label: 'Hindu' },
            { value: '1', label: 'Muslim' },
            { value: '2', label: 'Sikh' },
            { value: '3', label: 'Christian' },
            { value: '4', label: 'Other' },
          ],
        },
        { key: 'dob', label: 'Date of Birth', type: 'date' },
        { key: 'address', label: 'Address', type: 'textarea' },
      ],
    },

    // ─────────────────────────────────────────────────────────
    // 4. HISTORY
    // ─────────────────────────────────────────────────────────
    {
      key: 'history',
      title: 'History',
      fields: [
        { key: 'chief_complaint', label: 'Chief Complaint(s)', type: 'textarea', required: true },
        {
          key: 'hpi_heading',
          label: 'History of Present Illness',
          type: 'heading',
        },
        { key: 'mode_of_onset', label: 'Mode of Onset of Lesion(s)', type: 'text' },
        { key: 'site_of_lesion_hpi', label: 'Site of Lesion(s)', type: 'text' },
        {
          key: 'characteristic',
          label: 'Characteristic of Lesion(s)',
          type: 'radio',
          options: [
            { value: 'intermittent', label: 'Intermittent' },
            { value: 'progressive', label: 'Progressive' },
          ],
        },
        {
          key: 'earlier_episodes',
          label: 'Earlier Similar Episodes',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        {
          key: 'aggravating_relieving',
          label: 'H/O Aggravating / Relieving Factors',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        { key: 'aggravating_food', label: 'Food (if applicable)', type: 'radio', options: [{ value: 'veg', label: 'Veg' }, { value: 'non_veg', label: 'Non-veg' }], dependsOn: { key: 'aggravating_relieving', value: 'yes' } },
        { key: 'aggravating_season', label: 'Season (if applicable)', type: 'radio', options: [{ value: 'rainy', label: 'Rainy' }, { value: 'winter', label: 'Winter' }, { value: 'summer', label: 'Summer' }], dependsOn: { key: 'aggravating_relieving', value: 'yes' } },
        { key: 'aggravating_others', label: 'Others', type: 'text', dependsOn: { key: 'aggravating_relieving', value: 'yes' } },
        {
          key: 'past_history',
          label: 'History of Past Illness',
          type: 'radio',
          options: [{ value: '0', label: 'Yes' }, { value: '1', label: 'No' }],
        },
        { key: 'past_history_details', label: 'If yes, specify past medical/surgical history', type: 'textarea', dependsOn: { key: 'past_history', value: '0' } },
        { key: 'treatment_history', label: 'Treatment History', type: 'textarea' },
        { key: 'family_history', label: 'Family History', type: 'textarea' },
        {
          key: 'personal_heading',
          label: 'Personal History',
          type: 'heading',
        },
        {
          key: 'ahara',
          label: 'Ahara (Diet)',
          type: 'radio',
          options: [
            { value: 'samisha', label: 'Samisha (Non-vegetarian)' },
            { value: 'niramisha', label: 'Niramisha (Vegetarian)' },
          ],
        },
        {
          key: 'ahara_vidhi',
          label: 'Ahara Vidhi (Eating Habit)',
          type: 'radio',
          options: [
            { value: 'samashana', label: 'Samashana' },
            { value: 'adhyashana', label: 'Adhyashana' },
            { value: 'vishamashana', label: 'Vishamashana' },
            { value: 'viruddhashana', label: 'Viruddhashana' },
          ],
        },
        {
          key: 'menstrual_heading',
          label: 'Menstrual History (if applicable)',
          type: 'heading',
        },
        { key: 'menarche', label: 'Menarche (age in years)', type: 'number', unit: 'years' },
        { key: 'menopause', label: 'Menopause (age in years)', type: 'number', unit: 'years' },
        {
          key: 'menstrual_cycle',
          label: 'Menstrual Cycle',
          type: 'radio',
          options: [{ value: 'regular', label: 'Regular' }, { value: 'irregular', label: 'Irregular' }],
        },
        {
          key: 'obstetric_heading',
          label: 'Obstetric History',
          type: 'heading',
        },
        { key: 'ftnd', label: 'Full-term Normal Deliveries (FTND)', type: 'number' },
        { key: 'lscs', label: 'LSCS', type: 'number' },
        { key: 'abortions', label: 'Abortions', type: 'number' },
      ],
    },

    // ─────────────────────────────────────────────────────────
    // 5. GENERAL PHYSICAL EXAMINATION
    // ─────────────────────────────────────────────────────────
    {
      key: 'general_examination',
      title: 'General Physical Examination',
      fields: [
        {
          key: 'built',
          label: 'Built',
          type: 'radio',
          options: [
            { value: '1', label: 'Average' },
            { value: '2', label: 'Emaciated' },
            { value: '3', label: 'Well built' },
            { value: '4', label: 'Tall' },
            { value: '5', label: 'Dwarf' },
          ],
        },
        {
          key: 'nutrition',
          label: 'Nutrition',
          type: 'radio',
          options: [
            { value: '1', label: 'Moderately nourished' },
            { value: '2', label: 'Malnourished' },
            { value: '3', label: 'Well-nourished' },
          ],
        },
        { key: 'height', label: 'Height', type: 'number', unit: 'cm' },
        { key: 'weight', label: 'Weight', type: 'number', unit: 'kg' },
        { key: 'bmi', label: 'Body Mass Index (BMI)', type: 'calculated', formulaId: 'bmi', hint: 'Auto-calculated: Weight (kg) ÷ [Height (cm) ÷ 100]²' },
        { key: 'respiratory_rate', label: 'Respiratory Rate', type: 'number', unit: '/min' },
        { key: 'pulse_rate', label: 'Pulse Rate', type: 'number', unit: '/min' },
        { key: 'bp_systolic', label: 'Blood Pressure — Systolic', type: 'number', unit: 'mmHg' },
        { key: 'bp_diastolic', label: 'Blood Pressure — Diastolic', type: 'number', unit: 'mmHg' },
        { key: 'temperature', label: 'Temperature', type: 'number', unit: '°F' },
        {
          key: 'clubbing',
          label: 'Clubbing',
          type: 'radio',
          options: [{ value: '1', label: 'Present' }, { value: '2', label: 'Absent' }],
        },
        {
          key: 'cyanosis',
          label: 'Cyanosis',
          type: 'radio',
          options: [{ value: '1', label: 'Present' }, { value: '2', label: 'Absent' }],
        },
        {
          key: 'cyanosis_type',
          label: 'Cyanosis type',
          type: 'radio',
          options: [{ value: '1', label: 'Central' }, { value: '2', label: 'Peripheral' }],
          dependsOn: { key: 'cyanosis', value: '1' },
        },
        {
          key: 'pallor',
          label: 'Pallor',
          type: 'radio',
          options: [{ value: '1', label: 'Present' }, { value: '2', label: 'Absent' }],
        },
        { key: 'pallor_site', label: 'Site of Pallor', type: 'text', dependsOn: { key: 'pallor', value: '1' } },
        {
          key: 'lymphadenopathy',
          label: 'Lymphadenopathy',
          type: 'radio',
          options: [{ value: '1', label: 'Present' }, { value: '2', label: 'Absent' }],
        },
        { key: 'lymph_site', label: 'Site of Lymphadenopathy', type: 'text', dependsOn: { key: 'lymphadenopathy', value: '1' } },
        {
          key: 'edema',
          label: 'Edema',
          type: 'radio',
          options: [{ value: '1', label: 'Present' }, { value: '2', label: 'Absent' }],
        },
        {
          key: 'edema_character',
          label: 'Character of Edema',
          type: 'radio',
          options: [{ value: '1', label: 'Pitting' }, { value: '2', label: 'Non-pitting' }],
          dependsOn: { key: 'edema', value: '1' },
        },
      ],
    },

    // ─────────────────────────────────────────────────────────
    // 6. LOCAL EXAMINATION
    // ─────────────────────────────────────────────────────────
    {
      key: 'local_examination',
      title: 'Local Examination',
      fields: [
        {
          key: 'lesion_site',
          label: 'Site of Lesion (Pidika Sthana)',
          type: 'checkbox_group',
          options: [
            { value: 'scalp', label: 'Scalp' },
            { value: 'face', label: 'Face' },
            { value: 'neck', label: 'Neck' },
            { value: 'trunk', label: 'Trunk' },
            { value: 'forearm', label: 'Forearm' },
            { value: 'arm', label: 'Arm' },
            { value: 'back', label: 'Back' },
            { value: 'hip', label: 'Hip' },
            { value: 'groins', label: 'Groins' },
            { value: 'nails', label: 'Nails' },
            { value: 'thigh', label: 'Thigh' },
            { value: 'leg', label: 'Leg' },
            { value: 'foot', label: 'Foot' },
            { value: 'others', label: 'Others' },
          ],
          required: true,
        },
        {
          key: 'lesion_surface',
          label: 'Surface',
          type: 'radio',
          options: [
            { value: 'flexor', label: 'Flexor Surface' },
            { value: 'extensor', label: 'Extensor Surface' },
            { value: 'both', label: 'Both' },
          ],
        },
        {
          key: 'distribution',
          label: 'Distribution (Vyapti)',
          type: 'radio',
          options: [
            { value: 'symmetrical', label: 'Symmetrical' },
            { value: 'asymmetrical', label: 'Asymmetrical' },
          ],
        },
        { key: 'lesion_size', label: 'Size of Lesion', type: 'text' },
        {
          key: 'lesion_colour',
          label: 'Colour of Lesion',
          type: 'radio',
          options: [
            { value: 'erythematous', label: 'Erythematous' },
            { value: 'hyperpigmented', label: 'Hyperpigmented' },
            { value: 'normal', label: 'Normal skin colour' },
          ],
        },
        {
          key: 'lesion_type',
          label: 'Type of Lesion (Pidika Lakshanas)',
          type: 'checkbox_group',
          options: [
            { value: 'erythema', label: 'Erythema' },
            { value: 'papules', label: 'Papules' },
            { value: 'vesicles', label: 'Vesicles' },
            { value: 'plaques', label: 'Plaques' },
            { value: 'lichenification', label: 'Lichenification' },
            { value: 'scaling', label: 'Scaling' },
            { value: 'excoriation', label: 'Excoriation' },
            { value: 'fissures', label: 'Fissures' },
            { value: 'crusting', label: 'Crusting' },
          ],
        },
        {
          key: 'arrangement',
          label: 'Arrangement',
          type: 'radio',
          options: [
            { value: 'single', label: 'Single' },
            { value: 'grouped', label: 'Grouped' },
            { value: 'scattered', label: 'Scattered' },
          ],
        },
        {
          key: 'itching_present',
          label: 'Itching (Kandu)',
          type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'itching_severity',
          label: 'Itching Severity',
          type: 'radio',
          options: [{ value: 'mild', label: 'Mild' }, { value: 'moderate', label: 'Moderate' }, { value: 'severe', label: 'Severe' }],
          dependsOn: { key: 'itching_present', value: 'present' },
        },
        {
          key: 'hyperpigmentation',
          label: 'Hyperpigmentation (Shyava Varna)',
          type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'hyperpigmentation_severity',
          label: 'Hyperpigmentation Severity',
          type: 'radio',
          options: [{ value: 'mild', label: 'Mild' }, { value: 'moderate', label: 'Moderate' }, { value: 'severe', label: 'Severe' }],
          dependsOn: { key: 'hyperpigmentation', value: 'present' },
        },
        {
          key: 'discharge',
          label: 'Discharge (Srava)',
          type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'discharge_colour',
          label: 'Discharge Colour',
          type: 'radio',
          options: [{ value: 'watery', label: 'Watery' }, { value: 'white', label: 'White' }, { value: 'red', label: 'Red' }],
          dependsOn: { key: 'discharge', value: 'present' },
        },
        {
          key: 'discharge_contents',
          label: 'Discharge Contents',
          type: 'radio',
          options: [{ value: 'blood', label: 'Blood' }, { value: 'pus', label: 'Pus' }, { value: 'clear', label: 'Clear fluid' }],
          dependsOn: { key: 'discharge', value: 'present' },
        },
        {
          key: 'dryness',
          label: 'Dryness (Rukshata)',
          type: 'radio',
          options: [{ value: 'present', label: 'Present' }, { value: 'absent', label: 'Absent' }],
        },
        {
          key: 'dryness_severity',
          label: 'Dryness Severity',
          type: 'radio',
          options: [{ value: 'mild', label: 'Mild' }, { value: 'moderate', label: 'Moderate' }, { value: 'severe', label: 'Severe' }],
          dependsOn: { key: 'dryness', value: 'present' },
        },
      ],
    },

    // ─────────────────────────────────────────────────────────
    // 7. SYSTEMIC EXAMINATION
    // ─────────────────────────────────────────────────────────
    {
      key: 'systemic_examination',
      title: 'Systemic Examination',
      fields: [
        { key: 'sys_respiratory', label: 'Respiratory System', type: 'textarea' },
        { key: 'sys_gi', label: 'Gastro-Intestinal System', type: 'textarea' },
        { key: 'sys_cvs', label: 'Cardio-vascular System', type: 'textarea' },
        { key: 'sys_nervous', label: 'Nervous System', type: 'textarea' },
        { key: 'sys_musculoskeletal', label: 'Musculo-skeletal System', type: 'textarea' },
        { key: 'sys_genitourinary', label: 'Genito-urinary System', type: 'textarea' },
      ],
    },

    // ─────────────────────────────────────────────────────────
    // 8. DASHAVIDHA PARIKSHA
    // ─────────────────────────────────────────────────────────
    {
      key: 'dashavidha_pariksha',
      title: 'Dashavidha Pariksha',
      fields: [
        {
          key: 'prakriti_sharirik',
          label: 'Prakriti — Sharirik',
          type: 'radio',
          options: [
            { value: 'V', label: 'Vata' },
            { value: 'P', label: 'Pitta' },
            { value: 'K', label: 'Kapha' },
            { value: 'VP', label: 'Vata-Pitta' },
            { value: 'VK', label: 'Vata-Kapha' },
            { value: 'PK', label: 'Pitta-Kapha' },
            { value: 'Samdoshaj', label: 'Samdoshaj' },
          ],
        },
        {
          key: 'prakriti_mansika',
          label: 'Prakriti — Mansika',
          type: 'radio',
          options: [
            { value: 'satvic', label: 'Satvic' },
            { value: 'rajas', label: 'Rajas' },
            { value: 'tamas', label: 'Tamas' },
          ],
        },
        { key: 'vikriti', label: 'Vikriti (Hetu, Dosha, Dushya)', type: 'textarea' },
        {
          key: 'sara',
          label: 'Sara',
          type: 'radio',
          options: [
            { value: 'twaka', label: 'Twaka' },
            { value: 'rakta', label: 'Rakta' },
            { value: 'mansa', label: 'Mansa' },
            { value: 'meda', label: 'Meda' },
            { value: 'asthi', label: 'Asthi' },
            { value: 'majja', label: 'Majja' },
            { value: 'shukra', label: 'Shukra' },
            { value: 'satwa', label: 'Satwa' },
            { value: 'sarvasara', label: 'Sarvasara' },
          ],
        },
        {
          key: 'samhanana',
          label: 'Samhanana',
          type: 'radio',
          options: [
            { value: 'susanhata', label: 'Susanhata' },
            { value: 'madhyama', label: 'Madhyama' },
            { value: 'heena', label: 'Heena' },
          ],
        },
        {
          key: 'pramana',
          label: 'Pramana',
          type: 'radio',
          options: [
            { value: 'sama', label: 'Sama' },
            { value: 'madhyama', label: 'Madhyama' },
            { value: 'heena', label: 'Heena' },
          ],
        },
        {
          key: 'satmya',
          label: 'Satmya',
          type: 'radio',
          options: [
            { value: 'pravar', label: 'Pravar' },
            { value: 'madhyama', label: 'Madhyama' },
            { value: 'avara', label: 'Avara' },
          ],
        },
        {
          key: 'satwa',
          label: 'Satwa',
          type: 'radio',
          options: [
            { value: 'pravar', label: 'Pravar' },
            { value: 'madhyama', label: 'Madhyama' },
            { value: 'avara', label: 'Avara' },
          ],
        },
        {
          key: 'aharashakti_abhyavaharana',
          label: 'Aharashakti — Abhyavaharana Shakti',
          type: 'radio',
          options: [
            { value: 'pravar', label: 'Pravar' },
            { value: 'madhyama', label: 'Madhyama' },
            { value: 'avara', label: 'Avara' },
          ],
        },
        {
          key: 'aharashakti_jarana',
          label: 'Aharashakti — Jarana Shakti',
          type: 'radio',
          options: [
            { value: 'pravar', label: 'Pravar' },
            { value: 'madhyama', label: 'Madhyama' },
            { value: 'avara', label: 'Avara' },
          ],
        },
        {
          key: 'vyayamashakti',
          label: 'Vyayamashakti',
          type: 'radio',
          options: [
            { value: 'pravar', label: 'Pravar' },
            { value: 'madhyama', label: 'Madhyama' },
            { value: 'avara', label: 'Avara' },
          ],
        },
        {
          key: 'vaya',
          label: 'Vaya',
          type: 'radio',
          options: [
            { value: 'balavastha', label: 'Balavastha (childhood)' },
            { value: 'madhyamavastha', label: 'Madhyamavastha (middle age)' },
            { value: 'vridhavastha', label: 'Vridhavastha (old age)' },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────
    // 9. INVESTIGATIONS
    // ─────────────────────────────────────────────────────────
    {
      key: 'investigations',
      title: 'Investigations',
      fields: [
        { key: 'inv_h_heading', label: 'Hematological Investigations', type: 'heading' },
        { key: 'hb_bt', label: 'Hb% — Before Treatment', type: 'number', unit: 'g/dL' },
        { key: 'hb_at', label: 'Hb% — After Treatment', type: 'number', unit: 'g/dL' },
        { key: 'tlc_bt', label: 'TLC — Before Treatment', type: 'number', unit: 'cells/cumm' },
        { key: 'tlc_at', label: 'TLC — After Treatment', type: 'number', unit: 'cells/cumm' },
        { key: 'sr_ige_bt', label: 'Sr. IgE — Before Treatment', type: 'number', unit: 'IU/mL' },
        { key: 'sr_ige_at', label: 'Sr. IgE — After Treatment', type: 'number', unit: 'IU/mL' },
        { key: 'esr_bt', label: 'ESR — Before Treatment', type: 'number', unit: 'mm/hr' },
        { key: 'esr_at', label: 'ESR — After Treatment', type: 'number', unit: 'mm/hr' },
        { key: 'aec_bt', label: 'AEC — Before Treatment', type: 'number', unit: 'cells/cumm' },
        { key: 'aec_at', label: 'AEC — After Treatment', type: 'number', unit: 'cells/cumm' },
        { key: 'dlc_n_bt', label: 'DLC — N% Before Treatment', type: 'number', unit: '%' },
        { key: 'dlc_n_at', label: 'DLC — N% After Treatment', type: 'number', unit: '%' },
        { key: 'dlc_l_bt', label: 'DLC — L% Before Treatment', type: 'number', unit: '%' },
        { key: 'dlc_l_at', label: 'DLC — L% After Treatment', type: 'number', unit: '%' },
        { key: 'dlc_e_bt', label: 'DLC — E% Before Treatment', type: 'number', unit: '%' },
        { key: 'dlc_e_at', label: 'DLC — E% After Treatment', type: 'number', unit: '%' },
        { key: 'dlc_b_bt', label: 'DLC — B% Before Treatment', type: 'number', unit: '%' },
        { key: 'dlc_b_at', label: 'DLC — B% After Treatment', type: 'number', unit: '%' },
        { key: 'dlc_m_bt', label: 'DLC — M% Before Treatment', type: 'number', unit: '%' },
        { key: 'dlc_m_at', label: 'DLC — M% After Treatment', type: 'number', unit: '%' },

        { key: 'inv_b_heading', label: 'Biochemical Investigations', type: 'heading' },
        { key: 'kft_heading', label: 'KFT (Kidney Function Tests)', type: 'heading' },
        { key: 'blood_urea_bt', label: 'Blood Urea — BT', type: 'number', unit: 'mg/dL' },
        { key: 'blood_urea_at', label: 'Blood Urea — AT', type: 'number', unit: 'mg/dL' },
        { key: 'uric_acid_bt', label: 'Serum Uric Acid — BT', type: 'number', unit: 'mg/dL' },
        { key: 'uric_acid_at', label: 'Serum Uric Acid — AT', type: 'number', unit: 'mg/dL' },
        { key: 'creatinine_bt', label: 'Serum Creatinine — BT', type: 'number', unit: 'mg/dL' },
        { key: 'creatinine_at', label: 'Serum Creatinine — AT', type: 'number', unit: 'mg/dL' },

        { key: 'lft_heading', label: 'LFT (Liver Function Tests)', type: 'heading' },
        { key: 'sgot_bt', label: 'SGOT (AST) — BT', type: 'number', unit: 'karmen units/dL' },
        { key: 'sgot_at', label: 'SGOT (AST) — AT', type: 'number', unit: 'karmen units/dL' },
        { key: 'sgpt_bt', label: 'SGPT (ALT) — BT', type: 'number', unit: 'karmen units/dL' },
        { key: 'sgpt_at', label: 'SGPT (ALT) — AT', type: 'number', unit: 'karmen units/dL' },
        { key: 'total_protein_bt', label: 'Total Protein — BT', type: 'number', unit: 'gm/dL' },
        { key: 'total_protein_at', label: 'Total Protein — AT', type: 'number', unit: 'gm/dL' },
        { key: 'albumin_bt', label: 'S. Albumin — BT', type: 'number', unit: 'gm/dL' },
        { key: 'albumin_at', label: 'S. Albumin — AT', type: 'number', unit: 'gm/dL' },
        { key: 'globulin_bt', label: 'S. Globulin — BT', type: 'number', unit: 'gm/dL' },
        { key: 'globulin_at', label: 'S. Globulin — AT', type: 'number', unit: 'gm/dL' },
        { key: 'ag_ratio_bt', label: 'A/G Ratio — BT', type: 'number' },
        { key: 'ag_ratio_at', label: 'A/G Ratio — AT', type: 'number' },
        { key: 'direct_bili_bt', label: 'Direct Bilirubin — BT', type: 'number', unit: 'mg/dL' },
        { key: 'direct_bili_at', label: 'Direct Bilirubin — AT', type: 'number', unit: 'mg/dL' },
        { key: 'indirect_bili_bt', label: 'Indirect Bilirubin — BT', type: 'number', unit: 'mg/dL' },
        { key: 'indirect_bili_at', label: 'Indirect Bilirubin — AT', type: 'number', unit: 'mg/dL' },
        { key: 'total_bili_bt', label: 'Total Bilirubin — BT', type: 'number', unit: 'mg/dL' },
        { key: 'total_bili_at', label: 'Total Bilirubin — AT', type: 'number', unit: 'mg/dL' },
        { key: 'fbs_bt', label: 'FBS — BT', type: 'number', unit: 'mg/dL' },
        { key: 'fbs_at', label: 'FBS — AT', type: 'number', unit: 'mg/dL' },
      ],
    },

    // ─────────────────────────────────────────────────────────
    // 10. DISEASE ASSESSMENT
    // Graded at Baseline, Day 15, 30, 45, 60, 75, 90
    // ─────────────────────────────────────────────────────────
    {
      key: 'disease_assessment',
      title: 'Disease Assessment',
      fields: [
        {
          key: 'grading_table',
          label: 'Disease-Specific Parameters (Grading across visits)',
          type: 'assessment_grid',
          rows: [
            'Kandu (Pruritus)',
            'Srava / Lasikadhya (Oozing)',
            'Rukshata (Dryness)',
            'Pidikotpatti (Eruption)',
            'Shyavata (Discolouration)',
            'Ruja (Pain)',
            'Rajyo (Thickness / Marked lining)',
            'EASI Score',
            'vIGA-AD',
            'Itch NRS',
          ],
          columns: ['Baseline (0)', 'Day 15', 'Day 30', 'Day 45', 'Day 60', 'Day 75', 'Day 90'],
        },
        { key: 'dlqi_bt', label: 'DLQI — Before Treatment', type: 'number' },
        { key: 'dlqi_at', label: 'DLQI — After Treatment', type: 'number' },
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

    // ─────────────────────────────────────────────────────────
    // 12. DLQI (Dermatology Life Quality Index)
    // ─────────────────────────────────────────────────────────
    {
      key: 'dlqi_assessment',
      title: 'DLQI (Dermatology Life Quality Index)',
      fields: [
        {
          key: 'dlqi_instructions',
          label: 'Ask about the PAST WEEK only. Score each item: 0=Not at all / Not relevant, 1=A little, 2=A lot, 3=Very much. Total score 0–30. Interpretation: 0–1=No effect; 2–5=Small effect; 6–10=Moderate effect; 11–20=Very large effect; 21–30=Extremely large effect on QoL.',
          type: 'heading',
        },

        // ── BEFORE TREATMENT ──
        { key: 'dlqi_bt_heading', label: 'Before Treatment (BT)', type: 'heading' },
        {
          key: 'dlqi_q1_bt',
          label: 'Q1. Over the last week, how itchy, sore, painful or stinging has your skin been?',
          type: 'radio',
          options: [
            { value: '3', label: '3 — Very much' },
            { value: '2', label: '2 — A lot' },
            { value: '1', label: '1 — A little' },
            { value: '0', label: '0 — Not at all / Not relevant' },
          ],
        },
        {
          key: 'dlqi_q2_bt',
          label: 'Q2. Over the last week, how embarrassed or self-conscious have you been because of your skin?',
          type: 'radio',
          options: [
            { value: '3', label: '3 — Very much' },
            { value: '2', label: '2 — A lot' },
            { value: '1', label: '1 — A little' },
            { value: '0', label: '0 — Not at all / Not relevant' },
          ],
        },
        {
          key: 'dlqi_q3_bt',
          label: 'Q3. Over the last week, how much has your skin interfered with you going shopping or looking after your home / garden?',
          type: 'radio',
          options: [
            { value: '3', label: '3 — Very much' },
            { value: '2', label: '2 — A lot' },
            { value: '1', label: '1 — A little' },
            { value: '0', label: '0 — Not at all / Not relevant' },
          ],
        },
        {
          key: 'dlqi_q4_bt',
          label: 'Q4. Over the last week, how much has your skin influenced the clothes you wear?',
          type: 'radio',
          options: [
            { value: '3', label: '3 — Very much' },
            { value: '2', label: '2 — A lot' },
            { value: '1', label: '1 — A little' },
            { value: '0', label: '0 — Not at all / Not relevant' },
          ],
        },
        {
          key: 'dlqi_q5_bt',
          label: 'Q5. Over the last week, how much has your skin affected any social or leisure activities?',
          type: 'radio',
          options: [
            { value: '3', label: '3 — Very much' },
            { value: '2', label: '2 — A lot' },
            { value: '1', label: '1 — A little' },
            { value: '0', label: '0 — Not at all / Not relevant' },
          ],
        },
        {
          key: 'dlqi_q6_bt',
          label: 'Q6. Over the last week, how much has your skin made it difficult for you to do any sport?',
          type: 'radio',
          options: [
            { value: '3', label: '3 — Very much' },
            { value: '2', label: '2 — A lot' },
            { value: '1', label: '1 — A little' },
            { value: '0', label: '0 — Not at all / Not relevant' },
          ],
        },
        {
          key: 'dlqi_q7_bt',
          label: 'Q7. Over the last week, has your skin prevented you from working or studying?',
          type: 'radio',
          options: [
            { value: '3', label: '3 — Yes, prevented' },
            { value: '2', label: '2 — A lot of trouble at work / study because of skin' },
            { value: '1', label: '1 — A little trouble at work / study because of skin' },
            { value: '0', label: '0 — Not at all / Not relevant' },
          ],
        },
        {
          key: 'dlqi_q8_bt',
          label: 'Q8. Over the last week, has your skin created problems with your partner or any of your close friends or relatives?',
          type: 'radio',
          options: [
            { value: '3', label: '3 — Very much' },
            { value: '2', label: '2 — A lot' },
            { value: '1', label: '1 — A little' },
            { value: '0', label: '0 — Not at all / Not relevant' },
          ],
        },
        {
          key: 'dlqi_q9_bt',
          label: 'Q9. Over the last week, how much has your skin caused any sexual difficulties?',
          type: 'radio',
          options: [
            { value: '3', label: '3 — Very much' },
            { value: '2', label: '2 — A lot' },
            { value: '1', label: '1 — A little' },
            { value: '0', label: '0 — Not at all / Not relevant' },
          ],
        },
        {
          key: 'dlqi_q10_bt',
          label: 'Q10. Over the last week, how much of a problem has the treatment for your skin been (e.g. mess, time to apply)?',
          type: 'radio',
          options: [
            { value: '3', label: '3 — Very much' },
            { value: '2', label: '2 — A lot' },
            { value: '1', label: '1 — A little' },
            { value: '0', label: '0 — Not at all / Not relevant' },
          ],
        },
        {
          key: 'dlqi_total_bt',
          label: 'DLQI Total Score — BT',
          type: 'calculated',
          sumKeys: [
            'dlqi_q1_bt','dlqi_q2_bt','dlqi_q3_bt','dlqi_q4_bt','dlqi_q5_bt',
            'dlqi_q6_bt','dlqi_q7_bt','dlqi_q8_bt','dlqi_q9_bt','dlqi_q10_bt',
          ],
        },

        // ── AFTER TREATMENT ──
        { key: 'dlqi_at_heading', label: 'After Treatment (AT)', type: 'heading' },
        {
          key: 'dlqi_q1_at',
          label: 'Q1. Over the last week, how itchy, sore, painful or stinging has your skin been?',
          type: 'radio',
          options: [
            { value: '3', label: '3 — Very much' },
            { value: '2', label: '2 — A lot' },
            { value: '1', label: '1 — A little' },
            { value: '0', label: '0 — Not at all / Not relevant' },
          ],
        },
        {
          key: 'dlqi_q2_at',
          label: 'Q2. Over the last week, how embarrassed or self-conscious have you been because of your skin?',
          type: 'radio',
          options: [
            { value: '3', label: '3 — Very much' },
            { value: '2', label: '2 — A lot' },
            { value: '1', label: '1 — A little' },
            { value: '0', label: '0 — Not at all / Not relevant' },
          ],
        },
        {
          key: 'dlqi_q3_at',
          label: 'Q3. Over the last week, how much has your skin interfered with you going shopping or looking after your home / garden?',
          type: 'radio',
          options: [
            { value: '3', label: '3 — Very much' },
            { value: '2', label: '2 — A lot' },
            { value: '1', label: '1 — A little' },
            { value: '0', label: '0 — Not at all / Not relevant' },
          ],
        },
        {
          key: 'dlqi_q4_at',
          label: 'Q4. Over the last week, how much has your skin influenced the clothes you wear?',
          type: 'radio',
          options: [
            { value: '3', label: '3 — Very much' },
            { value: '2', label: '2 — A lot' },
            { value: '1', label: '1 — A little' },
            { value: '0', label: '0 — Not at all / Not relevant' },
          ],
        },
        {
          key: 'dlqi_q5_at',
          label: 'Q5. Over the last week, how much has your skin affected any social or leisure activities?',
          type: 'radio',
          options: [
            { value: '3', label: '3 — Very much' },
            { value: '2', label: '2 — A lot' },
            { value: '1', label: '1 — A little' },
            { value: '0', label: '0 — Not at all / Not relevant' },
          ],
        },
        {
          key: 'dlqi_q6_at',
          label: 'Q6. Over the last week, how much has your skin made it difficult for you to do any sport?',
          type: 'radio',
          options: [
            { value: '3', label: '3 — Very much' },
            { value: '2', label: '2 — A lot' },
            { value: '1', label: '1 — A little' },
            { value: '0', label: '0 — Not at all / Not relevant' },
          ],
        },
        {
          key: 'dlqi_q7_at',
          label: 'Q7. Over the last week, has your skin prevented you from working or studying?',
          type: 'radio',
          options: [
            { value: '3', label: '3 — Yes, prevented' },
            { value: '2', label: '2 — A lot of trouble at work / study because of skin' },
            { value: '1', label: '1 — A little trouble at work / study because of skin' },
            { value: '0', label: '0 — Not at all / Not relevant' },
          ],
        },
        {
          key: 'dlqi_q8_at',
          label: 'Q8. Over the last week, has your skin created problems with your partner or any of your close friends or relatives?',
          type: 'radio',
          options: [
            { value: '3', label: '3 — Very much' },
            { value: '2', label: '2 — A lot' },
            { value: '1', label: '1 — A little' },
            { value: '0', label: '0 — Not at all / Not relevant' },
          ],
        },
        {
          key: 'dlqi_q9_at',
          label: 'Q9. Over the last week, how much has your skin caused any sexual difficulties?',
          type: 'radio',
          options: [
            { value: '3', label: '3 — Very much' },
            { value: '2', label: '2 — A lot' },
            { value: '1', label: '1 — A little' },
            { value: '0', label: '0 — Not at all / Not relevant' },
          ],
        },
        {
          key: 'dlqi_q10_at',
          label: 'Q10. Over the last week, how much of a problem has the treatment for your skin been (e.g. mess, time to apply)?',
          type: 'radio',
          options: [
            { value: '3', label: '3 — Very much' },
            { value: '2', label: '2 — A lot' },
            { value: '1', label: '1 — A little' },
            { value: '0', label: '0 — Not at all / Not relevant' },
          ],
        },
        {
          key: 'dlqi_total_at',
          label: 'DLQI Total Score — AT',
          type: 'calculated',
          sumKeys: [
            'dlqi_q1_at','dlqi_q2_at','dlqi_q3_at','dlqi_q4_at','dlqi_q5_at',
            'dlqi_q6_at','dlqi_q7_at','dlqi_q8_at','dlqi_q9_at','dlqi_q10_at',
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────
    // 13. ADVERSE DRUG REACTIONS
    // ─────────────────────────────────────────────────────────
    {
      key: 'adr',
      title: 'Adverse Events / ADR',
      fields: [
        {
          key: 'adr_present',
          label: 'Any Adverse Events?',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        { key: 'adr_description', label: 'Description of Adverse Event', type: 'textarea', dependsOn: { key: 'adr_present', value: 'yes' } },
        { key: 'adr_onset_date', label: 'Event Onset Date', type: 'date', dependsOn: { key: 'adr_present', value: 'yes' } },
        { key: 'adr_end_date', label: 'Event End Date', type: 'date', dependsOn: { key: 'adr_present', value: 'yes' } },
        {
          key: 'adr_severity',
          label: 'Severity Grade',
          type: 'radio',
          options: [
            { value: '1', label: '1 — Present but easily tolerated' },
            { value: '2', label: '2 — Interferes with daily activities' },
            { value: '3', label: '3 — Prevents daily activities' },
            { value: '4', label: '4 — Life-threatening' },
          ],
          dependsOn: { key: 'adr_present', value: 'yes' },
        },
        {
          key: 'adr_action',
          label: 'Action Taken',
          type: 'radio',
          options: [
            { value: '0', label: '0 — No action' },
            { value: '1', label: '1 — Medication' },
            { value: '2', label: '2 — Non-drug therapy' },
            { value: '3', label: '3 — Hospitalisation' },
          ],
          dependsOn: { key: 'adr_present', value: 'yes' },
        },
        {
          key: 'adr_outcome',
          label: 'Outcome',
          type: 'radio',
          options: [
            { value: '1', label: '1 — Resolved' },
            { value: '2', label: '2 — Resolving' },
            { value: '3', label: '3 — Not Resolved' },
            { value: '4', label: '4 — Resolved with sequelae' },
            { value: '5', label: '5 — Fatal' },
            { value: '6', label: '6 — Unknown' },
          ],
          dependsOn: { key: 'adr_present', value: 'yes' },
        },
        {
          key: 'adr_sae',
          label: 'Reported as SAE?',
          type: 'radio',
          options: [{ value: '1', label: 'Yes' }, { value: '2', label: 'No' }],
          dependsOn: { key: 'adr_present', value: 'yes' },
        },
      ],
    },

    // ─────────────────────────────────────────────────────────
    // 14. COMPLETION
    // ─────────────────────────────────────────────────────────
    {
      key: 'completion',
      title: 'Completion',
      fields: [
        {
          key: 'treatment_completed',
          label: 'Treatment',
          type: 'radio',
          options: [{ value: 'completed', label: 'Completed' }, { value: 'not_completed', label: 'Not Completed' }],
          required: true,
        },
        {
          key: 'dropout_self',
          label: 'Did the patient drop out on their own?',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        { key: 'dropout_date_reason', label: 'Dropout date & reason (in detail)', type: 'textarea', dependsOn: { key: 'dropout_self', value: 'yes' } },
        {
          key: 'withdrawn',
          label: 'Was the patient withdrawn from the trial?',
          type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        { key: 'withdrawn_date_reason', label: 'Withdrawal date & reason (in detail)', type: 'textarea', dependsOn: { key: 'withdrawn', value: 'yes' } },
        { key: 'result', label: 'Result', type: 'text' },
        {
          key: 'improved',
          label: 'Improved / Not Improved',
          type: 'radio',
          options: [{ value: 'improved', label: 'Improved' }, { value: 'not_improved', label: 'Not Improved' }],
        },
        { key: 'adverse_effects_final', label: 'Adverse Effects (if any)', type: 'textarea' },
      ],
    },
  ],
}
