'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Shield } from 'lucide-react';
import { ICategory, ISetting } from '@/types';

interface FooterProps {
  categories?: ICategory[];
  settings?: Partial<ISetting>;
}

export default function Footer({ categories = [], settings }: FooterProps) {
  const siteName = settings?.siteName || 'Spotlight';

  return (
    <footer className="bg-slate-950 text-slate-400 pt-12 pb-10 border-t border-slate-900 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-900/80">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-3.5">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center shrink-0">
                <Image
                  src="/avt.png"
                  alt={siteName}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {siteName}
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              {settings?.description ||
                'Delivering authoritative, fast, and authentic editorial reporting across modern culture, technology, and sports.'}
            </p>
            <div className="pt-1 flex items-center gap-4 text-slate-500">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-medium"
              >
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                Staff Portal
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5">
              Channels
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {categories.map((cat) => (
                <li key={cat._id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-indigo-400 transition"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About & Contact */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5">
              Information
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/about" className="hover:text-indigo-400 transition">
                  About & Standards
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-400 transition">
                  Contact Desk
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-indigo-400 transition">
                  Search Archive
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5">
              Legal
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/privacy-policy" className="hover:text-indigo-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-indigo-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-indigo-400 transition">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <p className="text-slate-500 text-[11px]">
            Clean editorial news delivery platform.
          </p>
        </div>
      </div>
    </footer>
  );
}
