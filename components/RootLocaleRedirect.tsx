'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { detectLocale, readStoredLocale } from '@/lib/locale';

/**
 * The site is a static export, so `/` cannot redirect from the server. This
 * sends the visitor on once the page loads; the markup around it is a real
 * document so crawlers and link unfurlers get a title, a description and an
 * image rather than an empty body.
 */
export default function RootLocaleRedirect() {
  const router = useRouter();

  useEffect(() => {
    // An explicit choice from the language toggle always wins over detection.
    router.replace(`/${readStoredLocale() ?? detectLocale()}`);
  }, [router]);

  return null;
}
