import { redirect } from 'next/navigation';

import { getCurrentUser, ensureProfile } from '@/lib/auth';
import { getGamificationState } from '@/lib/gamification';
import { pickLocalized } from '@/lib/i18n/content';
import { translate } from '@/lib/i18n';
import { getResolvedLanguage } from '@/lib/server-language';
import { BadgeCard } from '@/components/ui/badge-card';
import { StatCard } from '@/components/ui/stat-card';

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  await ensureProfile();

  const language = await getResolvedLanguage();
  const t = (key: Parameters<typeof translate>[1], replacements?: Record<string, string | number>) =>
    translate(language, key, replacements);

  const gamification = await getGamificationState(user.id);
  const unlockedBadges = new Map(
    gamification.awards.map((award) => [award.badge_id, award.awarded_at ?? ''])
  );

  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold text-white">{t('profile.title')}</h1>
        <p className="text-lg text-white/70">{t('profile.keepGoing')}</p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard label={t('profile.totalXp')} value={`${gamification.xpTotal}`} />
        <StatCard
          label={t('profile.completedLessons')}
          value={`${gamification.completedLessons}`}
        />
        <StatCard
          label={t('profile.badges')}
          value={`${unlockedBadges.size}/${gamification.badges.length}`}
        />
      </div>
      <section className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold text-white">{t('generic.badges')}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {gamification.badges.length === 0 ? (
            <article className="card-surface flex flex-col gap-3 p-6 text-lg text-white/70">
              <p>{t('generic.empty')}</p>
            </article>
          ) : (
            gamification.badges.map((badge) => {
              const achieved = unlockedBadges.has(badge.id);
              return (
                <BadgeCard
                  key={badge.id}
                  title={pickLocalized(badge, 'title', language)}
                  description={pickLocalized(badge, 'description', language)}
                  achieved={achieved}
                  xpReward={badge.xp_reward ?? undefined}
                  statusLabel={achieved ? t('badges.unlocked') : t('badges.locked')}
                />
              );
            })
          )}
        </div>
      </section>
    </section>
  );
}
