import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth';

type SignupPageSearchParams = {
  redirectTo?: string | string[];
};

const asString = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value);

export default async function SignupPage({ searchParams }: { searchParams?: SignupPageSearchParams }) {
  const user = await getCurrentUser();
  if (user) {
    redirect('/roadmap');
  }

  const redirectTo = asString(searchParams?.redirectTo);
  const params = new URLSearchParams();
  if (redirectTo) {
    params.set('redirectTo', redirectTo);
  }
  params.set('showSignup', '1');

  redirect(`/?${params.toString()}`);
}
