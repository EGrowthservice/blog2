import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Tag as TagIcon, ArrowLeft, BookOpen } from 'lucide-react';
import connectDB from '@/lib/mongodb';
import Tag from '@/models/Tag';
import Post from '@/models/Post';
import ArticleCard from '@/components/articles/ArticleCard';
import { getBreadcrumbJsonLd } from '@/lib/seo';
import { ITag, IPost } from '@/types';

export const dynamic = 'force-dynamic';

interface TagPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const tag = await Tag.findOne({ slug }).lean();

  if (!tag) {
    return { title: 'Tag Not Found' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    title: `Articles tagged with #${tag.name}`,
    description: `Explore articles, in-depth stories, and commentary focused on #${tag.name}.`,
    alternates: {
      canonical: `${siteUrl}/tag/${tag.slug}`,
    },
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { slug } = await params;
  const { page: pageQuery } = await searchParams;
  const page = parseInt(pageQuery || '1', 10);
  const limit = 12;

  await connectDB();
  const tagDoc = await Tag.findOne({ slug }).lean();

  if (!tagDoc) {
    notFound();
  }

  const tag: ITag = JSON.parse(JSON.stringify(tagDoc));

  const skip = (page - 1) * limit;
  const [postDocs, totalPosts] = await Promise.all([
    Post.find({ tags: tag._id, status: 'published' })
      .populate('category', 'name slug')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments({ tags: tag._id, status: 'published' }),
  ]);

  const posts: IPost[] = JSON.parse(JSON.stringify(postDocs));
  const totalPages = Math.ceil(totalPosts / limit);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const breadcrumbJsonLd = getBreadcrumbJsonLd(
    [
      { name: 'Home', url: '/' },
      { name: `#${tag.name}`, url: `/tag/${tag.slug}` },
    ],
    siteUrl
  );

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Header */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-8 sm:p-12 shadow-xs">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home Feed
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TagIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              #{tag.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {totalPosts} curated {totalPosts === 1 ? 'article' : 'articles'} in this collection
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <ArticleCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No articles tagged with #{tag.name}</h3>
          <Link
            href="/"
            className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-500 transition"
          >
            Explore Homepage
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isCurrent = pageNum === page;
            return (
              <Link
                key={pageNum}
                href={`/tag/${tag.slug}?page=${pageNum}`}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
