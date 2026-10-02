import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, Calendar, Flame } from 'lucide-react';
import { IPost, ICategory } from '@/types';
import { formatDate, formatNumber } from '@/lib/utils';

interface ArticleCardProps {
  post: IPost;
  variant?: 'standard' | 'horizontal' | 'compact' | 'lead' | 'minimal';
  rank?: number;
}

export default function ArticleCard({ post, variant = 'standard', rank }: ArticleCardProps) {
  const category = typeof post.category === 'object' && post.category ? (post.category as ICategory) : null;
  const imageUrl = post.featuredImage || '/avt.png';

  // Minimal wire brief variant (great for left column quick news)
  if (variant === 'minimal') {
    return (
      <article className="py-3 border-b border-slate-100 last:border-0 group">
        <div className="flex items-center gap-2 mb-1.5">
          {category && (
            <Link
              href={`/category/${category.slug}`}
              className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider hover:underline"
            >
              {category.name}
            </Link>
          )}
          <span className="text-[10px] text-slate-400">·</span>
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {formatDate(post.publishedAt || post.createdAt)}
          </span>
        </div>
        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
          <Link href={`/article/${post.slug}`}>{post.title}</Link>
        </h4>
      </article>
    );
  }

  // Lead main story variant (centerpiece of news feed)
  if (variant === 'lead') {
    return (
      <article className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:border-indigo-200 hover:shadow-lg transition-all duration-300 group flex flex-col">
        <Link
          href={`/article/${post.slug}`}
          className="relative w-full aspect-[16/9] overflow-hidden bg-slate-100 block"
        >
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 650px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {category && (
            <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-lg bg-indigo-600/90 backdrop-blur-xs text-white text-xs font-bold tracking-wide shadow-sm">
              {category.name}
            </span>
          )}
        </Link>

        <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between space-y-3">
          <div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
              <span className="flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {post.readingTime} min read
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
              <Link href={`/article/${post.slug}`}>{post.title}</Link>
            </h2>

            {post.excerpt && (
              <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mt-2 leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
            <Link
              href={`/article/${post.slug}`}
              className="font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 text-xs"
            >
              Read full story →
            </Link>
            <div className="flex items-center gap-1 text-slate-400">
              <Eye className="w-3.5 h-3.5" />
              <span>{formatNumber(post.views || 0)} views</span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Compact variant (ideal for right column top reads)
  if (variant === 'compact') {
    return (
      <article className="flex gap-3.5 group items-start py-2.5 border-b border-slate-100 last:border-0">
        {rank !== undefined && (
          <span className="text-xl font-black text-slate-300 group-hover:text-indigo-600 transition-colors w-5 shrink-0 text-center leading-none mt-1">
            {rank}
          </span>
        )}
        <Link
          href={`/article/${post.slug}`}
          className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200/60"
        >
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            sizes="72px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="flex-1 min-w-0">
          {category && (
            <Link
              href={`/category/${category.slug}`}
              className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider hover:underline inline-block"
            >
              {category.name}
            </Link>
          )}
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug mt-0.5">
            <Link href={`/article/${post.slug}`}>{post.title}</Link>
          </h4>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
            <span>·</span>
            <span>{post.readingTime}m read</span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition group">
        <Link
          href={`/article/${post.slug}`}
          className="relative w-full sm:w-48 h-36 sm:h-auto rounded-xl overflow-hidden shrink-0 bg-slate-100"
        >
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, 192px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="flex flex-col justify-between flex-1 py-0.5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              {category && (
                <Link
                  href={`/category/${category.slug}`}
                  className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold hover:bg-indigo-100 transition uppercase"
                >
                  {category.name}
                </Link>
              )}
              <span className="text-[11px] text-slate-400">·</span>
              <span className="text-[11px] text-slate-500">
                {post.readingTime} min read
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug mb-1.5">
              <Link href={`/article/${post.slug}`}>{post.title}</Link>
            </h3>

            {post.excerpt && (
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
            <div className="flex items-center gap-1 text-slate-400">
              <Eye className="w-3 h-3" />
              <span>{formatNumber(post.views || 0)}</span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Standard vertical card
  return (
    <article className="flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:border-indigo-200 hover:shadow-lg transition-all duration-300 group">
      <Link
        href={`/article/${post.slug}`}
        className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100 block"
      >
        <Image
          src={imageUrl}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {category && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-indigo-700 text-[11px] font-bold shadow-xs">
            {category.name}
          </span>
        )}
      </Link>

      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
            <span>·</span>
            <span>{post.readingTime}m read</span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug mb-2 line-clamp-2">
            <Link href={`/article/${post.slug}`}>{post.title}</Link>
          </h3>

          {post.excerpt && (
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
              {post.excerpt}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-400">
          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{formatNumber(post.views || 0)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
