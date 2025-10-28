# Tango Rápido

Tango Rápido is a high-contrast, keyboard-friendly learning portal to help older adults master tango with simple flows, short videos, and light gamification. It is built with Next.js (App Router), TypeScript, Tailwind CSS, and Supabase (Auth, Postgres, Storage, RLS).

## Features

- Email/password auth with Supabase Auth and protected routes via middleware.
- Courses → Modules → Lessons hierarchy with roadmap, course overview, module view, and lesson player.
- Lesson completion tracking with persisted progress, XP rollups, and automatic badge awards.
- Profile dashboard displaying XP, completions, and badge progress.
- EN/ES language toggle stored in cookie + profile preference.
- Accessible UI: large typography, clear contrast, visible focus states, skip navigation, full keyboard control.
- Admin studio (`/admin`) for creating/updating/deleting courses, modules, and lessons (service role key required).

## Local Setup

1. **Install dependencies**
   ```bash
   npm install
   ```
   (You can substitute `pnpm` or `yarn`.)

2. **Environment variables**  
   Copy `.env.example` to `.env.local` and fill in your Supabase credentials.
   ```bash
   cp .env.example .env.local
   ```
   Required keys:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (for admin actions and automatic badge provisioning)
   - `NEXT_PUBLIC_SITE_URL` (used in email magic-link redirects; defaults to `http://localhost:3000`)
   - `NEXT_PUBLIC_SUPABASE_LESSON_BUCKET` (storage bucket for lesson media, default `lesson-media`)

3. **Supabase schema & security**
   - Create a new Supabase project.
   - Apply the initial migration with `supabase db push` (uses files in `supabase/migrations/`). This seeds tables, enums, indexes, and RLS policies.
   - Create a storage bucket matching `NEXT_PUBLIC_SUPABASE_LESSON_BUCKET` (default `lesson-media`). Grant authenticated users read access; uploads happen via the admin studio or direct Supabase dashboard.
   - Add initial badge rows by either letting the app seed them (service role key must be set) or inserting records manually. The app will upsert default badges the first time a lesson is completed when the service role key is configured.

4. **Development server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`.

5. **Admin access**
   - Mark desired users as admins by setting `is_admin = true` in the `profiles` table.
   - Ensure `SUPABASE_SERVICE_ROLE_KEY` is present locally; admin mutations are routed through the service client.

## Project Structure

```
app/                    # Next.js App Router routes, layouts, server components
  (auth)/               # Login/Signup flows with server actions
  admin/                # Admin studio with CRUD forms (service role only)
  course/               # Course overview & module pages
  lesson/               # Lesson detail/player + mark complete
  profile/              # User profile with XP/badge summary
  roadmap/              # Main learner dashboard
components/             # Shared UI components, forms, language provider, etc.
lib/                    # Supabase clients, auth helpers, i18n, progress, gamification logic
supabase/migrations/    # Postgres schema & RLS policies (applied via `supabase db push`)
types/database.ts       # Supabase typed API surface for strongly typed queries
```

## Workflows

- **Language toggle** — Stored in cookie + synced to profile. Server-rendered pages respect the saved language for titles/descriptions.
- **Lesson completion** — Marks `lesson_states`, recalculates module/course progress, updates XP totals, and awards badges before revalidating affected pages.
- **Gamification** — Module XP accumulates towards course XP; badges include First Steps, Quarter Milestone, Module Master, and Lesson Streak. Profile XP reflects summed course progress.
- **Admin** — CRUD forms leverage the service role client; every mutation revalidates roadmap/course/module/lesson routes to keep learners in sync.

## Testing & Next Steps

- Run `npm run lint` to check TypeScript/ESLint status.
- Seed real course/module/lesson content via the admin studio or SQL.
- Connect storage objects (videos/thumbnails) and ensure signed URLs resolve.
- Configure Supabase Auth email templates / disable email confirmation if you want instant login after signup.
- Consider adding automated tests (Playwright / Jest) once data stabilises.

Enjoy helping dancers glide onto the floor faster! 💃🕺
