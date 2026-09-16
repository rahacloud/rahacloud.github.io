import RootLocaleRedirect from '@/components/RootLocaleRedirect';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/lib/metadata';

const TITLE = 'Raha Cloud - Infrastructure, DevOps, Cloud';
const DESCRIPTION =
  "We provide infrastructure and DevOps solutions based on AWS, Hetzner, and Arvancloud to reduce your team's operational overhead.";

const LOCALE_NAMES: Record<string, string> = {
  en: 'English',
  es: 'Español',
  fa: 'فارسی',
};

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  icons: { icon: '/icon.png', apple: '/icon.png' },
  // `/` is a doorway to the localized pages -- it points its weight at the
  // default locale rather than competing with it.
  alternates: {
    canonical: `${SITE_URL}/${routing.defaultLocale}`,
    languages: {
      ...Object.fromEntries(routing.locales.map((locale) => [locale, `${SITE_URL}/${locale}`])),
      'x-default': `${SITE_URL}/${routing.defaultLocale}`,
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'Raha Cloud',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Raha Cloud - Infrastructure, DevOps, Cloud',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootPage() {
  return (
    <html lang={routing.defaultLocale}>
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.25rem',
          background: '#14171d',
          color: '#f0ebe3',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
        }}
      >
        <RootLocaleRedirect />
        {/* biome-ignore lint/performance/noImgElement: this page ships no JS bundle for images */}
        <img src="/logo.png" alt="" width={56} height={56} style={{ borderRadius: 16 }} />
        <h1 style={{ margin: 0, fontSize: '1.1rem', letterSpacing: '0.14em' }}>RAHA CLOUD</h1>
        <p style={{ margin: 0, color: '#b8bcc6', maxWidth: '34ch', lineHeight: 1.6 }}>
          {DESCRIPTION}
        </p>
        <nav style={{ display: 'flex', gap: '1.25rem' }}>
          {routing.locales.map((locale) => (
            <a key={locale} href={`/${locale}`} style={{ color: '#f07a52' }}>
              {LOCALE_NAMES[locale] ?? locale}
            </a>
          ))}
        </nav>
      </body>
    </html>
  );
}
