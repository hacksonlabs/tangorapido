import { redirect } from 'next/navigation';

import { getServerComponentClient } from '@/lib/supabase/server';

export default async function LogoutPage() {
  const supabase = getServerComponentClient();
  await supabase.auth.signOut();

  redirect('/login');
}
