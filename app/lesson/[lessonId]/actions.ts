'use server';

import { revalidatePath } from 'next/cache';

import { getServerActionClient } from '@/lib/supabase/server';
import { recalculateProgress } from '@/lib/progress';
import { applyGamification } from '@/lib/gamification';

export const completeLesson = async (lessonId: string) => {
  const supabase = getServerActionClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('id, module_id, module:modules (course_id)')
    .eq('id', lessonId)
    .maybeSingle();

  if (error || !lesson) {
    throw new Error('Lesson not found');
  }

  const moduleId = lesson.module_id;
  const courseId = lesson.module?.course_id;

  if (!moduleId || !courseId) {
    throw new Error('Lesson is not linked correctly');
  }

  await supabase
    .from('lesson_states')
    .upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString()
      },
      {
        onConflict: 'user_id,lesson_id'
      }
    );

  const snapshot = await recalculateProgress(user.id, courseId);
  await applyGamification(user.id);

  revalidatePath('/roadmap');
  revalidatePath(`/course/${courseId}`);
  revalidatePath(`/lesson/${lessonId}`);
  revalidatePath('/profile');

  return snapshot;
};
