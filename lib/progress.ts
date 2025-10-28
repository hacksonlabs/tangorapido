import { getServerActionClient } from '@/lib/supabase/server';
import type { Tables } from '@/types/database';

type ModuleRow = Pick<Tables<'modules'>, 'id' | 'xp_value'>;
type LessonRow = Pick<Tables<'lessons'>, 'id' | 'module_id'>;

export type ProgressSnapshot = {
  coursePercent: number;
  courseXp: number;
  moduleSnapshots: Array<{
    moduleId: string;
    percent: number;
    xpEarned: number;
    totalLessons: number;
    completedLessons: number;
  }>;
  totals: {
    totalLessons: number;
    completedLessons: number;
  };
};

export const recalculateProgress = async (
  userId: string,
  courseId: string
): Promise<ProgressSnapshot> => {
  const supabase = getServerActionClient();

  const { data: modulesData } = await supabase
    .from('modules')
    .select('id, xp_value')
    .eq('course_id', courseId);

  const modules = (modulesData ?? []) as ModuleRow[];
  const moduleIds = modules.map((module) => module.id);

  const { data: lessonsData } = await supabase
    .from('lessons')
    .select('id, module_id')
    .in('module_id', moduleIds);

  const lessons = (lessonsData ?? []) as LessonRow[];
  const lessonIds = lessons.map((lesson) => lesson.id);

  const { data: lessonStatesData } = await supabase
    .from('lesson_states')
    .select('lesson_id, completed')
    .eq('user_id', userId)
    .in('lesson_id', lessonIds);

  const completedLessonsSet = new Set(
    (lessonStatesData ?? [])
      .filter((state) => state.completed)
      .map((state) => state.lesson_id)
  );

  const moduleSnapshots = modules.map((module) => {
    const moduleLessons = lessons.filter((lesson) => lesson.module_id === module.id);
    const totalLessons = moduleLessons.length;
    const moduleCompletedLessons = moduleLessons.filter((lesson) =>
      completedLessonsSet.has(lesson.id)
    ).length;
    const percent = totalLessons === 0 ? 0 : Math.round((moduleCompletedLessons / totalLessons) * 100);
    const xpEarned = Math.round((module.xp_value ?? 0) * (percent / 100));

    return {
      moduleId: module.id,
      percent,
      xpEarned,
      totalLessons,
      completedLessons: moduleCompletedLessons
    };
  });

  const totalLessons = lessons.length;
  const completedLessons = completedLessonsSet.size;
  const coursePercent = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
  const courseXp = moduleSnapshots.reduce((sum, snapshot) => sum + snapshot.xpEarned, 0);

  await supabase
    .from('progresses')
    .upsert(
      [
        {
          user_id: userId,
          course_id: courseId,
          module_id: null,
          percent_complete: coursePercent,
          xp_earned: courseXp
        },
        ...moduleSnapshots.map((snapshot) => ({
          user_id: userId,
          course_id: courseId,
          module_id: snapshot.moduleId,
          percent_complete: snapshot.percent,
          xp_earned: snapshot.xpEarned
        }))
      ],
      {
        onConflict: 'user_id,course_id,module_id'
      }
    );

  return {
    coursePercent,
    courseXp,
    moduleSnapshots,
    totals: {
      totalLessons,
      completedLessons
    }
  };
};
