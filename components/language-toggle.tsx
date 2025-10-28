'use client';

import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/language-provider';

type LanguageToggleProps = {
  className?: string;
};

export const LanguageToggle = ({ className }: LanguageToggleProps) => {
  const { language, setLanguage, t, pending } = useLanguage();

  const nextLanguage = language === 'en' ? 'es' : 'en';

  return (
    <button
      type="button"
      className={cn('btn-secondary gap-2', className)}
      onClick={() => setLanguage(nextLanguage)}
      aria-live="polite"
      disabled={pending}
    >
      <span aria-hidden>{language.toUpperCase()}</span>
      <span className="sr-only">
        {t('generic.language')} {pending ? '…' : ''}
      </span>
    </button>
  );
};
