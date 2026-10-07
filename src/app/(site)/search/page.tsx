import type { Metadata } from 'next';
import Link from 'next/link';
import { Search as SearchIcon, ArrowRight, Frown } from 'lucide-react';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import Category from '@/models/Category';
import ArticleCard from '@/components/articles/ArticleCard';
import { IPost } from '@/types';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search results for "${q}"` : 'Search Articles',
    description: 'Search across all published articles, stories, and commentary on Spotlight.',
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '', page: pageParam = '1' } = await searchParams;
  const page = parseInt(pageParam, 10);
  const limit = 10;
  const query = q.trim();

  let posts: IPost[] = [];
  let totalPosts = 0;

  if (query) {
    try {
      await connectDB();
      const skip = (page - 1) * limit;

      const searchFilter = {
        status: 'published' as const,
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { excerpt: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { seoKeywords: { $in: [new RegExp(query, 'i')] } },
        ],
      };

      const [docs, count] = await Promise.all([
        Post.find(searchFilter)
          .select('title slug excerpt featuredImage category publishedAt createdAt views readingTime')
          .populate('category', 'name slug')
          .sort({ publishedAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Post.countDocuments(searchFilter),
      ]);

      posts = JSON.parse(JSON.stringify(docs));
      totalPosts = count;
    } catch (e) {
      console.warn('Search query error:', e);
    }
  }

  const totalPages = Math.ceil(totalPosts / limit);

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Search Header Form */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
          Search Spotlight Archive
        </h1>
        <p className="text-slate-600 text-sm mb-6">
          Query stories across Entertainment, Sports, and Comedy.
        </p>

        <form action="/search" method="GET" className="relative flex items-center">
          <SearchIcon className="w-5 h-5 absolute left-4 text-slate-400 pointer-events-none" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search stories: Cinema, Football, Stand-up, Pop Culture..."
            className="w-full pl-12 pr-28 py-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
          <button
            type="submit"
            className="absolute right-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Query Stats */}
      {query && (
        <div className="flex items-center justify-between px-2 text-sm text-slate-600">
          <div>
            Showing results for <span className="font-bold text-slate-900">&quot;{query}&quot;</span>
          </div>
          <div className="text-xs font-semibold text-slate-400">
            {totalPosts} {totalPosts === 1 ? 'result' : 'results'} found
          </div>
        </div>
      )}

      {/* Results Feed */}
      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <ArticleCard key={post._id} post={post} variant="horizontal" />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-16 px-6 bg-white rounded-3xl border border-slate-200">
          <Frown className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">
            No articles found matching &quot;{query}&quot;
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Try refining your keywords, checking for typos, or browsing our curated categories.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 mt-5 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-500 transition"
          >
            Return to Homepage
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : null}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isCurrent = pageNum === page;
            return (
              <Link
                key={pageNum}
                href={`/search?q=${encodeURIComponent(query)}&page=${pageNum}`}
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
