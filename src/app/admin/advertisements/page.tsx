'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Megaphone,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Layers,
} from 'lucide-react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { IAdvertisement, AdPosition, AdType } from '@/types';

const POSITIONS: { value: AdPosition; label: string }[] = [
  { value: 'header', label: 'Header (Top Leaderboard)' },
  { value: 'homepage-top', label: 'Homepage Top' },
  { value: 'homepage-middle', label: 'Homepage Middle' },
  { value: 'homepage-bottom', label: 'Homepage Bottom' },
  { value: 'sidebar', label: 'Sidebar Unit' },
  { value: 'article-top', label: 'Article Top' },
  { value: 'article-middle', label: 'Article Middle' },
  { value: 'article-bottom', label: 'Article Bottom' },
  { value: 'footer', label: 'Footer Banner' },
];

export default function AdminAdvertisementsPage() {
  const [ads, setAds] = useState<IAdvertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAd, setEditingAd] = useState<IAdvertisement | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [position, setPosition] = useState<AdPosition>('homepage-top');
  const [type, setType] = useState<AdType>('adsense');
  const [adClient, setAdClient] = useState('');
  const [adSlot, setAdSlot] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [content, setContent] = useState('');
  const [isActive, setIsActive] = useState(true);

  const fetchAds = useCallback(async () => {
    try {
      const res = await fetch('/api/advertisements?all=true');
      if (res.ok) {
        const data = await res.json();
        setAds(data.advertisements || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/advertisements?all=true')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.advertisements) {
          setAds(data.advertisements);
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

  const handleOpenCreate = () => {
    setEditingAd(null);
    setName('');
    setPosition('homepage-top');
    setType('adsense');
    setAdClient(process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '');
    setAdSlot('');
    setImageUrl('');
    setLinkUrl('');
    setContent('');
    setIsActive(true);
    setError(null);
    setShowModal(true);
  };

  const handleOpenEdit = (ad: IAdvertisement) => {
    setEditingAd(ad);
    setName(ad.name);
    setPosition(ad.position);
    setType(ad.type);
    setAdClient(ad.adClient || '');
    setAdSlot(ad.adSlot || '');
    setImageUrl(ad.imageUrl || '');
    setLinkUrl(ad.linkUrl || '');
    setContent(ad.content || '');
    setIsActive(ad.isActive);
    setError(null);
    setShowModal(true);
  };

  const handleToggleActive = async (ad: IAdvertisement) => {
    try {
      const res = await fetch(`/api/advertisements/${ad._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !ad.isActive }),
      });
      if (res.ok) {
        setAds(ads.map((a) => (a._id === ad._id ? { ...a, isActive: !a.isActive } : a)));
      }
    } catch {
      alert('Failed to toggle status');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Ad slot name is required');
      return;
    }

    const payload = {
      name,
      position,
      type,
      adClient,
      adSlot,
      imageUrl,
      linkUrl,
      content,
      isActive,
    };

    try {
      const url = editingAd
        ? `/api/advertisements/${editingAd._id}`
        : '/api/advertisements';
      const method = editingAd ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save advertisement');
      }

      setShowModal(false);
      fetchAds();
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Error occurred');
    }
  };

  const handleDelete = async (ad: IAdvertisement) => {
    if (!confirm(`Delete advertisement slot "${ad.name}"?`)) return;
    try {
      const res = await fetch(`/api/advertisements/${ad._id}`, { method: 'DELETE' });
      if (res.ok) {
        setAds(ads.filter((a) => a._id !== ad._id));
      } else {
        alert('Failed to delete ad');
      }
    } catch {
      alert('Error deleting ad');
    }
  };

  return (
    <div>
      <AdminNavbar title="Monetization & Advertisements" />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Ad Placements & Monetization
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage Google AdSense slots, sponsor banners, custom HTML embeds, and layout placements.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Ad Placement</span>
          </button>
        </div>

        {/* Ads List Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Placement Name</th>
                  <th className="py-3.5 px-4">Position</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Ad Details</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Loading advertisements...
                    </td>
                  </tr>
                ) : ads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No advertisements configured. Click &quot;New Ad Placement&quot; to configure one.
                    </td>
                  </tr>
                ) : (
                  ads.map((ad) => (
                    <tr key={ad._id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <Megaphone className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>{ad.name}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-mono text-[11px] text-slate-700">
                          {ad.position}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold uppercase text-[10px]">
                          {ad.type}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate font-mono text-[11px]">
                        {ad.type === 'adsense' && `Slot: ${ad.adSlot || 'Auto'}`}
                        {ad.type === 'image' && `Image: ${ad.imageUrl || ''}`}
                        {ad.type === 'html' && 'Custom HTML code'}
                        {ad.type === 'script' && 'Custom Script'}
                      </td>

                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(ad)}
                          className="cursor-pointer"
                        >
                          {ad.isActive ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-400 font-semibold text-[11px]">
                              <XCircle className="w-3.5 h-3.5" />
                              Paused
                            </span>
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(ad)}
                            title="Edit Ad"
                            className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(ad)}
                            title="Delete Ad"
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">
                  {editingAd ? 'Edit Ad Placement' : 'Create Ad Placement'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-600"
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
                    Ad Unit Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sidebar Sticky 300x250"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Placement Position *
                    </label>
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value as AdPosition)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {POSITIONS.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Ad Type *
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as AdType)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="adsense">Google AdSense</option>
                      <option value="image">Image Banner & Link</option>
                      <option value="html">Custom HTML</option>
                      <option value="script">Script Snippet</option>
                    </select>
                  </div>
                </div>

                {/* Conditional Fields based on Type */}
                {type === 'adsense' && (
                  <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Google AdSense Slot Configuration</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Ad Client (Publisher ID)
                      </label>
                      <input
                        type="text"
                        value={adClient}
                        onChange={(e) => setAdClient(e.target.value)}
                        placeholder="ca-pub-xxxxxxxxxxxxxxxx"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Ad Slot ID *
                      </label>
                      <input
                        type="text"
                        value={adSlot}
                        onChange={(e) => setAdSlot(e.target.value)}
                        placeholder="1234567890"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800"
                      />
                    </div>
                  </div>
                )}

                {type === 'image' && (
                  <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Banner Image URL *
                      </label>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Destination Link URL
                      </label>
                      <input
                        type="url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://sponsor.com/offer"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Caption / Alt Text
                      </label>
                      <input
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Promotional banner tagline"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                )}

                {(type === 'html' || type === 'script') && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {type === 'html' ? 'Custom HTML Code' : 'Custom Script Embed'}
                    </label>
                    <textarea
                      rows={4}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="<div>...</div>"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="ad-is-active"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="ad-is-active" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Enable advertisement immediately
                  </label>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-indigo-600/20 cursor-pointer"
                  >
                    {editingAd ? 'Update Ad Placement' : 'Create Ad Placement'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
