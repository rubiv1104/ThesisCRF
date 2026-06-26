/**
 * CRF TEMPLATE REGISTRY
 * =====================
 * This is the single place where CRF templates are registered.
 *
 * HOW TO ADD A NEW CRF:
 *   1. Create a new file in src/features/crf/definitions/ (e.g. xyz2027.ts)
 *      following the same structure as the existing templates.
 *   2. Import your template below (follow the pattern of existing imports).
 *   3. Add it to CRF_REGISTRY with the study_code as the key.
 *   4. Add the study to the Supabase 'studies' table (so investigators can
 *      select it during registration and patients get the right CRF).
 *
 * HOW TO REMOVE A CRF:
 *   1. Delete (or comment out) the import below.
 *   2. Delete (or comment out) the entry in CRF_REGISTRY.
 *   Note: existing CRF data in the database is NOT deleted — it stays safe.
 *         The study just won't render in the UI until re-registered.
 */

import { ECZ2026_TEMPLATE } from './definitions/ecz2026'
import { AST2026_TEMPLATE } from './definitions/ast2026'
import { SHP2026_TEMPLATE } from './definitions/shp2026'
import { DM2026_TEMPLATE } from './definitions/dm2026'
import { DMA2026_TEMPLATE } from './definitions/dma2026'
import { HTN2026_TEMPLATE } from './definitions/htn2026'
import { HYP2026_TEMPLATE } from './definitions/hyp2026'
import { FLD2026_TEMPLATE } from './definitions/fld2026'

import type { CrfTemplateDef } from './types'

export const CRF_REGISTRY: Record<string, CrfTemplateDef> = {
  // ── Active studies ──────────────────────────────────────────────────────
  ECZ2026: ECZ2026_TEMPLATE,   // Vicharchika / Eczema — Dr. Rubi Vishwakarma
  AST2026: AST2026_TEMPLATE,   // Tamaka Shwasa / Bronchial Asthma
  SHP2026: SHP2026_TEMPLATE,   // Sheetapitta / Urticaria
  DM2026: DM2026_TEMPLATE,     // Madhumeha / Type 2 DM — Dr. Nisha Uke
  DMA2026: DMA2026_TEMPLATE,   // Madhumeha / Type 2 DM — Dr. Ayush Gupta (Kaishore Guggulu + Asanadi Kwatha)
  HTN2026: HTN2026_TEMPLATE,   // Aavrit Vyana / Essential Hypertension — Dr. Aman Raj
  HYP2026: HYP2026_TEMPLATE,   // Dhatvagnimandhya / Subclinical Hypothyroidism — Dr. Kirti Garg
  FLD2026: FLD2026_TEMPLATE,   // Fatty Liver Disease (NAFLD/NASH) — Dr. Vaibhav Khandare
  // ── Add new entries above this line ─────────────────────────────────────
}
