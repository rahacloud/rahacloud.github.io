import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getAllPosts } from '@/lib/blog';
import { SITE_URL } from '@/lib/metadata';

/**
 * Generated at build time rather than hand-written, so a new locale or post
 * cannot be forgotten -- the file this replaces still listed two locales and
 * was missing Spanish entirely.
 */
export const dynamic = 'force-static';

function localeEntry(path: string, lastModified: Date, changeFrequency: 'weekly' | 'monthly') {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, `${SITE_URL}/${locale}${path}`])
  );

  return routing.locales.map((locale) => ({
    url: `${SITE_URL}/${locale}${path}`,
    lastModified,
    changeFrequency,
    priority: path === '' ? 1 : 0.8,
    alternates: {
      languages: { ...languages, 'x-default': `${SITE_URL}/${routing.defaultLocale}${path}` },
    },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const posts = getAllPosts();

  // Posts are English-only; the other locales serve a noindex redirect stub,
  // so only the canonical URL belongs here.
  const postEntries = posts.map((post) => ({
    url: `${SITE_URL}/${routing.defaultLocale}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    ...localeEntry('', now, 'weekly'),
    ...localeEntry('/pitch', now, 'monthly'),
    {
      url: `${SITE_URL}/${routing.defaultLocale}/blog`,
      lastModified: posts[0] ? new Date(posts[0].frontmatter.date) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    ...postEntries,
  ];
}
