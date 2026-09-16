'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { storeLocale } from '@/lib/locale';

type Locale = 'es' | 'en' | 'fa';

// Two-letter codes keep the toggle narrow enough for the header to fit its
// container in every language; the full name lives in the accessible label.
const LOCALES: { code: Locale; short: string }[] = [
  { code: 'es', short: 'ES' },
  { code: 'en', short: 'EN' },
  { code: 'fa', short: 'FA' },
];

export default function LocaleToggle() {
  const t = useTranslations('lang');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    // Remembered so the root redirect stops second-guessing the visitor.
    storeLocale(newLocale);
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <fieldset className="locale-toggle" aria-label="Language toggle">
      {LOCALES.map(({ code, short }) => (
        <button
          key={code}
          type="button"
          className={locale === code ? 'active' : ''}
          onClick={() => switchLocale(code)}
          aria-label={t(code)}
          aria-current={locale === code ? 'true' : undefined}
          title={t(code)}
        >
          {short}
        </button>
      ))}
    </fieldset>
  );
}
