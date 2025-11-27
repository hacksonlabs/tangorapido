import { Fragment } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ensureProfile, getCurrentUser } from '@/lib/auth';
import { getCoursesWithProgress } from '@/lib/data/courses';
import { pickLocalized } from '@/lib/i18n/content';
import { translate } from '@/lib/i18n';
import { getResolvedLanguage } from '@/lib/server-language';
import { Progress } from '@/components/ui/progress';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export default async function RoadmapPage() {
  console.log('RoadmapPage: render start');
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  await ensureProfile();

  const language = await getResolvedLanguage();
  const t = (key: Parameters<typeof translate>[1], replacements?: Record<string, string | number>) =>
    translate(language, key, replacements);

  console.log('RoadmapPage: fetching courses with progress', { userId: user.id });
  const courses = await getCoursesWithProgress(user.id);
  console.log('RoadmapPage: fetch complete', {
    courseCount: courses.length,
    firstCourseTitle: courses[0]?.title_en
  });

  const roadmapSteps = courses.map((course) => ({
    course,
    modules: course.modules,
    lessons: course.modules.flatMap((module) => module.lessons)
  }));

  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-extrabold text-white">{t('roadmap.title')}</h1>
        <p className="text-xl text-white/70">{t('roadmap.subtitle')}</p>
      </header>
      <div className="grid gap-6">
        {courses.length === 0 ? (
          <>
            <article className="card-surface flex flex-col gap-4 p-8 text-lg text-white/70 lg:col-span-2 xl:col-span-1">
              <h2 className="text-2xl font-semibold text-white">{t('generic.empty')}</h2>
              <p>{t('roadmap.empty')}</p>
            </article>
          </>
        ) : (
          <>
            <section className="card-surface flex flex-col gap-6 p-8 xl:p-10">
              <div>
                <h2 className="text-2xl font-semibold text-white">{t('roadmap.timelineTitle')}</h2>
                <p className="text-base text-white/70">{t('roadmap.timelineDescription')}</p>
              </div>
              <div className="relative overflow-x-auto pb-4">
                <div className="flex min-w-full items-center gap-6 xl:gap-10">
                  {roadmapSteps.map(({ course }, index) => {
            const isComplete = course.progressPercent >= 100;
            const hasStarted = course.completedLessons > 0;
            const buttonLabel = isComplete
              ? t('roadmap.completedCourse')
              : hasStarted
                ? t('roadmap.continueCourse')
                : t('roadmap.startCourse');
            const primaryHref = !hasStarted
              ? `/course/${course.id}`
              : course.nextLessonId
                ? `/lesson/${course.nextLessonId}`
                : `/course/${course.id}`;
                    const progressAngle = Math.min(100, Math.max(0, course.progressPercent)) * 3.6;

                    return (
                      <Fragment key={course.id}>
                        {index > 0 ? (
                          <div className="hidden h-px flex-1 bg-gradient-to-r from-brand-accent/60 to-brand-accent/0 md:block" />
                        ) : null}
                        <div className="flex min-w-[10rem] flex-col items-center gap-3">
                          <Link
                            href={primaryHref}
                            className="group relative flex h-36 w-36 items-center justify-center rounded-full border border-white/10 text-center text-white shadow-lg transition focus-visible:outline-none focus-visible:shadow-focus xl:h-40 xl:w-40"
                            style={{
                              background:
                                `radial-gradient(circle at center, rgba(17,24,39,0.95) 55%, rgba(17,24,39,0.4) 65%), ` +
                                `conic-gradient(#F7B733 ${progressAngle}deg, rgba(255,255,255,0.08) ${progressAngle}deg)`
                            }}
                            aria-label={`${pickLocalized(course, 'title', language)} · ${t('generic.progress')}: ${course.progressPercent.toFixed(0)}%`}
                          >
                            <span className="mx-6 text-lg font-semibold leading-snug">
                              {pickLocalized(course, 'title', language)}
                            </span>
                            <span className="sr-only">{t('roadmap.viewCourse')}</span>
                          </Link>
                          <span className="text-sm font-semibold text-white/80">
                            {course.progressPercent.toFixed(0)}%
                          </span>
                          <Link href={primaryHref} className="btn-secondary px-5 py-2">
                            {buttonLabel}
                          </Link>
                        </div>
                      </Fragment>
                    );
                  })}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
      {courses.length > 0 ? (
        <section className="grid gap-6 md:grid-cols-2">
          {courses.map((course) => (
            <article key={course.id} className="card-surface flex flex-col gap-5 p-6">
              <header className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold text-white">
                  {pickLocalized(course, 'title', language)}
                </h2>
                <p className="text-base text-white/70">
                  {pickLocalized(course, 'description', language)}
                </p>
              </header>
              <Progress
                value={course.progressPercent}
                label={`${t('generic.progress')}: ${course.completedLessons}/${course.totalLessons}`}
              />
              <div className="flex flex-col gap-3">
                {course.modules.map((module) => (
                  <div key={module.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {pickLocalized(module, 'title', language)}
                        </h3>
                        <p className="text-sm text-white/60">
                          {pickLocalized(module, 'description', language)}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-brand-accent">
                        {module.progressPercent}%
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-sm text-white/70">
                      {module.lessons.map((lesson) => (
                        <Link
                          key={lesson.id}
                          href={`/lesson/${lesson.id}`}
                          className="rounded-full border border-white/15 px-3 py-1 text-white transition hover:border-brand-accent/80 hover:text-brand-accent focus-visible:outline-none focus-visible:shadow-focus"
                        >
                          {pickLocalized(lesson, 'title', language)}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={`/course/${course.id}`} className="btn-primary">
                  {t('course.overview')}
                </Link>
              </div>
            </article>
          ))}
        </section>
      ) : null}
    </section>
  );
}
