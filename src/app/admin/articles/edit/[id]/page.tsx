'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import RichEditor from '@/components/admin/RichEditor';
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
          setError('Article not found');
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
      console.error('Error creating tag:', e);
    }
  };

  const handleSave = async (customStatus?: 'draft' | 'published') => {
    setError(null);
    setSuccess(null);
    setSaving(true);

    const postStatus = customStatus || status;

    if (!title.trim()) {
      setError('Please provide an article title.');
      setSaving(false);
      return;
    }
    if (!content.trim()) {
      setError('Article content cannot be empty.');
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
        throw new Error(data.error || 'Failed to update article');
      }

      setSuccess('Article saved and updated successfully!');
      setStatus(postStatus);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Error updating article');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this article?')) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/articles');
      } else {
        alert('Failed to delete');
      }
    } catch {
      alert('Error deleting');
    }
  };

  if (loading) {
    return (
      <div>
        <AdminNavbar title="Edit Article" />
        <div className="p-12 text-center text-xs text-slate-400">Loading article details...</div>
      </div>
    );
  }

  return (
    <div>
      <AdminNavbar title="Edit Article" />

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
            {slug && status === 'published' && (
              <Link
                href={`/article/${slug}`}
                target="_blank"
                className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Live</span>
              </Link>
            )}

            <button
              type="button"
              onClick={handleDelete}
              className="p-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
              title="Delete Article"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave()}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Update Article'}</span>
            </button>
          </div>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-rose-700 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-700 text-xs font-medium">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{success}</span>
          </div>
        )}

        {/* Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Area */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  URL Slug
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">/article/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  onChange={(e) => setExcerpt(e.target.value)}
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
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  SEO Keywords
                </label>
                <input
                  type="text"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Publication Status
              </h3>

              <div>
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
                    <span className="text-[11px] text-slate-500 block">Highlight at top of home feed</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Category Select */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Category
              </h3>
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
              <input
                type="url"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {featuredImage && (
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 mt-2">
                  <Image src={featuredImage} alt="Preview" fill className="object-cover" />
                </div>
              )}
            </div>

            {/* Tags Box */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Tags
              </h3>
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
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
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
