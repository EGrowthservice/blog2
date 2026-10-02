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
  Bell,
  X,
  Mail,
  ShieldAlert,
  MessageSquare,
} from 'lucide-react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import ImageUpload from '@/components/admin/ImageUpload';
import { ISetting } from '@/types';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'seo' | 'social' | 'monetization' | 'notifications'>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [siteName, setSiteName] = useState('Spotlight');
  const [logo, setLogo] = useState('');
  const [favicon, setFavicon] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('qbinhtkcongviec@gmail.com');

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

  // Notification / Alert settings
  const [notifyNewComment, setNotifyNewComment] = useState(true);
  const [notifyNewReport, setNotifyNewReport] = useState(true);
  const [adminNotificationEmail, setAdminNotificationEmail] = useState('qbinhtkcongviec@gmail.com');

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
          setEmail(s.email || 'qbinhtkcongviec@gmail.com');

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

          setNotifyNewComment(s.notifyNewComment !== undefined ? s.notifyNewComment : true);
          setNotifyNewReport(s.notifyNewReport !== undefined ? s.notifyNewReport : true);
          setAdminNotificationEmail(s.adminNotificationEmail || 'qbinhtkcongviec@gmail.com');
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
      notifyNewComment,
      notifyNewReport,
      adminNotificationEmail,
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Lỗi khi lưu cài đặt');
      }

      setSuccess('Đã lưu cấu hình hệ thống thành công!');
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: unknown) {
      const eObj = err as Error;
      setError(eObj.message || 'Lỗi xảy ra trong quá trình lưu cài đặt.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'Cài đặt chung & Logo', icon: Globe },
    { id: 'seo', label: 'Cấu hình SEO & Thẻ chia sẻ', icon: Search },
    { id: 'social', label: 'Mạng xã hội', icon: Share2 },
    { id: 'monetization', label: 'Google Analytics & AdSense', icon: BarChart3 },
    { id: 'notifications', label: 'Thông báo & Cảnh báo', icon: Bell },
  ];

  if (loading) {
    return (
      <div>
        <AdminNavbar title="Cài Đặt Hệ Thống & SEO" />
        <div className="p-12 text-center text-slate-400">Đang tải cấu hình hệ thống...</div>
      </div>
    );
  }

  return (
    <div>
      <AdminNavbar title="Cài Đặt Hệ Thống & SEO" />

      {/* Floating Simple Alert / Toast (Đơn giản, không màu mè) */}
      {success && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-800 text-xs animate-in slide-in-from-top-3 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{success}</span>
          <button
            type="button"
            onClick={() => setSuccess(null)}
            className="ml-3 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {error && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-rose-950 text-white rounded-xl shadow-xl border border-rose-900 text-xs animate-in slide-in-from-top-3 duration-200">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="font-semibold">{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="ml-3 text-rose-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="p-6 sm:p-8 space-y-8 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Cài Đặt Hệ Thống</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Cấu hình thương hiệu, logo, thẻ SEO, thông báo hệ thống và các dịch vụ tích hợp.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer self-start sm:self-auto"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Đang lưu...' : 'Lưu cấu hình'}</span>
          </button>
        </div>

        {/* Inline Alerts */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-700 text-xs">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
            <span>{success}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-slate-200 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition border-b-2 -mb-[2px] cursor-pointer ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 bg-white shadow-2xs'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Container */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* TAB 1: General */}
          {activeTab === 'general' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Thông tin Cơ bản & Thương hiệu
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tên Website / Tạp chí
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Logo Upload */}
              <div>
                <ImageUpload
                  label="Logo Chính (Header & Footer)"
                  value={logo}
                  onChange={(url) => setLogo(url)}
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Định dạng PNG/SVG nền trong suốt để hiển thị sắc nét nhất.
                </p>
              </div>

              {/* Favicon Upload */}
              <div>
                <ImageUpload
                  label="Favicon Website (Tab trình duyệt)"
                  value={favicon}
                  onChange={(url) => setFavicon(url)}
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Kích thước khuyến nghị 32x32 hoặc 64x64 pixel.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Mô tả Website (Description)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Email Liên hệ Tòa soạn
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
          )}

          {/* TAB 2: SEO */}
          {activeTab === 'seo' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Cấu hình Thẻ Siêu Dữ Liệu SEO Mặc định
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tiêu đề SEO Mặc định (Meta Title)
                </label>
                <input
                  type="text"
                  value={defaultMetaTitle}
                  onChange={(e) => setDefaultMetaTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Mô tả SEO Mặc định (Meta Description)
                </label>
                <textarea
                  rows={3}
                  value={defaultMetaDescription}
                  onChange={(e) => setDefaultMetaDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <ImageUpload
                  label="Ảnh Chia Sẻ Mặc định (OpenGraph Image)"
                  value={ogImage}
                  onChange={(url) => setOgImage(url)}
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Kích thước tối ưu 1200x630px khi chia sẻ đường dẫn lên Facebook, X, Zalo.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Kiểu Thẻ Twitter Card
                </label>
                <select
                  value={twitterCard}
                  onChange={(e) => setTwitterCard(e.target.value as 'summary' | 'summary_large_image')}
                  className="px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="summary_large_image">Ảnh lớn (summary_large_image)</option>
                  <option value="summary">Ảnh nhỏ (summary)</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 3: Social */}
          {activeTab === 'social' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Đường Dẫn Kênh Mạng Xã Hội Chính Thức
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Facebook</label>
                  <input
                    type="url"
                    value={socialLinks.facebook}
                    onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                    placeholder="https://facebook.com/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">X (Twitter)</label>
                  <input
                    type="url"
                    value={socialLinks.x}
                    onChange={(e) => setSocialLinks({ ...socialLinks, x: e.target.value })}
                    placeholder="https://x.com/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Instagram</label>
                  <input
                    type="url"
                    value={socialLinks.instagram}
                    onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                    placeholder="https://instagram.com/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">YouTube</label>
                  <input
                    type="url"
                    value={socialLinks.youtube}
                    onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                    placeholder="https://youtube.com/@..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn</label>
                  <input
                    type="url"
                    value={socialLinks.linkedin}
                    onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/company/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">TikTok</label>
                  <input
                    type="url"
                    value={socialLinks.tiktok}
                    onChange={(e) => setSocialLinks({ ...socialLinks, tiktok: e.target.value })}
                    placeholder="https://tiktok.com/@..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Monetization */}
          {activeTab === 'monetization' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Tích Hợp Đo Lường & Quảng Cáo
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Google Analytics 4 Measurement ID
                </label>
                <input
                  type="text"
                  value={gaId}
                  onChange={(e) => setGaId(e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Đo lường lượng truy cập trực tiếp, số phiên đọc và thiết bị độc giả.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Google AdSense Publisher Client ID
                </label>
                <input
                  type="text"
                  value={adsenseClient}
                  onChange={(e) => setAdsenseClient(e.target.value)}
                  placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Mã nhà xuất bản AdSense để phân phối banner tự động.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: Notifications & Alerts (Đơn giản, không màu mè) */}
          {activeTab === 'notifications' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Cài Đặt Cảnh Báo & Thông Báo Quản Trị
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tùy chỉnh thông báo chuông trên trang quản trị và thông báo khi có tương tác từ độc giả.
                </p>
              </div>

              <div className="space-y-4">
                {/* Email nhận cảnh báo */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email Nhận Cảnh Báo Quản Trị Viên
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={adminNotificationEmail}
                      onChange={(e) => setAdminNotificationEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Hòm thư tiếp nhận các cảnh báo quan trọng và phản hồi liên hệ khẩn cấp.
                  </p>
                </div>

                {/* Switch: Bình luận mới */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-100">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Thông báo khi có bình luận mới từ khách
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Hiển thị ngay trên chuông thông báo Admin khi độc giả gửi bình luận dưới bài viết.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={notifyNewComment}
                      onChange={(e) => setNotifyNewComment(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
                  </label>
                </div>

                {/* Switch: Báo cáo vi phạm */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 border border-rose-100">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Cảnh báo ưu tiên khi có báo cáo vi phạm nội dung
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Bật chấm đỏ cảnh báo trên chuông thông báo khi có báo cáo bài viết hoặc bình luận từ độc giả.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={notifyNewReport}
                      onChange={(e) => setNotifyNewReport(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer"
            >
              {saving ? 'Đang lưu...' : 'Lưu tất cả thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
