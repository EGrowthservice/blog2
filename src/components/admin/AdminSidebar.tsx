'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Megaphone,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  PlusCircle,
  MessageSquare,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const navGroups = [
    {
      group: 'Tổng quan',
      items: [
        { name: 'Bảng điều khiển', href: '/admin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'Quản lý nội dung',
      items: [
        { name: 'Bài viết', href: '/admin/articles', icon: FileText },
        { name: 'Danh mục', href: '/admin/categories', icon: FolderTree },
        { name: 'Bình luận & Báo cáo', href: '/admin/comments', icon: MessageSquare },
      ],
    },
    {
      group: 'Quảng cáo & Thống kê',
      items: [
        { name: 'Quảng cáo', href: '/admin/advertisements', icon: Megaphone },
        { name: 'Google Analytics', href: '/admin/analytics', icon: BarChart3 },
      ],
    },
    {
      group: 'Hệ thống',
      items: [
        { name: 'Cài đặt & SEO', href: '/admin/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col border-r border-slate-800 shrink-0">
      {/* Brand Header with /avt.png logo */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/80 overflow-hidden flex items-center justify-center shrink-0">
            <Image
              src="/avt.png"
              alt="Logo"
              width={36}
              height={36}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div>
            <span className="font-bold text-white tracking-tight text-sm block">Quản Trị Blog</span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-indigo-400 block">
              Bảng Quản Trị
            </span>
          </div>
        </Link>
      </div>

      {/* Quick Action: New Post */}
      <div className="p-4">
        <Link
          href="/admin/articles/create"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-indigo-600/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Viết bài mới</span>
        </Link>
      </div>

      {/* Nav List */}
      <div className="flex-1 px-3 py-2 space-y-6 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.group}>
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {group.group}
            </div>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            Xem trang chủ
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold">Trực tuyến</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
