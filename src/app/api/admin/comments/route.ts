import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Report from '@/models/Report';
import { requireAuth } from '@/lib/api-auth';

export async function GET(req: NextRequest) {
  const { errorResponse } = await requireAuth(req);
  if (errorResponse) return errorResponse;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const filterType = searchParams.get('filter') || 'all';

    let query: Record<string, unknown> = {};
    if (filterType === 'flagged') {
      query = { $or: [{ status: 'flagged' }, { reportsCount: { $gt: 0 } }] };
    } else if (filterType === 'hidden') {
      query = { status: 'hidden' };
    } else if (filterType === 'approved') {
      query = { status: 'approved' };
    }

    const comments = await Comment.find(query)
      .populate('postId', 'title slug')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const articleReports = await Report.find({ targetType: 'article' })
      .populate('targetId', 'title slug')
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    return NextResponse.json({
      success: true,
      comments,
      articleReports,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || 'Lỗi máy chủ' }, { status: 500 });
  }
}
