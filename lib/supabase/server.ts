import { cookies } from 'next/headers';
import {
  createServerActionClient,
  createServerComponentClient,
  createRouteHandlerClient
} from '@supabase/auth-helpers-nextjs';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/types/database';
import { serverEnv } from '@/lib/env';

export const getServerComponentClient = () => {
  console.log('Supabase: createServerComponentClient');
  return createServerComponentClient<Database>({ cookies }) as unknown as SupabaseClient<Database>;
};

export const getServerActionClient = () => {
  console.log('Supabase: createServerActionClient');
  return createServerActionClient<Database>({ cookies }) as unknown as SupabaseClient<Database>;
};

export const getRouteHandlerClient = () => {
  console.log('Supabase: createRouteHandlerClient');
  return createRouteHandlerClient<Database>({ cookies }) as unknown as SupabaseClient<Database>;
};

export const getServiceRoleClient = (): SupabaseClient<Database> => {
  const serviceRoleKey = serverEnv.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY for admin operation.');
  }

  console.log('Supabase: createServiceRoleClient');
  return createClient<Database>(serverEnv.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, {
    auth: {
      persistSession: false
    }
  });
};
