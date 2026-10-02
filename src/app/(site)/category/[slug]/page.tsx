import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import Post from '@/models/Post';
import ArticleCard from '@/components/articles/ArticleCard';
import { getSiteSettings } from '@/lib/data';
import { getBreadcrumbJsonLd } from '@/lib/seo';
import { ICategory, IPost } from '@/types';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const category = await Category.findOne({ slug, isActive: { $ne: false } }).lean();

  if (!category) {
    return { title: 'Category Not Found' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const title = category.seoTitle || `${category.name} Articles & Analysis`;
  const description = category.seoDescription || category.description;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/category/${category.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/category/${category.slug}`,
      images: category.image ? [{ url: category.image }] : [],
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page: pageQuery } = await searchParams;
  const page = parseInt(pageQuery || '1', 10);
  const limit = 12;

  await connectDB();
  const [categoryDoc, settings] = await Promise.all([
    Category.findOne({ slug, isActive: { $ne: false } }).lean(),
    getSiteSettings(),
  ]);

  if (!categoryDoc) {
    notFound();
  }

  const category: ICategory = JSON.parse(JSON.stringify(categoryDoc));

  const skip = (page - 1) * limit;
  const [postDocs, totalPosts] = await Promise.all([
    Post.find({ category: category._id, status: 'published' })
      .populate('category', 'name slug')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments({ category: category._id, status: 'published' }),
  ]);

  const posts: IPost[] = JSON.parse(JSON.stringify(postDocs));
  const totalPages = Math.ceil(totalPosts / limit);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const breadcrumbJsonLd = getBreadcrumbJsonLd(
    [
      { name: 'Home', url: '/' },
      { name: category.name, url: `/category/${category.slug}` },
    ],
    siteUrl
  );

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Clean Category Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          {category.name}
        </h1>

        {category.description && (
          <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            {category.description}
          </p>
        )}
      </div>


      {/* Articles Feed */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <ArticleCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No articles yet in this category</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Check back shortly or explore other categories across {settings.siteName}.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-500 transition"
          >
            Explore Homepage
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isCurrent = pageNum === page;
            return (
              <Link
                key={pageNum}
                href={`/category/${category.slug}?page=${pageNum}`}
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
