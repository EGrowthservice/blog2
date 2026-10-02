export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'editor';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
  isActive: boolean;
  sortOrder: number;
  articleCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ITag {
  _id: string;
  name: string;
  slug: string;
  articleCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type PostStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export interface IPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: ICategory | string;
  tags: (ITag | string)[];
  author: {
    _id?: string;
    name: string;
    email?: string;
    avatar?: string;
  } | string;
  status: PostStatus;
  isFeatured: boolean;
  views: number;
  readingTime: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AdPosition =
  | 'header'
  | 'homepage-top'
  | 'homepage-middle'
  | 'homepage-bottom'
  | 'sidebar'
  | 'article-top'
  | 'article-middle'
  | 'article-bottom'
  | 'footer';

export type AdType = 'adsense' | 'html' | 'script' | 'image';

export interface IAdvertisement {
  _id: string;
  name: string;
  position: AdPosition;
  type: AdType;
  content?: string;
  adClient?: string;
  adSlot?: string;
  imageUrl?: string;
  linkUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ISocialLinks {
  facebook?: string;
  x?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  tiktok?: string;
}

export interface ISetting {
  _id?: string;
  siteName: string;
  logo?: string;
  favicon?: string;
  description: string;
  email: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  ogImage?: string;
  twitterCard: 'summary' | 'summary_large_image';
  socialLinks: ISocialLinks;
  gaId?: string;
  adsenseClient?: string;
  notifyNewComment?: boolean;
  notifyNewReport?: boolean;
  adminNotificationEmail?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  scheduledArticles: number;
  totalCategories: number;
  totalTags: number;
  totalViews: number;
  popularArticles: IPost[];
  recentArticles: IPost[];
  activeAdsCount: number;
  isGaConfigured: boolean;
  isAdSenseConfigured: boolean;
}
