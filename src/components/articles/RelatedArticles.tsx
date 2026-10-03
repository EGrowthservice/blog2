import Link from 'next/link';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import ArticleCard from './ArticleCard';
import { IPost } from '@/types';

interface RelatedArticlesProps {
  relatedPosts: IPost[];
  prevPost?: IPost | null;
  nextPost?: IPost | null;
}

export default function RelatedArticles({
  relatedPosts = [],
  prevPost,
  nextPost,
}: RelatedArticlesProps) {
  return (
    <div className="my-10 pt-8 border-t border-slate-200">
      {/* Previous / Next Article Navigation */}
      {(prevPost || nextPost) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {prevPost ? (
            <Link
              href={`/article/${prevPost.slug}`}
              className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-slate-50/80 transition-all group flex flex-col justify-between shadow-2xs"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Bài trước</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {prevPost.title}
              </h4>
            </Link>
          ) : (
            <div className="hidden md:block"></div>
          )}

          {nextPost && (
            <Link
              href={`/article/${nextPost.slug}`}
              className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-slate-50/80 transition-all group flex flex-col justify-between text-right shadow-2xs"
            >
              <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
                <span>Bài tiếp theo</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {nextPost.title}
              </h4>
            </Link>
          )}
        </div>
      )}

      {/* Bottom Related Articles Grid */}
      {relatedPosts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Bài viết liên quan khác
              </h3>
            </div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Khám phá thêm
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {relatedPosts.map((post) => (
              <ArticleCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
