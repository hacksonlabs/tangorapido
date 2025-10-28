import { cookies } from 'next/headers';

import { getCurrentProfile } from '@/lib/auth';
import { isLanguage, type Language } from '@/lib/i18n';

const LANGUAGE_COOKIE = 'tr-lang';

export const getResolvedLanguage = async (): Promise<Language> => {
  const cookieStore = cookies();
  const cookieLanguage = cookieStore.get(LANGUAGE_COOKIE)?.value;

  let language: Language = 'en';
  if (isLanguage(cookieLanguage)) {
    language = cookieLanguage;
  }

  const profile = await getCurrentProfile();

  if (profile?.preferred_language && profile.preferred_language !== language) {
    language = profile.preferred_language;
  }

  return language;
};
