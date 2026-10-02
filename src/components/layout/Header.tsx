'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, Menu, X, ArrowRight } from 'lucide-react';
import { ICategory } from '@/types';

interface HeaderProps {
  categories?: ICategory[];
  siteName?: string;
}

export default function Header({ categories = [], siteName = 'Spotlight' }: HeaderProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchInput(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 group-hover:scale-105 transition-transform flex items-center justify-center bg-slate-100 shrink-0">
                <Image
                  src="/avt.png"
                  alt={siteName}
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {siteName}
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-400 -mt-0.5">
                  Editorial News & Insights
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links (Home + Categories only, About & Contact moved to Footer) */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              href="/"
              className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-rose-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Home
            </Link>
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/category/${category.slug}`}
                className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-rose-600 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Actions: Search & Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Search Input / Button */}
            {showSearchInput ? (
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  autoFocus
                  className="w-48 sm:w-64 pl-3 pr-8 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={() => setShowSearchInput(false)}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowSearchInput(true)}
                className="p-2 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Search"
                aria-label="Search articles"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Open main menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, news, shows..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition"
            >
              Search
            </button>
          </form>

          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-semibold text-slate-900 hover:bg-rose-50 rounded-lg"
            >
              Home
            </Link>
            <div className="pt-2 pb-1 px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Categories
            </div>
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/category/${category.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                <span>{category.name}</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
