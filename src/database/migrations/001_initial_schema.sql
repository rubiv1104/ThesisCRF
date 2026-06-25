-- =============================================================
-- ThesisCRF – Initial Database Schema
-- Version: 1.0
-- Run this in the Supabase SQL Editor (Project > SQL Editor)
-- =============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- =============================================================
-- ENUMS
-- =============================================================

create type user_role as enum ('admin', 'investigator');
create type study_status as enum ('active', 'completed', 'archived');
create type patient_status as enum ('active', 'completed', 'dropped', 'withdrawn');
create type crf_status as enum ('draft', 'submitted', 'correction_required', 'approved', 'locked');
create type gender as enum ('male', 'female', 'other');
create type correction_status as enum ('pending', 'resolved');
create type visit_status as enum ('scheduled', 'completed', 'missed');
create type file_type as enum ('pdf', 'png', 'jpeg', 'docx');

-- =============================================================
-- TABLE 1: USER PROFILES
-- Extends Supabase Auth users with application-specific fields
-- =============================================================

create table user_profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null unique,
  full_name   text not null,
  role        user_role not null default 'investigator',
  department  text,
  status      text not null default 'active' check (status in ('active', 'inactive')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- =============================================================
-- TABLE 2: STUDIES
-- One row per thesis / clinical study
-- =============================================================

create table studies (
  id              uuid primary key default uuid_generate_v4(),
  study_code      text not null unique,           -- e.g. ECZ2026
  study_title     text not null,
  scholar_name    text not null,
  guide_name      text not null,
  co_guide_name   text,
  department      text not null,
  sample_size     int not null check (sample_size > 0),
  study_status    study_status not null default 'active',
  created_by      uuid not null references user_profiles(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- =============================================================
-- TABLE 3: STUDY INVESTIGATORS
-- Links investigators to studies (one investigator per study in V1)
-- =============================================================

create table study_investigators (
  id              uuid primary key default uuid_generate_v4(),
  study_id        uuid not null references studies(id) on delete cascade,
  investigator_id uuid not null references user_profiles(id) on delete cascade,
  created_at      timestamptz not null default now(),
  unique (study_id, investigator_id)
);

-- =============================================================
-- TABLE 4: RESEARCH GROUPS
-- =============================================================

create table research_groups (
  id          uuid primary key default uuid_generate_v4(),
  study_id    uuid not null references studies(id) on delete cascade,
  group_name  text not null,
  description text,
  created_at  timestamptz not null default now()
);

-- =============================================================
-- TABLE 5: PATIENTS
-- One row per enrolled patient
-- =============================================================

create table patients (
  id                  uuid primary key default uuid_generate_v4(),
  study_id            uuid not null references studies(id),
  research_group_id   uuid not null references research_groups(id),
  study_patient_id    text not null,               -- e.g. ECZ2026-001
  hospital_cr_number  text not null,
  opd_number          text not null,
  patient_name        text not null,
  age                 int not null check (age between 0 and 120),
  gender              gender not null,
  phone               text check (phone ~ '^[0-9]{10}$'),
  status              patient_status not null default 'active',
  created_by          uuid not null references user_profiles(id),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (study_id, study_patient_id),
  unique (study_id, hospital_cr_number),
  unique (study_id, opd_number)
);

-- =============================================================
-- TABLE 6: CRFS
-- One CRF per patient (never duplicated)
-- =============================================================

create table crfs (
  id                uuid primary key default uuid_generate_v4(),
  patient_id        uuid not null unique references patients(id) on delete cascade,
  template_version  text not null default '1.0',
  status            crf_status not null default 'draft',
  submitted         boolean not null default false,
  approved          boolean not null default false,
  locked            boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- =============================================================
-- TABLE 7: CRF SECTIONS
-- Named sections within a CRF (e.g., Demographics, History)
-- =============================================================

create table crf_sections (
  id            uuid primary key default uuid_generate_v4(),
  crf_id        uuid not null references crfs(id) on delete cascade,
  section_name  text not null,
  section_order int not null,
  completed     boolean not null default false,
  locked        boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (crf_id, section_name)
);

-- =============================================================
-- TABLE 8: CRF RESPONSES
-- Every field answer lives here — the core data store
-- =============================================================

create table crf_responses (
  id            uuid primary key default uuid_generate_v4(),
  section_id    uuid not null references crf_sections(id) on delete cascade,
  field_key     text not null,
  field_label   text not null,
  field_type    text not null,       -- text | number | date | select | radio | checkbox | textarea
  response      text,
  visit_number  int not null default 0,  -- 0 = baseline
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (section_id, field_key, visit_number)
);

-- =============================================================
-- TABLE 9: FOLLOW-UPS
-- Controls which visits are scheduled / completed
-- =============================================================

create table follow_ups (
  id          uuid primary key default uuid_generate_v4(),
  patient_id  uuid not null references patients(id) on delete cascade,
  visit_name  text not null,          -- Baseline, Day 15, Day 30 …
  visit_date  date,
  status      visit_status not null default 'scheduled',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (patient_id, visit_name)
);

-- =============================================================
-- TABLE 10: INVESTIGATIONS
-- Lab values per visit
-- =============================================================

create table investigations (
  id                  uuid primary key default uuid_generate_v4(),
  patient_id          uuid not null references patients(id) on delete cascade,
  visit_number        int not null default 0,
  investigation_name  text not null,
  result              text,
  unit                text,
  reference_range     text,
  remarks             text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- =============================================================
-- TABLE 11: ATTACHMENTS
-- Files stored in Supabase Storage
-- =============================================================

create table attachments (
  id           uuid primary key default uuid_generate_v4(),
  patient_id   uuid not null references patients(id) on delete cascade,
  visit_number int not null default 0,
  file_name    text not null,
  file_url     text not null,
  file_type    file_type not null,
  uploaded_by  uuid not null references user_profiles(id),
  uploaded_at  timestamptz not null default now()
);

-- =============================================================
-- TABLE 12: MEDICATIONS (STUDY / CONCOMITANT / RESCUE)
-- =============================================================

create table medications (
  id            uuid primary key default uuid_generate_v4(),
  patient_id    uuid not null references patients(id) on delete cascade,
  visit_number  int not null default 0,
  med_type      text not null check (med_type in ('study', 'concomitant', 'rescue')),
  medicine      text not null,
  dose          text,
  frequency     text,
  duration      text,
  reason        text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =============================================================
-- TABLE 13: ADVERSE DRUG REACTIONS (ADR)
-- =============================================================

create table adrs (
  id            uuid primary key default uuid_generate_v4(),
  patient_id    uuid not null references patients(id) on delete cascade,
  date          date not null,
  complaint     text not null,
  severity      text not null check (severity in ('mild', 'moderate', 'severe')),
  action_taken  text,
  remarks       text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =============================================================
-- TABLE 14: QUESTIONNAIRES (future: DLQI, EASI, SCORAD)
-- =============================================================

create table questionnaires (
  id                   uuid primary key default uuid_generate_v4(),
  study_id             uuid not null references studies(id) on delete cascade,
  questionnaire_name   text not null,
  version              text not null default '1.0',
  active               boolean not null default true,
  created_at           timestamptz not null default now()
);

create table questionnaire_questions (
  id                uuid primary key default uuid_generate_v4(),
  questionnaire_id  uuid not null references questionnaires(id) on delete cascade,
  question          text not null,
  question_type     text not null,   -- radio | checkbox | scale | text
  display_order     int not null,
  required          boolean not null default true
);

create table questionnaire_responses (
  id                uuid primary key default uuid_generate_v4(),
  patient_id        uuid not null references patients(id) on delete cascade,
  visit_number      int not null default 0,
  question_id       uuid not null references questionnaire_questions(id),
  answer            text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (patient_id, visit_number, question_id)
);

-- =============================================================
-- TABLE 15: CORRECTIONS
-- Admin sends correction requests; investigator resolves them
-- =============================================================

create table corrections (
  id           uuid primary key default uuid_generate_v4(),
  crf_id       uuid not null references crfs(id) on delete cascade,
  section      text not null,
  comment      text not null,
  status       correction_status not null default 'pending',
  created_by   uuid not null references user_profiles(id),
  resolved_by  uuid references user_profiles(id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- =============================================================
-- TABLE 16: AUDIT LOGS
-- Immutable record of every change
-- =============================================================

create table audit_logs (
  id          uuid primary key default uuid_generate_v4(),
  table_name  text not null,
  record_id   uuid not null,
  field_name  text not null,
  old_value   text,
  new_value   text,
  user_id     uuid not null references user_profiles(id),
  timestamp   timestamptz not null default now()
);

-- =============================================================
-- TABLE 17: EXPORT HISTORY
-- =============================================================

create table export_history (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references user_profiles(id),
  study_id     uuid references studies(id),
  export_type  text not null check (export_type in ('xlsx', 'docx', 'pdf', 'csv')),
  created_at   timestamptz not null default now()
);

-- =============================================================
-- TABLE 18: SYSTEM SETTINGS
-- =============================================================

create table system_settings (
  id      uuid primary key default uuid_generate_v4(),
  setting text not null unique,
  value   text not null
);

-- =============================================================
-- INDEXES
-- =============================================================

create index idx_patients_study_id        on patients(study_id);
create index idx_patients_cr_number       on patients(hospital_cr_number);
create index idx_patients_opd_number      on patients(opd_number);
create index idx_patients_study_patient_id on patients(study_patient_id);
create index idx_patients_status          on patients(status);
create index idx_crfs_patient_id          on crfs(patient_id);
create index idx_crf_sections_crf_id      on crf_sections(crf_id);
create index idx_crf_responses_section_id on crf_responses(section_id);
create index idx_follow_ups_patient_id    on follow_ups(patient_id);
create index idx_investigations_patient_id on investigations(patient_id);
create index idx_attachments_patient_id   on attachments(patient_id);
create index idx_corrections_crf_id       on corrections(crf_id);
create index idx_audit_logs_record_id     on audit_logs(record_id);
create index idx_audit_logs_user_id       on audit_logs(user_id);
create index idx_audit_logs_timestamp     on audit_logs(timestamp);

-- =============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================================

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_user_profiles_updated_at  before update on user_profiles  for each row execute function set_updated_at();
create trigger trg_studies_updated_at        before update on studies        for each row execute function set_updated_at();
create trigger trg_patients_updated_at       before update on patients       for each row execute function set_updated_at();
create trigger trg_crfs_updated_at           before update on crfs           for each row execute function set_updated_at();
create trigger trg_crf_sections_updated_at   before update on crf_sections   for each row execute function set_updated_at();
create trigger trg_crf_responses_updated_at  before update on crf_responses  for each row execute function set_updated_at();
create trigger trg_follow_ups_updated_at     before update on follow_ups     for each row execute function set_updated_at();
create trigger trg_investigations_updated_at before update on investigations  for each row execute function set_updated_at();
create trigger trg_medications_updated_at    before update on medications    for each row execute function set_updated_at();
create trigger trg_adrs_updated_at           before update on adrs           for each row execute function set_updated_at();
create trigger trg_corrections_updated_at    before update on corrections    for each row execute function set_updated_at();

-- =============================================================
-- AUTO-CREATE USER PROFILE ON SIGNUP
-- =============================================================

create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into user_profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'investigator')
  );
  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================

alter table user_profiles           enable row level security;
alter table studies                  enable row level security;
alter table study_investigators      enable row level security;
alter table research_groups          enable row level security;
alter table patients                 enable row level security;
alter table crfs                     enable row level security;
alter table crf_sections             enable row level security;
alter table crf_responses            enable row level security;
alter table follow_ups               enable row level security;
alter table investigations           enable row level security;
alter table attachments              enable row level security;
alter table medications              enable row level security;
alter table adrs                     enable row level security;
alter table questionnaires           enable row level security;
alter table questionnaire_questions  enable row level security;
alter table questionnaire_responses  enable row level security;
alter table corrections              enable row level security;
alter table audit_logs               enable row level security;
alter table export_history           enable row level security;

-- Helper: is the current user an admin?
create or replace function is_admin()
returns boolean language sql security definer as $$
  select exists (
    select 1 from user_profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Helper: studies the current investigator can access
create or replace function investigator_study_ids()
returns setof uuid language sql security definer as $$
  select study_id from study_investigators where investigator_id = auth.uid();
$$;

-- ---- user_profiles ----
create policy "Users can read own profile"
  on user_profiles for select using (id = auth.uid() or is_admin());

create policy "Admin can manage all profiles"
  on user_profiles for all using (is_admin());

-- ---- studies ----
create policy "Investigators see own studies"
  on studies for select
  using (is_admin() or id in (select investigator_study_ids()));

create policy "Admin manages studies"
  on studies for all using (is_admin());

-- ---- study_investigators ----
create policy "Anyone in study can see investigators"
  on study_investigators for select
  using (is_admin() or study_id in (select investigator_study_ids()));

create policy "Admin manages study investigators"
  on study_investigators for all using (is_admin());

-- ---- research_groups ----
create policy "Read research groups for own studies"
  on research_groups for select
  using (is_admin() or study_id in (select investigator_study_ids()));

create policy "Admin manages research groups"
  on research_groups for all using (is_admin());

-- ---- patients ----
create policy "Investigators see own patients"
  on patients for select
  using (is_admin() or study_id in (select investigator_study_ids()));

create policy "Investigators insert own patients"
  on patients for insert
  with check (study_id in (select investigator_study_ids()));

create policy "Investigators update own unlocked patients"
  on patients for update
  using (study_id in (select investigator_study_ids()))
  with check (study_id in (select investigator_study_ids()));

create policy "Admin full patient access"
  on patients for all using (is_admin());

-- ---- crfs ----
create policy "Investigators see own CRFs"
  on crfs for select
  using (
    is_admin() or
    patient_id in (
      select id from patients where study_id in (select investigator_study_ids())
    )
  );

create policy "Investigators manage own unlocked CRFs"
  on crfs for insert
  with check (
    patient_id in (
      select id from patients where study_id in (select investigator_study_ids())
    )
  );

create policy "Investigators update own unlocked CRFs"
  on crfs for update
  using (
    not locked and
    patient_id in (
      select id from patients where study_id in (select investigator_study_ids())
    )
  );

create policy "Admin full CRF access"
  on crfs for all using (is_admin());

-- ---- crf_sections ----
create policy "Sections readable by CRF owner"
  on crf_sections for select
  using (
    is_admin() or
    crf_id in (
      select c.id from crfs c
      join patients p on p.id = c.patient_id
      where p.study_id in (select investigator_study_ids())
    )
  );

create policy "Sections writable if CRF not locked"
  on crf_sections for all
  using (
    is_admin() or
    crf_id in (
      select c.id from crfs c
      join patients p on p.id = c.patient_id
      where p.study_id in (select investigator_study_ids()) and not c.locked
    )
  );

-- ---- crf_responses ----
create policy "Responses readable by CRF owner"
  on crf_responses for select
  using (
    is_admin() or
    section_id in (
      select s.id from crf_sections s
      join crfs c on c.id = s.crf_id
      join patients p on p.id = c.patient_id
      where p.study_id in (select investigator_study_ids())
    )
  );

create policy "Responses writable if section not locked"
  on crf_responses for all
  using (
    is_admin() or
    section_id in (
      select s.id from crf_sections s
      join crfs c on c.id = s.crf_id
      join patients p on p.id = c.patient_id
      where p.study_id in (select investigator_study_ids()) and not s.locked
    )
  );

-- ---- follow_ups ----
create policy "Own follow-ups"
  on follow_ups for all
  using (
    is_admin() or
    patient_id in (
      select id from patients where study_id in (select investigator_study_ids())
    )
  );

-- ---- investigations ----
create policy "Own investigations"
  on investigations for all
  using (
    is_admin() or
    patient_id in (
      select id from patients where study_id in (select investigator_study_ids())
    )
  );

-- ---- attachments ----
create policy "Own attachments"
  on attachments for all
  using (
    is_admin() or
    patient_id in (
      select id from patients where study_id in (select investigator_study_ids())
    )
  );

-- ---- medications ----
create policy "Own medications"
  on medications for all
  using (
    is_admin() or
    patient_id in (
      select id from patients where study_id in (select investigator_study_ids())
    )
  );

-- ---- adrs ----
create policy "Own ADRs"
  on adrs for all
  using (
    is_admin() or
    patient_id in (
      select id from patients where study_id in (select investigator_study_ids())
    )
  );

-- ---- corrections ----
create policy "Investigator sees own corrections"
  on corrections for select
  using (
    is_admin() or
    crf_id in (
      select c.id from crfs c
      join patients p on p.id = c.patient_id
      where p.study_id in (select investigator_study_ids())
    )
  );

create policy "Investigator resolves own corrections"
  on corrections for update
  using (
    crf_id in (
      select c.id from crfs c
      join patients p on p.id = c.patient_id
      where p.study_id in (select investigator_study_ids())
    )
  );

create policy "Admin manages corrections"
  on corrections for all using (is_admin());

-- ---- audit_logs ----
create policy "Admin reads all audit logs"
  on audit_logs for select using (is_admin());

create policy "Insert audit logs (system)"
  on audit_logs for insert with check (true);

-- ---- export_history ----
create policy "Own export history"
  on export_history for all using (is_admin() or user_id = auth.uid());

-- =============================================================
-- STORAGE BUCKETS (run via Supabase dashboard or API)
-- =============================================================
-- Create these buckets in Storage > New Bucket:
--   attachments  (private)
--   exports      (private)
--
-- Bucket RLS policies:
--   attachments: authenticated users can upload to studies/{study_id}/patients/{patient_id}/
--   exports:     authenticated users can read their own exports
