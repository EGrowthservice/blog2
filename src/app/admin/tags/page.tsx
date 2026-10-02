'use client';

import { useEffect, useState, useCallback } from 'react';
import { Tags, Plus, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { ITag } from '@/types';
import { slugify } from '@/lib/utils';

export default function AdminTagsPage() {
  const [tags, setTags] = useState<ITag[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchTags = useCallback(async () => {
    try {
      const res = await fetch('/api/tags');
      if (res.ok) {
        const data = await res.json();
        setTags(data.tags || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), slug: slugify(name.trim()) }),
      });
      if (res.ok) {
        setName('');
        fetchTags();
        showToast('Đã tạo thẻ mới thành công');
      } else {
        showToast('Không thể tạo thẻ mới', 'error');
      }
    } catch {
      showToast('Đã xảy ra lỗi khi tạo thẻ mới', 'error');
    } finally {
      setSaving(false);
    }
  };

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteTagTarget, setDeleteTagTarget] = useState<ITag | null>(null);
  const [deletingTag, setDeletingTag] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast((prev) => (prev?.message === message ? null : prev)), 3500);
  };

  const confirmDeleteTag = async () => {
    if (!deleteTagTarget) return;
    setDeletingTag(true);
    try {
      const res = await fetch(`/api/tags/${deleteTagTarget._id}`, { method: 'DELETE' });
      if (res.ok) {
        setTags(tags.filter((t) => t._id !== deleteTagTarget._id));
        showToast(`Đã xóa thẻ #${deleteTagTarget.name}`);
        setDeleteTagTarget(null);
      } else {
        showToast('Không thể xóa thẻ', 'error');
      }
    } catch {
      showToast('Lỗi xảy ra khi xóa thẻ', 'error');
    } finally {
      setDeletingTag(false);
    }
  };

  return (
    <div>
      <AdminNavbar title="Quản Lý Thẻ (Tags)" />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Thẻ Bài Viết (Taxonomy Tags)</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tạo, quản lý và dọn dẹp các từ khóa gắn thẻ phục vụ bộ máy tìm kiếm nội bộ và điều hướng độc giả.
          </p>
        </div>

        {/* Add Tag Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs max-w-md">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Thêm Thẻ Mới
          </h3>
          <form onSubmit={handleCreate} className="flex gap-2">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên thẻ (vd: công nghệ, oscar)..."
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-indigo-600/20 cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{saving ? 'Đang thêm...' : 'Thêm thẻ'}</span>
            </button>
          </form>
        </div>

        {/* Tags Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden max-w-3xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Tên thẻ</th>
                  <th className="py-3 px-4">Đường dẫn (Slug)</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-slate-400">
                      Đang tải danh sách thẻ...
                    </td>
                  </tr>
                ) : tags.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-slate-400">
                      Chưa có thẻ nào được tạo.
                    </td>
                  </tr>
                ) : (
                  tags.map((tag) => (
                    <tr key={tag._id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <Tags className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>#{tag.name}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-500">
                        /{tag.slug}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/tag/${tag.slug}`}
                            target="_blank"
                            title="Xem trang thẻ ngoài website"
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeleteTagTarget(tag)}
                            title="Xóa thẻ"
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* In-app Toast */}
        {toast && (
          <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-800 text-xs animate-in slide-in-from-top-3 duration-200">
            <span className="font-semibold">{toast.message}</span>
          </div>
        )}

        {/* In-app Delete Confirmation Modal */}
        {deleteTagTarget && (
          <div
            onClick={() => !deletingTag && setDeleteTagTarget(null)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
                <Trash2 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">Xác nhận xóa thẻ?</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Bạn có chắc chắn muốn xóa thẻ{' '}
                  <strong className="text-slate-900 font-semibold">#{deleteTagTarget.name}</strong> không?
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={deletingTag}
                  onClick={() => setDeleteTagTarget(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  disabled={deletingTag}
                  onClick={confirmDeleteTag}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer"
                >
                  {deletingTag ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
