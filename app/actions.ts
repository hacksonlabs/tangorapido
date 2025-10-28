'use server';

import { cookies } from 'next/headers';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

import type { Language } from '@/lib/i18n';
import { isLanguage } from '@/lib/i18n';
import { getServerActionClient } from '@/lib/supabase/server';

const LANGUAGE_COOKIE = 'tr-lang';

export async function setLanguagePreference(language: Language) {
  if (!isLanguage(language)) {
    return;
  }

  const cookieStore = cookies();

  cookieStore.set({
    name: LANGUAGE_COOKIE,
    value: language,
    maxAge: 60 * 60 * 24 * 365,
    path: '/'
  });

  const supabase = getServerActionClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    await supabase
      .from('profiles')
      .update({ preferred_language: language })
      .eq('user_id', user.id);

    revalidateTag(`profile:${user.id}`);
  }

  revalidatePath('/', 'layout');
}

export async function logout() {
  const supabase = getServerActionClient();
  await supabase.auth.signOut();
  redirect('/login');
}
