'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  MessageSquare,
  ShieldAlert,
  Trash2,
  CheckCircle,
  EyeOff,
  Filter,
  ExternalLink,
  Flag,
} from 'lucide-react';
import Link from 'next/link';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { formatDate } from '@/lib/utils';

interface CommentData {
  _id: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  status: 'approved' | 'hidden' | 'flagged';
  reportsCount: number;
  reports?: { reason: string; details?: string; createdAt: string }[];
  postId?: { _id: string; title: string; slug: string };
  createdAt: string;
}

interface ArticleReportData {
  _id: string;
  targetId?: { _id: string; title: string; slug: string };
  reason: string;
  details?: string;
  status: string;
  createdAt: string;
}

export default function AdminCommentsPage() {
  const [activeTab, setActiveTab] = useState<'comments' | 'reports'>('comments');
  const [comments, setComments] = useState<CommentData[]>([]);
  const [articleReports, setArticleReports] = useState<ArticleReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'flagged' | 'approved' | 'hidden'>('all');

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/comments?filter=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
        setArticleReports(data.articleReports || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast((prev) => (prev?.message === message ? null : prev)), 3500);
  };

  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'hidden') => {
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, resetReports: newStatus === 'approved' }),
      });
      if (res.ok) {
        setComments((prev) =>
          prev.map((c) =>
            c._id === id
              ? { ...c, status: newStatus, reportsCount: newStatus === 'approved' ? 0 : c.reportsCount }
              : c
          )
        );
        showToast(newStatus === 'approved' ? 'Đã duyệt hiển thị bình luận' : 'Đã ẩn bình luận');
      } else {
        showToast('Không thể cập nhật trạng thái', 'error');
      }
    } catch {
      showToast('Lỗi cập nhật trạng thái', 'error');
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/comments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c._id !== id));
        showToast('Đã xóa bình luận thành công');
      } else {
        showToast('Lỗi khi xóa bình luận', 'error');
      }
    } catch {
      showToast('Lỗi xóa bình luận', 'error');
    }
  };

  return (
    <div>
      <AdminNavbar title="Kiểm Duyệt Bình Luận & Báo Cáo" />

      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-800 text-xs animate-in slide-in-from-top-3 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toast.message}</span>
        </div>
      )}

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Bình Luận Độc Giả & Báo Cáo Vi Phạm
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Quản lý các phản hồi từ khách đọc báo, kiểm tra các bình luận hoặc bài viết bị báo cáo.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('comments')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'comments'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Bình luận ({comments.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'reports'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Báo cáo bài viết ({articleReports.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: COMMENTS LIST */}
        {activeTab === 'comments' && (
          <div className="space-y-4">
            {/* Filter bar */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 ml-1" />
              <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    filter === 'all' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Tất cả
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('flagged')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    filter === 'flagged' ? 'bg-rose-50 text-rose-700' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Flag className="w-3 h-3 text-rose-500" />
                  <span>Bị báo cáo ({comments.filter((c) => (c.reportsCount || 0) > 0).length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('approved')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    filter === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Hiển thị
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('hidden')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    filter === 'hidden' ? 'bg-slate-100 text-slate-700' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Đã ẩn
                </button>
              </div>
            </div>

            {/* Comments Table / Cards */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              {loading ? (
                <div className="py-12 text-center text-slate-400 text-xs">Đang tải bình luận...</div>
              ) : comments.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">Không có bình luận nào.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {comments.map((c) => (
                    <div key={c._id} className="p-5 hover:bg-slate-50/60 transition space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                            {c.authorName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 text-xs sm:text-sm block">
                              {c.authorName}
                              {c.authorEmail && (
                                <span className="font-normal text-slate-400 text-[11px] ml-1.5">
                                  ({c.authorEmail})
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {formatDate(c.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          {c.reportsCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[10px] border border-rose-200 inline-flex items-center gap-1">
                              <Flag className="w-3 h-3 text-rose-500" />
                              {c.reportsCount} báo cáo
                            </span>
                          )}

                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              c.status === 'approved'
                                ? 'bg-emerald-50 text-emerald-700'
                                : c.status === 'flagged'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {c.status === 'approved'
                              ? 'Đang hiển thị'
                              : c.status === 'flagged'
                              ? 'Đang gắn cờ'
                              : 'Đã ẩn'}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <p className="text-xs sm:text-sm text-slate-800 bg-slate-50/80 p-3 rounded-xl border border-slate-100 whitespace-pre-line leading-relaxed">
                        {c.content}
                      </p>

                      {/* Attached Post Link & Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                        <div>
                          {c.postId ? (
                            <Link
                              href={`/article/${c.postId.slug}`}
                              target="_blank"
                              className="text-[11px] text-indigo-600 hover:underline inline-flex items-center gap-1 font-medium"
                            >
                              <span>Bài viết: {c.postId.title}</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          ) : (
                            <span className="text-[11px] text-slate-400">Bài viết đã xóa</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {c.status !== 'approved' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(c._id, 'approved')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3" />
                              <span>Duyệt hiển thị</span>
                            </button>
                          )}

                          {c.status === 'approved' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(c._id, 'hidden')}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                            >
                              <EyeOff className="w-3 h-3" />
                              <span>Ẩn đi</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteComment(c._id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Xóa bình luận"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ARTICLE REPORTS */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {articleReports.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Không có bài viết nào bị độc giả báo cáo vi phạm.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {articleReports.map((r) => (
                  <div key={r._id} className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200">
                        {r.reason}
                      </span>
                      <span className="text-[10px] text-slate-400">{formatDate(r.createdAt)}</span>
                    </div>

                    {r.targetId && (
                      <Link
                        href={`/article/${r.targetId.slug}`}
                        target="_blank"
                        className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition flex items-center gap-1.5"
                      >
                        <span>{r.targetId.title}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}

                    {r.details && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        Chi tiết: {r.details}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
