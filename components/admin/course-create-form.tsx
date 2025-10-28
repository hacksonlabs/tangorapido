'use client';

import { useFormState } from 'react-dom';

import { createCourse } from '@/app/admin/actions';
import { useLanguage } from '@/components/language-provider';

const initialState = {
  success: true,
  message: ''
};

export const CourseCreateForm = () => {
  const { t } = useLanguage();
  const [state, formAction] = useFormState(createCourse, initialState);

  return (
    <form action={formAction} className="card-surface flex flex-col gap-4 p-6">
      <header>
        <h3 className="text-2xl font-semibold text-white">{t('admin.createCourse')}</h3>
      </header>
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
      <label className="flex flex-col gap-2 text-sm text-white/80 md:w-48">
        <span>Order</span>
        <input
          name="order_index"
          type="number"
          min={0}
          className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-3 text-lg text-white focus-visible:outline-none focus-visible:shadow-focus"
        />
      </label>
      {!state.success && state.message ? (
        <p className="rounded-2xl bg-red-500/20 px-4 py-3 text-base text-red-200">{state.message}</p>
      ) : null}
      {state.success && state.message ? (
        <p className="rounded-2xl bg-green-500/20 px-4 py-3 text-base text-green-100">
          {state.message}
        </p>
      ) : null}
      <button type="submit" className="btn-primary self-start">
        {t('admin.save')}
      </button>
    </form>
  );
};
