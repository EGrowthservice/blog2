'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  PlusCircle,
  Search,
  Filter,
  Trash2,
  Edit3,
  ExternalLink,
  Star,
  Eye,
  EyeOff,
  Calendar,
  Image as ImageIcon,
  Loader2,
  X,
  Maximize2,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { IPost, ICategory } from '@/types';
import { formatDate, formatNumber } from '@/lib/utils';

export default function AdminArticlesPage() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // In-app Modals and Toasts (KHÔNG DÙNG native alert/confirm của trình duyệt)
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  useEffect(() => {
    fetch('/api/categories?all=true')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.categories) setCategories(data.categories);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let isMounted = true;
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', '15');
    // Luôn truyền status (bao gồm cả 'all' để lấy toàn bộ bài viết cả ẩn và hiện)
    params.set('status', statusFilter);
    if (categoryFilter) params.set('category', categoryFilter);
    if (search) params.set('search', search);

    fetch(`/api/articles?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data) {
          setPosts(data.posts || []);
          setTotalPages(data.totalPages || 1);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [page, statusFilter, categoryFilter, search]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/articles/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p._id !== deleteTarget.id));
        showToast(`Đã xóa bài viết "${deleteTarget.title}" vĩnh viễn`, 'success');
        setDeleteTarget(null);
      } else {
        showToast('Không thể xóa bài viết. Vui lòng thử lại.', 'error');
      }
    } catch {
      showToast('Đã xảy ra lỗi khi xóa bài viết', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleFeatured = async (post: IPost) => {
    const nextFeatured = !post.isFeatured;
    try {
      const res = await fetch(`/api/articles/${post._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: nextFeatured }),
      });

      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p._id === post._id ? { ...p, isFeatured: nextFeatured } : p))
        );
        showToast(
          nextFeatured ? `Đã đặt "${post.title}" làm tin nổi bật` : `Đã bỏ đánh dấu tin nổi bật`,
          'success'
        );
      } else {
        showToast('Không thể cập nhật trạng thái nổi bật', 'error');
      }
    } catch {
      showToast('Lỗi kết nối khi cập nhật nổi bật', 'error');
    }
  };

  const handleToggleVisibility = async (post: IPost) => {
    const isCurrentlyPublished = post.status === 'published';
    const newStatus = isCurrentlyPublished ? 'draft' : 'published';

    setUpdatingId(post._id);
    try {
      const res = await fetch(`/api/articles/${post._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          publishedAt: newStatus === 'published' && !post.publishedAt ? new Date().toISOString() : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPosts((prev) =>
          prev.map((p) =>
            p._id === post._id
              ? {
                  ...p,
                  status: newStatus,
                  publishedAt: data.post?.publishedAt || (newStatus === 'published' ? p.publishedAt || new Date().toISOString() : p.publishedAt),
                }
              : p
          )
        );

        if (newStatus === 'published') {
          showToast(`Đã xuất bản (HIỆN) bài viết "${post.title}"`, 'success');
        } else {
          showToast(`Đã ẨN bài viết "${post.title}" (chuyển sang Bản nháp)`, 'info');
        }
      } else {
        showToast('Không thể cập nhật trạng thái bài viết', 'error');
      }
    } catch {
      showToast('Đã xảy ra lỗi kết nối', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <AdminNavbar title="Quản Lý Bài Viết" />

      {/* In-app Toast Alert (Đơn giản, tinh tế, KHÔNG HIỆN localhost) */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-800 text-xs animate-in slide-in-from-top-3 duration-200">
          {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <EyeOff className="w-4 h-4 text-amber-400 shrink-0" />}
          <span className="font-semibold">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-3 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
        {/* Top Header & New Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Danh Sách Bài Viết</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Soạn thảo, xem ảnh bìa, bật/tắt ẩn hiện tức thì và theo dõi thống kê lượt đọc các bài báo.
            </p>
          </div>

          <Link
            href="/admin/articles/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition self-start sm:self-auto cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Viết bài mới</span>
          </Link>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Tìm bài viết theo tiêu đề..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="all">Tất cả trạng thái (Ẩn & Hiện)</option>
                <option value="published">Đang hiển thị (Xuất bản)</option>
                <option value="draft">Đang ẩn (Bản nháp)</option>
                <option value="scheduled">Đã lên lịch</option>
                <option value="archived">Lưu trữ</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">Tất cả chuyên mục</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-24">Ảnh đại diện</th>
                  <th className="py-3.5 px-4">Bài viết</th>
                  <th className="py-3.5 px-4">Chuyên mục</th>
                  <th className="py-3.5 px-4">Ẩn / Hiện</th>
                  <th className="py-3.5 px-4">Lượt đọc</th>
                  <th className="py-3.5 px-4">Ngày đăng</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Đang tải danh sách bài viết...
                    </td>
                  </tr>
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Không tìm thấy bài viết nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => {
                    const cat =
                      typeof post.category === 'object' && post.category
                        ? (post.category as ICategory)
                        : categories.find((c) => c._id === post.category);

                    const isPublished = post.status === 'published';
                    const isUpdating = updatingId === post._id;

                    return (
                      <tr key={post._id} className="hover:bg-slate-50/60 transition group">
                        {/* Ảnh đại diện (Cover Image Thumbnail) */}
                        <td className="py-3.5 px-4 align-middle">
                          {post.featuredImage ? (
                            <div
                              onClick={() =>
                                setPreviewImage({
                                  url: post.featuredImage,
                                  title: post.title,
                                })
                              }
                              title="Bấm để phóng to xem ảnh đầy đủ"
                              className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/90 shadow-2xs group/img cursor-pointer shrink-0"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-200"
                              />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <Maximize2 className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-16 h-12 rounded-lg bg-slate-100 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 shrink-0">
                              <ImageIcon className="w-4 h-4" />
                              <span className="text-[9px] mt-0.5">Không ảnh</span>
                            </div>
                          )}
                        </td>

                        {/* Title & Slug & Star */}
                        <td className="py-3.5 px-4 max-w-md align-middle">
                          <div className="flex items-start gap-3">
                            <button
                              type="button"
                              onClick={() => handleToggleFeatured(post)}
                              title={
                                post.isFeatured
                                  ? 'Đang là tin nổi bật (bấm để hủy)'
                                  : 'Đặt làm tin nổi bật trang chủ'
                              }
                              className={`mt-0.5 transition cursor-pointer ${
                                post.isFeatured
                                  ? 'text-amber-500 hover:text-amber-600'
                                  : 'text-slate-300 hover:text-amber-400'
                              }`}
                            >
                              <Star className={`w-4 h-4 ${post.isFeatured ? 'fill-current' : ''}`} />
                            </button>

                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/admin/articles/edit/${post._id}`}
                                className="font-bold text-slate-900 hover:text-indigo-600 transition line-clamp-1 block leading-snug"
                              >
                                {post.title}
                              </Link>
                              <p className="text-[11px] text-slate-400 font-mono mt-0.5 line-clamp-1">
                                /{post.slug}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Chuyên mục */}
                        <td className="py-3.5 px-4 align-middle">
                          {cat ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-[11px]">
                              {cat.name}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        {/* Nút Ẩn / Hiện Bài Viết Tức Thì */}
                        <td className="py-3.5 px-4 align-middle">
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleToggleVisibility(post)}
                            title={
                              isPublished
                                ? 'Bấm để ẨN bài viết ngay tức thì'
                                : 'Bấm để XUẤT BẢN bài viết lên trang web ngay tức thì'
                            }
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition cursor-pointer shadow-2xs ${
                              isPublished
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            {isUpdating ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : isPublished ? (
                              <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                            )}
                            <span>{isPublished ? 'Đang hiển thị' : 'Đang ẩn'}</span>
                          </button>
                        </td>

                        {/* Views */}
                        <td className="py-3.5 px-4 align-middle">
                          <span className="flex items-center gap-1 text-slate-600 font-medium">
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            {formatNumber(post.views || 0)}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-slate-500 text-[11px] align-middle">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {formatDate(post.publishedAt || post.createdAt)}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right align-middle">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Nút Ẩn/Hiện nhanh */}
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleToggleVisibility(post)}
                              title={isPublished ? 'Ẩn bài viết khỏi trang web' : 'Hiện bài viết lên trang web'}
                              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                isPublished
                                  ? 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100 text-emerald-700'
                                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              {isPublished ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Xem bài viết công khai nếu đang xuất bản */}
                            {isPublished && (
                              <Link
                                href={`/article/${post.slug}`}
                                target="_blank"
                                title="Xem bài viết trên trang web"
                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            )}

                            {/* Sửa bài viết */}
                            <Link
                              href={`/admin/articles/edit/${post._id}`}
                              title="Chỉnh sửa chi tiết bài viết"
                              className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </Link>

                            {/* Xoá (mở modal nội bộ, không dùng confirm của trình duyệt) */}
                            <button
                              type="button"
                              onClick={() => setDeleteTarget({ id: post._id, title: post.title })}
                              title="Xóa bài viết"
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>
                Trang {page} / {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                >
                  Trang trước
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                >
                  Trang sau
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Preview Modal for Cover Image */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-800/20"
          >
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 truncate pr-4">
                <ImageIcon className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-xs font-semibold truncate">{previewImage.title}</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative max-h-[75vh] overflow-auto bg-slate-950 flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-md"
              />
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono text-[11px] truncate max-w-md">{previewImage.url}</span>
              <a
                href={previewImage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center gap-1 shrink-0"
              >
                Mở link gốc <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* In-app Delete Confirmation Modal (KHÔNG DÙNG confirm của trình duyệt) */}
      {deleteTarget && (
        <div
          onClick={() => !deleting && setDeleteTarget(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Xác nhận xóa bài viết?</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Bạn có chắc chắn muốn xóa bài viết{' '}
                <strong className="text-slate-900 font-semibold">&ldquo;{deleteTarget.title}&rdquo;</strong> vĩnh viễn không?
                Hành động này sẽ xóa toàn bộ nội dung và không thể hoàn tác.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{deleting ? 'Đang xóa...' : 'Xóa vĩnh viễn'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
