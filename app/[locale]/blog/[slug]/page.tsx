import { notFound } from 'next/navigation';
import LocaleRedirect from '@/components/LocaleRedirect';
import { routing } from '@/i18n/routing';
import { getAllPostSlugs, getPostBySlug } from '@/lib/blog';
import { defaultLocaleOnlyAlternates } from '@/lib/metadata';

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

  return {
    title: `${post.frontmatter.title} | Raha Cloud Blog`,
    description: post.frontmatter.description,
    alternates: defaultLocaleOnlyAlternates(`/blog/${slug}`),
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

  return (
    <article className="blog-post">
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
