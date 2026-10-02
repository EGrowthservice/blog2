'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Trash2,
  Plus,
} from 'lucide-react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import RichEditor from '@/components/admin/RichEditor';
import ImageUpload from '@/components/admin/ImageUpload';
import { ICategory, ITag } from '@/types';
import { slugify } from '@/lib/utils';

interface EditArticleProps {
  params: Promise<{ id: string }>;
}

export default function EditArticlePage({ params }: EditArticleProps) {
  const { id } = use(params);
  const router = useRouter();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [availableTags, setAvailableTags] = useState<ITag[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [category, setCategory] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled' | 'archived'>('draft');
  const [isFeatured, setIsFeatured] = useState(false);

  // SEO Fields
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`/api/articles/${id}`).then((res) => (res.ok ? res.json() : null)),
      fetch('/api/categories?all=true').then((res) => (res.ok ? res.json() : null)),
      fetch('/api/tags').then((res) => (res.ok ? res.json() : null)),
    ])
      .then(([postData, catData, tagData]) => {
        if (catData?.categories) setCategories(catData.categories);
        if (tagData?.tags) setAvailableTags(tagData.tags);

        if (postData?.post) {
          const p = postData.post;
          setTitle(p.title || '');
          setSlug(p.slug || '');
          setExcerpt(p.excerpt || '');
          setContent(p.content || '');
          setFeaturedImage(p.featuredImage || '');
          setCategory(typeof p.category === 'object' ? p.category._id : p.category);
          setSelectedTagIds(
            Array.isArray(p.tags)
              ? p.tags.map((t: ITag | string) => (typeof t === 'object' ? t._id : t))
              : []
          );
          setStatus(p.status || 'draft');
          setIsFeatured(!!p.isFeatured);
          setSeoTitle(p.seoTitle || '');
          setSeoDescription(p.seoDescription || '');
          setSeoKeywords(Array.isArray(p.seoKeywords) ? p.seoKeywords.join(', ') : '');
        } else {
          setError('Không tìm thấy bài viết');
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddTag = async () => {
    if (!newTagInput.trim()) return;
    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTagInput.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.tag) {
          setAvailableTags([...availableTags, data.tag]);
          setSelectedTagIds([...selectedTagIds, data.tag._id]);
          setNewTagInput('');
        }
      }
    } catch (e) {
      console.error('Lỗi khi tạo thẻ:', e);
    }
  };

  const handleSave = async (submitStatus?: 'draft' | 'published') => {
    setError(null);
    setSuccess(null);
    setSaving(true);

    const postStatus = submitStatus || status;

    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề bài viết.');
      setSaving(false);
      return;
    }
    if (!content.trim()) {
      setError('Nội dung bài viết không được để trống.');
      setSaving(false);
      return;
    }
    if (!category) {
      setError('Vui lòng chọn một chuyên mục cho bài viết.');
      setSaving(false);
      return;
    }

    try {
      const payload = {
        title,
        slug: slug.trim() ? slugify(slug) : slugify(title),
        excerpt,
        content,
        featuredImage,
        category,
        tags: selectedTagIds,
        status: postStatus,
        isFeatured,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || excerpt,
        seoKeywords: seoKeywords
          ? seoKeywords.split(',').map((k) => k.trim()).filter(Boolean)
          : [],
      };

      const res = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Cập nhật bài viết thất bại');
      }

      setSuccess('Bài viết đã được cập nhật thành công!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Đã xảy ra lỗi khi cập nhật bài viết.');
    } finally {
      setSaving(false);
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/articles');
        router.refresh();
      } else {
        setError('Không thể xóa bài viết. Vui lòng thử lại.');
        setShowDeleteModal(false);
      }
    } catch {
      setError('Đã xảy ra lỗi khi xóa bài viết.');
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <AdminNavbar title="Chỉnh Sửa Bài Viết" />
        <div className="p-12 text-center text-slate-400">Đang tải nội dung bài viết...</div>
      </div>
    );
  }

  return (
    <div>
      <AdminNavbar title="Chỉnh Sửa Bài Viết" />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl">
        {/* Top Header & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/articles"
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
              title="Quay lại danh sách"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Chỉnh Sửa Bài Báo</h2>
              <p className="text-xs text-slate-500 font-mono">ID: {id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {slug && (
              <Link
                href={`/article/${slug}`}
                target="_blank"
                className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Xem trực tiếp</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              title="Xóa bài viết"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave()}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition shadow-md shadow-indigo-600/20 cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-700 text-xs">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
            <span>{success}</span>
          </div>
        )}

        {/* 2 Columns Grid: Main Editor vs Sidebar Meta */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Editor (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Title */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tiêu đề bài viết *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề hấp dẫn..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* URL Slug */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Đường dẫn URL (Slug)
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-xs font-mono text-slate-500">
                    /article/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="tieu-de-bai-viet"
                    className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-r-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tóm tắt ngắn (Excerpt)
                </label>
                <textarea
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Đoạn văn ngắn giới thiệu nội dung tóm lược..."
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />
              </div>
            </div>

            {/* Rich Editor */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Nội dung bài viết (HTML) *
              </label>
              <RichEditor value={content} onChange={setContent} />
            </div>

            {/* SEO Panel */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Cấu hình Thẻ SEO & Meta Search
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tiêu đề SEO (Meta Title)
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Tối đa 60 ký tự cho kết quả tìm kiếm Google"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mô tả SEO (Meta Description)
                </label>
                <textarea
                  rows={2}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Tối đa 160 ký tự mô tả nội dung cho công cụ tìm kiếm..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Từ khóa SEO (phân tách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  placeholder="tin tức, giải trí, xu hướng, phân tích"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Sidebar Settings (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Status & Visibility */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Trạng Thái Xuất Bản
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Trạng thái
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'draft' | 'published' | 'scheduled' | 'archived')}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="draft">Bản nháp</option>
                  <option value="published">Đã xuất bản</option>
                  <option value="scheduled">Lên lịch xuất bản</option>
                  <option value="archived">Lưu trữ</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Tin Tiêu Điểm Nổi Bật</span>
                    <span className="text-[11px] text-slate-500 block">Ưu tiên hiển thị tại vị trí trung tâm trang chủ</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Category Box */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Chuyên Mục *</h3>
                <Link
                  href="/admin/categories"
                  className="text-[11px] text-indigo-600 hover:underline font-semibold"
                >
                  + Thêm chuyên mục
                </Link>
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Featured Image with Supabase Upload */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Ảnh Bìa Bài Viết (Supabase)
              </h3>

              <ImageUpload
                value={featuredImage}
                onChange={setFeaturedImage}
                folder="articles"
                label=""
                aspectHint="Ảnh chất lượng cao, định dạng JPG, PNG, WEBP tỷ lệ 16:9"
                placeholder="https://... hoặc tải ảnh từ máy tính"
              />
            </div>

            {/* Tags Box */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Thẻ Bài Viết (Tags)
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Thêm thẻ mới..."
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 max-h-48 overflow-y-auto">
                {availableTags.map((tg) => {
                  const isSelected = selectedTagIds.includes(tg._id);
                  return (
                    <button
                      key={tg._id}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedTagIds(selectedTagIds.filter((tid) => tid !== tg._id));
                        } else {
                          setSelectedTagIds([...selectedTagIds, tg._id]);
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      #{tg.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* In-app Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          onClick={() => !deleting && setShowDeleteModal(false)}
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
              <h3 className="text-base font-bold text-slate-900">Xác nhận xóa bài viết?</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Bạn có chắc chắn muốn xóa bài viết này vĩnh viễn không? Thao tác này sẽ xóa toàn bộ nội dung và không thể hoàn tác.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer"
              >
                {deleting ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
