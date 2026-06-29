# ThesisCRF

ThesisCRF is a Next.js and Supabase application for managing MD thesis case record forms in the PG Department of Kayachikitsa.

It supports investigator registration, guide review, admin oversight, patient enrolment, CRF entry, print/export workflows, investigation uploads, and feedback requests.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Supabase Auth, Database, RLS, and Storage
- pnpm

## Local Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run database migrations in Supabase SQL Editor in order:

```text
src/database/migrations/001_initial_schema.sql
src/database/migrations/002_teacher_rls.sql
src/database/migrations/003_app_schema_sync.sql
```

4. Create required Supabase Storage buckets:

```text
attachments
exports
feedback-attachments
investigation-docs
```

5. Start the app:

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Important Workflows

- Investigators register from `/register?role=investigator` and choose their study.
- The database trigger in `003_app_schema_sync.sql` links new investigators to the selected active study.
- Guides register from `/register?role=teacher`.
- Admins assign guide-study links from the user management screen.
- Investigators submit CRFs for review.
- Guides approve or return CRFs with notes.

## Quality Checks

Run these before deployment:

```bash
pnpm lint
pnpm build
```

If building from a OneDrive folder fails with file-locking errors in `.next`, move the project to a non-synced folder or delete `.next` after stopping all local dev servers.

## Deployment

The app can be deployed on Vercel. Add the same Supabase environment variables in Vercel project settings.

Before treating a deployment as production-ready, confirm:

- migrations are applied to the production Supabase project
- required storage buckets exist
- `pnpm lint` passes
- `pnpm build` passes
- a new investigator can register and lands on the correct assigned study
