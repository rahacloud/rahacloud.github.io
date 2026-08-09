'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { detectLocale, readStoredLocale } from '@/lib/locale';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // An explicit choice from the language toggle always wins over detection.
    router.replace(`/${readStoredLocale() ?? detectLocale()}`);
  }, [router]);

  return (
    <noscript>
      <p>
        <a href="/en">English</a> · <a href="/fa">فارسی</a>
      </p>
    </noscript>
  );
}
