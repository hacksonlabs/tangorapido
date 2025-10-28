import { NextResponse } from 'next/server';

import { getRouteHandlerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = getRouteHandlerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  requestUrl.pathname = '/roadmap';
  requestUrl.searchParams.delete('code');
  requestUrl.searchParams.delete('type');

  return NextResponse.redirect(requestUrl);
}
