import { translations, type Language, SUPPORTED_LANGUAGES } from '@/lib/i18n/strings';

export type { Language };

export type TranslationKey = keyof (typeof translations)['en'];

export const isLanguage = (value: string | undefined | null): value is Language =>
  !!value && SUPPORTED_LANGUAGES.includes(value as Language);

export const translate = (
  language: Language,
  key: TranslationKey,
  replacements?: Record<string, string | number>
) => {
  const fallback = translations.en[key] ?? key;
  const template = translations[language]?.[key] ?? fallback;

  if (!replacements) {
    return template;
  }

  return Object.entries(replacements).reduce((acc, [replacementKey, value]) => {
    return acc.replaceAll(`{${replacementKey}}`, String(value));
  }, template);
};
