'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useFormState } from 'react-dom';

import { login, type AuthActionState } from '@/app/(auth)/auth-actions';
import { useLanguage } from '@/components/language-provider';

const initialState = {
  success: true,
  message: ''
};

export const LoginForm = () => {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirectTo') ?? undefined;
  const [state, formAction] = useFormState<AuthActionState, FormData>(login, initialState);

  return (
    <form
      action={formAction}
      className="flex w-full flex-col gap-6 text-lg"
      aria-describedby={state.success ? undefined : 'login-error'}
      noValidate
    >
      <input type="hidden" name="redirectTo" value={redirectTo ?? ''} />
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-semibold text-white">
          {t('auth.email')}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-3 text-lg text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:shadow-focus"
          placeholder="you@example.com"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="font-semibold text-white">
          {t('auth.password')}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="rounded-2xl border border-white/20 bg-neutral-900 px-4 py-3 text-lg text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:shadow-focus"
        />
      </div>
      {!state.success && state.message ? (
        <p id="login-error" role="alert" className="rounded-2xl bg-red-500/20 px-4 py-3 text-base text-red-200">
          {state.message}
        </p>
      ) : null}
      <button type="submit" className="btn-primary w-full">
        {t('auth.login')}
      </button>
      <p className="text-center text-base text-white/80">
        {t('auth.noAccount')}{' '}
        <Link href="/signup" className="font-semibold text-brand-accent">
          {t('auth.signup')}
        </Link>
      </p>
    </form>
  );
};
