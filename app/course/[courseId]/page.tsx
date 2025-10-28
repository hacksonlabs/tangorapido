import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth';
import { getCourseWithProgress } from '@/lib/data/courses';
import { pickLocalized } from '@/lib/i18n/content';
import { translate } from '@/lib/i18n';
import { getResolvedLanguage } from '@/lib/server-language';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type CoursePageProps = {
  params: {
    courseId: string;
  };
};

export default async function CoursePage({ params }: CoursePageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const course = await getCourseWithProgress(params.courseId, user.id);

  if (!course) {
    notFound();
  }

  const language = await getResolvedLanguage();
  const t = (key: Parameters<typeof translate>[1], replacements?: Record<string, string | number>) =>
    translate(language, key, replacements);

const exerciseLessons = course.modules.map((module) => {
    const orderedLessons = [...module.lessons].sort(
      (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)
    );

    const items: {
      parentTitle: string | null;
      exercises: { lesson: typeof orderedLessons[number] }[];
    }[] = [];

    let currentParent: typeof orderedLessons[number] | null = null;

    for (const lesson of orderedLessons) {
      if (lesson.lesson_type === 'lesson') {
        currentParent = lesson;
        continue;
      }

      const parentTitle = currentParent ? pickLocalized(currentParent, 'title', language) : null;
      let group = items.find((item) => item.parentTitle === parentTitle);

      if (!group) {
        group = { parentTitle, exercises: [] };
        items.push(group);
      }

      group.exercises.push({ lesson });
    }

    return {
      moduleTitle: pickLocalized(module, 'title', language),
      items
    };
  });

  return (
    <section className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <Link href="/roadmap" className="text-base text-brand-accent">
          ← {t('generic.back')}
        </Link>
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-extrabold text-white">
            {pickLocalized(course, 'title', language)}
          </h1>
          <p className="text-xl text-white/70">{pickLocalized(course, 'description', language)}</p>
        </div>
        <Progress
          value={course.progressPercent}
          label={`${t('generic.progress')}: ${course.completedLessons}/${course.totalLessons}`}
        />
        {course.nextLessonId ? (
          <div className="flex flex-wrap gap-3">
            <Link href={`/lesson/${course.nextLessonId}`} className="btn-primary">
              {t('generic.continue')}
            </Link>
          </div>
        ) : null}
      </header>
      <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-6">
          {course.modules.map((module) => (
            <article key={module.id} className="card-surface flex flex-col gap-5 p-6">
              <header className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold text-white">
                  {pickLocalized(module, 'title', language)}
                </h2>
                <p className="text-base text-white/70">
                  {pickLocalized(module, 'description', language)}
                </p>
                <Progress
                  value={module.progressPercent}
                  label={`${t('module.progress')}: ${module.completedLessons}/${module.totalLessons}`}
                />
              </header>
              <div className="flex flex-col gap-2">
                {module.lessons
                  .filter((lesson) => lesson.lesson_type !== 'exercise')
                  .map((lesson) => (
                    <Link
                      key={lesson.id}
                      href={`/lesson/${lesson.id}`}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10 focus-visible:outline-none focus-visible:shadow-focus"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold uppercase tracking-wide text-white/60">
                          {t('lesson.type.lesson')}
                        </span>
                        <span className="text-lg font-semibold text-white">
                          {pickLocalized(lesson, 'title', language)}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-brand-accent">
                        {lesson.completed ? t('lesson.completed') : t('lesson.notStarted')}
                      </span>
                    </Link>
                  ))}
              </div>
            </article>
          ))}
        </div>
        <aside className="card-surface flex h-fit flex-col gap-4 p-6">
          <h3 className="text-xl font-semibold text-white">{t('course.exercises')}</h3>
          {exerciseLessons.every((group) => group.items.length === 0) ? (
            <p className="text-base text-white/70">{t('course.noExercises')}</p>
          ) : (
            <ul className="flex flex-col gap-4" aria-label={t('course.exercises')}>
              {exerciseLessons
                .filter(({ items }) => items.length > 0)
                .map(({ moduleTitle, items }) => (
                  <li key={moduleTitle} className="flex flex-col gap-3">
                    <span className="text-sm font-semibold uppercase tracking-wide text-white/50">
                      {moduleTitle}
                    </span>
                    <ul className="flex flex-col gap-4">
                      {items.map(({ parentTitle, exercises }) => (
                      <li key={parentTitle ?? 'general'} className="flex flex-col gap-2">
                        {parentTitle ? (
                          <p className="text-sm font-semibold text-white/70">{parentTitle}</p>
                        ) : null}
                        <div className="flex flex-col gap-2">
                          {exercises.map((exercise) => (
                            <Link
                              key={exercise.lesson.id}
                              href={`/lesson/${exercise.lesson.id}`}
                              className={cn(
                                'flex flex-col gap-1 rounded-2xl border px-4 py-3 text-white transition focus-visible:outline-none focus-visible:shadow-focus',
                                exercise.lesson.completed
                                  ? 'border-green-500/50 bg-green-600/30 hover:bg-green-600/40'
                                  : 'border-white/10 bg-white/5 hover:bg-white/10'
                              )}
                            >
                              <span className="text-lg font-semibold">
                                {pickLocalized(exercise.lesson, 'title', language)}
                              </span>
                              {exercise.lesson.completed ? (
                                <span className="text-sm text-white/60">{t('lesson.completed')}</span>
                              ) : null}
                            </Link>
                          ))}
                        </div>
                      </li>
                      ))}
                    </ul>
                  </li>
                ))}
            </ul>
          )}
        </aside>
      </section>
    </section>
  );
}
