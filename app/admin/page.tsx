import { redirect } from 'next/navigation';

import {
  deleteCourse,
  deleteLesson,
  deleteModule,
  updateCourse,
  updateLesson,
  updateModule
} from '@/app/admin/actions';
import { getCurrentProfile, getCurrentUser } from '@/lib/auth';
import { getCoursesWithProgress } from '@/lib/data/courses';
import { pickLocalized } from '@/lib/i18n/content';
import { translate } from '@/lib/i18n';
import { getResolvedLanguage } from '@/lib/server-language';
import { CourseCreateForm } from '@/components/admin/course-create-form';
import { LessonCreateForm } from '@/components/admin/lesson-create-form';
import { ModuleCreateForm } from '@/components/admin/module-create-form';

export default async function AdminPage() {
  const user = await getCurrentUser();
  const profile = await getCurrentProfile();

  if (!user) {
    redirect('/login');
  }

  if (!profile?.is_admin) {
    redirect('/roadmap');
  }

  const language = await getResolvedLanguage();
  const t = (key: Parameters<typeof translate>[1], replacements?: Record<string, string | number>) =>
    translate(language, key, replacements);

  const courses = await getCoursesWithProgress(null);
  const courseOptions = courses.map((course) => ({
    id: course.id,
    label: pickLocalized(course, 'title', language)
  }));
  const lessonOptions = courses.map((course) => ({
    id: course.id,
    label: pickLocalized(course, 'title', language),
    modules: course.modules.map((module) => ({
      id: module.id,
      label: pickLocalized(module, 'title', language)
    }))
  }));

  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-extrabold text-white">{t('admin.title')}</h1>
        <p className="text-lg text-white/70">
          Manage courses, modules, and lessons. Changes publish instantly to learners.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        <CourseCreateForm />
        <ModuleCreateForm courses={courseOptions} />
        <LessonCreateForm courses={lessonOptions} />
      </div>
      <section className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold text-white">{t('admin.courses')}</h2>
        <div className="grid gap-4">
          {courses.map((course) => (
            <article key={course.id} className="card-surface flex flex-col gap-4 p-6">
              <header className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-2xl font-semibold text-white">
                    {pickLocalized(course, 'title', language)}
                  </h3>
                  <p className="text-base text-white/70">
                    {pickLocalized(course, 'description', language)}
                  </p>
                </div>
                <form action={deleteCourse}>
                  <input type="hidden" name="id" value={course.id} />
                  <button type="submit" className="btn-secondary">
                    {t('admin.delete')}
                  </button>
                </form>
              </header>
              <details className="rounded-2xl bg-white/5">
                <summary className="cursor-pointer px-4 py-2 text-lg font-semibold text-brand-accent">
                  {t('admin.edit')}
                </summary>
                <form action={updateCourse} className="flex flex-col gap-3 px-4 py-4">
                  <input type="hidden" name="id" value={course.id} />
                  <label className="flex flex-col gap-2 text-sm text-white/80">
                    <span>Title (EN)</span>
                    <input
                      name="title_en"
                      defaultValue={course.title_en}
                      className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-2 text-lg text-white focus-visible:outline-none focus-visible:shadow-focus"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-white/80">
                    <span>Título (ES)</span>
                    <input
                      name="title_es"
                      defaultValue={course.title_es}
                      className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-2 text-lg text-white focus-visible:outline-none focus-visible:shadow-focus"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-white/80">
                    <span>Description (EN)</span>
                    <textarea
                      name="description_en"
                      defaultValue={course.description_en}
                      rows={3}
                      className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-2 text-lg text-white focus-visible:outline-none focus-visible:shadow-focus"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-white/80">
                    <span>Descripción (ES)</span>
                    <textarea
                      name="description_es"
                      defaultValue={course.description_es}
                      rows={3}
                      className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-2 text-lg text-white focus-visible:outline-none focus-visible:shadow-focus"
                    />
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex flex-col gap-2 text-sm text-white/80">
                      <span>Order</span>
                      <input
                        name="order_index"
                        type="number"
                        defaultValue={course.order_index ?? ''}
                        className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-2 text-lg text-white focus-visible:outline-none focus-visible:shadow-focus"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm text-white/80">
                      <span>Cover image URL</span>
                      <input
                        name="cover_image_url"
                        type="url"
                        defaultValue={course.cover_image_url ?? ''}
                        className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-2 text-lg text-white focus-visible:outline-none focus-visible:shadow-focus"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm text-white/80">
                      <span>Total XP</span>
                      <input
                        name="total_xp"
                        type="number"
                        defaultValue={course.total_xp ?? 0}
                        className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-2 text-lg text-white focus-visible:outline-none focus-visible:shadow-focus"
                      />
                    </label>
                  </div>
                  <button type="submit" className="btn-primary self-start">
                    {t('admin.save')}
                  </button>
                </form>
              </details>
              <section className="flex flex-col gap-3">
                <h4 className="text-xl font-semibold text-white">{t('admin.modules')}</h4>
                <div className="grid gap-3">
                  {course.modules.map((module) => (
                    <article key={module.id} className="rounded-2xl border border-white/10 p-4">
                      <header className="flex items-start justify-between gap-3">
                        <div className="flex flex-col gap-1">
                          <h5 className="text-lg font-semibold text-white">
                            {pickLocalized(module, 'title', language)}
                          </h5>
                          <p className="text-sm text-white/70">
                            {pickLocalized(module, 'description', language)}
                          </p>
                        </div>
                        <form action={deleteModule}>
                          <input type="hidden" name="id" value={module.id} />
                          <input type="hidden" name="course_id" value={course.id} />
                          <button type="submit" className="btn-secondary">
                            {t('admin.delete')}
                          </button>
                        </form>
                      </header>
                      <details className="mt-3 rounded-2xl bg-white/5">
                        <summary className="cursor-pointer px-4 py-2 text-sm font-semibold text-brand-accent">
                          {t('admin.edit')}
                        </summary>
                        <form action={updateModule} className="flex flex-col gap-3 px-4 py-4 text-sm">
                          <input type="hidden" name="id" value={module.id} />
                          <input type="hidden" name="course_id" value={course.id} />
                          <label className="flex flex-col gap-2 text-white/80">
                            <span>Title (EN)</span>
                            <input
                              name="title_en"
                              defaultValue={module.title_en}
                              className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-2 text-white focus-visible:outline-none focus-visible:shadow-focus"
                            />
                          </label>
                          <label className="flex flex-col gap-2 text-white/80">
                            <span>Título (ES)</span>
                            <input
                              name="title_es"
                              defaultValue={module.title_es}
                              className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-2 text-white focus-visible:outline-none focus-visible:shadow-focus"
                            />
                          </label>
                          <label className="flex flex-col gap-2 text-white/80">
                            <span>Description (EN)</span>
                            <textarea
                              name="description_en"
                              defaultValue={module.description_en}
                              rows={3}
                              className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-2 text-white focus-visible:outline-none focus-visible:shadow-focus"
                            />
                          </label>
                          <label className="flex flex-col gap-2 text-white/80">
                            <span>Descripción (ES)</span>
                            <textarea
                              name="description_es"
                              defaultValue={module.description_es}
                              rows={3}
                              className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-2 text-white focus-visible:outline-none focus-visible:shadow-focus"
                            />
                          </label>
                          <div className="flex flex-wrap gap-3">
                            <label className="flex flex-col gap-2 text-white/80">
                              <span>XP</span>
                              <input
                                name="xp_value"
                                type="number"
                                defaultValue={module.xp_value ?? 100}
                                className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-2 text-white focus-visible:outline-none focus-visible:shadow-focus"
                              />
                            </label>
                            <label className="flex flex-col gap-2 text-white/80">
                              <span>Order</span>
                              <input
                                name="order_index"
                                type="number"
                                defaultValue={module.order_index ?? ''}
                                className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-2 text-white focus-visible:outline-none focus-visible:shadow-focus"
                              />
                            </label>
                          </div>
                          <button type="submit" className="btn-primary self-start">
                            {t('admin.save')}
                          </button>
                        </form>
                      </details>
                      <section className="mt-3 flex flex-col gap-2">
                        <h6 className="text-base font-semibold text-white">{t('admin.lessons')}</h6>
                        <div className="grid gap-2">
                          {module.lessons.map((lesson) => (
                            <article
                              key={lesson.id}
                              className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white/80"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex flex-col gap-1">
                                  <span className="text-white">
                                    {pickLocalized(lesson, 'title', language)}
                                  </span>
                                  <span>{pickLocalized(lesson, 'description', language)}</span>
                                </div>
                                <form action={deleteLesson}>
                                  <input type="hidden" name="id" value={lesson.id} />
                                  <input type="hidden" name="module_id" value={module.id} />
                                  <input type="hidden" name="course_id" value={course.id} />
                                  <button type="submit" className="btn-secondary">
                                    {t('admin.delete')}
                                  </button>
                                </form>
                              </div>
                              <details className="mt-2 rounded-2xl bg-neutral-900/70 text-white">
                                <summary className="cursor-pointer px-4 py-2 text-sm font-semibold text-brand-accent">
                                  {t('admin.edit')}
                                </summary>
                                <form action={updateLesson} className="flex flex-col gap-2 px-4 py-3">
                                  <input type="hidden" name="id" value={lesson.id} />
                                  <input type="hidden" name="module_id" value={module.id} />
                                  <input type="hidden" name="course_id" value={course.id} />
                                  <label className="flex flex-col gap-2 text-sm text-white/80">
                                    <span>Title (EN)</span>
                                    <input
                                      name="title_en"
                                      defaultValue={lesson.title_en}
                                      className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-2 text-white focus-visible:outline-none focus-visible:shadow-focus"
                                    />
                                  </label>
                                  <label className="flex flex-col gap-2 text-sm text-white/80">
                                    <span>Título (ES)</span>
                                    <input
                                      name="title_es"
                                      defaultValue={lesson.title_es}
                                      className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-2 text-white focus-visible:outline-none focus-visible:shadow-focus"
                                    />
                                  </label>
                                  <label className="flex flex-col gap-2 text-sm text-white/80">
                                    <span>Description (EN)</span>
                                    <textarea
                                      name="description_en"
                                      defaultValue={lesson.description_en}
                                      rows={3}
                                      className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-2 text-white focus-visible:outline-none focus-visible:shadow-focus"
                                    />
                                  </label>
                                  <label className="flex flex-col gap-2 text-sm text-white/80">
                                    <span>Descripción (ES)</span>
                                    <textarea
                                      name="description_es"
                                      defaultValue={lesson.description_es}
                                      rows={3}
                                      className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-2 text-white focus-visible:outline-none focus-visible:shadow-focus"
                                    />
                                  </label>
                                  <div className="flex flex-wrap gap-3 text-sm text-white/80">
                                    <label className="flex flex-col gap-2">
                                      <span>{t('admin.videoUrl')}</span>
                                      <input
                                        name="video_url"
                                        type="url"
                                        defaultValue={lesson.video_url ?? ''}
                                        className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-2 text-white focus-visible:outline-none focus-visible:shadow-focus"
                                      />
                                    </label>
                                    <label className="flex flex-col gap-2">
                                      <span>{t('admin.storagePath')}</span>
                                      <input
                                        name="storage_path"
                                        defaultValue={lesson.storage_path ?? ''}
                                        className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-2 text-white focus-visible:outline-none focus-visible:shadow-focus"
                                      />
                                    </label>
                                    <label className="flex flex-col gap-2">
                                      <span>Order</span>
                                      <input
                                        name="order_index"
                                        type="number"
                                        defaultValue={lesson.order_index ?? ''}
                                        className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-2 text-white focus-visible:outline-none focus-visible:shadow-focus"
                                      />
                                    </label>
                                    <label className="flex flex-col gap-2">
                                      <span>Type</span>
                                      <select
                                        name="lesson_type"
                                        defaultValue={lesson.lesson_type}
                                        className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-2 text-white focus-visible:outline-none focus-visible:shadow-focus"
                                      >
                                        <option value="lesson">{t('lesson.type.lesson')}</option>
                                        <option value="exercise">{t('lesson.type.exercise')}</option>
                                      </select>
                                    </label>
                                  </div>
                                  <button type="submit" className="btn-primary self-start">
                                    {t('admin.save')}
                                  </button>
                                </form>
                              </details>
                            </article>
                          ))}
                        </div>
                      </section>
                    </article>
                  ))}
                </div>
              </section>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
