'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Activity,
  Search,
  Eye,
  FolderTree,
} from 'lucide-react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { ISetting } from '@/types';

export default function AdminAnalyticsPage() {
  const [settings, setSettings] = useState<ISetting | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.settings) setSettings(data.settings);
      });
  }, []);

  const gaId = settings?.gaId || process.env.NEXT_PUBLIC_GA_ID;
  const isConfigured = Boolean(gaId && gaId.trim().length > 0);

  const trackedEvents = [
    {
      name: 'Lượt xem trang (Page Views)',
      icon: Eye,
      description: 'Tự động gửi tín hiệu khi người đọc chuyển trang qua component GoogleAnalytics.',
    },
    {
      name: 'Lượt đọc bài viết (Article Reads)',
      icon: Activity,
      description: 'Ghi nhận khi độc giả truy cập trang chi tiết bài viết và cập nhật lượt xem MongoDB.',
    },
    {
      name: 'Từ khóa tìm kiếm (Search Queries)',
      icon: Search,
      description: 'Ghi nhận các truy vấn tìm kiếm giúp đánh giá chủ đề được quan tâm nhiều nhất.',
    },
    {
      name: 'Chuyên mục được xem (Category Visits)',
      icon: FolderTree,
      description: 'Theo dõi lưu lượng truy cập theo từng chuyên mục nội dung.',
    },
  ];

  return (
    <div>
      <AdminNavbar title="Google Analytics 4" />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Hạ Tầng Thống Kê & Đo Lường
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Theo dõi trạng thái tích hợp Google Analytics 4 và các sự kiện thu thập dữ liệu người dùng.
          </p>
        </div>

        {/* Integration Status Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <BarChart3 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Trạng Thái Google Analytics 4
                </h3>
                {isConfigured ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Đã kết nối
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Chưa cấu hình
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 mt-1 max-w-lg leading-relaxed">
                {isConfigured
                  ? `Mã đo lường đang hoạt động: ${gaId}. Đoạn mã thống kê đã được nhúng vào phần head của website.`
                  : 'Hãy nhập mã đo lường GA4 (định dạng: G-XXXXXXXXXX) trong phần Cài đặt để bắt đầu thu thập dữ liệu người đọc.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isConfigured ? (
              <a
                href="https://analytics.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition"
              >
                <span>Mở Google Analytics</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <Link
                href="/admin/settings"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition"
              >
                <span>Cấu hình GA4 ngay</span>
              </Link>
            )}
          </div>
        </div>

        {/* Tracked Events Grid */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Các Sự Kiện Được Tự Động Thu Thập
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trackedEvents.map((evt) => {
              const Icon = evt.icon;
              return (
                <div
                  key={evt.name}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{evt.name}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {evt.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
