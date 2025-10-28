'use client';

import { useLanguage } from '@/components/language-provider';

export const SkipNav = () => {
  const { t } = useLanguage();

  return (
    <a
      href="#main-content"
      className="absolute left-6 top-4 z-50 -translate-y-32 transform rounded-full bg-brand-accent px-5 py-3 text-base font-semibold text-black transition focus-visible:translate-y-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
    >
      {t('a11y.skipNav')}
    </a>
  );
};
