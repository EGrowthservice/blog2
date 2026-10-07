import Link from 'next/link';
import { Flame, Sparkles, ArrowRight } from 'lucide-react';
import ArticleCard from '@/components/articles/ArticleCard';
import { getHomepageArticles } from '@/lib/data';

export const revalidate = 60;

export default async function HomePage() {
  const { featuredPost, latestPosts, popularPosts } = await getHomepageArticles();

  // Consolidate articles into a unified pool
  const allPosts = [
    ...(featuredPost ? [featuredPost] : []),
    ...latestPosts.filter((p) => p._id !== featuredPost?._id),
  ];

  const hasArticles = allPosts.length > 0;

  // Center Lead Story + Main News Feed
  const leadPost = allPosts[0] || null;
  const centerFeedPosts = allPosts.slice(1, 7);

  // Top Reads for Right Column (pure news, no fluff)
  const topReadPosts = popularPosts.length > 0 ? popularPosts.slice(0, 5) : allPosts.slice(1, 6);

  return (
    <div className="space-y-8">
      {/* Empty State if no articles yet */}
      {!hasArticles && (
        <div className="my-16 text-center py-16 px-6 bg-white border border-slate-200 rounded-3xl shadow-xs max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            No News Published Yet
          </h2>
          <p className="text-slate-500 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
            The publication database is ready. Sign in to the staff portal to publish your first editorial article.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/admin/login"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-indigo-600/20"
            >
              Access Admin Portal
            </Link>
          </div>
        </div>
      )}

      {/* Pure News Layout: Main News Stream (8 cols) + Top Reads (4 cols) */}
      {hasArticles && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ========================================================
                MAIN NEWS FEED (8 Cols): Lead Story & News Grid
               ======================================================== */}
            <section className="lg:col-span-8 space-y-8">
              {/* Primary Lead Story */}
              {leadPost && (
                <div>
                  <ArticleCard post={leadPost} variant="lead" />
                </div>
              )}

              {/* Subsequent News Stories */}
              {centerFeedPosts.length > 0 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Latest Dispatches
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {centerFeedPosts.map((post) => (
                      <ArticleCard key={`center-${post._id}`} post={post} variant="standard" />
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* ========================================================
                TOP READS (4 Cols): Ranked News Stories
               ======================================================== */}
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
                <div className="flex items-center gap-2 pb-3.5 mb-2 border-b border-slate-100">
                  <Flame className="w-4 h-4 text-amber-500 shrink-0" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Top Reads
                  </h3>
                </div>

                <div className="space-y-1">
                  {topReadPosts.map((post, idx) => (
                    <ArticleCard
                      key={`top-${post._id}`}
                      post={post}
                      variant="compact"
                      rank={idx + 1}
                    />
                  ))}
                </div>
              </div>
            </aside>
          </div>

          {/* ========================================================
              BOTTOM: "MORE" / "VIEW ALL ARTICLES" BUTTON
             ======================================================== */}
          <div className="pt-4 pb-4 text-center">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-white hover:bg-slate-900 border border-slate-200 hover:border-slate-900 text-slate-800 hover:text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-xs hover:shadow-lg transition-all duration-200 group"
            >
              <span>More Articles</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
