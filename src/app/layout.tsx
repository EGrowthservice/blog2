import type { Metadata } from 'next';
import Script from 'next/script';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import CustomHeaderScripts from '@/components/layout/CustomHeaderScripts';
import { getSiteSettings } from '@/lib/data';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'http://localhost:3000';

  return {
    title: {
      default: settings.defaultMetaTitle || 'Spotlight - Entertainment, Sports & Comedy Magazine',
      template: `%s | ${settings.siteName || 'Spotlight'}`,
    },
    description: settings.defaultMetaDescription || 'Spotlight is a premier digital publication delivering curated reporting, insightful commentary, and captivating coverage across Entertainment, Sports, and Comedy.',
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: '/',
    },
    icons: {
      icon: [
        { url: '/avt.png', type: 'image/png' },
        { url: '/favicon.ico', type: 'image/x-icon' },
      ],
      shortcut: '/avt.png',
      apple: '/avt.png',
    },
    openGraph: {
      title: settings.defaultMetaTitle || 'Spotlight',
      description: settings.defaultMetaDescription,
      url: siteUrl,
      siteName: settings.siteName || 'Spotlight',
      images: [
        {
          url: settings.ogImage || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&h=630&q=80',
          width: 1200,
          height: 630,
          alt: settings.siteName,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: settings.twitterCard || 'summary_large_image',
      title: settings.defaultMetaTitle || 'Spotlight',
      description: settings.defaultMetaDescription,
      images: [settings.ogImage || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&h=630&q=80'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const adsenseClient = settings.adsenseClient || process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <CustomHeaderScripts code={settings.customHeaderScripts} />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
        {adsenseClient && !settings.customHeaderScripts?.includes('adsbygoogle.js') && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <GoogleAnalytics gaId={settings.gaId} />
        {children}
      </body>
    </html>
  );
}
