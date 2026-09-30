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
    let isMounted = true;
    fetch('/api/tags')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.tags) {
          setTags(data.tags);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
      }
    } catch {
      alert('Error creating tag');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (tag: ITag) => {
    if (!confirm(`Delete tag #${tag.name}?`)) return;

    try {
      const res = await fetch(`/api/tags/${tag._id}`, { method: 'DELETE' });
      if (res.ok) {
        setTags(tags.filter((t) => t._id !== tag._id));
      }
    } catch {
      alert('Failed to delete tag');
    }
  };

  return (
    <div>
      <AdminNavbar title="Tag Management" />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Tags & Taxonomy</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create, inspect, and remove article tags used across internal search and discovery.
          </p>
        </div>

        {/* Add Tag Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs max-w-md">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Create New Tag
          </h3>
          <form onSubmit={handleCreate} className="flex items-center gap-2">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Next.js, Cloud, LLM..."
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create</span>
            </button>
          </form>
        </div>

        {/* Tags Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Tag Name</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Articles Count</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400">
                      Loading tags...
                    </td>
                  </tr>
                ) : tags.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400">
                      No tags created yet.
                    </td>
                  </tr>
                ) : (
                  tags.map((tg) => (
                    <tr key={tg._id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <Tags className="w-3.5 h-3.5 text-indigo-600" />
                          <span>#{tg.name}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-500">
                        /tag/{tg.slug}
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          {tg.articleCount || 0}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/tag/${tg.slug}`}
                            target="_blank"
                            title="View Public Tag Page"
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(tg)}
                            title="Delete Tag"
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
      </div>
    </div>
  );
}
