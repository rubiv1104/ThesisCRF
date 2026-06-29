-- =============================================================
-- ThesisCRF - App schema sync
-- Version: 1.2
--
-- Run this after 001_initial_schema.sql and 002_teacher_rls.sql.
-- It aligns the database with the columns and tables used by the
-- current Next.js app.
-- =============================================================

-- Keep the role enum aligned with the app.
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

-- App-level account activation flag. The older schema used status text;
-- keep both so existing data remains compatible.
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

UPDATE user_profiles
SET is_active = false
WHERE status = 'inactive';

-- App-level study duration editor.
ALTER TABLE studies
  ADD COLUMN IF NOT EXISTS duration_days int CHECK (duration_days IS NULL OR duration_days > 0);

-- Guide review workflow used by dashboard, teacher review, export, and CRF pages.
ALTER TABLE crfs
  ADD COLUMN IF NOT EXISTS validation_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS validation_note text,
  ADD COLUMN IF NOT EXISTS validated_by uuid REFERENCES user_profiles(id),
  ADD COLUMN IF NOT EXISTS validated_at timestamptz;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'crfs_validation_status_check'
      AND conrelid = 'crfs'::regclass
  ) THEN
    ALTER TABLE crfs
      ADD CONSTRAINT crfs_validation_status_check
      CHECK (validation_status IN ('pending', 'submitted', 'approved', 'returned'));
  END IF;
END$$;

CREATE INDEX IF NOT EXISTS idx_crfs_validation_status ON crfs(validation_status);

-- Section/field correction comments used by guide review.
CREATE TABLE IF NOT EXISTS crf_corrections (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  crf_id          uuid NOT NULL REFERENCES crfs(id) ON DELETE CASCADE,
  section_key     text NOT NULL,
  field_key       text,
  correction      text NOT NULL,
  corrected_by    uuid REFERENCES user_profiles(id),
  corrector_name  text,
  status          text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crf_corrections_crf_id ON crf_corrections(crf_id);
CREATE INDEX IF NOT EXISTS idx_crf_corrections_status ON crf_corrections(status);

DROP TRIGGER IF EXISTS trg_crf_corrections_updated_at ON crf_corrections;
CREATE TRIGGER trg_crf_corrections_updated_at
  BEFORE UPDATE ON crf_corrections
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE crf_corrections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "CRF corrections readable by study members" ON crf_corrections;
CREATE POLICY "CRF corrections readable by study members"
  ON crf_corrections FOR SELECT
  USING (
    is_admin()
    OR crf_id IN (
      SELECT c.id
      FROM crfs c
      JOIN patients p ON p.id = c.patient_id
      WHERE p.study_id IN (SELECT investigator_study_ids())
         OR p.study_id IN (SELECT teacher_study_ids())
    )
  );

DROP POLICY IF EXISTS "Guides and admins manage CRF corrections" ON crf_corrections;
CREATE POLICY "Guides and admins manage CRF corrections"
  ON crf_corrections FOR ALL
  USING (
    is_admin()
    OR crf_id IN (
      SELECT c.id
      FROM crfs c
      JOIN patients p ON p.id = c.patient_id
      WHERE p.study_id IN (SELECT teacher_study_ids())
    )
  )
  WITH CHECK (
    is_admin()
    OR crf_id IN (
      SELECT c.id
      FROM crfs c
      JOIN patients p ON p.id = c.patient_id
      WHERE p.study_id IN (SELECT teacher_study_ids())
    )
  );

-- Uploaded investigation reports used by patient investigations and exports.
CREATE TABLE IF NOT EXISTS investigation_documents (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id   uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  file_name    text NOT NULL,
  file_path    text NOT NULL,
  file_size    bigint,
  visit_label  text,
  description  text,
  uploaded_by  uuid REFERENCES user_profiles(id),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_investigation_documents_patient_id ON investigation_documents(patient_id);
CREATE INDEX IF NOT EXISTS idx_investigation_documents_uploaded_by ON investigation_documents(uploaded_by);

DROP TRIGGER IF EXISTS trg_investigation_documents_updated_at ON investigation_documents;
CREATE TRIGGER trg_investigation_documents_updated_at
  BEFORE UPDATE ON investigation_documents
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE investigation_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Study members read investigation documents" ON investigation_documents;
CREATE POLICY "Study members read investigation documents"
  ON investigation_documents FOR SELECT
  USING (
    is_admin()
    OR patient_id IN (
      SELECT id FROM patients
      WHERE study_id IN (SELECT investigator_study_ids())
         OR study_id IN (SELECT teacher_study_ids())
    )
  );

DROP POLICY IF EXISTS "Investigators manage own investigation documents" ON investigation_documents;
CREATE POLICY "Investigators manage own investigation documents"
  ON investigation_documents FOR ALL
  USING (
    patient_id IN (
      SELECT id FROM patients
      WHERE study_id IN (SELECT investigator_study_ids())
    )
  )
  WITH CHECK (
    patient_id IN (
      SELECT id FROM patients
      WHERE study_id IN (SELECT investigator_study_ids())
    )
  );

DROP POLICY IF EXISTS "Admin manages investigation documents" ON investigation_documents;
CREATE POLICY "Admin manages investigation documents"
  ON investigation_documents FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Feedback and request inbox used by /feedback and /admin/feedback.
CREATE TABLE IF NOT EXISTS feedbacks (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  submitted_by   uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  full_name      text NOT NULL,
  email          text NOT NULL,
  study_code     text,
  category       text NOT NULL CHECK (category IN ('scale_request', 'feature', 'bug', 'general')),
  subject        text NOT NULL,
  message        text NOT NULL,
  status         text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  admin_notes    text,
  attachment_url text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feedbacks_submitted_by ON feedbacks(submitted_by);
CREATE INDEX IF NOT EXISTS idx_feedbacks_status ON feedbacks(status);
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks(created_at DESC);

DROP TRIGGER IF EXISTS trg_feedbacks_updated_at ON feedbacks;
CREATE TRIGGER trg_feedbacks_updated_at
  BEFORE UPDATE ON feedbacks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users insert own feedback" ON feedbacks;
CREATE POLICY "Users insert own feedback"
  ON feedbacks FOR INSERT
  WITH CHECK (submitted_by = auth.uid());

DROP POLICY IF EXISTS "Users read own feedback" ON feedbacks;
CREATE POLICY "Users read own feedback"
  ON feedbacks FOR SELECT
  USING (submitted_by = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "Admin manages feedback" ON feedbacks;
CREATE POLICY "Admin manages feedback"
  ON feedbacks FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Registration needs to display active studies before login.
DROP POLICY IF EXISTS "Public can read active studies for registration" ON studies;
CREATE POLICY "Public can read active studies for registration"
  ON studies FOR SELECT
  USING (study_status = 'active');

-- Automatically connect an investigator to the study selected during signup.
-- The app passes study_code in auth metadata.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  requested_role user_role;
  requested_study_code text;
  requested_study_id uuid;
BEGIN
  requested_role := coalesce((new.raw_user_meta_data->>'role')::user_role, 'investigator');
  requested_study_code := nullif(new.raw_user_meta_data->>'study_code', '');

  INSERT INTO user_profiles (id, email, full_name, role, is_active)
  VALUES (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    requested_role,
    true
  )
  ON CONFLICT (id) DO UPDATE
    SET email = excluded.email,
        full_name = excluded.full_name,
        role = excluded.role,
        updated_at = now();

  IF requested_role = 'investigator' AND requested_study_code IS NOT NULL THEN
    SELECT id INTO requested_study_id
    FROM studies
    WHERE study_code = requested_study_code
      AND study_status = 'active'
    LIMIT 1;

    IF requested_study_id IS NOT NULL THEN
      INSERT INTO study_investigators (study_id, investigator_id)
      VALUES (requested_study_id, new.id)
      ON CONFLICT (study_id, investigator_id) DO NOTHING;
    END IF;
  END IF;

  RETURN new;
END;
$$;

-- Storage bucket reminder:
-- Create these buckets:
--   investigation-docs     private, used with signed URLs
--   feedback-attachments   public if admin inbox should use getPublicUrl()
-- For private feedback attachments, change the app to create signed URLs.
