import type { CrfTemplateDef } from '../types'

// Scholar: Dr. Aman Raj
// Study: Gokshuradi Kwath and Kakubhadi Churna in management of Aavrit Vyana w.s.r. Essential Hypertension

export const HTN2026_TEMPLATE: CrfTemplateDef = {
  study_code: 'HTN2026',
  version: '1.0',
  visitSchedule: ['BT (Baseline)', '1st Follow-up', '2nd Follow-up', '3rd Follow-up', '4th Follow-up', '5th Follow-up', '6th Follow-up', 'AT'],
  sections: [
    // 1. STUDY INFORMATION
    {
      key: 'study_info',
      title: '1. Study Information',
      fields: [
        { key: 'trial_group', label: 'Trial Group', type: 'text', required: true },
        { key: 'centre', label: 'Centre', type: 'text', required: true },
        { key: 'date_induction', label: 'Date of Induction into Clinical Trial', type: 'date', required: true },
        { key: 'date_expected_completion', label: 'Expected Date of Completion', type: 'date' },
        { key: 'iec_number', label: 'IEC Number', type: 'text' },
        { key: 'ctri_number', label: 'CTRI Number', type: 'text' },
      ],
    },

    // 2. PERSONAL IDENTIFICATION
    {
      key: 'personal_identification',
      title: '2. Personal Identification',
      fields: [
        { key: 'cr_no', label: 'CR No.', type: 'text' },
        { key: 'opd_no', label: 'OPD No.', type: 'text' },
        { key: 'address', label: 'Address', type: 'textarea' },
        { key: 'phone_residence', label: 'Phone – Residence', type: 'text' },
        { key: 'phone_mobile', label: 'Mobile', type: 'text' },
        { key: 'email', label: 'Email', type: 'text' },
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
            { value: 'other', label: 'Any other' },
          ],
        },
        {
          key: 'education', label: 'Educational Status', type: 'radio',
          options: [{ value: 'illiterate', label: 'Illiterate' }, { value: 'literate', label: 'Literate' }],
        },
        { key: 'education_qualification', label: 'If literate, specify qualification', type: 'text', dependsOn: { key: 'education', value: 'literate' } },
        { key: 'occupation', label: 'Occupation', type: 'text' },
        {
          key: 'socioeconomic', label: 'Socio-economic Status', type: 'radio',
          options: [{ value: 'apl', label: 'Above Poverty Line' }, { value: 'bpl', label: 'Below Poverty Line' }],
        },
        {
          key: 'habitat', label: 'Habitat', type: 'radio',
          options: [{ value: 'urban', label: 'Urban' }, { value: 'semi_urban', label: 'Semi-Urban' }, { value: 'rural', label: 'Rural' }],
        },
        {
          key: 'religion', label: 'Religion', type: 'radio',
          options: [
            { value: 'hindu', label: 'Hindu' }, { value: 'muslim', label: 'Muslim' },
            { value: 'sikh', label: 'Sikh' }, { value: 'christian', label: 'Christian' },
            { value: 'other', label: 'Others' },
          ],
        },
      ],
    },

    // 4. HISTORY
    {
      key: 'history',
      title: '4. Chief Complaints & History',
      fields: [
        { key: 'cc_heading', label: 'Chief Complaints', type: 'heading' },
        {
          key: 'chief_complaints',
          label: 'Chief Complaints — mark Yes/No, note duration, and grade each symptom (grade range shown per symptom, as per the proforma)',
          type: 'assessment_grid',
          rows: [
            'Headache (0-3)',
            'Palpitation (0-1)',
            'Dizziness (0-3)',
            'Breathlessness (0-3)',
            'Fatigue (0-1)',
            'Chest Pain (0-3)',
            'Nausea / Vomiting (0-3)',
            'Pale / Red Skin (0-1)',
          ],
          columns: ['Yes / No', 'Duration', 'Grading'],
        },
        { key: 'hpi_heading', label: 'History of Present Illness', type: 'heading' },
        { key: 'hpi_duration', label: 'Duration of Illness', type: 'text' },
        { key: 'hpi_other', label: 'Any other information', type: 'textarea' },
        {
          key: 'past_history_yn', label: 'History of Previous Illness', type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        { key: 'past_history_details', label: 'Medical / Surgical history details', type: 'textarea', dependsOn: { key: 'past_history_yn', value: 'yes' } },
        { key: 'treatment_history', label: 'Treatment History', type: 'textarea' },
      ],
    },

    // 5. PERSONAL HISTORY
    {
      key: 'personal_history',
      title: '5. Personal History',
      fields: [
        {
          key: 'ahara', label: 'Ahara (Diet)', type: 'radio',
          options: [{ value: 'veg', label: 'Vegetarian' }, { value: 'non_veg', label: 'Non-Vegetarian' }],
        },
        {
          key: 'dietary_habits', label: 'Dietary Habits', type: 'radio',
          options: [{ value: 'regular', label: 'Regular' }, { value: 'irregular', label: 'Irregular' }],
        },
        { key: 'dietary_note', label: 'Salt / fat intake notes', type: 'text' },
        {
          key: 'guna_pradhanata', label: 'Guna Pradhanata', type: 'checkbox_group',
          options: [
            { value: 'guru', label: 'Guru (G)' }, { value: 'laghu', label: 'Laghu (L)' },
            { value: 'snigdha', label: 'Snigdha (SN)' }, { value: 'ruksha', label: 'Ruksha (R)' },
            { value: 'ushna', label: 'Ushna (U)' }, { value: 'sheeta', label: 'Sheeta (SH)' },
            { value: 'tikshna', label: 'Tikshna (T)' }, { value: 'mridu', label: 'Mridu (M)' },
          ],
        },
        {
          key: 'rasa_pradhanata', label: 'Rasa Pradhanata', type: 'checkbox_group',
          options: [
            { value: 'madhura', label: 'Madhura (M)' }, { value: 'amla', label: 'Amla (A)' },
            { value: 'lavana', label: 'Lavana (L)' }, { value: 'katu', label: 'Katu (K)' },
            { value: 'tikta', label: 'Tikta (T)' }, { value: 'kashaya', label: 'Kashaya (Ks)' },
            { value: 'sapta', label: 'Sapta (S)' },
          ],
        },
        {
          key: 'agni', label: 'Agni', type: 'radio',
          options: [{ value: 'sama', label: 'Sama' }, { value: 'vishama', label: 'Vishama' }, { value: 'tikshana', label: 'Tikshana' }, { value: 'manda', label: 'Manda' }],
        },
        {
          key: 'appetite', label: 'Appetite', type: 'radio',
          options: [{ value: 'poor', label: 'Poor' }, { value: 'moderate', label: 'Moderate' }, { value: 'good', label: 'Good' }],
        },
        {
          key: 'kostha', label: 'Kostha', type: 'radio',
          options: [{ value: 'mridu', label: 'Mridu' }, { value: 'madhyam', label: 'Madhyam' }, { value: 'krura', label: 'Krura' }],
        },
        {
          key: 'stool_nature', label: 'Nature of Stool', type: 'radio',
          options: [
            { value: 'regular', label: 'Regular' }, { value: 'irregular', label: 'Irregular' },
            { value: 'loose', label: 'Loose motion' }, { value: 'constipated', label: 'Constipation' },
          ],
        },
        { key: 'stool_frequency', label: 'Stool Frequency (times/day)', type: 'number' },
        { key: 'micturition_freq', label: 'Micturition Frequency (times/day & night)', type: 'text' },
        {
          key: 'micturition_qty', label: 'Micturition Quantity', type: 'radio',
          options: [{ value: 'alpa', label: 'Alpa' }, { value: 'madhyam', label: 'Madhyam' }, { value: 'bahu', label: 'Bahu' }],
        },
        { key: 'micturition_other', label: 'Other urinary symptoms', type: 'text' },
        {
          key: 'sleep', label: 'Sleep', type: 'radio',
          options: [{ value: 'sound', label: 'Sound' }, { value: 'disturbed', label: 'Disturbed' }, { value: 'insomnia', label: 'Insomnia' }],
        },
        { key: 'sleep_day', label: 'Sleep hours – Day', type: 'number' },
        { key: 'sleep_night', label: 'Sleep hours – Night', type: 'number' },
        {
          key: 'psyche', label: 'Psyche / Sat', type: 'radio',
          options: [
            { value: 'anxiety', label: 'Anxiety' }, { value: 'tension', label: 'Tension' },
            { value: 'depression', label: 'Depression' }, { value: 'sentimental', label: 'Sentimental' },
            { value: 'normal', label: 'Normal' },
          ],
        },
        { key: 'menstrual_cycle', label: 'Menstrual Cycle (if applicable)', type: 'radio', options: [{ value: 'regular', label: 'Regular' }, { value: 'irregular', label: 'Irregular' }, { value: 'na', label: 'N/A' }] },
        { key: 'menstrual_quantity', label: 'Menstrual Quantity', type: 'radio', options: [{ value: 'scanty', label: 'Scanty (S)' }, { value: 'moderate', label: 'Moderate (M)' }, { value: 'heavy', label: 'Heavy (H)' }, { value: 'na', label: 'N/A' }] },
        { key: 'menopause_age', label: 'Menopause Age (years)', type: 'number' },
        {
          key: 'addiction', label: 'Addiction', type: 'checkbox_group',
          options: [
            { value: 'tea', label: 'Tea' }, { value: 'coffee', label: 'Coffee' },
            { value: 'smoking', label: 'Smoking' }, { value: 'tobacco', label: 'Tobacco' },
            { value: 'supari', label: 'Supari' }, { value: 'alcohol', label: 'Alcohol' },
            { value: 'sleeping_pills', label: 'Sleeping pills' }, { value: 'analgesics', label: 'Analgesics' },
            { value: 'purgatives', label: 'Purgatives' }, { value: 'contraceptives', label: 'Contraceptives' },
          ],
        },
        {
          key: 'vyayama', label: 'Vyayama (Exercise)', type: 'radio',
          options: [
            { value: 'no', label: 'None' }, { value: 'light', label: 'Light' },
            { value: 'heavy', label: 'Heavy' }, { value: 'regular', label: 'Regular' },
            { value: 'irregular', label: 'Irregular' }, { value: 'occasional', label: 'Occasional' },
          ],
        },
        { key: 'vyayama_type', label: 'Type of exercise', type: 'text', placeholder: 'Walking / Running / Yoga / Other' },
        {
          key: 'nature_of_work', label: 'Nature of Work', type: 'radio',
          options: [
            { value: 'sedentary', label: 'Sedentary' }, { value: 'moderate', label: 'Moderate' },
            { value: 'heavy', label: 'Heavy' }, { value: 'sitting', label: 'Sitting' },
            { value: 'standing', label: 'Standing' }, { value: 'travelling', label: 'Travelling' },
          ],
        },
        { key: 'working_hours', label: 'Working Hours', type: 'number', unit: 'hrs/day' },
        {
          key: 'work_shift', label: 'Work Shift', type: 'radio',
          options: [{ value: 'day', label: 'Day' }, { value: 'night', label: 'Night' }],
        },
        {
          key: 'job_satisfaction', label: 'Job Satisfaction', type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
      ],
    },

    // 6. GENERAL PHYSICAL EXAMINATION
    {
      key: 'general_examination',
      title: '6. General Physical Examination',
      fields: [
        {
          key: 'built', label: 'Built', type: 'radio',
          options: [
            { value: 'average', label: 'Average' }, { value: 'emaciated', label: 'Emaciated' },
            { value: 'well_built', label: 'Well built' }, { value: 'tall', label: 'Tall' }, { value: 'dwarf', label: 'Dwarf' },
          ],
        },
        {
          key: 'nutrition', label: 'Nutrition', type: 'radio',
          options: [
            { value: 'moderately_nourished', label: 'Moderately nourished' },
            { value: 'malnourished', label: 'Malnourished' },
            { value: 'well_nourished', label: 'Well nourished' },
          ],
        },
        { key: 'height', label: 'Height', type: 'number', unit: 'm' },
        { key: 'weight', label: 'Weight', type: 'number', unit: 'kg' },
        { key: 'bmi', label: 'BMI', type: 'calculated', formulaId: 'bmi', hint: 'Auto-calculated from height & weight' },
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
        { key: 'tongue', label: 'Tongue', type: 'text' },
        { key: 'lips', label: 'Lips', type: 'text' },
        { key: 'eyes', label: 'Eyes', type: 'text' },
        { key: 'ears', label: 'Ears', type: 'text' },
        { key: 'nose', label: 'Nose', type: 'text' },
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
          key: 'oedema_character', label: 'Character of Oedema', type: 'radio',
          options: [{ value: 'pitting', label: 'Pitting' }, { value: 'non_pitting', label: 'Non-pitting' }],
          dependsOn: { key: 'oedema', value: 'present' },
        },
      ],
    },

    // 7. SYSTEMIC EXAMINATION
    {
      key: 'systemic_examination',
      title: '7. Systemic Examination',
      fields: [
        { key: 'sys_respiratory', label: 'Respiratory System', type: 'textarea' },
        { key: 'sys_gi', label: 'Gastro-Intestinal System', type: 'textarea' },
        { key: 'sys_cvs', label: 'Cardio-Vascular System', type: 'textarea' },
        { key: 'sys_nervous', label: 'Nervous System', type: 'textarea' },
        { key: 'sys_msk', label: 'Musculo-Skeletal System', type: 'textarea' },
        { key: 'sys_gu', label: 'Genito-Urinary System', type: 'textarea' },
      ],
    },

    // 8. ASHTAVIDHA PARIKSHA
    {
      key: 'ashtavidha_pariksha',
      title: '8. Ashtavidha Pariksha',
      fields: [
        {
          key: 'nadi', label: 'Nadi', type: 'select',
          options: [
            { value: 'vata', label: 'Vata (V)' }, { value: 'pitta', label: 'Pitta (P)' }, { value: 'kapha', label: 'Kapha (K)' },
            { value: 'vata_pitta', label: 'Vata-Pitta (VP)' }, { value: 'vata_kapha', label: 'Vata-Kapha (VK)' },
            { value: 'pitta_kapha', label: 'Pitta-Kapha (PK)' }, { value: 'tridoshaja', label: 'Tridoshaja' },
          ],
        },
        {
          key: 'nadi_rhythm', label: 'Nadi Rhythm', type: 'radio',
          options: [{ value: 'regular', label: 'Regular' }, { value: 'irregular', label: 'Irregular' }],
        },
        { key: 'mutra_matra', label: 'Mutra – Matra', type: 'text' },
        { key: 'mutra_varna', label: 'Mutra – Varna', type: 'text' },
        { key: 'mutra_gandha', label: 'Mutra – Gandha', type: 'text' },
        { key: 'mutra_pravrutti', label: 'Mutra – Pravrutti', type: 'text' },
        { key: 'mala_matra', label: 'Mala – Matra', type: 'text' },
        { key: 'mala_varna', label: 'Mala – Varna', type: 'text' },
        { key: 'mala_gandha', label: 'Mala – Gandha', type: 'text' },
        {
          key: 'mala_pravrutti', label: 'Mala – Pravrutti', type: 'radio',
          options: [{ value: 'sama', label: 'Sama' }, { value: 'nirama', label: 'Nirama' }],
        },
        {
          key: 'jihwa', label: 'Jihwa', type: 'radio',
          options: [{ value: 'sama', label: 'Sama' }, { value: 'nirama', label: 'Nirama' }],
        },
        {
          key: 'shabda', label: 'Shabda', type: 'radio',
          options: [
            { value: 'spashta', label: 'Spashta' }, { value: 'aspashta', label: 'Aspashta' },
            { value: 'gadgada', label: 'Gadgada' }, { value: 'sanunasika', label: 'Sanunasika' },
          ],
        },
        {
          key: 'sparsha', label: 'Sparsha', type: 'checkbox_group',
          options: [
            { value: 'mridu', label: 'Mridu' }, { value: 'kathina', label: 'Kathina' },
            { value: 'sheeta', label: 'Sheeta' }, { value: 'ushna', label: 'Ushna' },
            { value: 'ruksha', label: 'Ruksha' }, { value: 'snigdha', label: 'Snigdha' },
            { value: 'khara', label: 'Khara' }, { value: 'slaksha', label: 'Slaksha' },
          ],
        },
        {
          key: 'drik', label: 'Drik', type: 'radio',
          options: [
            { value: 'shwetabha', label: 'Shwetabha' }, { value: 'raktabha', label: 'Raktabha' },
            { value: 'peetabha', label: 'Peetabha' }, { value: 'anya', label: 'Anya' },
          ],
        },
        {
          key: 'akriti', label: 'Akriti', type: 'select',
          options: [
            { value: 'krisha', label: 'Krisha' }, { value: 'sthool', label: 'Sthool' },
            { value: 'deergha', label: 'Deergha' }, { value: 'hriswa', label: 'Hriswa' },
            { value: 'samopachita', label: 'Samopachita' }, { value: 'vishamopachita', label: 'Vishamopachita' },
          ],
        },
      ],
    },

    // 9. DASHAVIDHA PARIKSHA
    {
      key: 'dashavidha_pariksha',
      title: '9. Dashavidha Pariksha',
      fields: [
        {
          key: 'prakriti', label: 'Prakriti', type: 'radio',
          options: [
            { value: 'V', label: 'Vata (V)' }, { value: 'P', label: 'Pitta (P)' }, { value: 'K', label: 'Kapha (K)' },
            { value: 'VP', label: 'Vata-Pitta (VP)' }, { value: 'VK', label: 'Vata-Kapha (VK)' },
            { value: 'PK', label: 'Pitta-Kapha (PK)' }, { value: 'Samdoshaj', label: 'Samdoshaj' },
          ],
        },
        { key: 'vikriti_hetu', label: 'Vikriti – Hetu', type: 'textarea' },
        { key: 'vikriti_dosha', label: 'Vikriti – Dosha', type: 'textarea' },
        { key: 'vikriti_dushya', label: 'Vikriti – Dushya', type: 'textarea' },
        {
          key: 'sara', label: 'Sara', type: 'select',
          options: [
            { value: 'twaka', label: 'Twaka' }, { value: 'rakta', label: 'Rakta' },
            { value: 'mansa', label: 'Mansa' }, { value: 'meda', label: 'Meda' },
            { value: 'asthi', label: 'Asthi' }, { value: 'majja', label: 'Majja' },
            { value: 'shukra', label: 'Shukra' }, { value: 'satwa', label: 'Satwa' }, { value: 'sarvasara', label: 'Sarvasara' },
          ],
        },
        {
          key: 'samhanana', label: 'Samhanana', type: 'radio',
          options: [{ value: 'susanhata', label: 'Susanhata' }, { value: 'madhyama', label: 'Madhyama' }, { value: 'heena', label: 'Heena' }],
        },
        {
          key: 'pramana', label: 'Pramana', type: 'radio',
          options: [{ value: 'sama', label: 'Sama' }, { value: 'madhyama', label: 'Madhyama' }, { value: 'heena', label: 'Heena' }],
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
          key: 'aharashakti_abhyavaharana', label: 'Aharashakti – Abhyavaharana Shakti', type: 'radio',
          options: [{ value: 'pravar', label: 'Pravar' }, { value: 'madhyama', label: 'Madhyama' }, { value: 'avara', label: 'Avara' }],
        },
        {
          key: 'aharashakti_jarana', label: 'Aharashakti – Jarana Shakti', type: 'radio',
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

    // 10. INVESTIGATIONS
    {
      key: 'investigations',
      title: '10. Investigations',
      fields: [
        { key: 'inv_biochem_heading', label: 'Bio-Chemistry', type: 'heading' },
        { key: 'blood_urea_bt', label: 'Blood Urea – BT', type: 'number', unit: 'mg/dL' },
        { key: 'blood_urea_at', label: 'Blood Urea – AT', type: 'number', unit: 'mg/dL' },
        { key: 'uric_acid_bt', label: 'Serum Uric Acid – BT', type: 'number', unit: 'mg/dL' },
        { key: 'uric_acid_at', label: 'Serum Uric Acid – AT', type: 'number', unit: 'mg/dL' },
        { key: 'creatinine_bt', label: 'Serum Creatinine – BT', type: 'number', unit: 'mg/dL' },
        { key: 'creatinine_at', label: 'Serum Creatinine – AT', type: 'number', unit: 'mg/dL' },
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
        { key: 'serum_bili_bt', label: 'Serum Bilirubin (Total) – BT', type: 'number', unit: 'mg/dL' },
        { key: 'serum_bili_at', label: 'Serum Bilirubin (Total) – AT', type: 'number', unit: 'mg/dL' },
        { key: 'direct_bili_bt', label: 'Direct Bilirubin – BT', type: 'number', unit: 'mg/dL' },
        { key: 'direct_bili_at', label: 'Direct Bilirubin – AT', type: 'number', unit: 'mg/dL' },
        { key: 'indirect_bili_bt', label: 'Indirect Bilirubin – BT', type: 'number', unit: 'mg/dL' },
        { key: 'indirect_bili_at', label: 'Indirect Bilirubin – AT', type: 'number', unit: 'mg/dL' },
        { key: 'alp_bt', label: 'Serum Alkaline Phosphatase – BT', type: 'number', unit: 'K.A. Units' },
        { key: 'alp_at', label: 'Serum Alkaline Phosphatase – AT', type: 'number', unit: 'K.A. Units' },
        { key: 'inv_lipid_heading', label: 'Serum Lipid Profile', type: 'heading' },
        { key: 'cholesterol_bt', label: 'Serum Cholesterol – BT', type: 'number', unit: 'mg/dL' },
        { key: 'cholesterol_at', label: 'Serum Cholesterol – AT', type: 'number', unit: 'mg/dL' },
        { key: 'tg_bt', label: 'Serum Triglycerides – BT', type: 'number', unit: 'mg/dL' },
        { key: 'tg_at', label: 'Serum Triglycerides – AT', type: 'number', unit: 'mg/dL' },
        { key: 'ldl_bt', label: 'LDL Cholesterol – BT', type: 'number', unit: 'mg/dL' },
        { key: 'ldl_at', label: 'LDL Cholesterol – AT', type: 'number', unit: 'mg/dL' },
        { key: 'hdl_bt', label: 'HDL Cholesterol – BT', type: 'number', unit: 'mg/dL' },
        { key: 'hdl_at', label: 'HDL Cholesterol – AT', type: 'number', unit: 'mg/dL' },
        { key: 'vldl_bt', label: 'VLDL – BT', type: 'number', unit: 'mg/dL' },
        { key: 'vldl_at', label: 'VLDL – AT', type: 'number', unit: 'mg/dL' },
        { key: 'chol_hdl_ratio_bt', label: 'Total Cholesterol / HDL Ratio – BT', type: 'number' },
        { key: 'chol_hdl_ratio_at', label: 'Total Cholesterol / HDL Ratio – AT', type: 'number' },
        { key: 'inv_haem_heading', label: 'Haematology', type: 'heading' },
        { key: 'hb_bt', label: 'Haemoglobin – BT', type: 'number', unit: 'g/dL' },
        { key: 'hb_at', label: 'Haemoglobin – AT', type: 'number', unit: 'g/dL' },
        { key: 'tlc_bt', label: 'TLC – BT', type: 'number', unit: 'cells/cumm' },
        { key: 'tlc_at', label: 'TLC – AT', type: 'number', unit: 'cells/cumm' },
        { key: 'dlc_n_bt', label: 'DLC N% – BT', type: 'number' },
        { key: 'dlc_n_at', label: 'DLC N% – AT', type: 'number' },
        { key: 'dlc_e_bt', label: 'DLC E% – BT', type: 'number' },
        { key: 'dlc_e_at', label: 'DLC E% – AT', type: 'number' },
        { key: 'dlc_m_bt', label: 'DLC M% – BT', type: 'number' },
        { key: 'dlc_m_at', label: 'DLC M% – AT', type: 'number' },
        { key: 'dlc_b_bt', label: 'DLC B% – BT', type: 'number' },
        { key: 'dlc_b_at', label: 'DLC B% – AT', type: 'number' },
        { key: 'dlc_l_bt', label: 'DLC L% – BT', type: 'number' },
        { key: 'dlc_l_at', label: 'DLC L% – AT', type: 'number' },
        { key: 'esr_bt', label: 'ESR – BT', type: 'number', unit: 'mm/hr' },
        { key: 'esr_at', label: 'ESR – AT', type: 'number', unit: 'mm/hr' },
        { key: 'fbs_bt', label: 'FBS – BT', type: 'number', unit: 'mg/dL' },
        { key: 'fbs_at', label: 'FBS – AT', type: 'number', unit: 'mg/dL' },
        { key: 'inv_urine_heading', label: 'Urine Examination', type: 'heading' },
        { key: 'urine_physical_bt', label: 'Urine Physical – BT', type: 'textarea' },
        { key: 'urine_physical_at', label: 'Urine Physical – AT', type: 'textarea' },
        { key: 'urine_chemical_bt', label: 'Urine Chemical – BT', type: 'textarea' },
        { key: 'urine_chemical_at', label: 'Urine Chemical – AT', type: 'textarea' },
        { key: 'urine_microscopic_bt', label: 'Urine Microscopic – BT', type: 'textarea' },
        { key: 'urine_microscopic_at', label: 'Urine Microscopic – AT', type: 'textarea' },
        { key: 'ecg_findings', label: 'ECG Findings', type: 'textarea' },
      ],
    },

    // 11. TREATMENT SCHEDULE
    {
      key: 'treatment_schedule',
      title: '11. Treatment Schedule',
      fields: [
        { key: 'ts_group', label: 'Group', type: 'text' },
        { key: 'ts_drug', label: 'Drug', type: 'text' },
        { key: 'ts_dose', label: 'Dose', type: 'text' },
      ],
    },

    // 12. DISEASE ASSESSMENT & FOLLOW-UP
    {
      key: 'disease_assessment',
      title: '12. Disease Assessment & Follow-up',
      fields: [
        {
          key: 'followup_schedule',
          label: 'Follow-up Assessment Schedule',
          type: 'assessment_grid',
          rows: ['Date of Assessment', 'Day of Assessment'],
          columns: ['BT', '1st F/U', '2nd F/U', '3rd F/U', '4th F/U', '5th F/U', '6th F/U', 'AT'],
        },
        {
          key: 'symptom_grades',
          label: 'Symptom Grades — Before vs After Treatment',
          type: 'assessment_grid',
          rows: [
            'Headache (0-3)',
            'Palpitation (0-1)',
            'Dizziness (0-3)',
            'Breathlessness (0-3)',
            'Fatigue (0-1)',
            'Chest Pain (0-3)',
            'Nausea / Vomiting (0-3)',
            'Pale / Red Skin (0-1)',
          ],
          columns: ['BT', 'AT', 'Diff'],
        },
        {
          key: 'vitals_grid',
          label: 'Vital Signs across visits',
          type: 'assessment_grid',
          rows: [
            'Pulse Rate (/min)',
            'BP Systolic (mmHg)',
            'BP Diastolic (mmHg)',
            'Respiratory Rate (/min)',
            'Body Weight (kg)',
          ],
          columns: ['BT', '1st F/U', '2nd F/U', '3rd F/U', '4th F/U', '5th F/U', '6th F/U', 'AT'],
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

    // 13. CONCOMITANT / RESCUE MEDICATION
    {
      key: 'concomitant_medication',
      title: '13. Concomitant & Rescue Medication',
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

    // 14. ADVERSE DRUG REACTIONS
    {
      key: 'adr',
      title: '14. Adverse Drug Reactions / Events',
      fields: [
        {
          key: 'adr_present', label: 'Any Adverse Events?', type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        {
          key: 'adr_table', label: 'Adverse Drug Reactions / Events', type: 'assessment_grid',
          rows: ['1', '2', '3'], columns: ['Date', 'Complaint', 'Treatment Given', 'Remarks'],
          dependsOn: { key: 'adr_present', value: 'yes' },
        },
      ],
    },

    // 15. COMPLETION
    {
      key: 'completion',
      title: '15. Completion',
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
        { key: 'dropout_reason', label: 'Date & reason for dropout (in detail)', type: 'textarea', dependsOn: { key: 'dropout', value: 'yes' } },
        {
          key: 'withdrawn', label: 'Was the patient withdrawn from the trial?', type: 'radio',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        { key: 'withdrawal_reason', label: 'Date & reason for withdrawal (in detail)', type: 'textarea', dependsOn: { key: 'withdrawn', value: 'yes' } },
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
