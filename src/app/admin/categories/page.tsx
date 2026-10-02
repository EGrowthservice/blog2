'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import AdminNavbar from '@/components/admin/AdminNavbar';
import ImageUpload from '@/components/admin/ImageUpload';
import { ICategory } from '@/types';
import { slugify } from '@/lib/utils';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories?all=true');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (e) {
      console.error('Error fetching categories:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('');
    setSeoTitle('');
    setSeoDescription('');
    setIsActive(true);
    setSortOrder(categories.length + 1);
    setError(null);
    setShowModal(true);
  };

  const handleOpenEdit = (cat: ICategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setSeoTitle(cat.seoTitle || '');
    setSeoDescription(cat.seoDescription || '');
    setIsActive(cat.isActive ?? true);
    setSortOrder(cat.sortOrder || 0);
    setError(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Vui lòng nhập tên danh mục.');
      return;
    }

    setSaving(true);
    const payload = {
      name: name.trim(),
      slug: slug.trim() ? slugify(slug) : slugify(name),
      description: description.trim(),
      image,
      seoTitle: seoTitle.trim(),
      seoDescription: seoDescription.trim(),
      isActive,
      sortOrder: Number(sortOrder),
    };

    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory._id}`
        : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Lỗi khi lưu danh mục');
      }

      setShowModal(false);
      await fetchCategories();
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Đã xảy ra lỗi khi lưu thông tin danh mục');
    } finally {
      setSaving(false);
    }
  };

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteCatTarget, setDeleteCatTarget] = useState<ICategory | null>(null);
  const [deletingCat, setDeletingCat] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast((prev) => (prev?.message === message ? null : prev)), 3500);
  };

  const confirmDeleteCategory = async () => {
    if (!deleteCatTarget) return;
    setDeletingCat(true);
    try {
      const res = await fetch(`/api/categories/${deleteCatTarget._id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Không thể xóa danh mục.', 'error');
        setDeleteCatTarget(null);
        return;
      }

      setCategories((prev) => prev.filter((c) => c._id !== deleteCatTarget._id));
      showToast(`Đã xóa danh mục "${deleteCatTarget.name}" thành công`, 'success');
      setDeleteCatTarget(null);
    } catch {
      showToast('Đã xảy ra lỗi khi xóa danh mục.', 'error');
    } finally {
      setDeletingCat(false);
    }
  };

  return (
    <div>
      <AdminNavbar title="Quản Lý Danh Mục" />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Danh Mục Bài Viết</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Phân loại cấu trúc bài viết, tối ưu SEO theo chủ đề và sắp xếp thứ tự hiển thị ngoài website.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm danh mục mới</span>
          </button>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-16">Thứ tự</th>
                  <th className="py-3.5 px-4">Tên danh mục</th>
                  <th className="py-3.5 px-4">Đường dẫn (Slug)</th>
                  <th className="py-3.5 px-4">Số bài viết</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Đang tải danh sách danh mục...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Chưa có danh mục nào được tạo.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-500">
                        {cat.sortOrder ?? 0}
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-3">
                          {cat.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-200"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                              <FolderTree className="w-4 h-4" />
                            </div>
                          )}
                          <div>
                            <span className="block font-bold text-slate-900">{cat.name}</span>
                            {cat.description && (
                              <span className="text-[11px] text-slate-400 font-normal line-clamp-1">
                                {cat.description}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-600">
                        /{cat.slug}
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          {cat.articleCount || 0} bài
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {cat.isActive !== false ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Hiển thị
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 font-semibold text-[11px]">
                            <XCircle className="w-3.5 h-3.5" />
                            Ẩn
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/category/${cat.slug}`}
                            target="_blank"
                            title="Xem trang công khai"
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(cat)}
                            title="Chỉnh sửa danh mục"
                            className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteCatTarget(cat)}
                            title="Xóa danh mục"
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

        {/* Category Modal Create / Edit */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">
                  {editingCategory ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tên Danh Mục *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!editingCategory) setSlug(slugify(e.target.value));
                    }}
                    placeholder="Ví dụ: Công nghệ, Thể thao, Giải trí..."
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Đường Dẫn URL (Slug)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="cong-nghe"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mô Tả Ngắn
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tóm tắt ngắn về chuyên mục này hiển thị cho độc giả..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Supabase Image Upload for Category */}
                <div>
                  <ImageUpload
                    value={image}
                    onChange={setImage}
                    folder="categories"
                    label="Hình Ảnh Đại Diện Danh Mục (Supabase)"
                    aspectHint="Khuyến nghị ảnh tỷ lệ 16:9 hoặc ảnh ngang, lưu trữ trên Supabase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Thứ Tự Sắp Xếp
                    </label>
                    <input
                      type="number"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                      />
                      <span>Hiển thị trên website</span>
                    </label>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-indigo-600/20 cursor-pointer"
                  >
                    {saving
                      ? 'Đang lưu...'
                      : editingCategory
                      ? 'Cập nhật danh mục'
                      : 'Tạo danh mục'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* In-app Toast */}
        {toast && (
          <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-800 text-xs animate-in slide-in-from-top-3 duration-200">
            {toast.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="font-semibold">{toast.message}</span>
          </div>
        )}

        {/* In-app Delete Confirmation Modal */}
        {deleteCatTarget && (
          <div
            onClick={() => !deletingCat && setDeleteCatTarget(null)}
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
                <h3 className="text-base font-bold text-slate-900">Xác nhận xóa danh mục?</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Bạn có chắc chắn muốn xóa danh mục{' '}
                  <strong className="text-slate-900 font-semibold">&ldquo;{deleteCatTarget.name}&rdquo;</strong> không?
                  Nếu còn bài viết thuộc danh mục này, bạn cần chuyển bài viết sang danh mục khác trước khi xóa.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={deletingCat}
                  onClick={() => setDeleteCatTarget(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  disabled={deletingCat}
                  onClick={confirmDeleteCategory}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer"
                >
                  {deletingCat ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
