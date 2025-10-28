import type { Language } from '@/lib/i18n';

export const pickLocalized = <T extends Record<string, unknown>>(
  record: T,
  baseKey: string,
  language: Language
) => {
  const suffix = language === 'es' ? '_es' : '_en';
  const key = `${baseKey}${suffix}` as keyof T;
  const fallbackKey = `${baseKey}_en` as keyof T;

  return (record[key] as string | null | undefined) ?? (record[fallbackKey] as string | null | undefined) ?? '';
};
