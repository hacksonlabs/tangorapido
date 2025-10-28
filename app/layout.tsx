import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import './globals.css';

import { LanguageProvider } from '@/components/language-provider';
import { SkipNav } from '@/components/skip-nav';
import { TopNav } from '@/components/top-nav';
import { getCurrentProfile, getCurrentUser } from '@/lib/auth';
import { isLanguage, type Language } from '@/lib/i18n';

const LANGUAGE_COOKIE = 'tr-lang';

export const metadata: Metadata = {
  title: 'Tango Rápido',
  description:
    'Learn tango faster with a friendly roadmap, video lessons, and gentle gamification built for older adults.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }]
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const cookieLanguage = cookieStore.get(LANGUAGE_COOKIE)?.value;

  let defaultLanguage: Language = 'en';
  if (isLanguage(cookieLanguage)) {
    defaultLanguage = cookieLanguage;
  }

  const user = await getCurrentUser();
  const profile = user ? await getCurrentProfile() : null;

  if (profile?.preferred_language && profile.preferred_language !== defaultLanguage) {
    defaultLanguage = profile.preferred_language;
  }

  return (
    <html lang={defaultLanguage} suppressHydrationWarning>
      <body className="bg-neutral-950 text-white">
        <LanguageProvider defaultLanguage={defaultLanguage}>
          <SkipNav />
          <TopNav isAuthenticated={Boolean(user)} isAdmin={Boolean(profile?.is_admin)} />
          <main
            id="main-content"
            className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-7xl flex-1 flex-col gap-10 px-6 py-10"
          >
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
