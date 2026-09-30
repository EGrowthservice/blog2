'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import RichEditor from '@/components/admin/RichEditor';
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
  const [featuredImage, setFeaturedImage] = useState(
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&h=630&q=80'
  );
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
      console.error('Error creating tag:', e);
    }
  };

  const handleSubmit = async (submitStatus?: 'draft' | 'published') => {
    setError(null);
    setLoading(true);

    const postStatus = submitStatus || status;

    if (!title.trim()) {
      setError('Please provide an article title.');
      setLoading(false);
      return;
    }
    if (!content.trim()) {
      setError('Article content cannot be empty.');
      setLoading(false);
      return;
    }
    if (!category) {
      setError('Please select a category for this article.');
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
        throw new Error(data.error || 'Failed to create article');
      }

      router.push('/admin/articles');
      router.refresh();
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Error saving article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminNavbar title="Create New Article" />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
        {/* Top Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/admin/articles"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Articles
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmit('draft')}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmit('published')}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Publish Article</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-rose-700 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Main 2-Column Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Title, Excerpt, Rich Editor, SEO */}
          <div className="lg:col-span-8 space-y-6">
            {/* Title & Slug */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Next.js 15 Deep Dive: Server Components & Cache Lifecycle"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    URL Slug
                  </label>
                  <label className="text-[11px] text-slate-400 flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoSlug}
                      onChange={(e) => setAutoSlug(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    Auto-generate from title
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">/article/</span>
                  <input
                    type="text"
                    value={slug}
                    disabled={autoSlug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 disabled:bg-slate-100 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Article Excerpt / Abstract
                </label>
                <textarea
                  rows={3}
                  value={excerpt}
                  onChange={(e) => {
                    setExcerpt(e.target.value);
                    if (!seoDescription) setSeoDescription(e.target.value);
                  }}
                  placeholder="A concise, high-impact summary displayed on social shares, Google search cards, and feed cards..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition leading-relaxed"
                />
              </div>
            </div>

            {/* Rich Editor */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Article Body Content *
              </label>
              <RichEditor value={content} onChange={setContent} />
            </div>

            {/* SEO Metadata Box */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Search Engine Optimization (SEO)
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  SEO Meta Title
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={title || 'Primary Title tag for search engines'}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  SEO Meta Description
                </label>
                <textarea
                  rows={2}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Meta description for SERP snippets (recommended 140-160 characters)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  SEO Keywords (Comma Separated)
                </label>
                <input
                  type="text"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  placeholder="e.g. Next.js, TypeScript, Fullstack, Web Performance"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Category, Tags, Image, Status, Featured */}
          <div className="lg:col-span-4 space-y-6">
            {/* Publication Settings */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Publication Settings
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'draft' | 'published' | 'scheduled' | 'archived')}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="draft">Draft (Private)</option>
                  <option value="published">Published (Live to Public)</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Featured Cover Story</span>
                    <span className="text-[11px] text-slate-500 block">Display prominently at homepage top</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Category Box */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Category *</h3>
                <Link
                  href="/admin/categories"
                  className="text-[11px] text-indigo-600 hover:underline font-semibold"
                >
                  + Add Category
                </Link>
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Featured Image */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Featured Cover Image
              </h3>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {featuredImage && (
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 mt-2">
                  <Image
                    src={featuredImage}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {/* Tags Box */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Tags & Topics
              </h3>

              {/* Tag selector checkboxes */}
              <div className="max-h-40 overflow-y-auto space-y-1.5 p-1">
                {availableTags.map((tg) => {
                  const isChecked = selectedTagIds.includes(tg._id);
                  return (
                    <label key={tg._id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:bg-slate-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTagIds([...selectedTagIds, tg._id]);
                          } else {
                            setSelectedTagIds(selectedTagIds.filter((id) => id !== tg._id));
                          }
                        }}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>#{tg.name}</span>
                    </label>
                  );
                })}
              </div>

              {/* Add New Tag Inline */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder="New tag..."
                  className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
