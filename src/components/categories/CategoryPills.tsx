import Link from 'next/link';
import { ICategory } from '@/types';

interface CategoryPillsProps {
  categories: ICategory[];
  activeSlug?: string;
}

export default function CategoryPills({ categories = [], activeSlug }: CategoryPillsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar scroll-smooth">
      <Link
        href="/"
        className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
          !activeSlug
            ? 'bg-slate-900 text-white shadow-sm'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }`}
      >
        All Feeds
      </Link>
      {categories.map((cat) => {
        const isActive = activeSlug === cat.slug;
        return (
          <Link
            key={cat._id}
            href={`/category/${cat.slug}`}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              isActive
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat.name}
            {cat.articleCount !== undefined && cat.articleCount > 0 && (
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {cat.articleCount}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
