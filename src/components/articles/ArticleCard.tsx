import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, Calendar } from 'lucide-react';
import { IPost, ICategory } from '@/types';
import { formatDate, formatNumber } from '@/lib/utils';

interface ArticleCardProps {
  post: IPost;
  variant?: 'standard' | 'horizontal' | 'compact';
}

export default function ArticleCard({ post, variant = 'standard' }: ArticleCardProps) {
  const category = typeof post.category === 'object' && post.category ? (post.category as ICategory) : null;

  if (variant === 'compact') {
    return (
      <article className="flex gap-4 group items-start">
        <Link
          href={`/article/${post.slug}`}
          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100"
        >
          <Image
            src={post.featuredImage || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80'}
            alt={post.title}
            fill
            sizes="96px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="flex-1 min-w-0">
          {category && (
            <Link
              href={`/category/${category.slug}`}
              className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider hover:underline inline-block mb-1"
            >
              {category.name}
            </Link>
          )}
          <h4 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug">
            <Link href={`/article/${post.slug}`}>{post.title}</Link>
          </h4>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readingTime}m
            </span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article className="flex flex-col sm:flex-row gap-6 p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-200 hover:shadow-lg transition group">
        <Link
          href={`/article/${post.slug}`}
          className="relative w-full sm:w-64 h-48 sm:h-auto rounded-xl overflow-hidden shrink-0 bg-slate-100"
        >
          <Image
            src={post.featuredImage || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, 256px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="flex flex-col justify-between flex-1 py-1">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {category && (
                <Link
                  href={`/category/${category.slug}`}
                  className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold hover:bg-indigo-100 transition"
                >
                  {category.name}
                </Link>
              )}
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readingTime} min read
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight mb-2">
              <Link href={`/article/${post.slug}`}>{post.title}</Link>
            </h3>

            <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formatDate(post.publishedAt || post.createdAt)}
            </span>

            <div className="flex items-center gap-1 text-slate-400">
              <Eye className="w-3.5 h-3.5" />
              <span>{formatNumber(post.views || 0)} views</span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Standard vertical card
  return (
    <article className="flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:border-indigo-200 hover:shadow-xl transition-all duration-300 group">
      <Link
        href={`/article/${post.slug}`}
        className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100 block"
      >
        <Image
          src={post.featuredImage || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-sm text-indigo-700 text-xs font-bold tracking-wide shadow-sm">
            {category.name}
          </span>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTime} min read
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug mb-2 line-clamp-2">
            <Link href={`/article/${post.slug}`}>{post.title}</Link>
          </h3>

          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {post.excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
          <span className="text-[11px] text-slate-400">
            {formatDate(post.publishedAt || post.createdAt)}
          </span>

          <div className="flex items-center gap-1 text-slate-400">
            <Eye className="w-3.5 h-3.5" />
            <span>{formatNumber(post.views || 0)} views</span>
          </div>
        </div>
      </div>
    </article>
  );
}
