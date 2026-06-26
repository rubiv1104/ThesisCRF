-- =============================================================
-- ThesisCRF – Teacher / Guide RLS Policies
-- Version: 1.1
-- Run this in Supabase SQL Editor AFTER 001_initial_schema.sql
-- =============================================================

-- Add 'teacher' to the user_role enum if not already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'teacher'
      AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
  ) THEN
    ALTER TYPE user_role ADD VALUE 'teacher';
  END IF;
END$$;

-- Add study_teachers table if not already present
CREATE TABLE IF NOT EXISTS study_teachers (
  id          uuid primary key default uuid_generate_v4(),
  study_id    uuid not null references studies(id) on delete cascade,
  teacher_id  uuid not null references user_profiles(id) on delete cascade,
  role_label  text default 'Guide',
  created_at  timestamptz not null default now(),
  unique (study_id, teacher_id)
);

-- ---- Helper: study ids the current teacher supervises ----
CREATE OR REPLACE FUNCTION teacher_study_ids()
RETURNS setof uuid LANGUAGE sql SECURITY DEFINER AS $$
  SELECT study_id FROM study_teachers WHERE teacher_id = auth.uid();
$$;

-- ---- study_teachers RLS ----
ALTER TABLE study_teachers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Teachers see own study assignments" ON study_teachers;
CREATE POLICY "Teachers see own study assignments"
  ON study_teachers FOR SELECT
  USING (teacher_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "Admin manages study teachers" ON study_teachers;
CREATE POLICY "Admin manages study teachers"
  ON study_teachers FOR ALL USING (is_admin());

-- ---- patients: teachers can read patients from supervised studies ----
DROP POLICY IF EXISTS "Teachers see supervised patients" ON patients;
CREATE POLICY "Teachers see supervised patients"
  ON patients FOR SELECT
  USING (
    study_id IN (SELECT teacher_study_ids())
  );

-- ---- crfs: teachers can read CRFs for supervised patients ----
DROP POLICY IF EXISTS "Teachers see supervised CRFs" ON crfs;
CREATE POLICY "Teachers see supervised CRFs"
  ON crfs FOR SELECT
  USING (
    patient_id IN (
      SELECT id FROM patients
      WHERE study_id IN (SELECT teacher_study_ids())
    )
  );

-- Teachers can also update validation_status (approve/return)
DROP POLICY IF EXISTS "Teachers update CRF validation" ON crfs;
CREATE POLICY "Teachers update CRF validation"
  ON crfs FOR UPDATE
  USING (
    patient_id IN (
      SELECT id FROM patients
      WHERE study_id IN (SELECT teacher_study_ids())
    )
  );

-- ---- crf_sections: teachers can read sections for supervised CRFs ----
DROP POLICY IF EXISTS "Teachers see supervised CRF sections" ON crf_sections;
CREATE POLICY "Teachers see supervised CRF sections"
  ON crf_sections FOR SELECT
  USING (
    crf_id IN (
      SELECT c.id FROM crfs c
      JOIN patients p ON p.id = c.patient_id
      WHERE p.study_id IN (SELECT teacher_study_ids())
    )
  );

-- ---- crf_responses: teachers can read responses for supervised CRFs ----
DROP POLICY IF EXISTS "Teachers see supervised CRF responses" ON crf_responses;
CREATE POLICY "Teachers see supervised CRF responses"
  ON crf_responses FOR SELECT
  USING (
    section_id IN (
      SELECT s.id FROM crf_sections s
      JOIN crfs c ON c.id = s.crf_id
      JOIN patients p ON p.id = c.patient_id
      WHERE p.study_id IN (SELECT teacher_study_ids())
    )
  );

-- ---- user_profiles: teachers can read profiles of investigators in their studies ----
DROP POLICY IF EXISTS "Teachers see investigator profiles in supervised studies" ON user_profiles;
CREATE POLICY "Teachers see investigator profiles in supervised studies"
  ON user_profiles FOR SELECT
  USING (
    id = auth.uid()
    OR is_admin()
    OR id IN (
      SELECT p.created_by FROM patients p
      WHERE p.study_id IN (SELECT teacher_study_ids())
    )
  );

-- ---- studies: teachers can read studies they supervise ----
DROP POLICY IF EXISTS "Teachers see supervised studies" ON studies;
CREATE POLICY "Teachers see supervised studies"
  ON studies FOR SELECT
  USING (
    is_admin()
    OR id IN (SELECT investigator_study_ids())
    OR id IN (SELECT teacher_study_ids())
  );

-- ---- research_groups: teachers can read groups in supervised studies ----
DROP POLICY IF EXISTS "Teachers see supervised research groups" ON research_groups;
CREATE POLICY "Teachers see supervised research groups"
  ON research_groups FOR SELECT
  USING (
    is_admin()
    OR study_id IN (SELECT investigator_study_ids())
    OR study_id IN (SELECT teacher_study_ids())
  );
