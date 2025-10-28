import { cookies } from 'next/headers';
import {
  createServerActionClient,
  createServerComponentClient,
  createRouteHandlerClient
} from '@supabase/auth-helpers-nextjs';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/types/database';
import { serverEnv } from '@/lib/env';

export const getServerComponentClient = () =>
  createServerComponentClient<Database>({ cookies });

export const getServerActionClient = () =>
  createServerActionClient<Database>({ cookies });

export const getRouteHandlerClient = () =>
  createRouteHandlerClient<Database>({ cookies });

export const getServiceRoleClient = (): SupabaseClient<Database> => {
  const serviceRoleKey = serverEnv.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY for admin operation.');
  }

  return createClient<Database>(serverEnv.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, {
    auth: {
      persistSession: false
    }
  });
};
