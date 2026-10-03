import mongoose, { Schema, Model } from 'mongoose';

export interface ISettingDocument extends mongoose.Document {
  key: string;
  siteName: string;
  logo: string;
  favicon: string;
  description: string;
  email: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  ogImage: string;
  twitterCard: 'summary' | 'summary_large_image';
  socialLinks: {
    facebook?: string;
    x?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    tiktok?: string;
  };
  gaId?: string;
  adsenseClient?: string;
  notifyNewComment?: boolean;
  notifyNewReport?: boolean;
  adminNotificationEmail?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISettingDocument>(
  {
    key: {
      type: String,
      default: 'global_settings',
      unique: true,
      index: true,
    },
    siteName: {
      type: String,
      default: 'CineNova',
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    favicon: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: 'CineNova is a premier digital publication delivering curated reporting, insightful commentary, and captivating coverage across Entertainment, Sports, and Movies.',
      trim: true,
    },
    email: {
      type: String,
      default: 'contact@cinenova.click',
      trim: true,
    },
    defaultMetaTitle: {
      type: String,
      default: 'CineNova - Entertainment, Sports & Cinema Magazine',
      trim: true,
    },
    defaultMetaDescription: {
      type: String,
      default: 'Explore breaking stories, in-depth features, and engaging commentary across Entertainment, Sports, and Movies on CineNova.',
      trim: true,
    },
    ogImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&h=630&q=80',
    },
    twitterCard: {
      type: String,
      enum: ['summary', 'summary_large_image'],
      default: 'summary_large_image',
    },
    socialLinks: {
      facebook: { type: String, default: 'https://facebook.com' },
      x: { type: String, default: 'https://x.com' },
      instagram: { type: String, default: 'https://instagram.com' },
      youtube: { type: String, default: 'https://youtube.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      tiktok: { type: String, default: '' },
    },
    gaId: {
      type: String,
      default: '',
      trim: true,
    },
    adsenseClient: {
      type: String,
      default: '',
      trim: true,
    },
    notifyNewComment: {
      type: Boolean,
      default: true,
    },
    notifyNewReport: {
      type: Boolean,
      default: true,
    },
    adminNotificationEmail: {
      type: String,
      default: 'qbinhtkcongviec@gmail.com',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Setting: Model<ISettingDocument> =
  mongoose.models.Setting ||
  mongoose.model<ISettingDocument>('Setting', SettingSchema);

export default Setting;
