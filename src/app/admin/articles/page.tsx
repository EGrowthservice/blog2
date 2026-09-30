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
  Calendar,
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
    if (statusFilter !== 'all') params.set('status', statusFilter);
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

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(posts.filter((p) => p._id !== id));
      } else {
        alert('Failed to delete article');
      }
    } catch {
      alert('Error deleting article');
    }
  };

  const handleToggleFeatured = async (post: IPost) => {
    try {
      const res = await fetch(`/api/articles/${post._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !post.isFeatured }),
      });

      if (res.ok) {
        setPosts(
          posts.map((p) => (p._id === post._id ? { ...p, isFeatured: !p.isFeatured } : p))
        );
      }
    } catch {
      alert('Failed to toggle featured status');
    }
  };

  return (
    <div>
      <AdminNavbar title="Article Management" />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
        {/* Top Header & New Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Articles</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Draft, edit, schedule, publish, and analyze all editorial posts.
            </p>
          </div>

          <Link
            href="/admin/articles/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Article</span>
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
                placeholder="Search by title, keyword..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Status Select */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                aria-label="Filter articles by publication status"
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Category Select */}
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter articles by category"
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table of Articles */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Featured</th>
                  <th className="py-3.5 px-4 text-right">Views</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Loading articles from database...
                    </td>
                  </tr>
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No articles found matching criteria.
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => {
                    const catName =
                      typeof post.category === 'object' && post.category
                        ? post.category.name
                        : 'Uncategorized';

                    return (
                      <tr key={post._id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs">
                          <Link
                            href={`/admin/articles/edit/${post._id}`}
                            className="hover:text-indigo-600 transition truncate block"
                            title={post.title}
                          >
                            {post.title}
                          </Link>
                          <div className="text-[11px] text-slate-400 font-normal truncate">
                            /{post.slug}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {catName}
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              post.status === 'published'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : post.status === 'draft'
                                ? 'bg-slate-100 text-slate-700'
                                : post.status === 'scheduled'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {post.status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(post)}
                            title={post.isFeatured ? 'Featured Story (click to remove)' : 'Mark as Featured Cover'}
                            className={`p-1 rounded-md transition cursor-pointer ${
                              post.isFeatured
                                ? 'text-amber-500 hover:text-amber-600 bg-amber-50'
                                : 'text-slate-300 hover:text-slate-400'
                            }`}
                          >
                            <Star className={`w-4 h-4 ${post.isFeatured ? 'fill-amber-400' : ''}`} />
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right font-medium text-slate-700">
                          <span className="inline-flex items-center gap-1">
                            <Eye className="w-3 h-3 text-slate-400" />
                            {formatNumber(post.views || 0)}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-500">
                          <span className="flex items-center gap-1 text-[11px]">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {formatDate(post.publishedAt || post.createdAt)}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {post.status === 'published' && (
                              <Link
                                href={`/article/${post.slug}`}
                                target="_blank"
                                title="View on live blog"
                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            )}

                            <Link
                              href={`/admin/articles/edit/${post._id}`}
                              title="Edit article"
                              className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleDelete(post._id, post.title)}
                              title="Delete article"
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
            <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div>
                Page {page} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
