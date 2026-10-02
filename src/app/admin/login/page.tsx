'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

function LoginForm() {
  const searchParams = useSearchParams();
  const rawFrom = searchParams.get('from');
  const targetDestination = rawFrom && rawFrom !== '/admin' && rawFrom !== '/admin/login'
    ? rawFrom
    : '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Đăng nhập không thành công');
      }

      // Hard redirect to dashboard to ensure fresh cookies and middleware sync
      window.location.href = targetDestination;
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Xác thực thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.');
      setLoading(false);
    }
  };

  const handleUseDemo = () => {
    setEmail('admin@spotlight.com');
    setPassword('AdminPassword2026!');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8">
      {/* Header with main logo /avt.png */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-white mx-auto shadow-xl overflow-hidden p-1">
          <Image
            src="/avt.png"
            alt="Logo"
            width={60}
            height={60}
            className="w-full h-full object-cover rounded-xl"
            priority
          />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Hệ Thống Quản Trị Blog
        </h1>
        <p className="text-xs text-slate-400">
          Đăng nhập tài khoản quản trị viên để quản lý bài viết, danh mục, hình ảnh và cài đặt hệ thống.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Email Quản Trị
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@spotlight.com"
              className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Mật Khẩu
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Đăng Nhập Vào Bảng Điều Khiển</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Quick Seed Demo Helper */}
      <div className="pt-4 border-t border-slate-800 text-center space-y-2">
        <button
          type="button"
          onClick={handleUseDemo}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 cursor-pointer transition"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Điền tài khoản mẫu quản trị
        </button>
        <div className="text-[11px] text-slate-500 font-mono">
          admin@spotlight.com / AdminPassword2026!
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 -mt-32 -ml-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 -mb-32 -mr-32 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <Suspense
          fallback={
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
              Đang tải cổng quản trị...
            </div>
          }
        >
          <LoginForm />
        </Suspense>

        {/* Back to Public Site */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white transition"
          >
            ← Quay lại trang chủ công khai
          </Link>
        </div>
      </div>
    </div>
  );
}
