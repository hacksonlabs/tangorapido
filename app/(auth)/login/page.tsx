import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth';

type LoginPageSearchParams = {
  redirectTo?: string | string[];
};

const asString = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value);

export default async function LoginPage({ searchParams }: { searchParams?: LoginPageSearchParams }) {
  const user = await getCurrentUser();
  if (user) {
    redirect('/roadmap');
  }

  const redirectTo = asString(searchParams?.redirectTo);
  const params = new URLSearchParams();
  if (redirectTo) {
    params.set('redirectTo', redirectTo);
  }
  params.set('showLogin', '1');

  redirect(`/?${params.toString()}`);
}
