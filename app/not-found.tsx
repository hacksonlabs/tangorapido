import Link from 'next/link';

import { translate } from '@/lib/i18n';
import { getResolvedLanguage } from '@/lib/server-language';

export default async function NotFoundPage() {
  const language = await getResolvedLanguage();
  const t = (key: Parameters<typeof translate>[1]) => translate(language, key);

  return (
    <section className="flex flex-col items-center gap-6 text-center">
      <h1 className="text-5xl font-extrabold text-white">404</h1>
      <p className="text-xl text-white/70">{t('generic.notFound')}</p>
      <Link href="/roadmap" className="btn-primary">
        {t('generic.back')}
      </Link>
    </section>
  );
}
