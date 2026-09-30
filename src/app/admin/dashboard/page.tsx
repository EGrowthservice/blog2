'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Eye,
  FolderTree,
  Megaphone,
  BarChart3,
  TrendingUp,
  Clock,
  ArrowRight,
  PlusCircle,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { AdminStats, IPost } from '@/types';
import { formatDate, formatNumber } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setStats(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <AdminNavbar title="System Dashboard" />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl">
        {/* Quick Welcome & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Spotlight Publishing Center
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-time MongoDB statistics, content performance, and monetization health.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/articles/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Article</span>
            </Link>
          </div>
        </div>

        {/* Top Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Articles */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Articles
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {loading ? '-' : stats?.totalArticles || 0}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="text-emerald-600 font-semibold">{stats?.publishedArticles || 0} published</span>
              <span>·</span>
              <span>{stats?.draftArticles || 0} drafts</span>
            </div>
          </div>

          {/* Card 2: Total Views */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Page Views
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {loading ? '-' : formatNumber(stats?.totalViews || 0)}
            </div>
            <div className="text-xs text-slate-500">
              Accurate verified MongoDB counters
            </div>
          </div>

          {/* Card 3: Categories & Tags */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Taxonomy Topics
              </span>
              <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                <FolderTree className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {loading ? '-' : stats?.totalCategories || 0}
            </div>
            <div className="text-xs text-slate-500">
              {stats?.totalTags || 0} active searchable tags
            </div>
          </div>

          {/* Card 4: Monetization Units */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Active Ad Units
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Megaphone className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {loading ? '-' : stats?.activeAdsCount || 0}
            </div>
            <div className="text-xs text-slate-500">
              Configured placement slots
            </div>
          </div>
        </div>

        {/* Integration Status Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* GA4 Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Google Analytics 4</h4>
                <p className="text-xs text-slate-500">
                  {stats?.isGaConfigured
                    ? 'Measurement script active in head'
                    : 'Measurement ID not set in settings or .env'}
                </p>
              </div>
            </div>
            {stats?.isGaConfigured ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                Active
              </span>
            ) : (
              <Link
                href="/admin/settings"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Configure
              </Link>
            )}
          </div>

          {/* AdSense Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Google AdSense</h4>
                <p className="text-xs text-slate-500">
                  {stats?.isAdSenseConfigured
                    ? 'Ad client configured for ad slots'
                    : 'Publisher ID not yet configured'}
                </p>
              </div>
            </div>
            {stats?.isAdSenseConfigured ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                Configured
              </span>
            ) : (
              <Link
                href="/admin/settings"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Configure
              </Link>
            )}
          </div>
        </div>

        {/* Dual Tables: Popular Posts & Recent Posts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Read Articles */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Most Read Articles</h3>
              </div>
              <Link
                href="/admin/articles"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {stats?.popularArticles?.length ? (
                stats.popularArticles.map((post: IPost) => (
                  <div key={post._id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/admin/articles/edit/${post._id}`}
                        className="text-sm font-semibold text-slate-900 hover:text-indigo-600 truncate block"
                      >
                        {post.title}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold">
                        <Eye className="w-3 h-3" />
                        {formatNumber(post.views || 0)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  No article views recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* Recent Articles */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Recently Created</h3>
              </div>
              <Link
                href="/admin/articles"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                Manage
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {stats?.recentArticles?.length ? (
                stats.recentArticles.map((post: IPost) => (
                  <div key={post._id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/admin/articles/edit/${post._id}`}
                        className="text-sm font-semibold text-slate-900 hover:text-indigo-600 truncate block"
                      >
                        {post.title}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          post.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {post.status}
                        </span>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                    <Link
                      href={`/admin/articles/edit/${post._id}`}
                      className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium transition"
                    >
                      Edit
                    </Link>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  No articles created yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
