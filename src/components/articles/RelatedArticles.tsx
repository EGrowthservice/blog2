import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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
    <div className="my-12 pt-8 border-t border-slate-200">
      {/* Previous / Next Article Navigation */}
      {(prevPost || nextPost) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {prevPost ? (
            <Link
              href={`/article/${prevPost.slug}`}
              className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-slate-50 transition group flex flex-col justify-between"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                Previous Article
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {prevPost.title}
              </h4>
            </Link>
          ) : (
            <div className="hidden md:block"></div>
          )}

          {nextPost && (
            <Link
              href={`/article/${nextPost.slug}`}
              className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-slate-50 transition group flex flex-col justify-between text-right"
            >
              <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
                Next Article
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {nextPost.title}
              </h4>
            </Link>
          )}
        </div>
      )}

      {/* Related Articles Grid */}
      {relatedPosts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Recommended Reading
            </h3>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              From Editorial
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((post) => (
              <ArticleCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
