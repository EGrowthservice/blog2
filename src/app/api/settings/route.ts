import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Setting from '@/models/Setting';
import { requireAuth } from '@/lib/api-auth';

const DEFAULT_SETTINGS = {
  key: 'global_settings',
  siteName: 'Spotlight',
  logo: '',
  favicon: '',
  description: 'Spotlight is a premier digital publication delivering curated reporting, insightful commentary, and captivating coverage across Entertainment, Sports, and Comedy.',
  email: 'qbinhtkcongviec@gmail.com',
  defaultMetaTitle: 'Spotlight - Entertainment, Sports & Comedy Magazine',
  defaultMetaDescription: 'Read the latest in entertainment news, sports reporting, and comedic commentary on Spotlight.',
  ogImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&h=630&q=80',
  twitterCard: 'summary_large_image' as const,
  socialLinks: {
    facebook: 'https://facebook.com/spotlightmedia',
    x: 'https://x.com/spotlightmedia',
    instagram: 'https://instagram.com/spotlightmedia',
    youtube: 'https://youtube.com/@spotlightmedia',
    linkedin: 'https://linkedin.com/company/spotlightmedia',
    tiktok: '',
  },
  gaId: process.env.NEXT_PUBLIC_GA_ID || '',
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-4714090083774338',
  customHeaderScripts: '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4714090083774338" crossorigin="anonymous"></script>',
  notifyNewComment: true,
  notifyNewReport: true,
  adminNotificationEmail: 'qbinhtkcongviec@gmail.com',
};

export async function GET() {
  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ settings: DEFAULT_SETTINGS });
    }

    let settings = await Setting.findOne({ key: 'global_settings' }).lean();
    if (!settings) {
      settings = await Setting.create(DEFAULT_SETTINGS);
    }

    return NextResponse.json({ settings });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching settings:', err);
    return NextResponse.json({ settings: DEFAULT_SETTINGS });
  }
}

export async function PUT(req: NextRequest) {
  const { errorResponse } = await requireAuth(req);
  if (errorResponse) return errorResponse;

  try {
    await connectDB();
    const body = await req.json();

    const updated = await Setting.findOneAndUpdate(
      { key: 'global_settings' },
      { $set: body },
      { new: true, upsert: true }
    );

    try {
      revalidatePath('/', 'layout');
    } catch {
      // Ignore background revalidation error
    }

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || 'Error updating settings' }, { status: 500 });
  }
}
