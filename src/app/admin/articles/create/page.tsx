'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
  Plus,
} from 'lucide-react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import RichEditor from '@/components/admin/RichEditor';
import ImageUpload from '@/components/admin/ImageUpload';
import { ICategory, ITag } from '@/types';
import { slugify } from '@/lib/utils';

export default function CreateArticlePage() {
  const router = useRouter();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [availableTags, setAvailableTags] = useState<ITag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
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
    // Fetch categories and tags
    Promise.all([
      fetch('/api/categories?all=true').then((res) => (res.ok ? res.json() : null)),
      fetch('/api/tags').then((res) => (res.ok ? res.json() : null)),
    ]).then(([catData, tagData]) => {
      if (catData?.categories) {
        setCategories(catData.categories);
        if (catData.categories.length > 0) {
          setCategory(catData.categories[0]._id);
        }
      }
      if (tagData?.tags) {
        setAvailableTags(tagData.tags);
      }
    });
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (autoSlug) {
      setSlug(slugify(val));
    }
    if (!seoTitle) {
      setSeoTitle(val);
    }
  };

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

  const handleSubmit = async (submitStatus?: 'draft' | 'published') => {
    setError(null);
    setLoading(true);

    const postStatus = submitStatus || status;

    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề bài viết.');
      setLoading(false);
      return;
    }
    if (!content.trim()) {
      setError('Nội dung bài viết không được để trống.');
      setLoading(false);
      return;
    }
    if (!category) {
      setError('Vui lòng chọn một chuyên mục cho bài viết.');
      setLoading(false);
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

      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Lỗi khi tạo bài viết');
      }

      router.push('/admin/articles');
      router.refresh();
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Đã xảy ra lỗi trong quá trình lưu bài viết.');
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminNavbar title="Tạo Bài Viết Mới" />

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
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Soạn Thảo Bài Báo Mới</h2>
              <p className="text-xs text-slate-500">Soạn thảo nội dung bài viết và cấu hình SEO cho xuất bản.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmit('draft')}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 text-slate-500" />
              <span>Lưu bản nháp</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmit('published')}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition shadow-md shadow-indigo-600/20 cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Xuất bản ngay</span>
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span>{error}</span>
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
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Nhập tiêu đề hấp dẫn, chuẩn SEO cho bài báo..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
                />
              </div>

              {/* URL Slug */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Đường dẫn URL (Slug)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoSlug}
                      onChange={(e) => setAutoSlug(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Tự động tạo từ tiêu đề</span>
                  </label>
                </div>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-xs font-mono text-slate-500">
                    /article/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    disabled={autoSlug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="tieu-de-bai-viet"
                    className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-r-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-75"
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
                  placeholder="Đoạn văn ngắn giới thiệu nội dung tóm lược, hiển thị ở thẻ xem trước và kết quả tìm kiếm..."
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
                          setSelectedTagIds(selectedTagIds.filter((id) => id !== tg._id));
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
    </div>
  );
}
