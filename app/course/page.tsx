import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth';
import { getCoursesWithProgress } from '@/lib/data/courses';
import { pickLocalized } from '@/lib/i18n/content';
import { translate } from '@/lib/i18n';
import { getResolvedLanguage } from '@/lib/server-language';
import { Progress } from '@/components/ui/progress';

export default async function CoursesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const language = await getResolvedLanguage();
  const t = (key: Parameters<typeof translate>[1], replacements?: Record<string, string | number>) =>
    translate(language, key, replacements);

  const courses = await getCoursesWithProgress(user.id);

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold text-white">{t('nav.courses')}</h1>
        <p className="text-lg text-white/70">{t('roadmap.subtitle')}</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {courses.length === 0 ? (
          <article className="card-surface flex flex-col gap-4 p-8 text-lg text-white/70">
            <h2 className="text-2xl font-semibold text-white">{t('generic.empty')}</h2>
            <p>{t('roadmap.empty')}</p>
          </article>
        ) : (
          courses.map((course) => (
            <article key={course.id} className="card-surface flex flex-col gap-4 p-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-white">
                  {pickLocalized(course, 'title', language)}
                </h2>
                <p className="text-base text-white/70">
                  {pickLocalized(course, 'description', language)}
                </p>
              </div>
              <Progress
                value={course.progressPercent}
                label={`${t('generic.progress')}: ${course.completedLessons}/${course.totalLessons}`}
              />
              <div className="flex flex-wrap gap-2">
                <Link href={`/course/${course.id}`} className="btn-primary">
                  {t('course.overview')}
                </Link>
                {course.nextLessonId ? (
                  <Link href={`/lesson/${course.nextLessonId}`} className="btn-secondary">
                    {t('generic.continue')}
                  </Link>
                ) : null}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
