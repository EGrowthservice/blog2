import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Calendar, Clock, Eye, ArrowLeft } from 'lucide-react';
import { getArticleBySlug, getSiteSettings, getActiveCategories } from '@/lib/data';
import { formatDate, formatNumber, sanitizeHtmlContent } from '@/lib/utils';
import { getArticleJsonLd, getBreadcrumbJsonLd } from '@/lib/seo';
import SocialShare from '@/components/articles/SocialShare';
import RelatedArticles from '@/components/articles/RelatedArticles';
import ArticleSidebar from '@/components/articles/ArticleSidebar';
import ViewCounter from '@/components/articles/ViewCounter';
import CommentSection from '@/components/articles/CommentSection';
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
  const [{ post, relatedPosts, sidebarPosts, prevPost, nextPost }, categories] =
    await Promise.all([
      getArticleBySlug(slug),
      getActiveCategories(),
    ]);

  if (!post) {
    notFound();
  }

  const category =
    typeof post.category === 'object' && post.category ? (post.category as ICategory) : null;
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Navigation Bar / Breadcrumb Header */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/70">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>

          {category && (
            <Link
              href={`/category/${category.slug}`}
              className="px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs uppercase tracking-wider hover:bg-indigo-100 transition border border-indigo-100"
            >
              {category.name}
            </Link>
          )}
        </div>

        {/* 2-Column Responsive Layout: Main Article (8 cols) + Right Sidebar (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Article Content */}
          <article className="lg:col-span-8 min-w-0">
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.2] mb-4 sm:mb-6">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6 font-normal">
                {post.excerpt}
              </p>
            )}

            {/* Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 border-y border-slate-200/80 mb-8 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {formatDate(post.publishedAt || post.createdAt)}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {post.readingTime || 1} min read
                </span>
              </div>

              <div className="flex items-center gap-1 text-slate-500 font-medium">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatNumber(post.views || 0)} views</span>
              </div>
            </div>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="relative aspect-[16/9] w-full rounded-2xl sm:rounded-3xl overflow-hidden mb-8 shadow-md bg-slate-100">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 850px"
                  className="object-cover"
                />
              </div>
            )}

            {/* Main Article Content (Table of Contents removed as requested) */}
            <div
              className="article-body prose prose-slate max-w-none mb-10 text-slate-800"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-slate-200 mb-8">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
                  Tagged with:
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

            {/* Bottom Related Articles & Prev/Next */}
            <RelatedArticles
              relatedPosts={relatedPosts}
              prevPost={prevPost}
              nextPost={nextPost}
            />

            {/* Guest Comments & Reporting */}
            <CommentSection postId={post._id} postTitle={post.title} />
          </article>

          {/* Right Sidebar: Related Articles & Categories */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
              <ArticleSidebar
                posts={sidebarPosts}
                currentCategory={category}
                categories={categories}
              />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
