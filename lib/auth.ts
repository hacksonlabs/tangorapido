import { cache } from 'react';

import type { Tables } from '@/types/database';
import { getServerComponentClient, getServiceRoleClient } from '@/lib/supabase/server';
import { serverEnv } from '@/lib/env';

export const getSession = cache(async () => {
  const supabase = getServerComponentClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Failed to load session', error);
    return null;
  }

  console.log('Auth: getSession', {
    hasSession: Boolean(data.session),
    userId: data.session?.user.id
  });
  return data.session ?? null;
});

export const getCurrentUser = cache(async () => {
  const supabase = getServerComponentClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Failed to load user', error);
    return null;
  }

  console.log('Auth: getCurrentUser', { userId: data.user?.id });
  return data.user ?? null;
});

export const getCurrentProfile = cache(async () => {
  const supabase = serverEnv.SUPABASE_SERVICE_ROLE_KEY
    ? getServiceRoleClient()
    : getServerComponentClient();
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle<Tables<'profiles'>>();

  if (error) {
    console.error('Failed to load profile', error);
    return null;
  }

  return data;
});

export const ensureProfile = cache(async () => {
  const supabase = serverEnv.SUPABASE_SERVICE_ROLE_KEY
    ? getServiceRoleClient()
    : getServerComponentClient();
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const existing = await getCurrentProfile();
  if (existing) {
    return existing;
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      user_id: user.id,
      preferred_language: 'en',
      is_admin: false
    })
    .select('*')
    .maybeSingle<Tables<'profiles'>>();

  if (error) {
    console.error('Failed to create profile', error);
    return null;
  }

  return data;
});
