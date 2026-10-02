import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Report from '@/models/Report';
import Post from '@/models/Post';
import mongoose from 'mongoose';
import sanitizeHtml from 'sanitize-html';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetType = 'article', targetId, reason, details } = body;

    if (!targetId || !mongoose.Types.ObjectId.isValid(targetId)) {
      return NextResponse.json({ error: 'Nội dung cần báo cáo không hợp lệ.' }, { status: 400 });
    }

    if (!reason || !reason.trim()) {
      return NextResponse.json({ error: 'Vui lòng chọn lý do báo cáo.' }, { status: 400 });
    }

    await connectDB();

    if (targetType === 'article') {
      const post = await Post.findById(targetId);
      if (!post) {
        return NextResponse.json({ error: 'Không tìm thấy bài viết.' }, { status: 404 });
      }
    }

    const cleanReason = sanitizeHtml(reason.trim(), { allowedTags: [], allowedAttributes: {} });
    const cleanDetails = details
      ? sanitizeHtml(details.trim(), { allowedTags: [], allowedAttributes: {} })
      : '';

    const report = await Report.create({
      targetType,
      targetId,
      reason: cleanReason,
      details: cleanDetails,
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      message: 'Cảm ơn bạn. Báo cáo vi phạm đã được gửi tới ban biên tập để xem xét xử lý.',
      reportId: report._id,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error reporting content:', err);
    return NextResponse.json({ error: err.message || 'Lỗi khi gửi báo cáo' }, { status: 500 });
  }
}
