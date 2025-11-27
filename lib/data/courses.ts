import { serverEnv } from '@/lib/env';
import { getServerComponentClient, getServiceRoleClient } from '@/lib/supabase/server';
import type { Tables } from '@/types/database';

type LessonRow = Tables<'lessons'>;
type ModuleRow = Tables<'modules'>;
type CourseRow = Tables<'courses'>;
type ProgressRow = Tables<'progresses'>;
type LessonStateRow = Tables<'lesson_states'>;

export type LessonWithProgress = LessonRow & {
  completed: boolean;
};

export type ModuleWithProgress = ModuleRow & {
  lessons: LessonWithProgress[];
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  xpEarned: number;
};

export type CourseWithProgress = CourseRow & {
  modules: ModuleWithProgress[];
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  xpEarned: number;
  nextLessonId?: string;
};

type RawCourse = CourseRow & {
  modules?: (ModuleRow & { lessons: LessonRow[] })[];
};

const getPublicSupabase = () => {
  const usingServiceRole = Boolean(serverEnv.SUPABASE_SERVICE_ROLE_KEY);
  console.log('getPublicSupabase: choosing client', { usingServiceRole });
  return usingServiceRole ? getServiceRoleClient() : getServerComponentClient();
};

const attachLessons = (modules: ModuleRow[], lessons: LessonRow[]): RawCourse['modules'] => {
  const lessonsByModule = lessons.reduce<Record<string, LessonRow[]>>((acc, lesson) => {
    acc[lesson.module_id] = acc[lesson.module_id] ?? [];
    acc[lesson.module_id].push(lesson);
    return acc;
  }, {});

  return modules
    .map((module) => ({
      ...module,
      lessons: (lessonsByModule[module.id] ?? []).sort(
        (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)
      )
    }))
    .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
};

const getLessonStates = async (userId: string | null) => {
  if (!userId) {
    console.warn('getLessonStates: missing userId, returning empty list');
    return [];
  }

  const supabase = getServerComponentClient();
  const { data, error } = await supabase
    .from('lesson_states')
    .select('lesson_id, completed')
    .eq('user_id', userId);

  if (error) {
    console.error('Failed to fetch lesson states', error);
    return [];
  }

  console.log('getLessonStates: fetched rows', { userId, count: data?.length ?? 0 });
  return (data ?? []) as Pick<LessonStateRow, 'lesson_id' | 'completed'>[];
};

const getProgressRows = async (userId: string | null) => {
  if (!userId) {
    console.warn('getProgressRows: missing userId, returning empty list');
    return [];
  }

  const supabase = getServerComponentClient();
  const { data, error } = await supabase
    .from('progresses')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Failed to fetch progress rows', error);
    return [];
  }

  console.log('getProgressRows: fetched rows', { userId, count: data?.length ?? 0 });
  return (data ?? []) as ProgressRow[];
};

const computeCourse = (
  course: RawCourse,
  lessonStates: Record<string, boolean>,
  progressRows: ProgressRow[]
): CourseWithProgress => {
  let totalLessons = 0;
  let completedLessons = 0;
  let nextLessonId: string | undefined;
  let xpEarned = 0;

  const modules: ModuleWithProgress[] = course.modules
    ?.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
    .map((module) => {
      const lessons = (module.lessons ?? []).sort(
        (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)
      );

      const lessonViews: LessonWithProgress[] = lessons.map((lesson) => {
        const completed = Boolean(lessonStates[lesson.id]);
        return {
          ...lesson,
          completed
        };
      });

      const moduleCompletedLessons = lessonViews.filter((lesson) => lesson.completed).length;
      const moduleTotalLessons = lessonViews.length;
      totalLessons += moduleTotalLessons;
      completedLessons += moduleCompletedLessons;

      if (!nextLessonId) {
        const nextLesson = lessonViews.find((lesson) => !lesson.completed);
        nextLessonId = nextLesson?.id ?? nextLessonId;
      }

      const moduleProgress =
        moduleTotalLessons === 0 ? 0 : (moduleCompletedLessons / moduleTotalLessons) * 100;

      const moduleProgressRow = progressRows.find((row) => row.module_id === module.id);
      const moduleXpEarned =
        moduleProgressRow?.xp_earned ??
        (moduleProgress >= 100 ? module.xp_value ?? 0 : Math.round((module.xp_value ?? 0) * (moduleProgress / 100)));

      xpEarned += moduleXpEarned;

      return {
        ...module,
        lessons: lessonViews,
        totalLessons: moduleTotalLessons,
        completedLessons: moduleCompletedLessons,
        progressPercent: Math.round(moduleProgress),
        xpEarned: moduleXpEarned
      };
    }) ?? [];

  const courseProgress =
    totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

  const courseProgressRow = progressRows.find(
    (row) => row.course_id === course.id && row.module_id === null
  );

  if (courseProgressRow) {
    xpEarned = Math.max(xpEarned, courseProgressRow.xp_earned);
  }

  return {
    ...course,
    modules,
    totalLessons,
    completedLessons,
    progressPercent: courseProgress,
    xpEarned,
    nextLessonId
  };
};

export const getCoursesWithProgress = async (userId: string | null) => {
  const supabase = getPublicSupabase();
  console.log('getCoursesWithProgress: fetching graph', {
    userId,
    usingServiceRole: Boolean(serverEnv.SUPABASE_SERVICE_ROLE_KEY)
  });
  const [{ data: courseData, error: courseError }, { data: moduleData, error: moduleError }, { data: lessonData, error: lessonError }] =
    await Promise.all([
      supabase.from('courses').select('*').order('order_index', { ascending: true }),
      supabase.from('modules').select('*').order('order_index', { ascending: true }),
      supabase.from('lessons').select('*').order('order_index', { ascending: true })
    ]);

  if (courseError || moduleError || lessonError) {
    console.error('Failed to fetch courses graph', { courseError, moduleError, lessonError });
    return [];
  }

  console.log('getCoursesWithProgress: fetch results', {
    courseCount: courseData?.length ?? 0,
    moduleCount: moduleData?.length ?? 0,
    lessonCount: lessonData?.length ?? 0,
    firstCourseTitleEn: courseData?.[0]?.title_en,
    firstModuleTitleEn: moduleData?.[0]?.title_en,
    firstLessonTitleEn: lessonData?.[0]?.title_en
  });

  if (!courseData?.length) {
    console.warn('getCoursesWithProgress: no courses returned from Supabase');
  }

  const modulesByCourse = (moduleData ?? []).reduce<Record<string, ModuleRow[]>>((acc, module) => {
    acc[module.course_id] = acc[module.course_id] ?? [];
    acc[module.course_id].push(module);
    return acc;
  }, {});

  const lessons = lessonData ?? [];

  const rawCourses: RawCourse[] = (courseData ?? []).map((course) => ({
    ...course,
    modules: attachLessons(modulesByCourse[course.id] ?? [], lessons)
  }));

  const lessonStatesRows = await getLessonStates(userId);
  const progressRows = await getProgressRows(userId);

  const lessonStates = Object.fromEntries(
    lessonStatesRows.map((state) => [state.lesson_id, state.completed])
  );

  return rawCourses.map((course) => computeCourse(course, lessonStates, progressRows));
};

export const getCourseWithProgress = async (
  courseId: string,
  userId: string | null
): Promise<CourseWithProgress | null> => {
  const supabase = getPublicSupabase();
  console.log('getCourseWithProgress: fetching course', {
    courseId,
    userId,
    usingServiceRole: Boolean(serverEnv.SUPABASE_SERVICE_ROLE_KEY)
  });
  const [{ data: courseData, error: courseError }, { data: moduleData, error: moduleError }] =
    await Promise.all([
      supabase.from('courses').select('*').eq('id', courseId).single(),
      supabase.from('modules').select('*').eq('course_id', courseId).order('order_index', { ascending: true })
    ]);

  if (courseError || moduleError) {
    console.error('Failed to fetch course graph', { courseError, moduleError });
    return null;
  }

  if (!courseData) {
    console.warn('getCourseWithProgress: no course found', { courseId });
    return null;
  }

  const moduleIds = (moduleData ?? []).map((module) => module.id);
  console.log('getCourseWithProgress: fetch results', {
    hasCourse: Boolean(courseData),
    moduleCount: moduleData?.length ?? 0,
    courseTitleEn: (courseData as CourseRow).title_en,
    firstModuleTitleEn: moduleData?.[0]?.title_en
  });

  if (!moduleIds.length) {
    console.warn('getCourseWithProgress: no modules for course', { courseId });
  }

  let lessons: LessonRow[] = [];

  if (moduleIds.length > 0) {
    console.log('getCourseWithProgress: fetching lessons for modules', { moduleCount: moduleIds.length });
    const { data: lessonData, error: lessonError } = await supabase
      .from('lessons')
      .select('*')
      .in('module_id', moduleIds)
      .order('order_index', { ascending: true });

    if (lessonError) {
      console.error('Failed to fetch course lessons', lessonError);
      lessons = [];
    } else {
      lessons = (lessonData ?? []) as LessonRow[];
    }
  }

  const targetCourse: RawCourse = {
    ...(courseData as CourseRow),
    modules: attachLessons(moduleData ?? [], lessons)
  };

  const lessonStatesRows = await getLessonStates(userId);
  const progressRows = await getProgressRows(userId);
  const lessonStates = Object.fromEntries(
    lessonStatesRows.map((state) => [state.lesson_id, state.completed])
  );

  return computeCourse(targetCourse, lessonStates, progressRows);
};

export const getModuleWithProgress = async (
  moduleId: string,
  userId: string | null
): Promise<ModuleWithProgress & { course: CourseRow } | null> => {
  const supabase = getPublicSupabase();
  console.log('getModuleWithProgress: fetching module', {
    moduleId,
    userId,
    usingServiceRole: Boolean(serverEnv.SUPABASE_SERVICE_ROLE_KEY)
  });

  const { data: moduleRow, error: moduleError } = await supabase
    .from('modules')
    .select('*')
    .eq('id', moduleId)
    .single();

  if (moduleError) {
    console.error('Failed to fetch module', moduleError);
    return null;
  }

  if (!moduleRow) {
    console.warn('getModuleWithProgress: no module found', { moduleId });
    return null;
  }

  const { data: courseRow, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('id', moduleRow.course_id)
    .single();

  if (courseError) {
    console.error('Failed to fetch module course', courseError);
    return null;
  }

  if (!courseRow) {
    console.warn('getModuleWithProgress: module found without course', { moduleId });
    return null;
  }

  const { data: lessonRows, error: lessonError } = await supabase
    .from('lessons')
    .select('*')
    .eq('module_id', moduleId)
    .order('order_index', { ascending: true });

  if (lessonError) {
    console.error('Failed to fetch module lessons', lessonError);
    return null;
  }

  console.log('getModuleWithProgress: fetch results', {
    hasModule: Boolean(moduleRow),
    hasCourse: Boolean(courseRow),
    lessonCount: lessonRows?.length ?? 0,
    moduleTitleEn: moduleRow?.title_en,
    courseTitleEn: courseRow?.title_en
  });

  if (!lessonRows?.length) {
    console.warn('getModuleWithProgress: no lessons for module', { moduleId });
  }

  const course = courseRow as CourseRow;
  const module = moduleRow as ModuleRow;
  const lessons = (lessonRows ?? []) as LessonRow[];

  const lessonStatesRows = await getLessonStates(userId);
  const lessonStates = Object.fromEntries(
    lessonStatesRows.map((state) => [state.lesson_id, state.completed])
  );
  const progressRows = await getProgressRows(userId);

  const computedCourse = computeCourse(
    {
      ...course,
      modules: [{ ...(module as ModuleRow), lessons }]
    },
    lessonStates,
    progressRows
  );

  const computedModule = computedCourse.modules[0];

  return {
    ...computedModule,
    course
  };
};

export const getLessonWithContext = async (
  lessonId: string,
  userId: string | null
): Promise<
  (LessonWithProgress & {
    module: ModuleWithProgress;
    course: CourseRow;
  }) | null
> => {
  const supabase = getPublicSupabase();
  console.log('getLessonWithContext: fetching lesson context', {
    lessonId,
    userId,
    usingServiceRole: Boolean(serverEnv.SUPABASE_SERVICE_ROLE_KEY)
  });
  const { data: lessonRow, error: lessonError } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single();

  if (lessonError) {
    console.error('Failed to fetch lesson', lessonError);
    return null;
  }

  if (!lessonRow) {
    console.warn('getLessonWithContext: no lesson found', { lessonId });
    return null;
  }

  const { data: moduleRow, error: moduleError } = await supabase
    .from('modules')
    .select('*')
    .eq('id', lessonRow.module_id)
    .single();

  if (moduleError) {
    console.error('Failed to fetch lesson module', moduleError);
    return null;
  }

  if (!moduleRow) {
    console.warn('getLessonWithContext: lesson without module', { lessonId });
    return null;
  }

  const { data: courseRow, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('id', moduleRow.course_id)
    .single();

  if (courseError) {
    console.error('Failed to fetch lesson course', courseError);
    return null;
  }

  if (!courseRow) {
    console.warn('getLessonWithContext: module without course', { lessonId, moduleId: moduleRow.course_id });
    return null;
  }

  const { data: moduleLessons, error: moduleLessonsError } = await supabase
    .from('lessons')
    .select('*')
    .eq('module_id', moduleRow.id)
    .order('order_index', { ascending: true });

  if (moduleLessonsError) {
    console.error('Failed to fetch lessons for module', moduleLessonsError);
    return null;
  }

  console.log('getLessonWithContext: fetch results', {
    hasLesson: Boolean(lessonRow),
    hasModule: Boolean(moduleRow),
    hasCourse: Boolean(courseRow),
    lessonCount: moduleLessons?.length ?? 0,
    lessonTitleEn: lessonRow?.title_en,
    moduleTitleEn: moduleRow?.title_en,
    courseTitleEn: courseRow?.title_en
  });

  if (!moduleLessons?.length) {
    console.warn('getLessonWithContext: module has no lessons', {
      lessonId,
      moduleId: moduleRow.id
    });
  }

  const course = courseRow as CourseRow;
  const module = moduleRow as ModuleRow;
  const lesson = lessonRow as LessonRow;
  const lessons = (moduleLessons ?? []) as LessonRow[];

  const lessonStatesRows = await getLessonStates(userId);
  const lessonStates = Object.fromEntries(
    lessonStatesRows.map((state) => [state.lesson_id, state.completed])
  );
  const progressRows = await getProgressRows(userId);

  const computedCourse = computeCourse(
    {
      ...course,
      modules: [
        {
          ...module,
          lessons
        }
      ]
    },
    lessonStates,
    progressRows
  );

  const computedModule = computedCourse.modules.find((mod) => mod.id === module.id);
  const computedLesson = computedModule?.lessons.find((item) => item.id === lesson.id);

  if (!computedModule || !computedLesson) {
    return null;
  }

  return {
    ...computedLesson,
    module: computedModule,
    course: computedCourse
  };
};
