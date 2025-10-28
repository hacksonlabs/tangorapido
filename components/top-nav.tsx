'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LanguageToggle } from '@/components/language-toggle';
import { useLanguage } from '@/components/language-provider';
import { LogoutButton } from '@/components/logout-button';
import { cn } from '@/lib/utils';

type TopNavProps = {
  isAuthenticated: boolean;
  isAdmin: boolean;
};

export const TopNav = ({ isAuthenticated, isAdmin }: TopNavProps) => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current) {
        return;
      }

      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const baseLinks = [{ href: '/roadmap', label: t('nav.roadmap') }];
  const adminLinks = isAdmin ? [{ href: '/admin', label: t('nav.admin') }] : [];

  const unauthLinks = [
    { href: '/login', label: t('nav.login') },
    { href: '/signup', label: t('nav.signup') }
  ];

  const links = [...baseLinks, ...adminLinks];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-lg font-bold tracking-wide">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent text-black font-extrabold">
            TR
          </span>
          <span>
            Tango Rápido
            <span className="block text-sm font-normal text-white/60">{t('app.tagline')}</span>
          </span>
        </Link>
        <nav aria-label="Primary navigation" className="flex items-center gap-4 text-base">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-full px-4 py-2 font-semibold transition focus-visible:outline-none focus-visible:shadow-focus',
                  isActive ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'
                )}
              >
                {link.label}
              </Link>
            );
          })}

          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={menuOpen}
                className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-white transition hover:border-white/30 focus-visible:outline-none focus-visible:shadow-focus"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent/25 text-xl">
                  <span aria-hidden>👤</span>
                </span>
                <span className="hidden text-base font-semibold sm:block">{t('nav.profile')}</span>
                <svg
                  aria-hidden
                  className={cn('h-4 w-4 transition', menuOpen ? 'rotate-180' : 'rotate-0')}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.442l3.71-3.21a.75.75 0 111 1.12l-4.24 3.67a.75.75 0 01-1 0l-4.24-3.67a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {menuOpen ? (
                <div
                  role="menu"
                  aria-label={t('nav.profile')}
                  className="absolute right-0 mt-3 w-64 rounded-3xl border border-white/10 bg-neutral-900/95 p-4 shadow-xl"
                >
                  <Link
                    role="menuitem"
                    href="/profile"
                    className="flex items-center justify-between rounded-2xl px-4 py-2 text-white/80 transition hover:bg-white/10 focus-visible:outline-none focus-visible:shadow-focus"
                  >
                    <span>{t('nav.profile')}</span>
                    <span aria-hidden>→</span>
                  </Link>
                  <div className="mt-3 border-t border-white/10 pt-3">
                    <LanguageToggle className="w-full justify-between px-4 py-2 text-base" />
                  </div>
                  <div className="mt-3 border-t border-white/10 pt-3">
                    <LogoutButton className="px-4 py-2" />
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {unauthLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-4 py-2 font-semibold text-white/70 transition hover:text-white focus-visible:outline-none focus-visible:shadow-focus"
                >
                  {link.label}
                </Link>
              ))}
              <LanguageToggle className="px-4 py-2 text-base" />
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
