'use client';

import { cn } from '@/lib/utils';

type BadgeCardProps = {
  title: string;
  description: string;
  achieved?: boolean;
  statusLabel?: string;
  xpReward?: number;
};

export const BadgeCard = ({
  title,
  description,
  achieved = false,
  statusLabel,
  xpReward
}: BadgeCardProps) => (
  <article
    className={cn(
      'card-surface flex flex-col gap-2 p-6',
      achieved ? 'border-brand-accent/60' : 'border-white/15 opacity-70'
    )}
    aria-live="polite"
  >
    <span
      className={cn(
        'inline-flex h-12 w-12 items-center justify-center rounded-full text-xl font-extrabold',
        achieved ? 'bg-brand-accent text-black' : 'bg-white/10 text-white/60'
      )}
      aria-hidden
    >
      ⭐
    </span>
    <h3 className="text-xl font-semibold text-white">{title}</h3>
    <p className="text-base text-white/70">{description}</p>
    {typeof xpReward === 'number' ? (
      <span className="text-sm font-semibold text-brand-accent">+{xpReward} XP</span>
    ) : null}
    <span className="text-sm font-semibold uppercase tracking-wide text-white/60">
      {statusLabel ?? (achieved ? 'Unlocked' : 'Locked')}
    </span>
  </article>
);
