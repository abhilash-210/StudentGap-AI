# GapFinder AI — Security & Privacy Architecture

This document describes the security model, authorization mechanisms, and data protection practices implemented across GapFinder AI.

---

## 1. Secrets Management
- **Client-Side Secrets**: Only public environment variables prefixed with `NEXT_PUBLIC_` (such as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are exposed to the client bundle.
- **Server-Side Secrets**: Administrative credentials (such as `SUPABASE_SERVICE_ROLE_KEY` or `DATABASE_URL`) are restricted to server-side execution and never included in client code.
- **Git Hygiene**: Local `.env*` files are strictly excluded from source control via `.gitignore`. A sanitized `.env.example` file is provided with non-sensitive placeholder values.

---

## 2. Authentication & Role-Based Access Control (RBAC)

The application enforces a dual role model:
- **`STUDENT`**:
  - Can browse and enroll in courses.
  - Can view shared course materials uploaded by professors.
  - Can upload personal study documents marked private to their account.
  - Can take diagnostic quizzes and generate private gap reports and revision plans.
  - Cannot access other students' private attempts, reports, or documents.
  - Cannot access professor cohort analytics or student management rosters.
- **`TEACHER`**:
  - Assigned to specific courses (e.g., CS201, CS202, CS301).
  - Can upload course-wide shared study materials.
  - Can inspect enrolled student rosters and individual diagnostic gap summaries for students in their assigned courses.
  - Can analyze aggregated cohort-level struggle heatmaps and common misconception distributions.
  - Cannot read students' personal private study documents.

---

## 3. Data Isolation & Privacy

- **Row Level Security (RLS)**: PostgreSQL policies defined in `supabase/schema.sql` restrict rows based on `auth.uid() = user_id`.
- **Private Chunks**: Material chunks tagged with `is_private = true` and an `owner_id` are excluded from searches performed by other users.
- **Public Entry Experience**: Unauthenticated visitors on the landing page have no access to student scores, reports, or class analytics.

---

## 4. Evaluator Demo Account Notice

The demo accounts (`prof.sarah@gapfinder.demo`, `alex.chen@gapfinder.demo`, `priya.sharma@gapfinder.demo`) are provided solely for academic evaluation and testing purposes.

- These accounts operate on pre-seeded synthetic benchmark data.
- Evaluators and testers should **never** store sensitive personal data, real student identifiers, or production credentials in these demonstration profiles.
- For production deployment, demo account shortcuts should be disabled by setting `NEXT_PUBLIC_DEMO_MODE=false`.
