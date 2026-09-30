import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Calendar, Clock, Eye, ArrowLeft } from 'lucide-react';
import { getArticleBySlug, getSiteSettings } from '@/lib/data';
import { formatDate, formatNumber, sanitizeHtmlContent } from '@/lib/utils';
import { getArticleJsonLd, getBreadcrumbJsonLd } from '@/lib/seo';
import TableOfContents from '@/components/articles/TableOfContents';
import SocialShare from '@/components/articles/SocialShare';
import RelatedArticles from '@/components/articles/RelatedArticles';
import ViewCounter from '@/components/articles/ViewCounter';
import { ICategory, ITag } from '@/types';

export const dynamic = 'force-dynamic';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const { post } = await getArticleBySlug(slug);
  const settings = await getSiteSettings();

  if (!post) {
    return {
      title: 'Article Not Found',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const postUrl = `${siteUrl}/article/${post.slug}`;
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;

  return {
    title,
    description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title,
      description,
      url: postUrl,
      type: 'article',
      publishedTime: post.publishedAt || post.createdAt,
      modifiedTime: post.updatedAt || post.publishedAt || post.createdAt,
      images: [
        {
          url: post.featuredImage || settings.ogImage || '',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [post.featuredImage || settings.ogImage || ''],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const [{ post, relatedPosts, prevPost, nextPost }] =
    await Promise.all([
      getArticleBySlug(slug),
    ]);

  if (!post) {
    notFound();
  }

  const category = typeof post.category === 'object' && post.category ? (post.category as ICategory) : null;
  const tags = Array.isArray(post.tags) ? (post.tags as ITag[]) : [];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const articleUrl = `${siteUrl}/article/${post.slug}`;

  // Structured Data Schemas
  const articleJsonLd = getArticleJsonLd(post, siteUrl);
  const breadcrumbJsonLd = getBreadcrumbJsonLd(
    [
      { name: 'Home', url: '/' },
      ...(category ? [{ name: category.name, url: `/category/${category.slug}` }] : []),
      { name: post.title, url: `/article/${post.slug}` },
    ],
    siteUrl
  );

  const sanitizedContent = sanitizeHtmlContent(post.content);

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Real view count updater */}
      <ViewCounter articleIdOrSlug={post._id} />

      <article className="max-w-4xl mx-auto">
        {/* Back Link & Category */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>

          {category && (
            <Link
              href={`/category/${category.slug}`}
              className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs uppercase tracking-wider hover:bg-indigo-100 transition"
            >
              {category.name}
            </Link>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-6 font-normal">
            {post.excerpt}
          </p>
        )}

        {/* Meta Bar without author */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 border-y border-slate-200/80 mb-8 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {post.readingTime} min read
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-500 font-medium">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatNumber(post.views || 0)} views</span>
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden mb-10 shadow-lg bg-slate-100">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        {/* Table of Contents */}
        <TableOfContents content={sanitizedContent} />

        {/* Main Article Content */}
        <div
          className="article-body prose prose-slate max-w-none mb-10"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-slate-200">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
              Filed under:
            </span>
            {tags.map((tg) => {
              const tagObj = typeof tg === 'object' ? tg : { name: tg, slug: tg };
              return (
                <Link
                  key={tagObj.slug}
                  href={`/tag/${tagObj.slug}`}
                  className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium hover:bg-indigo-50 hover:text-indigo-600 transition"
                >
                  #{tagObj.name}
                </Link>
              );
            })}
          </div>
        )}

        {/* Social Sharing */}
        <SocialShare url={articleUrl} title={post.title} />

        {/* Internal Linking: Related & Prev/Next */}
        <RelatedArticles
          relatedPosts={relatedPosts}
          prevPost={prevPost}
          nextPost={nextPost}
        />
      </article>
    </>
  );
}
