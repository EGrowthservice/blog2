import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, Sparkles, ArrowRight, Calendar } from 'lucide-react';
import { IPost, ICategory } from '@/types';
import { formatDate, formatNumber } from '@/lib/utils';

interface FeaturedArticleProps {
  post: IPost;
}

export default function FeaturedArticle({ post }: FeaturedArticleProps) {
  const category = typeof post.category === 'object' && post.category ? (post.category as ICategory) : null;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl group my-8">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 -mt-20 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 -mb-20 w-80 h-80 rounded-full bg-violet-600/10 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
        {/* Text Content */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-semibold text-xs tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Featured Cover Story
            </span>
            {category && (
              <Link
                href={`/category/${category.slug}`}
                className="text-xs font-medium text-slate-400 hover:text-white transition"
              >
                in {category.name}
              </Link>
            )}
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] group-hover:text-indigo-200 transition-colors">
            <Link href={`/article/${post.slug}`}>{post.title}</Link>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {post.readingTime} min read
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                {formatNumber(post.views || 0)} views
              </span>
            </div>

            <Link
              href={`/article/${post.slug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition shadow-lg shadow-indigo-600/30 group-hover:translate-x-1 duration-200"
            >
              <span>Read Full Article</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Featured Image */}
        <div className="lg:col-span-5">
          <Link
            href={`/article/${post.slug}`}
            className="block relative aspect-[16/10] lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
          >
            <Image
              src={post.featuredImage || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&h=800&q=80'}
              alt={post.title}
              fill
              priority
              quality={75}
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
          </Link>
        </div>
      </div>
    </section>
  );
}
