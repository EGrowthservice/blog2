import mongoose, { Schema, Model } from 'mongoose';
import { AdPosition, AdType } from '@/types';

export interface IAdvertisementDocument extends mongoose.Document {
  name: string;
  position: AdPosition;
  type: AdType;
  content?: string;
  adClient?: string;
  adSlot?: string;
  imageUrl?: string;
  linkUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdvertisementSchema = new Schema<IAdvertisementDocument>(
  {
    name: {
      type: String,
      required: [true, 'Ad name is required'],
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'Ad position is required'],
      enum: [
        'header',
        'homepage-top',
        'homepage-middle',
        'homepage-bottom',
        'sidebar',
        'article-top',
        'article-middle',
        'article-bottom',
        'footer',
      ],
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Ad type is required'],
      enum: ['adsense', 'html', 'script', 'image'],
      default: 'adsense',
    },
    content: {
      type: String,
      default: '',
    },
    adClient: {
      type: String,
      default: '',
      trim: true,
    },
    adSlot: {
      type: String,
      default: '',
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
      trim: true,
    },
    linkUrl: {
      type: String,
      default: '',
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

AdvertisementSchema.index({ position: 1, isActive: 1 });

const Advertisement: Model<IAdvertisementDocument> =
  mongoose.models.Advertisement ||
  mongoose.model<IAdvertisementDocument>('Advertisement', AdvertisementSchema);

export default Advertisement;
