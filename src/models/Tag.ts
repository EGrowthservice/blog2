import mongoose, { Schema, Model } from 'mongoose';

export interface ITagDocument extends mongoose.Document {
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema = new Schema<ITagDocument>(
  {
    name: {
      type: String,
      required: [true, 'Tag name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Tag slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Tag: Model<ITagDocument> =
  mongoose.models.Tag || mongoose.model<ITagDocument>('Tag', TagSchema);

export default Tag;
