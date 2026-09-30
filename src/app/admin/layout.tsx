import { Metadata } from 'next';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata: Metadata = {
  title: 'Spotlight Admin Portal',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 font-sans antialiased">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
