import Link from 'next/link';
import { redirect } from 'next/navigation';

import { LandingAuthOverlay } from '@/components/landing-auth-overlay';
import { getCurrentUser } from '@/lib/auth';
import { translate } from '@/lib/i18n';
import { getResolvedLanguage } from '@/lib/server-language';

type HomePageSearchParams = {
  showLogin?: string | string[];
  showSignup?: string | string[];
  redirectTo?: string | string[];
};

const asString = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value);
const isTruthy = (value?: string | string[]) => {
  const normalized = asString(value);
  return normalized === '1' || normalized === 'true';
};

const buildAuthHref = ({
  type,
  redirectTo
}: {
  type: 'login' | 'signup';
  redirectTo?: string;
}) => {
  const params = new URLSearchParams();
  if (redirectTo) {
    params.set('redirectTo', redirectTo);
  }
  params.set(type === 'login' ? 'showLogin' : 'showSignup', '1');
  const query = params.toString();
  return query ? `/?${query}` : '/';
};

export default async function HomePage({ searchParams }: { searchParams?: HomePageSearchParams }) {
  const user = await getCurrentUser();

  if (user) {
    redirect('/roadmap');
  }

  const language = await getResolvedLanguage();
  const redirectTo = asString(searchParams?.redirectTo);
  const showLogin = isTruthy(searchParams?.showLogin);
  const showSignup = isTruthy(searchParams?.showSignup);
  const activeAuth = showSignup ? 'signup' : showLogin ? 'login' : null;
  const loginHref = buildAuthHref({ type: 'login', redirectTo });
  const signupHref = buildAuthHref({ type: 'signup', redirectTo });
  const overlayTitle =
    activeAuth === 'login'
      ? translate(language, 'auth.login')
      : activeAuth === 'signup'
        ? translate(language, 'auth.signup')
        : '';
  const overlayTagline = translate(language, 'app.tagline');

  return (
    <section
      className="relative isolate flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 px-6 py-16 text-center shadow-2xl"
      style={{
        backgroundImage: "linear-gradient(120deg, rgba(0,0,0,0.8), rgba(0,0,0,0.4)), url('/images/LandingPageBackground1.png')",
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}
    >
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-white">
        <h1 className="text-5xl font-extrabold leading-tight sm:text-6xl">
          {translate(language, 'app.tagline')}
        </h1>
        <p className="text-xl text-white/80">
          Tango is Complex. Tango Rápido accelerates your learning with simple lessons, a clear roadmap, and progress tracking.
        </p>
        {!activeAuth ? (
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href={loginHref} className="btn-primary px-8 py-3 text-lg">
              {translate(language, 'auth.login')}
            </Link>
            <Link href={signupHref} className="btn-secondary border-white/70 px-8 py-3 text-lg text-white">
              {translate(language, 'auth.signup')}
            </Link>
          </div>
        ) : null}
      </div>
      {activeAuth ? (
        <LandingAuthOverlay variant={activeAuth} title={overlayTitle} tagline={overlayTagline} />
      ) : null}
    </section>
  );
}
