'use server';

import { redirect } from 'next/navigation';

import { getServerActionClient } from '@/lib/supabase/server';

export type AuthActionState = {
  success?: boolean;
  message?: string;
};

const normalizeEmail = (value: FormDataEntryValue | null) =>
  typeof value === 'string' ? value.trim().toLowerCase() : '';

const normalizePassword = (value: FormDataEntryValue | null) =>
  typeof value === 'string' ? value : '';

export async function login(_: AuthActionState | undefined, formData: FormData) {
  const email = normalizeEmail(formData.get('email'));
  const password = normalizePassword(formData.get('password'));
  const redirectTo = formData.get('redirectTo');

  if (!email || !password) {
    return {
      success: false,
      message: 'Missing credentials.'
    };
  }

  const supabase = getServerActionClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return {
      success: false,
      message: error.message
    };
  }

  const destination =
    typeof redirectTo === 'string' && redirectTo.startsWith('/') ? redirectTo : '/roadmap';

  redirect(destination);
}

export async function signup(_: AuthActionState | undefined, formData: FormData) {
  const email = normalizeEmail(formData.get('email'));
  const password = normalizePassword(formData.get('password'));
  const confirmPassword = normalizePassword(formData.get('confirmPassword'));

  if (!email || !password) {
    return {
      success: false,
      message: 'Email and password are required.'
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      message: 'Passwords do not match.'
    };
  }

  const supabase = getServerActionClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback`
    }
  });

  if (error) {
    return {
      success: false,
      message: error.message
    };
  }

  const user = data.user;

  if (user) {
    await supabase.from('profiles').upsert(
      {
        user_id: user.id,
        preferred_language: 'en',
        xp_total: 0,
        is_admin: false
      },
      {
        onConflict: 'user_id',
        ignoreDuplicates: true
      }
    );
  }

  redirect('/roadmap');
}
