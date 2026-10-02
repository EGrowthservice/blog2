import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Report from '@/models/Report';
import Comment from '@/models/Comment';
import { requireAuth } from '@/lib/api-auth';

export async function GET(req: NextRequest) {
  const { errorResponse } = await requireAuth(req);
  if (errorResponse) return errorResponse;

  try {
    await connectDB();

    // 1. Pending reports count and items
    const pendingReportsCount = await Report.countDocuments({ status: 'pending' });
    const pendingReports = await Report.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    // 2. Recent comments from readers
    const recentComments = await Comment.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    return NextResponse.json({
      success: true,
      unreadCount: pendingReportsCount,
      reports: pendingReports,
      comments: recentComments,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching admin notifications:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { errorResponse } = await requireAuth(req);
  if (errorResponse) return errorResponse;

  try {
    await connectDB();
    const body = await req.json().catch(() => ({}));
    const { action } = body;

    if (action === 'mark_all_read') {
      // Mark pending reports as resolved or reviewed
      await Report.updateMany({ status: 'pending' }, { $set: { status: 'resolved' } });
      return NextResponse.json({ success: true, message: 'Đã đánh dấu xem tất cả' });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
