import Link from 'next/link';
import LocaleRedirect from '@/components/LocaleRedirect';
import { routing } from '@/i18n/routing';
import { getAllPosts } from '@/lib/blog';
import { defaultLocaleOnlyAlternates } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return {
    alternates: defaultLocaleOnlyAlternates('/blog'),
    ...(locale === routing.defaultLocale ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Posts are written in English only, so every other locale redirects here
  // rather than serving the same articles under a translated URL.
  if (locale !== routing.defaultLocale) {
    const target = `/${routing.defaultLocale}/blog`;

    return (
      <>
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
        <LocaleRedirect to={target} />
      </>
    );
  }

  const posts = getAllPosts();

  return (
    <div className="blog-page">
      <div className="container">
        <header className="blog-page-header">
          <p className="eyebrow">Technical Articles</p>
          <h1 className="section-title">Blog</h1>
          <p className="section-subtitle">
            Insights about DevOps, cloud infrastructure, and engineering best practices.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="empty-state">
            <p>No posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} className="post-card">
                <h2>{post.frontmatter.title}</h2>
                <p className="post-meta">{post.frontmatter.date}</p>
                <p className="post-excerpt">{post.frontmatter.description}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
