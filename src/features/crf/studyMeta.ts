/**
 * STUDY METADATA
 * ==============
 * Official study titles, batch (admission year-range), and PG scholar for each
 * study code — sourced from the PG Department of Kayachikitsa "SYNOPSIS TITLE"
 * master list (authoritative; the `studies.study_title` column is not).
 *
 * Used for: full-title headings on the CRF + exports, and batch/participant
 * grouping in the admin checking view.
 */
import { CRF_REGISTRY } from './registry'

export const DEPARTMENT = 'PG Department of Kayachikitsa'

export interface StudyMeta {
  code: string
  batch: string
  scholar: string
  title: string
}

export const STUDY_META: Record<string, StudyMeta> = {
  // ── Batch 2023–2026 ─────────────────────────────────────────────────────
  HTN2026: {
    code: 'HTN2026', batch: '2023-2026', scholar: 'Dr. Aman Raj',
    title: 'Randomized comparative clinical study to evaluate the efficacy of Gokshuradi Kwath and Kakubhadi Churna in the management of Aavrit Vyaan w.s.r. to Essential Hypertension',
  },
  DMA2026: {
    code: 'DMA2026', batch: '2023-2026', scholar: 'Dr. Ayush Gupta',
    title: 'Efficacy of Kaishore Guggulu and Asanadi Kwatha in the management of newly diagnosed cases of Madhumeha w.s.r. Type 2 Diabetes Mellitus: an open-label randomized comparative parallel group study',
  },
  AST2026: {
    code: 'AST2026', batch: '2023-2026', scholar: 'Dr. Dharnendra Jain',
    title: 'Efficacy of Vasadi Kwath versus Ashwagandhadi Churna in the management of Tamaka Shwasa w.s.r. Bronchial Asthma: An open label randomised comparative study',
  },
  ECZ2026: {
    code: 'ECZ2026', batch: '2023-2026', scholar: 'Dr. Rubi Vishwakarma',
    title: 'Efficacy of Ekvimshati Guggulu and Khadirashthak Kwatha in combination with Durvadya Taila in the management of Vicharchika w.s.r. Eczema: an open-label randomised comparative study',
  },

  // ── Batch 2024–2027 ─────────────────────────────────────────────────────
  SHP2026: {
    code: 'SHP2026', batch: '2024-2027', scholar: 'Dr. Anjali Saroha',
    title: 'Efficacy of Amrutarajanyadi Kashaya and Agnimantha Yoga along with Siddharthadi Yoga in the management of Sheetapitta w.s.r. to Urticaria: An Open-Label Randomised Comparative Clinical study',
  },
  FLD2026: {
    code: 'FLD2026', batch: '2024-2027', scholar: 'Dr. Vaibhav Khandare',
    title: 'A comparative clinical study of Yamanikadi Choornam and Agnimanth Kwatha with Shilajatu in the management of Non-alcoholic Fatty Liver Disease (Grade-I & Grade-II) w.s.r. to Yakritodara: An Open Labelled Randomized Study',
  },
  HYP2026: {
    code: 'HYP2026', batch: '2024-2027', scholar: 'Dr. Kirti Garg',
    title: 'Efficacy and Safety of Agnimukha Choorna and Yavakshara-Shunthi Choorna in the management of Dhatvagnimandhya w.s.r. subclinical hypothyroidism: An open-label randomized comparative parallel-group study',
  },
  DM2026: {
    code: 'DM2026', batch: '2024-2027', scholar: 'Dr. Nisha Uke',
    title: 'Efficacy and Safety of Vyoshadi Choorna and Shuddha Shilajatu in the management of newly diagnosed cases of Madhumeha w.s.r. Type 2 Diabetes Mellitus',
  },
}

/** All batch labels in display order. */
export const BATCH_ORDER = ['2023-2026', '2024-2027']

export function getStudyMeta(code: string): StudyMeta {
  return STUDY_META[code] ?? { code, batch: 'Other', scholar: '', title: code }
}

/** Full official title for a study code (falls back to the code itself). */
export function studyTitle(code: string): string {
  return STUDY_META[code]?.title ?? code
}

/** Batch label for a study code. */
export function studyBatch(code: string): string {
  return STUDY_META[code]?.batch ?? 'Other'
}

/**
 * Total number of fillable slots in a study's CRF template — used as the
 * denominator for completion %. Counts each input field as 1 and each grid as
 * rows × columns. Headings / dividers are not counted.
 */
export function expectedSlots(code: string): number {
  const template = CRF_REGISTRY[code]
  if (!template) return 0
  let n = 0
  for (const section of template.sections) {
    for (const field of section.fields) {
      if (field.type === 'heading' || field.type === 'divider') continue
      if (field.type === 'assessment_grid' || field.type === 'investigation_table') {
        n += (field.rows?.length ?? 0) * (field.columns?.length ?? 0)
        continue
      }
      n += 1
    }
  }
  return n
}
