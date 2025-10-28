-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Enum types
do $$
begin
  if not exists (select 1 from pg_type where typname = 'lesson_type') then
    create type public.lesson_type as enum ('lesson', 'exercise');
  end if;
  if not exists (select 1 from pg_type where typname = 'enrollment_status') then
    create type public.enrollment_status as enum ('active', 'completed');
  end if;
end
$$;

-- Profiles
create table if not exists public.profiles (
  id uuid primary key default extensions.uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  preferred_language text not null default 'en',
  xp_total integer not null default 0,
  is_admin boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create unique index if not exists profiles_user_id_idx on public.profiles(user_id);

alter table public.profiles enable row level security;

create policy "Profiles are readable by owner" on public.profiles
  for select
  using (auth.uid() = user_id);

create policy "Profiles are insertable by owner" on public.profiles
  for insert with check (auth.uid() = user_id);

create policy "Profiles are updatable by owner" on public.profiles
  for update using (auth.uid() = user_id);

-- Courses
create table if not exists public.courses (
  id uuid primary key default extensions.uuid_generate_v4(),
  slug text not null unique,
  title_en text not null,
  title_es text not null,
  description_en text not null,
  description_es text not null,
  cover_image_url text,
  total_xp integer not null default 0,
  order_index integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.courses enable row level security;

create policy "Courses readable by anyone" on public.courses
  for select using (true);

-- Modules
create table if not exists public.modules (
  id uuid primary key default extensions.uuid_generate_v4(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title_en text not null,
  title_es text not null,
  description_en text not null,
  description_es text not null,
  xp_value integer not null default 100,
  order_index integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create index if not exists modules_course_idx on public.modules(course_id);

alter table public.modules enable row level security;

create policy "Modules readable by anyone" on public.modules
  for select using (true);

-- Lessons
create table if not exists public.lessons (
  id uuid primary key default extensions.uuid_generate_v4(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title_en text not null,
  title_es text not null,
  description_en text not null,
  description_es text not null,
  lesson_type lesson_type not null default 'lesson',
  video_url text,
  storage_path text,
  order_index integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create index if not exists lessons_module_idx on public.lessons(module_id);

alter table public.lessons enable row level security;

create policy "Lessons readable by anyone" on public.lessons
  for select using (true);

-- Enrollments
create table if not exists public.enrollments (
  id uuid primary key default extensions.uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  status enrollment_status not null default 'active',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  unique (user_id, course_id)
);

alter table public.enrollments enable row level security;

create policy "Enrollments readable by owner" on public.enrollments
  for select using (auth.uid() = user_id);

create policy "Enrollments upsert by owner" on public.enrollments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Lesson states
create table if not exists public.lesson_states (
  id uuid primary key default extensions.uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamp with time zone,
  updated_at timestamp with time zone not null default now(),
  unique (user_id, lesson_id)
);

alter table public.lesson_states enable row level security;

create policy "Lesson states by owner" on public.lesson_states
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Progresses
create table if not exists public.progresses (
  id uuid primary key default extensions.uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  module_id uuid references public.modules(id) on delete cascade,
  percent_complete integer not null default 0,
  xp_earned integer not null default 0,
  updated_at timestamp with time zone not null default now(),
  unique (user_id, course_id, module_id)
);

alter table public.progresses enable row level security;

create policy "Progress readable by owner" on public.progresses
  for select using (auth.uid() = user_id);

create policy "Progress upsert by owner" on public.progresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Badges
create table if not exists public.badges (
  id uuid primary key default extensions.uuid_generate_v4(),
  slug text not null unique,
  title_en text not null,
  title_es text not null,
  description_en text not null,
  description_es text not null,
  xp_reward integer not null default 0,
  created_at timestamp with time zone not null default now()
);

alter table public.badges enable row level security;

create policy "Badges readable by anyone" on public.badges
  for select using (true);

-- Awards
create table if not exists public.awards (
  id uuid primary key default extensions.uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  awarded_at timestamp with time zone not null default now(),
  unique (user_id, badge_id)
);

alter table public.awards enable row level security;

create policy "Awards readable by owner" on public.awards
  for select using (auth.uid() = user_id);

create policy "Awards insert by owner" on public.awards
  for insert with check (auth.uid() = user_id);
