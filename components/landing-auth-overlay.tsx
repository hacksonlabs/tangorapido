'use client';

import { MouseEvent, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { LoginForm } from '@/components/auth/login-form';
import { SignupForm } from '@/components/auth/signup-form';

type LandingAuthOverlayProps = {
  variant: 'login' | 'signup';
  title: string;
  tagline: string;
};

export const LandingAuthOverlay = ({ variant, title, tagline }: LandingAuthOverlayProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const closeOverlay = useCallback(() => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    params.delete('showLogin');
    params.delete('showSignup');
    const query = params.toString();
    router.replace(query ? `/?${query}` : '/', { scroll: false });
  }, [router, searchParams]);

  const handleBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeOverlay();
    }
  };

  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center px-4"
      onMouseDown={handleBackdropMouseDown}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-2xl rounded-3xl border border-white/15 bg-black/75 p-8 text-center shadow-2xl backdrop-blur"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex flex-col gap-2 text-white">
          <h2 className="text-4xl font-extrabold">{title}</h2>
          <p className="text-lg text-white/70">{tagline}</p>
        </header>
        <div className="mt-6">{variant === 'login' ? <LoginForm /> : <SignupForm />}</div>
      </div>
    </div>
  );
};
