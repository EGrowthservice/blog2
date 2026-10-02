import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Report from '@/models/Report';
import mongoose from 'mongoose';
import sanitizeHtml from 'sanitize-html';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Mã bình luận không hợp lệ.' }, { status: 400 });
    }

    const body = await req.json();
    const { reason, details } = body;

    if (!reason || !reason.trim()) {
      return NextResponse.json({ error: 'Vui lòng chọn lý do báo cáo.' }, { status: 400 });
    }

    await connectDB();
    const comment = await Comment.findById(id);
    if (!comment) {
      return NextResponse.json({ error: 'Không tìm thấy bình luận.' }, { status: 404 });
    }

    const cleanReason = sanitizeHtml(reason.trim(), { allowedTags: [], allowedAttributes: {} });
    const cleanDetails = details
      ? sanitizeHtml(details.trim(), { allowedTags: [], allowedAttributes: {} })
      : '';

    // Update comment reports
    comment.reportsCount = (comment.reportsCount || 0) + 1;
    comment.reports.push({
      reason: cleanReason,
      details: cleanDetails,
      createdAt: new Date(),
    });

    if (comment.reportsCount >= 3 && comment.status === 'approved') {
      comment.status = 'flagged';
    }

    await comment.save();

    // Create Report record for tracking
    await Report.create({
      targetType: 'comment',
      targetId: comment._id,
      reason: cleanReason,
      details: cleanDetails,
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      message: 'Báo cáo đã được tiếp nhận. Đội ngũ quản trị sẽ kiểm tra nội dung này.',
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error reporting comment:', err);
    return NextResponse.json({ error: err.message || 'Lỗi khi gửi báo cáo' }, { status: 500 });
  }
}
