import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import Category from '@/models/Category';
import Tag from '@/models/Tag';
import Advertisement from '@/models/Advertisement';
import Setting from '@/models/Setting';
import { requireAuth } from '@/lib/api-auth';

export async function GET(req: NextRequest) {
  const { errorResponse } = await requireAuth(req);
  if (errorResponse) return errorResponse;

  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({
        totalArticles: 0,
        publishedArticles: 0,
        draftArticles: 0,
        scheduledArticles: 0,
        totalCategories: 0,
        totalTags: 0,
        totalViews: 0,
        popularArticles: [],
        recentArticles: [],
        activeAdsCount: 0,
        isGaConfigured: false,
        isAdSenseConfigured: false,
      });
    }

    const [
      totalArticles,
      publishedArticles,
      draftArticles,
      scheduledArticles,
      totalCategories,
      totalTags,
      activeAdsCount,
      settings,
      popularArticles,
      recentArticles,
      viewsAgg,
    ] = await Promise.all([
      Post.countDocuments(),
      Post.countDocuments({ status: 'published' }),
      Post.countDocuments({ status: 'draft' }),
      Post.countDocuments({ status: 'scheduled' }),
      Category.countDocuments(),
      Tag.countDocuments(),
      Advertisement.countDocuments({ isActive: true }),
      Setting.findOne({ key: 'global_settings' }).lean(),
      Post.find({ status: 'published' })
        .populate('category', 'name slug')
        .sort({ views: -1 })
        .limit(5)
        .lean(),
      Post.find()
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Post.aggregate([
        { $group: { _id: null, totalViews: { $sum: '$views' } } },
      ]),
    ]);

    const totalViews = viewsAgg.length > 0 ? viewsAgg[0].totalViews : 0;
    const isGaConfigured = !!(settings?.gaId || process.env.NEXT_PUBLIC_GA_ID);
    const isAdSenseConfigured = !!(settings?.adsenseClient || process.env.NEXT_PUBLIC_ADSENSE_CLIENT);

    return NextResponse.json({
      totalArticles,
      publishedArticles,
      draftArticles,
      scheduledArticles,
      totalCategories,
      totalTags,
      totalViews,
      popularArticles,
      recentArticles,
      activeAdsCount,
      isGaConfigured,
      isAdSenseConfigured,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching admin stats:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
