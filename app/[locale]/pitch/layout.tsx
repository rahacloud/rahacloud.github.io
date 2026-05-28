import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import LocaleToggle from '@/components/LocaleToggle';
import ThemeToggle from '@/components/ThemeToggle';
import { Link } from '@/i18n/routing';
import './pitch.css';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pitch' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function PitchLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  return (
    <>
      <header className="site-header pitch-header">
        <div className="container header-inner">
          <Link className="brand" href="/">
            <Image src="/logo.png" alt="Raha Cloud" width={44} height={44} className="brand-mark" />
            <span className="brand-text">
              <strong>{t('brand.name')}</strong>
              <span>{t('pitch.nav')}</span>
            </span>
          </Link>
          <div className="header-actions">
            <a className="btn small ghost desktop-only" href={`/${locale}#contact`}>
              {t('contact.cta')}
            </a>
            <ThemeToggle />
            <LocaleToggle />
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="container">
          <p className="footer-bottom">{t('footer.copyright')}</p>
        </div>
      </footer>
    </>
  );
}
