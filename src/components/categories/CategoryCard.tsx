import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { ICategory } from '@/types';

interface CategoryCardProps {
  category: ICategory;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative block overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-6 hover:shadow-xl transition-all duration-300"
    >
      {category.image && (
        <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-50 transition-opacity group-hover:scale-105 duration-500">
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>
      )}

      <div className="relative z-10 flex flex-col justify-between h-44">
        <div className="flex items-center justify-between">
          {category.articleCount !== undefined && (
            <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide">
              {category.articleCount} Articles
            </span>
          )}
          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-indigo-600 transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
