'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  startTransition
} from 'react';

import type { Language, TranslationKey } from '@/lib/i18n';
import { translate } from '@/lib/i18n';
import { setLanguagePreference } from '@/app/actions';

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, replacements?: Record<string, string | number>) => string;
  pending: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const LOCAL_STORAGE_KEY = 'tango-rapido-language';

export const LanguageProvider = ({
  defaultLanguage,
  children
}: {
  defaultLanguage: Language;
  children: React.ReactNode;
}) => {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);

    if (stored === 'en' || stored === 'es') {
      setLanguageState(stored);
      if (stored !== defaultLanguage) {
        setPending(true);
        startTransition(async () => {
          try {
            await setLanguagePreference(stored);
          } finally {
            setPending(false);
          }
        });
      }
    }
  }, [defaultLanguage]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const handleSetLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, nextLanguage);
    }

    setPending(true);
    startTransition(async () => {
      try {
        await setLanguagePreference(nextLanguage);
      } finally {
        setPending(false);
      }
    });
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      pending,
      setLanguage: handleSetLanguage,
      t: (key, replacements) => translate(language, key, replacements)
    }),
    [handleSetLanguage, language, pending]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
};
