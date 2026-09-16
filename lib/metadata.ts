import { routing } from '@/i18n/routing';

// The public home of the site. GitHub Pages is the origin, but it is reached
// through rahacloud.com (Arvan CDN in front), and Pages redirects the
// rahacloud.github.io host here -- so every canonical, hreflang, and sitemap
// URL has to name this domain rather than the origin behind it.
export const SITE_URL = 'https://rahacloud.com';

/**
 * Google Search Console ownership, for the HTML-tag method.
 *
 * DNS TXT verification is usually the better choice -- it covers every
 * subdomain and protocol at once and survives a rebuild -- but the tag is here
 * for the case where DNS is not reachable. Set GOOGLE_SITE_VERIFICATION in the
 * build environment (a repository variable feeding the `pnpm build` step);
 * unset, nothing is emitted.
 */
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

export function verification() {
  return googleSiteVerification ? { verification: { google: googleSiteVerification } } : {};
}

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
