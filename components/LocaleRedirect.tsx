'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Client-side half of a static redirect stub. The <meta http-equiv="refresh">
 * rendered alongside it does the work for crawlers and for visitors without
 * JavaScript; this makes the hop instant and keeps it out of session history.
 */
export default function LocaleRedirect({ to }: { to: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(to);
  }, [router, to]);

  return null;
}
