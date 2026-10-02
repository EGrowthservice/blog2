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
} from 'lucide-react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import ImageUpload from '@/components/admin/ImageUpload';
import { IAdvertisement, AdPosition, AdType } from '@/types';

const POSITIONS: { value: AdPosition; label: string }[] = [
  { value: 'header', label: 'Đầu trang (Header Leaderboard)' },
  { value: 'homepage-top', label: 'Trang chủ - Đầu trang' },
  { value: 'homepage-middle', label: 'Trang chủ - Giữa trang' },
  { value: 'homepage-bottom', label: 'Trang chủ - Cuối trang' },
  { value: 'sidebar', label: 'Cột bên (Sidebar)' },
  { value: 'article-top', label: 'Đầu bài viết' },
  { value: 'article-middle', label: 'Giữa nội dung bài viết' },
  { value: 'article-bottom', label: 'Cuối bài viết' },
  { value: 'footer', label: 'Chân trang (Footer)' },
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
    fetchAds();
  }, [fetchAds]);

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
        showToast(ad.isActive ? 'Đã tắt quảng cáo' : 'Đã bật quảng cáo');
      }
    } catch {
      showToast('Không thể cập nhật trạng thái', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Vui lòng nhập tên vị trí quảng cáo');
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
        throw new Error(data.error || 'Lỗi khi lưu quảng cáo');
      }

      setShowModal(false);
      fetchAds();
      showToast(editingAd ? 'Đã cập nhật quảng cáo' : 'Đã tạo quảng cáo mới');
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Đã xảy ra lỗi');
    }
  };

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteAdTarget, setDeleteAdTarget] = useState<IAdvertisement | null>(null);
  const [deletingAd, setDeletingAd] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast((prev) => (prev?.message === message ? null : prev)), 3500);
  };

  const confirmDeleteAd = async () => {
    if (!deleteAdTarget) return;
    setDeletingAd(true);
    try {
      const res = await fetch(`/api/advertisements/${deleteAdTarget._id}`, { method: 'DELETE' });
      if (res.ok) {
        setAds((prev) => prev.filter((a) => a._id !== deleteAdTarget._id));
        showToast(`Đã xóa quảng cáo "${deleteAdTarget.name}"`);
        setDeleteAdTarget(null);
      } else {
        showToast('Không thể xóa quảng cáo', 'error');
      }
    } catch {
      showToast('Lỗi khi xóa quảng cáo', 'error');
    } finally {
      setDeletingAd(false);
    }
  };

  return (
    <div>
      <AdminNavbar title="Quản Lý Quảng Cáo" />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Vị Trí Quảng Cáo & Kiếm Tiền
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Quản lý vị trí Google AdSense, banner đối tác tài trợ hoặc mã nhúng HTML.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm vị trí mới</span>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Tên quảng cáo</th>
                  <th className="py-3.5 px-4">Vị trí</th>
                  <th className="py-3.5 px-4">Loại quảng cáo</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      Đang tải danh sách quảng cáo...
                    </td>
                  </tr>
                ) : ads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      Chưa cấu hình vị trí quảng cáo nào.
                    </td>
                  </tr>
                ) : (
                  ads.map((ad) => {
                    const posLabel = POSITIONS.find((p) => p.value === ad.position)?.label || ad.position;
                    return (
                      <tr key={ad._id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          <div className="flex items-center gap-2.5">
                            <Megaphone className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>{ad.name}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {posLabel}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px] uppercase">
                            {ad.type}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(ad)}
                            className="inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            {ad.isActive ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Đang bật
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-slate-400 font-semibold text-[11px]">
                                <XCircle className="w-3.5 h-3.5" />
                                Tạm dừng
                              </span>
                            )}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(ad)}
                              title="Sửa"
                              className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteAdTarget(ad)}
                              title="Xóa"
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
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">
                  {editingAd ? 'Chỉnh Sửa Vị Trí Quảng Cáo' : 'Thêm Vị Trí Quảng Cáo Mới'}
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
                    Tên Vị Trí Quảng Cáo *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Banner Trang Chủ Đầu Trang"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Vị Trí Hiển Thị
                    </label>
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value as AdPosition)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
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
                      Loại Quảng Cáo
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as AdType)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="adsense">Google AdSense</option>
                      <option value="image">Hình ảnh / Banner (Supabase)</option>
                      <option value="html">Mã HTML tùy chỉnh</option>
                      <option value="script">Script bên thứ ba</option>
                    </select>
                  </div>
                </div>

                {type === 'adsense' && (
                  <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Ad Client (Publisher ID)
                      </label>
                      <input
                        type="text"
                        value={adClient}
                        onChange={(e) => setAdClient(e.target.value)}
                        placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Ad Slot ID
                      </label>
                      <input
                        type="text"
                        value={adSlot}
                        onChange={(e) => setAdSlot(e.target.value)}
                        placeholder="1234567890"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {type === 'image' && (
                  <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <ImageUpload
                        value={imageUrl}
                        onChange={setImageUrl}
                        folder="ads"
                        label="Hình Ảnh Banner Quảng Cáo (Supabase)"
                        aspectHint="Ảnh banner ngang hoặc chữ nhật, lưu trữ trên Supabase"
                        placeholder="https://... hoặc tải ảnh banner lên"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Liên Kết Đích (Click URL)
                      </label>
                      <input
                        type="url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://sponsor.com/landing-page"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                  </div>
                )}

                {(type === 'html' || type === 'script') && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Mã HTML / Script
                    </label>
                    <textarea
                      rows={5}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="<div>...</div> hoặc <script>...</script>"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span>Kích hoạt hiển thị</span>
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-indigo-600/20 cursor-pointer"
                  >
                    {editingAd ? 'Cập nhật' : 'Tạo mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* In-app Toast */}
        {toast && (
          <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-800 text-xs animate-in slide-in-from-top-3 duration-200">
            <span className="font-semibold">{toast.message}</span>
          </div>
        )}

        {/* In-app Delete Confirmation Modal */}
        {deleteAdTarget && (
          <div
            onClick={() => !deletingAd && setDeleteAdTarget(null)}
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
                <h3 className="text-base font-bold text-slate-900">Xác nhận xóa vị trí quảng cáo?</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Bạn có chắc chắn muốn xóa vị trí quảng cáo{' '}
                  <strong className="text-slate-900 font-semibold">&ldquo;{deleteAdTarget.name}&rdquo;</strong> không?
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={deletingAd}
                  onClick={() => setDeleteAdTarget(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  disabled={deletingAd}
                  onClick={confirmDeleteAd}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer"
                >
                  {deletingAd ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
