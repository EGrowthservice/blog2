import Link from 'next/link';
import { Flame, Sparkles, FolderTree, ArrowRight, Tag as TagIcon } from 'lucide-react';
import FeaturedArticle from '@/components/articles/FeaturedArticle';
import ArticleCard from '@/components/articles/ArticleCard';
import CategoryPills from '@/components/categories/CategoryPills';
import {
  getHomepageArticles,
  getActiveCategories,
} from '@/lib/data';
import connectDB from '@/lib/mongodb';
import Tag from '@/models/Tag';
import { ITag } from '@/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [
    { featuredPost, latestPosts, popularPosts },
    categories,
  ] = await Promise.all([
    getHomepageArticles(),
    getActiveCategories(),
  ]);

  // Fetch tags for tag cloud
  let tags: ITag[] = [];
  try {
    await connectDB();
    const tagDocs = await Tag.find().limit(12).lean();
    tags = JSON.parse(JSON.stringify(tagDocs));
  } catch (e) {
    console.warn('Error fetching tags for sidebar:', e);
  }

  // Filter out featured post from latest posts so it doesn't appear twice
  const remainingLatest = featuredPost
    ? latestPosts.filter((p) => p._id !== featuredPost._id)
    : latestPosts;

  const hasArticles = featuredPost || latestPosts.length > 0;

  return (
    <div className="space-y-10">
      {/* Category Pills Bar */}
      <div className="border-b border-slate-200/80 pb-3">
        <CategoryPills categories={categories} />
      </div>

      {/* Empty State if no articles yet */}
      {!hasArticles && (
        <div className="my-16 text-center py-16 px-6 bg-white border border-slate-200 rounded-3xl shadow-sm max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome to the Publication
          </h2>
          <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Content database is ready. Sign in to the Admin Dashboard to compose and publish articles in HTML format.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/admin/login"
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold transition shadow-md shadow-rose-600/20"
            >
              Access Admin CMS
            </Link>
          </div>
        </div>
      )}

      {/* Featured Cover Story */}
      {featuredPost && <FeaturedArticle post={featuredPost} />}

      {/* Main Content & Sidebar Grid */}
      {hasArticles && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Feed Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Latest Articles Section */}
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Latest Stories
                  </h2>
                </div>
                <Link
                  href="/search"
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 group"
                >
                  View Archive
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {remainingLatest.slice(0, 6).map((post) => (
                  <ArticleCard key={post._id} post={post} />
                ))}
              </div>
            </div>

            {/* Additional Stories */}
            {remainingLatest.length > 6 && (
              <div>
                <div className="pb-4 mb-6 border-b border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    More Stories
                  </h3>
                </div>

                <div className="space-y-4">
                  {remainingLatest.slice(6, 12).map((post) => (
                    <ArticleCard key={post._id} post={post} variant="horizontal" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column (4 Cols) */}
          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
            {/* Popular Posts Widget */}
            {popularPosts.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                <div className="flex items-center gap-2 pb-3.5 mb-4 border-b border-slate-200">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Trending Reads
                  </h3>
                </div>

                <div className="space-y-4">
                  {popularPosts.map((post) => (
                    <ArticleCard key={post._id} post={post} variant="compact" />
                  ))}
                </div>
              </div>
            )}

            {/* Categories Widget */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
              <div className="flex items-center gap-2 pb-3.5 mb-4 border-b border-slate-200">
                <FolderTree className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Browse Channels
                </h3>
              </div>

              <div className="space-y-2">
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/category/${cat.slug}`}
                    className="flex items-center justify-between py-2 px-3 rounded-xl text-sm font-semibold text-slate-700 hover:text-rose-600 hover:bg-slate-50 transition"
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs text-slate-400 font-semibold px-2 py-0.5 rounded-full bg-slate-100">
                      {cat.articleCount || 0}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tag Cloud */}
            {tags.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                <div className="flex items-center gap-2 pb-3.5 mb-4 border-b border-slate-200">
                  <TagIcon className="w-4 h-4 text-rose-600" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Topics & Tags
                  </h3>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tg) => (
                    <Link
                      key={tg._id}
                      href={`/tag/${tg.slug}`}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 transition"
                    >
                      #{tg.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
