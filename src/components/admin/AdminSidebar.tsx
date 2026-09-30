'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Tags,
  Megaphone,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  PlusCircle,
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
      group: 'Overview',
      items: [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'Content Management',
      items: [
        { name: 'Articles', href: '/admin/articles', icon: FileText },
        { name: 'Categories', href: '/admin/categories', icon: FolderTree },
        { name: 'Tags', href: '/admin/tags', icon: Tags },
      ],
    },
    {
      group: 'Monetization & Analytics',
      items: [
        { name: 'Advertisements', href: '/admin/advertisements', icon: Megaphone },
        { name: 'Google Analytics', href: '/admin/analytics', icon: BarChart3 },
      ],
    },
    {
      group: 'System',
      items: [
        { name: 'Settings & SEO', href: '/admin/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col border-r border-slate-800 shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-md">
            S
          </div>
          <div>
            <span className="font-bold text-white tracking-tight text-base block">Spotlight</span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-indigo-400 block -mt-1">
              Admin Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Quick Action: New Post */}
      <div className="p-4">
        <Link
          href="/admin/articles/create"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-indigo-600/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Write Article</span>
        </Link>
      </div>

      {/* Nav List */}
      <div className="flex-1 px-3 py-2 space-y-6 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.group}>
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
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
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
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
            View Public Site
          </span>
          <span className="text-[10px] text-slate-500">Live</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
