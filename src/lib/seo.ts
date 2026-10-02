import { IPost, ISetting } from '@/types';

export const DEFAULT_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  'http://localhost:3000';

export function getArticleJsonLd(post: IPost, siteUrl: string = DEFAULT_SITE_URL) {
  const authorName = typeof post.author === 'object' && post.author ? post.author.name : 'Spotlight Editorial Desk';
  const categoryName = typeof post.category === 'object' && post.category ? post.category.name : 'Entertainment';

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/article/${post.slug}`,
    },
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    image: post.featuredImage ? [post.featuredImage] : [],
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt,
    author: {
      '@type': 'Organization',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Spotlight',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/avt.png`,
      },
    },
    articleSection: categoryName,
    keywords: Array.isArray(post.seoKeywords) ? post.seoKeywords.join(', ') : '',
  };
}

export function getBreadcrumbJsonLd(
  items: { name: string; url: string }[],
  siteUrl: string = DEFAULT_SITE_URL
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}

export function getOrganizationJsonLd(settings?: Partial<ISetting>, siteUrl: string = DEFAULT_SITE_URL) {
  const siteName = settings?.siteName || 'Spotlight';
  const socialProfiles = settings?.socialLinks
    ? Object.values(settings.socialLinks).filter(Boolean)
    : [];

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: settings?.logo || `${siteUrl}/logo.png`,
    sameAs: socialProfiles,
    contactPoint: {
      '@type': 'ContactPoint',
      email: settings?.email || 'qbinhtkcongviec@gmail.com',
      contactType: 'editorial',
    },
  };
}
