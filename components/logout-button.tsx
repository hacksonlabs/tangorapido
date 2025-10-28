'use client';

import { logout } from '@/app/actions';
import { useLanguage } from '@/components/language-provider';
import { cn } from '@/lib/utils';

type LogoutButtonProps = {
  className?: string;
};

export const LogoutButton = ({ className }: LogoutButtonProps) => {
  const { t } = useLanguage();

  return (
    <form action={logout} className="inline-block w-full">
      <button
        type="submit"
        className={cn(
          'w-full rounded-full px-4 py-2 text-left text-white/70 transition hover:text-white focus-visible:outline-none focus-visible:shadow-focus',
          className
        )}
      >
        {t('nav.logout')}
      </button>
    </form>
  );
};
