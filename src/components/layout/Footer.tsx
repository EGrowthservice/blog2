'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, Shield } from 'lucide-react';
import { ICategory, ISetting } from '@/types';

interface FooterProps {
  categories?: ICategory[];
  settings?: Partial<ISetting>;
}

export default function Footer({ categories = [], settings }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const siteName = settings?.siteName || 'Spotlight';

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Callout */}
        <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/60 rounded-2xl p-8 sm:p-12 mb-16 border border-rose-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-rose-500/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="inline-block px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-semibold text-xs tracking-wider uppercase mb-3">
                {siteName} Daily Digest
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Entertainment, Sports Highlights & Comedy Dispatches
              </h3>
              <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-xl">
                Get the latest trending entertainment coverage, major sports recaps, and original comedy commentary delivered directly to your inbox.
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-emerald-300 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Thank you! You are now subscribed to {siteName}.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-rose-600/30 whitespace-nowrap cursor-pointer"
                  >
                    Subscribe Free
                  </button>
                </form>
              )}
              <p className="text-[11px] text-slate-500 mt-2">
                No spam. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-black text-lg">
                S
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {siteName}
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              {settings?.description ||
                'Spotlight is an independent digital media publication delivering authentic coverage across Entertainment, Sports, and Comedy.'}
            </p>
            <div className="pt-2 flex items-center gap-4 text-slate-400">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-medium"
              >
                <Shield className="w-3.5 h-3.5 text-rose-400" />
                Staff Portal
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Channels
            </h4>
            <ul className="space-y-2.5 text-sm">
              {categories.map((cat) => (
                <li key={cat._id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-rose-400 transition"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About & Contact (Prominently in Footer) */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Company & Contact
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-rose-400 transition font-medium text-slate-300">
                  About Us & Editorial Standards
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-rose-400 transition font-medium text-slate-300">
                  Contact Editorial Desk
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-rose-400 transition">
                  Search Archive
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Legal & Disclosures
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy-policy" className="hover:text-rose-400 transition">
                  Privacy Policy (GDPR / CCPA)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-rose-400 transition">
                  Terms of Service & DMCA
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-rose-400 transition">
                  Cookie Policy & Disclosures
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <p className="text-slate-500">
            Published with Next.js, TypeScript, Tailwind CSS, & MongoDB.
          </p>
        </div>
      </div>
    </footer>
  );
}
