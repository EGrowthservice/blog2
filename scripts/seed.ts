import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// Load .env or .env.local if present
const envPath = path.resolve(process.cwd(), '.env');
const envLocalPath = path.resolve(process.cwd(), '.env.local');

function loadEnvFile(filePath: string) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    content.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...values] = trimmed.split('=');
        const val = values.join('=').trim().replace(/^["']|["']$/g, '');
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = val;
        }
      }
    });
  }
}

loadEnvFile(envLocalPath);
loadEnvFile(envPath);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/english_blog';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@spotlight.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AdminPassword2026!';

// Define Schemas directly in seed script to ensure standalone execution reliability
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, select: false },
  role: { type: String, default: 'admin' },
  avatar: String,
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
  description: String,
  image: String,
  seoTitle: String,
  seoDescription: String,
  isActive: Boolean,
  sortOrder: Number,
}, { timestamps: true });

const TagSchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
}, { timestamps: true });

const PostSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  excerpt: String,
  content: String,
  featuredImage: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  author: {
    name: String,
    email: String,
    avatar: String,
  },
  status: String,
  isFeatured: Boolean,
  views: Number,
  readingTime: Number,
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String],
  publishedAt: Date,
}, { timestamps: true });

const AdvertisementSchema = new mongoose.Schema({
  name: String,
  position: String,
  type: String,
  content: String,
  adClient: String,
  adSlot: String,
  imageUrl: String,
  linkUrl: String,
  isActive: Boolean,
}, { timestamps: true });

const SettingSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  siteName: String,
  logo: String,
  favicon: String,
  description: String,
  email: String,
  defaultMetaTitle: String,
  defaultMetaDescription: String,
  ogImage: String,
  twitterCard: String,
  socialLinks: {
    facebook: String,
    x: String,
    instagram: String,
    youtube: String,
    linkedin: String,
  },
  gaId: String,
  adsenseClient: String,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Tag = mongoose.models.Tag || mongoose.model('Tag', TagSchema);
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
const Advertisement = mongoose.models.Advertisement || mongoose.model('Advertisement', AdvertisementSchema);
const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);

async function seed() {
  console.log('🌱 Starting database seed for Spotlight...');
  console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);

  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    console.log('✅ Connected to MongoDB successfully.');
  } catch (err: unknown) {
    const error = err as Error;
    console.error('❌ Failed to connect to MongoDB:', error.message);
    console.error('\nNOTE: Make sure MONGODB_URI in your .env is set and your IP is whitelisted.');
    process.exit(1);
  }

  // Clear existing collections - Completely wiping sample articles!
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Tag.deleteMany({}),
    Post.deleteMany({}), // 0 sample posts remaining
    Advertisement.deleteMany({}),
    Setting.deleteMany({}),
  ]);
  console.log('🧹 Cleaned existing database collections (deleted all sample posts).');

  // 1. Create Admin User
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

  const admin = await User.create({
    name: 'Spotlight Editorial Desk',
    email: ADMIN_EMAIL.toLowerCase(),
    password: hashedPassword,
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
  });
  console.log(`👤 Created Admin Account: ${admin.email}`);

  // 2. Exactly 3 Categories: Entertainment, Sports, Comedy (Correct spelling)
  const categoriesData = [
    {
      name: 'Entertainment',
      slug: 'entertainment',
      description: 'Cinema, television, Hollywood news, streaming platforms, and pop culture highlights.',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
      seoTitle: 'Entertainment News, Movies & Pop Culture | Spotlight',
      seoDescription: 'Read the latest entertainment reporting, film reviews, television commentary, and celebrity features on Spotlight.',
      isActive: true,
      sortOrder: 1,
    },
    {
      name: 'Sports',
      slug: 'sports',
      description: 'In-depth reporting, match previews, tournament breakdowns, and athletic championships.',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
      seoTitle: 'Sports News, Match Analysis & Highlights | Spotlight',
      seoDescription: 'Follow top-tier coverage across football, basketball, tennis, athletics, and international sports tournaments on Spotlight.',
      isActive: true,
      sortOrder: 2,
    },
    {
      name: 'Comedy',
      slug: 'comedy',
      description: 'Stand-up comedy, witty satire, comedic essays, sitcom retrospectives, and humor culture.',
      image: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80',
      seoTitle: 'Comedy Specials, Stand-Up & Satire | Spotlight',
      seoDescription: 'Explore the finest stand-up highlights, comedic critiques, and humorous cultural commentary on Spotlight.',
      isActive: true,
      sortOrder: 3,
    },
  ];

  const createdCategories = await Category.insertMany(categoriesData);
  console.log(`📂 Created ${createdCategories.length} categories: Entertainment, Sports, Comedy.`);

  // 3. Create Tags for Entertainment, Sports, Comedy
  const tagsData = [
    { name: 'Cinema', slug: 'cinema' },
    { name: 'Television', slug: 'television' },
    { name: 'Pop Culture', slug: 'pop-culture' },
    { name: 'Football', slug: 'football' },
    { name: 'Basketball', slug: 'basketball' },
    { name: 'Athletics', slug: 'athletics' },
    { name: 'Stand-Up', slug: 'stand-up' },
    { name: 'Satire', slug: 'satire' },
    { name: 'Interviews', slug: 'interviews' },
  ];

  const createdTags = await Tag.insertMany(tagsData);
  console.log(`🏷️ Created ${createdTags.length} tags.`);

  // 4. Sample Articles: ZERO posts created, as requested ("Xoá tất cả bài viết mẫu")
  console.log('📝 Sample articles: 0 posts created (clean slate for authentic HTML publishing).');

  // 5. Global Site Settings
  await Setting.create({
    key: 'global_settings',
    siteName: 'Spotlight',
    logo: '',
    favicon: '',
    description: 'Spotlight is a premier digital publication delivering curated reporting, insightful commentary, and captivating coverage across Entertainment, Sports, and Comedy.',
    email: 'qbinhtkcongviec@gmail.com',
    defaultMetaTitle: 'Spotlight - Entertainment, Sports & Comedy Magazine',
    defaultMetaDescription: 'Read the latest in entertainment news, sports reporting, and comedic commentary on Spotlight.',
    ogImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&h=630&q=80',
    twitterCard: 'summary_large_image',
    socialLinks: {
      facebook: 'https://facebook.com/spotlightmedia',
      x: 'https://x.com/spotlightmedia',
      instagram: 'https://instagram.com/spotlightmedia',
      youtube: 'https://youtube.com/@spotlightmedia',
      linkedin: 'https://linkedin.com/company/spotlightmedia',
    },
    gaId: process.env.NEXT_PUBLIC_GA_ID || '',
    adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '',
  });
  console.log('⚙️ Initialized Spotlight global website settings.');

  console.log('\n==========================================');
  console.log('🎉 Database seed completed successfully!');
  console.log(`🌐 Website Name:   Spotlight`);
  console.log(`📂 Categories:     Entertainment, Sports, Comedy`);
  console.log(`📝 Total Posts:    0 (clean slate)`);
  console.log(`🔐 Admin Login:    ${ADMIN_EMAIL}`);
  console.log(`🔑 Admin Password: ${ADMIN_PASSWORD}`);
  console.log('==========================================\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});
