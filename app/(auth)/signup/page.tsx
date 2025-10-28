import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { SignupForm } from '@/components/auth/signup-form';
import { getCurrentUser } from '@/lib/auth';
import { isLanguage, type Language, translate } from '@/lib/i18n';

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect('/roadmap');
  }

  const cookieStore = cookies();
  const cookieLanguage = cookieStore.get('tr-lang')?.value;

  let language: Language = 'en';
  if (isLanguage(cookieLanguage)) {
    language = cookieLanguage;
  }

  return (
    <div className="flex w-full flex-col gap-6 text-center">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold text-white">
          {translate(language, 'auth.signup')}
        </h1>
        <p className="text-lg text-white/70">{translate(language, 'app.tagline')}</p>
      </header>
      <SignupForm />
    </div>
  );
}
