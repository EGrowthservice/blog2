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
      <AdminNavbar title="Bảng Điều Khiển Hệ Thống" />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl">
        {/* Quick Welcome & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Trung Tâm Quản Trị Blog
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Thống kê thời gian thực từ MongoDB, theo dõi lượt đọc bài viết và cấu hình hệ thống.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/articles/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Viết bài mới</span>
            </Link>
          </div>
        </div>

        {/* Top Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Articles */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tổng bài viết
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {loading ? '-' : stats?.totalArticles || 0}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="text-emerald-600 font-semibold">{stats?.publishedArticles || 0} đã xuất bản</span>
              <span>·</span>
              <span>{stats?.draftArticles || 0} bản nháp</span>
            </div>
          </div>

          {/* Card 2: Total Views */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tổng lượt đọc bài
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {loading ? '-' : formatNumber(stats?.totalViews || 0)}
            </div>
            <div className="text-xs text-slate-500">
              Lượt xem thực tế từ cơ sở dữ liệu
            </div>
          </div>

          {/* Card 3: Categories */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Chuyên mục
              </span>
              <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                <FolderTree className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {loading ? '-' : stats?.totalCategories || 0}
            </div>
            <div className="text-xs text-slate-500">
              Danh mục bài viết đang hoạt động
            </div>
          </div>

          {/* Card 4: Monetization Units */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Vị trí quảng cáo
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Megaphone className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {loading ? '-' : stats?.activeAdsCount || 0}
            </div>
            <div className="text-xs text-slate-500">
              Vị trí banner / AdSense đã cấu hình
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
                    ? 'Mã theo dõi GA4 đang hoạt động trên website'
                    : 'Chưa cấu hình mã GA ID trong phần Cài đặt'}
                </p>
              </div>
            </div>
            {stats?.isGaConfigured ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                Đang bật
              </span>
            ) : (
              <Link
                href="/admin/settings"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Cấu hình ngay
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
                    ? 'Mã nhà xuất bản AdSense đang kết nối'
                    : 'Chưa cấu hình mã Publisher ID'}
                </p>
              </div>
            </div>
            {stats?.isAdSenseConfigured ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                Đã kết nối
              </span>
            ) : (
              <Link
                href="/admin/settings"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Cấu hình ngay
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
                <h3 className="font-bold text-slate-900 text-sm">Bài Viết Đọc Nhiều Nhất</h3>
              </div>
              <Link
                href="/admin/articles"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                Xem tất cả
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
                        {formatNumber(post.views || 0)} lượt xem
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  Chưa có dữ liệu lượt xem bài viết.
                </div>
              )}
            </div>
          </div>

          {/* Recent Articles */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Bài Viết Mới Tạo</h3>
              </div>
              <Link
                href="/admin/articles"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                Quản lý bài
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
                          {post.status === 'published' ? 'Đã xuất bản' : post.status}
                        </span>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                    <Link
                      href={`/admin/articles/edit/${post._id}`}
                      className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium transition"
                    >
                      Sửa
                    </Link>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  Chưa có bài viết nào được tạo.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
