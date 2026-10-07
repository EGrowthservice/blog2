import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Sparkles, Folder } from 'lucide-react';
import { IPost, ICategory } from '@/types';
import { formatDate } from '@/lib/utils';

interface ArticleSidebarProps {
  posts: IPost[];
  currentCategory?: ICategory | null;
  categories?: ICategory[];
}

export default function ArticleSidebar({
  posts = [],
  currentCategory,
  categories = [],
}: ArticleSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Related Posts Widget */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Related Articles</h3>
          </div>
          {currentCategory && (
            <Link
              href={`/category/${currentCategory.slug}`}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              View All
            </Link>
          )}
        </div>

        {posts.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">No related articles yet...</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const category =
                typeof post.category === 'object' && post.category
                  ? (post.category as ICategory)
                  : null;

              return (
                <article
                  key={post._id}
                  className="group flex gap-3.5 items-start pb-3.5 border-b border-slate-100 last:border-b-0 last:pb-0"
                >
                  {/* Article Thumbnail */}
                  <Link
                    href={`/article/${post.slug}`}
                    className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-slate-100 shadow-2xs"
                  >
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        quality={75}
                        sizes="80px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center text-indigo-300 text-xs font-bold">
                        Spotlight
                      </div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    {category && (
                      <Link
                        href={`/category/${category.slug}`}
                        className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 transition line-clamp-1 mb-1 block"
                      >
                        {category.name}
                      </Link>
                    )}

                    <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug mb-1.5">
                      <Link href={`/article/${post.slug}`}>{post.title}</Link>
                    </h4>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.publishedAt || post.createdAt)}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readingTime || 1} min
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Categories Widget */}
      {categories.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Folder className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Categories</h3>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/category/${cat.slug}`}
                className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition flex items-center gap-1"
              >
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
