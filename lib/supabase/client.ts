import { createBrowserClient } from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/types/database';
import { clientEnv } from '@/lib/env';

let client: SupabaseClient<Database> | undefined;

export const getBrowserClient = (): SupabaseClient<Database> => {
  if (!client) {
    client = createBrowserClient<Database>(
      clientEnv.NEXT_PUBLIC_SUPABASE_URL,
      clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }

  return client;
};
