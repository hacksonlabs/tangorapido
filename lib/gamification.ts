import {
  getServerActionClient,
  getServerComponentClient,
  getServiceRoleClient
} from '@/lib/supabase/server';
import type { Tables } from '@/types/database';

type BadgeRow = Tables<'badges'>;
type AwardRow = Tables<'awards'>;

const DEFAULT_BADGES: BadgeRow[] = [
  {
    id: 'badge-first-steps',
    slug: 'first_steps',
    title_en: 'First Steps',
    title_es: 'Primeros pasos',
    description_en: 'Complete your very first lesson.',
    description_es: 'Completa tu primera lección.',
    xp_reward: 25,
    created_at: new Date().toISOString()
  },
  {
    id: 'badge-quarter-course',
    slug: 'quarter_course',
    title_en: 'Quarter Milestone',
    title_es: 'Meta del 25 %',
    description_en: 'Reach 25% progress in any course.',
    description_es: 'Alcanza 25 % de progreso en cualquier curso.',
    xp_reward: 50,
    created_at: new Date().toISOString()
  },
  {
    id: 'badge-module-master',
    slug: 'module_master',
    title_en: 'Module Master',
    title_es: 'Maestro del módulo',
    description_en: 'Finish every lesson in a module.',
    description_es: 'Termina todas las lecciones de un módulo.',
    xp_reward: 75,
    created_at: new Date().toISOString()
  },
  {
    id: 'badge-lesson-streak',
    slug: 'lesson_streak',
    title_en: 'Lesson Streak',
    title_es: 'Racha de lecciones',
    description_en: 'Complete three lessons in total.',
    description_es: 'Completa tres lecciones en total.',
    xp_reward: 60,
    created_at: new Date().toISOString()
  }
] as const;

const BADGE_RULES: Array<{
  slug: string;
  check: (context: GamificationContext) => boolean;
}> = [
  {
    slug: 'first_steps',
    check: (context) => context.completedLessons >= 1
  },
  {
    slug: 'quarter_course',
    check: (context) => context.courseProgresses.some((course) => course.percent_complete >= 25)
  },
  {
    slug: 'module_master',
    check: (context) => context.moduleProgresses.some((module) => module.percent_complete >= 100)
  },
  {
    slug: 'lesson_streak',
    check: (context) => context.completedLessons >= 3
  }
];

type GamificationContext = {
  completedLessons: number;
  courseProgresses: Tables<'progresses'>[];
  moduleProgresses: Tables<'progresses'>[];
  awards: AwardRow[];
};

export type GamificationState = {
  xpTotal: number;
  completedLessons: number;
  awards: Array<AwardRow & { badge: BadgeRow | null }>;
  badges: BadgeRow[];
};

export const ensureDefaultBadges = async () => {
  try {
    const serviceClient = getServiceRoleClient();
    await serviceClient.from('badges').upsert(DEFAULT_BADGES as BadgeRow[], {
      onConflict: 'slug'
    });
  } catch (error) {
    console.warn('Unable to ensure default badges. Provide SUPABASE_SERVICE_ROLE_KEY for auto setup.', error);
  }
};

const buildContext = (
  progresses: Tables<'progresses'>[],
  completedLessonCount: number,
  awards: AwardRow[]
): GamificationContext => {
  const courseProgresses = progresses.filter((progress) => progress.module_id === null);
  const moduleProgresses = progresses.filter((progress) => progress.module_id !== null);

  return {
    completedLessons: completedLessonCount,
    courseProgresses,
    moduleProgresses,
    awards
  };
};

const calculateXpTotal = (progresses: Tables<'progresses'>[]) =>
  progresses
    .filter((progress) => progress.module_id === null)
    .reduce((total, progress) => total + (progress.xp_earned ?? 0), 0);

export const applyGamification = async (userId: string) => {
  const supabase = getServerActionClient();

  await ensureDefaultBadges();

  const { data: progressesData } = await supabase
    .from('progresses')
    .select('*')
    .eq('user_id', userId);

  const progresses = progressesData ?? [];

  const { data: lessonStatesData } = await supabase
    .from('lesson_states')
    .select('lesson_id')
    .eq('user_id', userId)
    .eq('completed', true);

  const completedLessons = lessonStatesData?.length ?? 0;

  const { data: awardsData } = await supabase.from('awards').select('*').eq('user_id', userId);
  const awards = awardsData ?? [];

  const context = buildContext(progresses, completedLessons, awards);

  const { data: badgesData } = await supabase.from('badges').select('*');
  const badges = badgesData ?? [];
  const badgeBySlug = new Map(badges.map((badge) => [badge.slug, badge]));

  const existingBadgeIds = new Set(awards.map((award) => award.badge_id));
  const awardsToInsert: AwardRow[] = [];

  for (const rule of BADGE_RULES) {
    const badge = badgeBySlug.get(rule.slug);
    if (!badge) {
      continue;
    }

    if (existingBadgeIds.has(badge.id)) {
      continue;
    }

    if (rule.check(context)) {
      awardsToInsert.push({
        id: crypto.randomUUID(),
        user_id: userId,
        badge_id: badge.id,
        awarded_at: new Date().toISOString()
      });
    }
  }

  if (awardsToInsert.length > 0) {
    await supabase.from('awards').insert(awardsToInsert);
  }

  const xpTotal = calculateXpTotal(progresses);

  await supabase
    .from('profiles')
    .update({ xp_total: xpTotal })
    .eq('user_id', userId);
};

export const getGamificationState = async (userId: string): Promise<GamificationState> => {
  const supabase = getServerComponentClient();

  const { data: profileData } = await supabase
    .from('profiles')
    .select('xp_total')
    .eq('user_id', userId)
    .maybeSingle();

  const { data: awardsData } = await supabase
    .from('awards')
    .select('*, badge:badges(*)')
    .eq('user_id', userId)
    .order('awarded_at', { ascending: false });

  const { data: lessonStatesData } = await supabase
    .from('lesson_states')
    .select('id')
    .eq('user_id', userId)
    .eq('completed', true);

  const { data: badgesData } = await supabase.from('badges').select('*');

  return {
    xpTotal: profileData?.xp_total ?? 0,
    completedLessons: lessonStatesData?.length ?? 0,
    awards: (awardsData ?? []).map((award) => ({
      ...award,
      badge: award.badge ?? null
    })),
    badges: badgesData ?? []
  };
};
