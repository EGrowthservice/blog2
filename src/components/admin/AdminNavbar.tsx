'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, User as UserIcon } from 'lucide-react';
import { IUser } from '@/types';

interface AdminNavbarProps {
  title?: string;
}

export default function AdminNavbar({ title = 'Dashboard' }: AdminNavbarProps) {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          <span>Open Blog</span>
        </Link>

        {user && (
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              {user.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-4 h-4" />
              )}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-slate-900 block leading-none">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
                {user.role}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
