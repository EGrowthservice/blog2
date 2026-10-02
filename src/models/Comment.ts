import mongoose, { Schema, Model } from 'mongoose';

export interface ICommentReport {
  reason: string;
  details?: string;
  createdAt: Date;
}

export interface ICommentDocument extends mongoose.Document {
  postId: mongoose.Types.ObjectId;
  authorName: string;
  authorEmail?: string;
  content: string;
  status: 'approved' | 'hidden' | 'flagged';
  reportsCount: number;
  reports: ICommentReport[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<ICommentDocument>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
    authorName: {
      type: String,
      required: [true, 'Vui lòng nhập tên của bạn'],
      trim: true,
      maxlength: 60,
    },
    authorEmail: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 100,
    },
    content: {
      type: String,
      required: [true, 'Nội dung bình luận không được để trống'],
      trim: true,
      maxlength: 1500,
    },
    status: {
      type: String,
      enum: ['approved', 'hidden', 'flagged'],
      default: 'approved',
      index: true,
    },
    reportsCount: {
      type: Number,
      default: 0,
    },
    reports: [
      {
        reason: { type: String, required: true },
        details: { type: String, default: '' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

CommentSchema.index({ postId: 1, createdAt: -1 });

const Comment: Model<ICommentDocument> =
  mongoose.models.Comment || mongoose.model<ICommentDocument>('Comment', CommentSchema);

export default Comment;
