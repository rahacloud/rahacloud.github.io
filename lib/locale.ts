import { routing } from '@/i18n/routing';

export const LOCALE_STORAGE_KEY = 'locale';

type Locale = (typeof routing.locales)[number];

function isSupported(value: string | null): value is Locale {
  return value !== null && (routing.locales as readonly string[]).includes(value);
}

/** The locale the visitor last picked with the toggle, if any. */
export function readStoredLocale(): Locale | null {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    return isSupported(stored) ? stored : null;
  } catch {
    // Storage can be unavailable (private mode, blocked cookies). Fall back to
    // detection rather than failing the redirect.
    return null;
  }
}

export function storeLocale(locale: Locale): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // A preference we cannot persist is not worth breaking the switch over.
  }
}

/**
 * Guesses whether the visitor is in Iran, to serve Persian by default.
 *
 * The site is a static export, so nothing in the stack ever sees the visitor's
 * IP address and true geolocation is not available. Device timezone plus
 * browser language stands in for it -- and for this audience it is arguably the
 * better signal, since a VPN moves the IP but leaves the timezone alone.
 */
export function detectLocale(): Locale {
  let timeZone = '';

  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
  } catch {
    timeZone = '';
  }

  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  const prefersPersian = languages.some((language) => language?.toLowerCase().startsWith('fa'));

  return timeZone === 'Asia/Tehran' || prefersPersian ? 'fa' : routing.defaultLocale;
}
