import mongoose, { Schema, Model } from 'mongoose';

export interface IReportDocument extends mongoose.Document {
  targetType: 'article' | 'comment';
  targetId: mongoose.Types.ObjectId;
  reason: string;
  details?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReportDocument>(
  {
    targetType: {
      type: String,
      enum: ['article', 'comment'],
      required: true,
      index: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
      default: '',
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'dismissed'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Report: Model<IReportDocument> =
  mongoose.models.Report || mongoose.model<IReportDocument>('Report', ReportSchema);

export default Report;
