import mongoose, { Schema, Model } from 'mongoose';

export interface IPostDocument extends mongoose.Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: mongoose.Types.ObjectId;
  tags: mongoose.Types.ObjectId[];
  author: {
    _id?: mongoose.Types.ObjectId;
    name: string;
    email?: string;
    avatar?: string;
  };
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  isFeatured: boolean;
  views: number;
  readingTime: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPostDocument>(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: [true, 'Post slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    excerpt: {
      type: String,
      default: '',
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
    },
    featuredImage: {
      type: String,
      default: '',
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
      index: true,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
        index: true,
      },
    ],
    author: {
      _id: { type: Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, default: 'Editorial Team' },
      email: { type: String, default: '' },
      avatar: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled', 'archived'],
      default: 'draft',
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    views: {
      type: Number,
      default: 0,
      index: true,
    },
    readingTime: {
      type: Number,
      default: 3,
    },
    seoTitle: {
      type: String,
      default: '',
      trim: true,
    },
    seoDescription: {
      type: String,
      default: '',
      trim: true,
    },
    seoKeywords: [
      {
        type: String,
        trim: true,
      },
    ],
    publishedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for high performance sorting and filtering
PostSchema.index({ status: 1, publishedAt: -1 });
PostSchema.index({ status: 1, isFeatured: 1, publishedAt: -1 });
PostSchema.index({ category: 1, status: 1, publishedAt: -1 });
PostSchema.index({ tags: 1, status: 1, publishedAt: -1 });
PostSchema.index({ status: 1, views: -1 });

// Full text search index
PostSchema.index(
  {
    title: 'text',
    excerpt: 'text',
    content: 'text',
  },
  {
    weights: {
      title: 10,
      excerpt: 5,
      content: 1,
    },
    name: 'PostTextIndex',
  }
);

const Post: Model<IPostDocument> =
  mongoose.models.Post || mongoose.model<IPostDocument>('Post', PostSchema);

export default Post;
