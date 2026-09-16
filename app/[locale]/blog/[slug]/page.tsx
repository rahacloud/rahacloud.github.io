import { notFound } from 'next/navigation';
import LocaleRedirect from '@/components/LocaleRedirect';
import { routing } from '@/i18n/routing';
import { getAllPostSlugs, getPostBySlug } from '@/lib/blog';
import { defaultLocaleOnlyAlternates, SITE_URL } from '@/lib/metadata';

export function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: 'Post Not Found | Raha Cloud Blog' };
  }

  const url = `${SITE_URL}/${routing.defaultLocale}/blog/${slug}`;

  return {
    title: `${post.frontmatter.title} | Raha Cloud Blog`,
    description: post.frontmatter.description,
    alternates: defaultLocaleOnlyAlternates(`/blog/${slug}`),
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      url,
      siteName: 'Raha Cloud',
      type: 'article',
      publishedTime: post.frontmatter.date,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: post.frontmatter.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      images: ['/og-image.png'],
    },
    ...(locale === routing.defaultLocale ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Posts are English-only; other locales redirect to the canonical article.
  if (locale !== routing.defaultLocale) {
    const target = `/${routing.defaultLocale}/blog/${slug}`;

    return (
      <>
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
        <LocaleRedirect to={target} />
      </>
    );
  }

  // Article markup is what earns a post a rich result; the Organization schema
  // on the marketing pages says nothing about an individual piece of writing.
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    datePublished: post.frontmatter.date,
    dateModified: post.frontmatter.date,
    image: `${SITE_URL}/og-image.png`,
    inLanguage: routing.defaultLocale,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${routing.defaultLocale}/blog/${slug}`,
    },
    author: { '@type': 'Organization', name: 'Raha Cloud', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'Raha Cloud',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
  };

  return (
    <article className="blog-post">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD payload built from local frontmatter
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="container">
        <header className="post-header">
          <h1>{post.frontmatter.title}</h1>
          <p className="post-meta">{post.frontmatter.date}</p>
        </header>

        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Markdown HTML is sanitized and controlled */}
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </article>
  );
}
