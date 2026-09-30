'use client';

import { useEffect, useState } from 'react';
import {
  Save,
  CheckCircle,
  AlertCircle,
  Globe,
  Search,
  Share2,
  BarChart3,
  Megaphone,
} from 'lucide-react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { ISetting } from '@/types';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'seo' | 'social' | 'monetization'>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [siteName, setSiteName] = useState('Spotlight');
  const [logo, setLogo] = useState('');
  const [favicon, setFavicon] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('editorial@spotlightmedia.com');

  const [defaultMetaTitle, setDefaultMetaTitle] = useState('');
  const [defaultMetaDescription, setDefaultMetaDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [twitterCard, setTwitterCard] = useState<'summary' | 'summary_large_image'>('summary_large_image');

  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    x: '',
    instagram: '',
    youtube: '',
    linkedin: '',
    tiktok: '',
  });

  const [gaId, setGaId] = useState('');
  const [adsenseClient, setAdsenseClient] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.settings) {
          const s: ISetting = data.settings;
          setSiteName(s.siteName || 'Spotlight');
          setLogo(s.logo || '');
          setFavicon(s.favicon || '');
          setDescription(s.description || '');
          setEmail(s.email || 'editorial@spotlightmedia.com');

          setDefaultMetaTitle(s.defaultMetaTitle || '');
          setDefaultMetaDescription(s.defaultMetaDescription || '');
          setOgImage(s.ogImage || '');
          setTwitterCard(s.twitterCard || 'summary_large_image');

          if (s.socialLinks) {
            setSocialLinks({
              facebook: s.socialLinks.facebook || '',
              x: s.socialLinks.x || '',
              instagram: s.socialLinks.instagram || '',
              youtube: s.socialLinks.youtube || '',
              linkedin: s.socialLinks.linkedin || '',
              tiktok: s.socialLinks.tiktok || '',
            });
          }

          setGaId(s.gaId || '');
          setAdsenseClient(s.adsenseClient || '');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      siteName,
      logo,
      favicon,
      description,
      email,
      defaultMetaTitle,
      defaultMetaDescription,
      ogImage,
      twitterCard,
      socialLinks,
      gaId,
      adsenseClient,
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to update website settings');
      }

      setSuccess('Settings saved and applied successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General Info', icon: Globe },
    { id: 'seo', label: 'SEO & Metadata', icon: Search },
    { id: 'social', label: 'Social Channels', icon: Share2 },
    { id: 'monetization', label: 'Analytics & AdSense', icon: Megaphone },
  ];

  if (loading) {
    return (
      <div>
        <AdminNavbar title="Website Settings" />
        <div className="p-12 text-center text-xs text-slate-400">Loading settings...</div>
      </div>
    );
  }

  return (
    <div>
      <AdminNavbar title="System Settings" />

      <div className="p-6 sm:p-8 space-y-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Website Settings</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Configure publication metadata, default SEO schemas, social profiles, and ad networks.
            </p>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer self-start sm:self-auto"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2.5 font-medium">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{success}</span>
          </div>
        )}

        {/* Settings Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                General Publication Info
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Website Name *
                </label>
                <input
                  type="text"
                  required
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Editorial Contact Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Publication Description / Tagline
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Custom Logo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    placeholder="https://.../logo.png"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Favicon URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={favicon}
                    onChange={(e) => setFavicon(e.target.value)}
                    placeholder="https://.../favicon.ico"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Default Global Search Engine Optimization
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Default SERP Meta Title
                </label>
                <input
                  type="text"
                  value={defaultMetaTitle}
                  onChange={(e) => setDefaultMetaTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Default SERP Meta Description
                </label>
                <textarea
                  rows={2}
                  value={defaultMetaDescription}
                  onChange={(e) => setDefaultMetaDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Default Open Graph (OG) Share Image
                </label>
                <input
                  type="url"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Twitter Card Format
                </label>
                <select
                  value={twitterCard}
                  onChange={(e) => setTwitterCard(e.target.value as 'summary' | 'summary_large_image')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="summary_large_image">Summary with Large Image (Recommended)</option>
                  <option value="summary">Summary Small Card</option>
                </select>
              </div>
            </div>
          )}

          {/* Social Tab */}
          {activeTab === 'social' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Official Social Media Channels
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    X (formerly Twitter)
                  </label>
                  <input
                    type="url"
                    value={socialLinks.x}
                    onChange={(e) => setSocialLinks({ ...socialLinks, x: e.target.value })}
                    placeholder="https://x.com/yourhandle"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    LinkedIn Organization
                  </label>
                  <input
                    type="url"
                    value={socialLinks.linkedin}
                    onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/company/spotlightmedia"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Facebook Page
                  </label>
                  <input
                    type="url"
                    value={socialLinks.facebook}
                    onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                    placeholder="https://facebook.com/spotlightmedia"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    YouTube Channel
                  </label>
                  <input
                    type="url"
                    value={socialLinks.youtube}
                    onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                    placeholder="https://youtube.com/@spotlightmedia"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Monetization & Analytics Tab */}
          {activeTab === 'monetization' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Analytics & Advertising Configurations
              </h3>

              {/* Google Analytics 4 */}
              <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 uppercase tracking-wider">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  <span>Google Analytics 4</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Measurement ID (format: G-XXXXXXXXXX)
                  </label>
                  <input
                    type="text"
                    value={gaId}
                    onChange={(e) => setGaId(e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Can also be provided via <code className="bg-slate-200 px-1 rounded">NEXT_PUBLIC_GA_ID</code> in .env.
                  </p>
                </div>
              </div>

              {/* Google AdSense */}
              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                  <Megaphone className="w-4 h-4 text-amber-600" />
                  <span>Google AdSense Integration</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Publisher ID (format: ca-pub-xxxxxxxxxxxxxxxx)
                  </label>
                  <input
                    type="text"
                    value={adsenseClient}
                    onChange={(e) => setAdsenseClient(e.target.value)}
                    placeholder="ca-pub-0000000000000000"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Can also be provided via <code className="bg-slate-200 px-1 rounded">NEXT_PUBLIC_ADSENSE_CLIENT</code> in .env.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer"
            >
              {saving ? 'Saving Changes...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
