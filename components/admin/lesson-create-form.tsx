'use client';

import { useMemo, useState } from 'react';
import { useFormState } from 'react-dom';

import { createLesson } from '@/app/admin/actions';
import { useLanguage } from '@/components/language-provider';

const initialState = {
  success: true,
  message: ''
};

type LessonCreateFormProps = {
  courses: Array<{
    id: string;
    label: string;
    modules: Array<{ id: string; label: string }>;
  }>;
};

export const LessonCreateForm = ({ courses }: LessonCreateFormProps) => {
  const { t } = useLanguage();
  const [state, formAction] = useFormState(createLesson, initialState);
  const [selectedCourse, setSelectedCourse] = useState('');

  const availableModules = useMemo(() => {
    return courses.find((course) => course.id === selectedCourse)?.modules ?? [];
  }, [courses, selectedCourse]);

  return (
    <form action={formAction} className="card-surface flex flex-col gap-4 p-6">
      <header>
        <h3 className="text-2xl font-semibold text-white">{t('admin.createLesson')}</h3>
      </header>
      <input type="hidden" name="course_id" value={selectedCourse} />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-white/80">
          <span>{t('nav.courses')}</span>
          <select
            name="course_selector"
            required
            value={selectedCourse}
            onChange={(event) => setSelectedCourse(event.target.value)}
            className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-3 text-lg text-white focus-visible:outline-none focus-visible:shadow-focus"
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm text-white/80">
          <span>{t('admin.modules')}</span>
          <select
            name="module_id"
            required
            className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-3 text-lg text-white focus-visible:outline-none focus-visible:shadow-focus"
            disabled={!selectedCourse}
          >
            <option value="">Select a module</option>
            {availableModules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-white/80">
          <span>Title (EN)</span>
          <input
            name="title_en"
            required
            className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-3 text-lg text-white focus-visible:outline-none focus-visible:shadow-focus"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-white/80">
          <span>Título (ES)</span>
          <input
            name="title_es"
            required
            className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-3 text-lg text-white focus-visible:outline-none focus-visible:shadow-focus"
          />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-white/80">
          <span>Description (EN)</span>
          <textarea
            name="description_en"
            required
            rows={3}
            className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-3 text-lg text-white focus-visible:outline-none focus-visible:shadow-focus"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-white/80">
          <span>Descripción (ES)</span>
          <textarea
            name="description_es"
            required
            rows={3}
            className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-3 text-lg text-white focus-visible:outline-none focus-visible:shadow-focus"
          />
        </label>
      </div>
      <div className="flex flex-wrap gap-4">
        <label className="flex flex-col gap-2 text-sm text-white/80 md:w-56">
          <span>{t('admin.videoUrl')}</span>
          <input
            name="video_url"
            type="url"
            placeholder="https://"
            className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-3 text-lg text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:shadow-focus"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-white/80 md:w-56">
          <span>{t('admin.storagePath')}</span>
          <input
            name="storage_path"
            placeholder="lesson-videos/intro.mp4"
            className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-3 text-lg text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:shadow-focus"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-white/80 md:w-40">
          <span>Order</span>
          <input
            name="order_index"
            type="number"
            min={0}
            className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-3 text-lg text-white focus-visible:outline-none focus-visible:shadow-focus"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-white/80 md:w-40">
          <span>Type</span>
          <select
            name="lesson_type"
            className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-3 text-lg text-white focus-visible:outline-none focus-visible:shadow-focus"
          >
            <option value="lesson">{t('lesson.type.lesson')}</option>
            <option value="exercise">{t('lesson.type.exercise')}</option>
          </select>
        </label>
      </div>
      {!state.success && state.message ? (
        <p className="rounded-2xl bg-red-500/20 px-4 py-3 text-base text-red-200">{state.message}</p>
      ) : null}
      {state.success && state.message ? (
        <p className="rounded-2xl bg-green-500/20 px-4 py-3 text-base text-green-100">
          {state.message}
        </p>
      ) : null}
      <button type="submit" className="btn-primary self-start" disabled={!selectedCourse}>
        {t('admin.save')}
      </button>
    </form>
  );
};
