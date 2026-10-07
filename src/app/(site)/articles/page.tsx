import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, BookOpen } from 'lucide-react';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import Category from '@/models/Category';
import ArticleCard from '@/components/articles/ArticleCard';
import { getSiteSettings } from '@/lib/data';
import { IPost } from '@/types';

export const revalidate = 60;

interface ArticlesPageProps {
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: 'All Articles & Archives',
    description: `Browse all news dispatches, analytical essays, and editorial reporting across ${settings.siteName}.`,
  };
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const { page: pageQuery } = await searchParams;
  const page = parseInt(pageQuery || '1', 10);
  const limit = 12;

  await connectDB();
  const skip = (page - 1) * limit;

  const [postDocs, totalPosts] = await Promise.all([
    Post.find({ status: 'published' })
      .select('title slug excerpt featuredImage category publishedAt createdAt views readingTime')
      .populate('category', 'name slug')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments({ status: 'published' }),
  ]);

  const posts: IPost[] = JSON.parse(JSON.stringify(postDocs));
  const totalPages = Math.ceil(totalPosts / limit);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            All Articles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete chronological archive of all editorial publications ({totalPosts} total).
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      {posts.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <ArticleCard key={post._id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/articles?page=${page - 1}`}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 font-semibold text-slate-700 transition"
                  >
                    Previous
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    href={`/articles?page=${page + 1}`}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 font-semibold transition"
                  >
                    Next Page
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No articles published yet</h3>
          <p className="text-sm text-slate-500 mt-1">
            Articles will appear here once published.
          </p>
        </div>
      )}
    </div>
  );
}
