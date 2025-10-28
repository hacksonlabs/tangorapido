import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tango Rápido · Access'
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-xl backdrop-blur">
      {children}
    </section>
  );
}
