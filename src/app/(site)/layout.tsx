import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getActiveCategories, getSiteSettings } from '@/lib/data';

export const revalidate = 60;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, settings] = await Promise.all([
    getActiveCategories(),
    getSiteSettings(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header categories={categories} siteName={settings.siteName} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      <Footer categories={categories} settings={settings} />
    </div>
  );
}
