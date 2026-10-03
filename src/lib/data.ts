import connectDB from './mongodb';
import Setting from '@/models/Setting';
import Category from '@/models/Category';
import Advertisement from '@/models/Advertisement';
import Post from '@/models/Post';
import { ISetting, ICategory, IAdvertisement, IPost, AdPosition } from '@/types';

export const revalidate = 60; // 60s ISR revalidation cache

export async function getSiteSettings(): Promise<ISetting> {
  const defaultSettings: ISetting = {
    siteName: 'CineNova',
    description: 'CineNova is a premier digital publication delivering curated reporting, insightful commentary, and captivating coverage across Entertainment, Sports, and Movies.',
    email: 'contact@cinenova.click',
    defaultMetaTitle: 'CineNova - Entertainment, Sports & Cinema Magazine',
    defaultMetaDescription: 'Read the latest in entertainment news, sports reporting, and cinematic commentary on CineNova.',
    ogImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&h=630&q=80',
    twitterCard: 'summary_large_image',
    socialLinks: {
      facebook: 'https://facebook.com/cinenovamedia',
      x: 'https://x.com/cinenovamedia',
      instagram: 'https://instagram.com/cinenovamedia',
      youtube: 'https://youtube.com/@cinenovamedia',
      linkedin: 'https://linkedin.com/company/cinenovamedia',
    },
    gaId: process.env.NEXT_PUBLIC_GA_ID || '',
    adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '',
  };

  try {
    const conn = await connectDB();
    if (!conn) return defaultSettings;
    const settings = await Setting.findOne({ key: 'global_settings' }).lean();
    if (!settings) return defaultSettings;
    return JSON.parse(JSON.stringify(settings));
  } catch (e) {
    console.warn('Error fetching settings:', e);
    return defaultSettings;
  }
}

export async function getActiveCategories(): Promise<ICategory[]> {
  try {
    const conn = await connectDB();
    if (!conn) return [];
    const categories = await Category.find({ isActive: { $ne: false } })
      .sort({ sortOrder: 1, name: 1 })
      .lean();
    return JSON.parse(JSON.stringify(categories));
  } catch (e) {
    console.warn('Error fetching categories:', e);
    return [];
  }
}

export async function getActiveAd(position: AdPosition | string): Promise<IAdvertisement | null> {
  try {
    const conn = await connectDB();
    if (!conn) return null;
    const ad = await Advertisement.findOne({ position: position as AdPosition, isActive: true })
      .sort({ updatedAt: -1 })
      .lean();
    return ad ? JSON.parse(JSON.stringify(ad)) : null;
  } catch (e) {
    console.warn(`Error fetching ad for ${position}:`, e);
    return null;
  }
}

export async function getHomepageArticles(): Promise<{
  featuredPost: IPost | null;
  latestPosts: IPost[];
  popularPosts: IPost[];
}> {
  try {
    const conn = await connectDB();
    if (!conn) return { featuredPost: null, latestPosts: [], popularPosts: [] };

    const [featuredPostDoc, latestPostDocs, popularPostDocs] = await Promise.all([
      Post.findOne({ status: 'published', isFeatured: true })
        .populate('category', 'name slug')
        .sort({ publishedAt: -1 })
        .lean(),
      Post.find({ status: 'published' })
        .populate('category', 'name slug')
        .sort({ publishedAt: -1 })
        .limit(9)
        .lean(),
      Post.find({ status: 'published' })
        .populate('category', 'name slug')
        .sort({ views: -1, publishedAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const featuredPost = featuredPostDoc
      ? JSON.parse(JSON.stringify(featuredPostDoc))
      : latestPostDocs[0]
      ? JSON.parse(JSON.stringify(latestPostDocs[0]))
      : null;

    return {
      featuredPost,
      latestPosts: JSON.parse(JSON.stringify(latestPostDocs)),
      popularPosts: JSON.parse(JSON.stringify(popularPostDocs)),
    };
  } catch (e) {
    console.warn('Error fetching homepage articles:', e);
    return { featuredPost: null, latestPosts: [], popularPosts: [] };
  }
}

export async function getArticleBySlug(slug: string): Promise<{
  post: IPost | null;
  relatedPosts: IPost[];
  sidebarPosts: IPost[];
  prevPost: IPost | null;
  nextPost: IPost | null;
}> {
  try {
    const conn = await connectDB();
    if (!conn) return { post: null, relatedPosts: [], sidebarPosts: [], prevPost: null, nextPost: null };

    const postDoc = await Post.findOne({ slug, status: 'published' })
      .populate('category')
      .populate('tags')
      .lean();

    if (!postDoc) return { post: null, relatedPosts: [], sidebarPosts: [], prevPost: null, nextPost: null };

    const post = JSON.parse(JSON.stringify(postDoc));

    // Get related posts from same category
    const categoryId = typeof post.category === 'object' && post.category ? post.category._id : post.category;
    let relatedDocs = await Post.find({
      category: categoryId,
      _id: { $ne: post._id },
      status: 'published',
    })
      .populate('category', 'name slug')
      .sort({ publishedAt: -1 })
      .limit(8)
      .lean();

    // If fewer than 6, fetch latest published posts to supplement
    if (relatedDocs.length < 6) {
      const existingIds = [post._id, ...relatedDocs.map((d: { _id: unknown }) => d._id)];
      const moreDocs = await Post.find({
        _id: { $nin: existingIds },
        status: 'published',
      })
        .populate('category', 'name slug')
        .sort({ publishedAt: -1 })
        .limit(8 - relatedDocs.length)
        .lean();
      relatedDocs = [...relatedDocs, ...moreDocs];
    }

    const allRelated: IPost[] = JSON.parse(JSON.stringify(relatedDocs));
    const sidebarPosts = allRelated.slice(0, 5);
    const bottomPosts = allRelated.length > 5 ? allRelated.slice(5, 9) : allRelated.slice(0, 3);

    // Get previous and next articles
    const [prevDoc, nextDoc] = await Promise.all([
      Post.findOne({
        status: 'published',
        publishedAt: { $lt: post.publishedAt || post.createdAt },
      })
        .select('title slug')
        .sort({ publishedAt: -1 })
        .lean(),
      Post.findOne({
        status: 'published',
        publishedAt: { $gt: post.publishedAt || post.createdAt },
      })
        .select('title slug')
        .sort({ publishedAt: 1 })
        .lean(),
    ]);

    return {
      post,
      relatedPosts: bottomPosts,
      sidebarPosts,
      prevPost: prevDoc ? JSON.parse(JSON.stringify(prevDoc)) : null,
      nextPost: nextDoc ? JSON.parse(JSON.stringify(nextDoc)) : null,
    };
  } catch (e) {
    console.warn('Error fetching article:', e);
    return { post: null, relatedPosts: [], sidebarPosts: [], prevPost: null, nextPost: null };
  }
}
