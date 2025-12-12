drop extension if exists "pg_net";

revoke delete on table "public"."awards" from "anon";

revoke insert on table "public"."awards" from "anon";

revoke references on table "public"."awards" from "anon";

revoke select on table "public"."awards" from "anon";

revoke trigger on table "public"."awards" from "anon";

revoke truncate on table "public"."awards" from "anon";

revoke update on table "public"."awards" from "anon";

revoke delete on table "public"."awards" from "authenticated";

revoke insert on table "public"."awards" from "authenticated";

revoke references on table "public"."awards" from "authenticated";

revoke select on table "public"."awards" from "authenticated";

revoke trigger on table "public"."awards" from "authenticated";

revoke truncate on table "public"."awards" from "authenticated";

revoke update on table "public"."awards" from "authenticated";

revoke delete on table "public"."awards" from "service_role";

revoke insert on table "public"."awards" from "service_role";

revoke references on table "public"."awards" from "service_role";

revoke select on table "public"."awards" from "service_role";

revoke trigger on table "public"."awards" from "service_role";

revoke truncate on table "public"."awards" from "service_role";

revoke update on table "public"."awards" from "service_role";

revoke delete on table "public"."badges" from "anon";

revoke insert on table "public"."badges" from "anon";

revoke references on table "public"."badges" from "anon";

revoke select on table "public"."badges" from "anon";

revoke trigger on table "public"."badges" from "anon";

revoke truncate on table "public"."badges" from "anon";

revoke update on table "public"."badges" from "anon";

revoke delete on table "public"."badges" from "authenticated";

revoke insert on table "public"."badges" from "authenticated";

revoke references on table "public"."badges" from "authenticated";

revoke select on table "public"."badges" from "authenticated";

revoke trigger on table "public"."badges" from "authenticated";

revoke truncate on table "public"."badges" from "authenticated";

revoke update on table "public"."badges" from "authenticated";

revoke delete on table "public"."badges" from "service_role";

revoke insert on table "public"."badges" from "service_role";

revoke references on table "public"."badges" from "service_role";

revoke select on table "public"."badges" from "service_role";

revoke trigger on table "public"."badges" from "service_role";

revoke truncate on table "public"."badges" from "service_role";

revoke update on table "public"."badges" from "service_role";

revoke delete on table "public"."courses" from "anon";

revoke insert on table "public"."courses" from "anon";

revoke references on table "public"."courses" from "anon";

revoke trigger on table "public"."courses" from "anon";

revoke truncate on table "public"."courses" from "anon";

revoke update on table "public"."courses" from "anon";

revoke delete on table "public"."courses" from "authenticated";

revoke insert on table "public"."courses" from "authenticated";

revoke references on table "public"."courses" from "authenticated";

revoke trigger on table "public"."courses" from "authenticated";

revoke truncate on table "public"."courses" from "authenticated";

revoke update on table "public"."courses" from "authenticated";

revoke delete on table "public"."courses" from "service_role";

revoke insert on table "public"."courses" from "service_role";

revoke references on table "public"."courses" from "service_role";

revoke trigger on table "public"."courses" from "service_role";

revoke truncate on table "public"."courses" from "service_role";

revoke update on table "public"."courses" from "service_role";

revoke delete on table "public"."enrollments" from "anon";

revoke insert on table "public"."enrollments" from "anon";

revoke references on table "public"."enrollments" from "anon";

revoke select on table "public"."enrollments" from "anon";

revoke trigger on table "public"."enrollments" from "anon";

revoke truncate on table "public"."enrollments" from "anon";

revoke update on table "public"."enrollments" from "anon";

revoke delete on table "public"."enrollments" from "authenticated";

revoke insert on table "public"."enrollments" from "authenticated";

revoke references on table "public"."enrollments" from "authenticated";

revoke select on table "public"."enrollments" from "authenticated";

revoke trigger on table "public"."enrollments" from "authenticated";

revoke truncate on table "public"."enrollments" from "authenticated";

revoke update on table "public"."enrollments" from "authenticated";

revoke delete on table "public"."enrollments" from "service_role";

revoke insert on table "public"."enrollments" from "service_role";

revoke references on table "public"."enrollments" from "service_role";

revoke select on table "public"."enrollments" from "service_role";

revoke trigger on table "public"."enrollments" from "service_role";

revoke truncate on table "public"."enrollments" from "service_role";

revoke update on table "public"."enrollments" from "service_role";

revoke delete on table "public"."lesson_exercises" from "anon";

revoke insert on table "public"."lesson_exercises" from "anon";

revoke references on table "public"."lesson_exercises" from "anon";

revoke trigger on table "public"."lesson_exercises" from "anon";

revoke truncate on table "public"."lesson_exercises" from "anon";

revoke update on table "public"."lesson_exercises" from "anon";

revoke delete on table "public"."lesson_exercises" from "authenticated";

revoke insert on table "public"."lesson_exercises" from "authenticated";

revoke references on table "public"."lesson_exercises" from "authenticated";

revoke trigger on table "public"."lesson_exercises" from "authenticated";

revoke truncate on table "public"."lesson_exercises" from "authenticated";

revoke update on table "public"."lesson_exercises" from "authenticated";

revoke delete on table "public"."lesson_exercises" from "service_role";

revoke insert on table "public"."lesson_exercises" from "service_role";

revoke references on table "public"."lesson_exercises" from "service_role";

revoke trigger on table "public"."lesson_exercises" from "service_role";

revoke truncate on table "public"."lesson_exercises" from "service_role";

revoke update on table "public"."lesson_exercises" from "service_role";

revoke delete on table "public"."lesson_external_links" from "anon";

revoke insert on table "public"."lesson_external_links" from "anon";

revoke references on table "public"."lesson_external_links" from "anon";

revoke trigger on table "public"."lesson_external_links" from "anon";

revoke truncate on table "public"."lesson_external_links" from "anon";

revoke update on table "public"."lesson_external_links" from "anon";

revoke delete on table "public"."lesson_external_links" from "authenticated";

revoke insert on table "public"."lesson_external_links" from "authenticated";

revoke references on table "public"."lesson_external_links" from "authenticated";

revoke trigger on table "public"."lesson_external_links" from "authenticated";

revoke truncate on table "public"."lesson_external_links" from "authenticated";

revoke update on table "public"."lesson_external_links" from "authenticated";

revoke delete on table "public"."lesson_external_links" from "service_role";

revoke insert on table "public"."lesson_external_links" from "service_role";

revoke references on table "public"."lesson_external_links" from "service_role";

revoke trigger on table "public"."lesson_external_links" from "service_role";

revoke truncate on table "public"."lesson_external_links" from "service_role";

revoke update on table "public"."lesson_external_links" from "service_role";

revoke delete on table "public"."lesson_states" from "anon";

revoke insert on table "public"."lesson_states" from "anon";

revoke references on table "public"."lesson_states" from "anon";

revoke select on table "public"."lesson_states" from "anon";

revoke trigger on table "public"."lesson_states" from "anon";

revoke truncate on table "public"."lesson_states" from "anon";

revoke update on table "public"."lesson_states" from "anon";

revoke delete on table "public"."lesson_states" from "authenticated";

revoke insert on table "public"."lesson_states" from "authenticated";

revoke references on table "public"."lesson_states" from "authenticated";

revoke select on table "public"."lesson_states" from "authenticated";

revoke trigger on table "public"."lesson_states" from "authenticated";

revoke truncate on table "public"."lesson_states" from "authenticated";

revoke update on table "public"."lesson_states" from "authenticated";

revoke delete on table "public"."lesson_states" from "service_role";

revoke insert on table "public"."lesson_states" from "service_role";

revoke references on table "public"."lesson_states" from "service_role";

revoke select on table "public"."lesson_states" from "service_role";

revoke trigger on table "public"."lesson_states" from "service_role";

revoke truncate on table "public"."lesson_states" from "service_role";

revoke update on table "public"."lesson_states" from "service_role";

revoke delete on table "public"."lessons" from "anon";

revoke insert on table "public"."lessons" from "anon";

revoke references on table "public"."lessons" from "anon";

revoke trigger on table "public"."lessons" from "anon";

revoke truncate on table "public"."lessons" from "anon";

revoke update on table "public"."lessons" from "anon";

revoke delete on table "public"."lessons" from "authenticated";

revoke insert on table "public"."lessons" from "authenticated";

revoke references on table "public"."lessons" from "authenticated";

revoke trigger on table "public"."lessons" from "authenticated";

revoke truncate on table "public"."lessons" from "authenticated";

revoke update on table "public"."lessons" from "authenticated";

revoke delete on table "public"."lessons" from "service_role";

revoke insert on table "public"."lessons" from "service_role";

revoke references on table "public"."lessons" from "service_role";

revoke trigger on table "public"."lessons" from "service_role";

revoke truncate on table "public"."lessons" from "service_role";

revoke update on table "public"."lessons" from "service_role";

revoke delete on table "public"."modules" from "anon";

revoke insert on table "public"."modules" from "anon";

revoke references on table "public"."modules" from "anon";

revoke trigger on table "public"."modules" from "anon";

revoke truncate on table "public"."modules" from "anon";

revoke update on table "public"."modules" from "anon";

revoke delete on table "public"."modules" from "authenticated";

revoke insert on table "public"."modules" from "authenticated";

revoke references on table "public"."modules" from "authenticated";

revoke trigger on table "public"."modules" from "authenticated";

revoke truncate on table "public"."modules" from "authenticated";

revoke update on table "public"."modules" from "authenticated";

revoke delete on table "public"."modules" from "service_role";

revoke insert on table "public"."modules" from "service_role";

revoke references on table "public"."modules" from "service_role";

revoke trigger on table "public"."modules" from "service_role";

revoke truncate on table "public"."modules" from "service_role";

revoke update on table "public"."modules" from "service_role";

revoke delete on table "public"."profiles" from "anon";

revoke insert on table "public"."profiles" from "anon";

revoke references on table "public"."profiles" from "anon";

revoke select on table "public"."profiles" from "anon";

revoke trigger on table "public"."profiles" from "anon";

revoke truncate on table "public"."profiles" from "anon";

revoke update on table "public"."profiles" from "anon";

revoke delete on table "public"."profiles" from "authenticated";

revoke references on table "public"."profiles" from "authenticated";

revoke trigger on table "public"."profiles" from "authenticated";

revoke truncate on table "public"."profiles" from "authenticated";

revoke delete on table "public"."profiles" from "service_role";

revoke references on table "public"."profiles" from "service_role";

revoke trigger on table "public"."profiles" from "service_role";

revoke truncate on table "public"."profiles" from "service_role";

revoke delete on table "public"."progresses" from "anon";

revoke insert on table "public"."progresses" from "anon";

revoke references on table "public"."progresses" from "anon";

revoke select on table "public"."progresses" from "anon";

revoke trigger on table "public"."progresses" from "anon";

revoke truncate on table "public"."progresses" from "anon";

revoke update on table "public"."progresses" from "anon";

revoke delete on table "public"."progresses" from "authenticated";

revoke insert on table "public"."progresses" from "authenticated";

revoke references on table "public"."progresses" from "authenticated";

revoke select on table "public"."progresses" from "authenticated";

revoke trigger on table "public"."progresses" from "authenticated";

revoke truncate on table "public"."progresses" from "authenticated";

revoke update on table "public"."progresses" from "authenticated";

revoke delete on table "public"."progresses" from "service_role";

revoke insert on table "public"."progresses" from "service_role";

revoke references on table "public"."progresses" from "service_role";

revoke select on table "public"."progresses" from "service_role";

revoke trigger on table "public"."progresses" from "service_role";

revoke truncate on table "public"."progresses" from "service_role";

revoke update on table "public"."progresses" from "service_role";


  create table "public"."Foo" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "name" text default ''::text
      );


alter table "public"."Foo" enable row level security;

alter table "public"."courses" alter column "id" drop default;

alter table "public"."courses" alter column "id" add generated by default as identity;

alter table "public"."courses" alter column "id" set data type integer using "id"::integer;

alter table "public"."enrollments" alter column "course_id" set data type integer using "course_id"::integer;

alter table "public"."modules" alter column "course_id" set data type integer using "course_id"::integer;

alter table "public"."progresses" alter column "course_id" set data type integer using "course_id"::integer;

CREATE UNIQUE INDEX "Foo_pkey" ON public."Foo" USING btree (id);

alter table "public"."Foo" add constraint "Foo_pkey" PRIMARY KEY using index "Foo_pkey";


