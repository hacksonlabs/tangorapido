import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth';
import { getLessonWithContext } from '@/lib/data/courses';
import { pickLocalized } from '@/lib/i18n/content';
import { translate, type TranslationKey } from '@/lib/i18n';
import { getResolvedLanguage } from '@/lib/server-language';
import { getSignedLessonUrl } from '@/lib/supabase/storage';
import { Progress } from '@/components/ui/progress';
import { MarkCompleteButton } from '@/components/lesson/mark-complete-button';

type LessonPageProps = {
  params: {
    lessonId: string;
  };
};

export default async function LessonPage({ params }: LessonPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const lesson = await getLessonWithContext(params.lessonId, user.id);

  if (!lesson) {
    notFound();
  }

  const language = await getResolvedLanguage();
  const t = (key: Parameters<typeof translate>[1], replacements?: Record<string, string | number>) =>
    translate(language, key, replacements);

  const lessonTitle = pickLocalized(lesson, 'title', language);
  const lessonDescription = pickLocalized(lesson, 'description', language);
  const moduleTitle = pickLocalized(lesson.module, 'title', language);
  const courseTitle = pickLocalized(lesson.course, 'title', language);
  const lessonTypeKey = `lesson.type.${lesson.lesson_type as 'lesson' | 'exercise'}` as TranslationKey;
  const videoSource = lesson.video_url ?? (await getSignedLessonUrl(lesson.storage_path));

  return (
    <article className="flex flex-col gap-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-3 text-base text-white/70">
        <Link href={`/course/${lesson.course.id}`} className="underline decoration-white/40">
          {courseTitle}
        </Link>
        <span aria-hidden>›</span>
        <span>{moduleTitle}</span>
      </nav>
      <header className="flex flex-col gap-4">
        <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-brand-accent">
          {t(lessonTypeKey)}
        </span>
        <h1 className="text-4xl font-extrabold text-white">{lessonTitle}</h1>
        <p className="text-lg text-white/70">{lessonDescription}</p>
        <Progress
          value={lesson.module.progressPercent}
          label={`${t('module.progress')}: ${lesson.module.completedLessons}/${lesson.module.totalLessons}`}
        />
      </header>
      <section className="flex flex-col gap-4">
        {videoSource ? (
          <video
            controls
            className="w-full overflow-hidden rounded-3xl border border-white/15 shadow-2xl"
            preload="metadata"
          >
            <source src={videoSource} />
            {lessonTitle}
          </video>
        ) : (
          <div className="card-surface flex h-64 items-center justify-center text-center text-lg text-white/70">
            {t('lesson.noVideo')}
          </div>
        )}
      </section>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <MarkCompleteButton lessonId={lesson.id} completed={lesson.completed} />
        <Link href={`/course/${lesson.course.id}`} className="btn-secondary w-full justify-center md:w-auto">
          {t('generic.back')}
        </Link>
      </div>
    </article>
  );
}
