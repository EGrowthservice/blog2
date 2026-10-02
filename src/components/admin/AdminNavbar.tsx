'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  User as UserIcon,
  Bell,
  CheckCircle,
  MessageSquare,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { IUser } from '@/types';
import { formatDate } from '@/lib/utils';

interface AdminNavbarProps {
  title?: string;
}

interface ReportItem {
  _id: string;
  targetType: 'article' | 'comment';
  reason: string;
  details?: string;
  createdAt: string;
}

interface CommentItem {
  _id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export default function AdminNavbar({ title = 'Bảng điều khiển' }: AdminNavbarProps) {
  const [user, setUser] = useState<IUser | null>(null);

  // Notification State
  const [unreadCount, setUnreadCount] = useState(0);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'reports' | 'comments'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(() => {
    fetch('/api/admin/notifications')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success) {
          setUnreadCount(data.unreadCount || 0);
          setReports(data.reports || []);
          setComments(data.comments || []);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});

    // Fetch initial notifications
    fetchNotifications();

    // Poll every 60s
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_all_read' }),
      });
      if (res.ok) {
        setUnreadCount(0);
        setReports([]);
      }
    } catch {}
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Xem trang chủ */}
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Xem trang chủ</span>
        </Link>

        {/* Nút Chuông Thông Báo (Notification Bell) */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            title="Thông báo hệ thống"
            className={`relative p-2 rounded-lg border transition cursor-pointer ${
              isOpen
                ? 'bg-slate-100 border-slate-300 text-slate-900'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white shadow-xs animate-in zoom-in">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Popover */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              {/* Header */}
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">Thông báo</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                      {unreadCount} cần xử lý
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
                  >
                    Đánh dấu đã xem
                  </button>
                )}
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-100 px-2 pt-1 text-[11px] font-semibold text-slate-500">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 border-b-2 cursor-pointer ${
                    activeTab === 'all'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent hover:text-slate-800'
                  }`}
                >
                  Tất cả
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('reports')}
                  className={`px-3 py-1.5 border-b-2 cursor-pointer flex items-center gap-1 ${
                    activeTab === 'reports'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent hover:text-slate-800'
                  }`}
                >
                  Báo cáo ({reports.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('comments')}
                  className={`px-3 py-1.5 border-b-2 cursor-pointer flex items-center gap-1 ${
                    activeTab === 'comments'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent hover:text-slate-800'
                  }`}
                >
                  Bình luận ({comments.length})
                </button>
              </div>

              {/* Content List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                {/* Reports section */}
                {(activeTab === 'all' || activeTab === 'reports') &&
                  reports.map((rep) => (
                    <Link
                      key={rep._id}
                      href="/admin/comments"
                      onClick={() => setIsOpen(false)}
                      className="p-3 hover:bg-slate-50/80 transition flex items-start gap-2.5 block text-slate-700"
                    >
                      <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 border border-rose-200">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-slate-900 text-[11px] truncate">
                            Báo cáo {rep.targetType === 'article' ? 'bài viết' : 'bình luận'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">
                            {formatDate(rep.createdAt)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1 font-medium">
                          {rep.reason}
                        </p>
                        {rep.details && (
                          <p className="text-[10px] text-slate-400 line-clamp-1 italic">
                            &quot;{rep.details}&quot;
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}

                {/* Comments section */}
                {(activeTab === 'all' || activeTab === 'comments') &&
                  comments.map((cmt) => (
                    <Link
                      key={cmt._id}
                      href="/admin/comments"
                      onClick={() => setIsOpen(false)}
                      className="p-3 hover:bg-slate-50/80 transition flex items-start gap-2.5 block text-slate-700"
                    >
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-100">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-slate-900 text-[11px] truncate">
                            {cmt.authorName} vừa bình luận
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">
                            {formatDate(cmt.createdAt)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">
                          {cmt.content}
                        </p>
                      </div>
                    </Link>
                  ))}

                {reports.length === 0 && comments.length === 0 && (
                  <div className="py-8 text-center text-slate-400 space-y-1">
                    <CheckCircle className="w-6 h-6 mx-auto text-emerald-500 opacity-80" />
                    <p className="text-xs">Không có thông báo mới nào</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-2 border-t border-slate-100 text-center">
                <Link
                  href="/admin/comments"
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-semibold text-slate-700 hover:text-indigo-600 inline-flex items-center gap-1 transition"
                >
                  <span>Xem tất cả bình luận & báo cáo</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        {user && (
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs overflow-hidden">
              {user.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-4 h-4" />
              )}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-slate-900 block leading-none">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
                {user.role === 'admin' ? 'Quản trị viên' : user.role}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
