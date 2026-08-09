import { routing } from '@/i18n/routing';

export const SITE_URL = 'https://rahacloud.github.io';

/**
 * Builds the canonical + hreflang block for one page.
 *
 * Two rules drive this: hreflang annotations are ignored unless the URLs are
 * fully qualified, and every page has to advertise its own translations —
 * inheriting them from a parent segment points the whole site at the home page.
 *
 * `path` is the part after the locale, e.g. '/blog' or '/blog/hello-world'.
 */
export function localeAlternates(locale: string, path = '') {
  const languages: Record<string, string> = {};

  for (const supported of routing.locales) {
    languages[supported] = `${SITE_URL}/${supported}${path}`;
  }
  languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}${path}`;

  return {
    canonical: `${SITE_URL}/${locale}${path}`,
    languages,
  };
}

/**
 * Metadata for a route that only exists in the default locale -- the blog,
 * whose posts are English-only. The other locales serve a redirect stub, so
 * they must not be indexed and must not be advertised as translations.
 */
export function defaultLocaleOnlyAlternates(path = '') {
  const canonical = `${SITE_URL}/${routing.defaultLocale}${path}`;

  return {
    canonical,
    languages: {
      [routing.defaultLocale]: canonical,
      'x-default': canonical,
    },
  };
}
