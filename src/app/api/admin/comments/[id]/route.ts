import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import { requireAuth } from '@/lib/api-auth';
import mongoose from 'mongoose';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { errorResponse } = await requireAuth(req);
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Mã không hợp lệ' }, { status: 400 });
    }

    const body = await req.json();
    const { status, resetReports } = body;

    await connectDB();
    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (resetReports) {
      updateData.reportsCount = 0;
      updateData.reports = [];
    }

    const comment = await Comment.findByIdAndUpdate(id, updateData, { new: true });
    if (!comment) {
      return NextResponse.json({ error: 'Không tìm thấy bình luận' }, { status: 404 });
    }

    return NextResponse.json({ success: true, comment });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { errorResponse } = await requireAuth(req);
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Mã không hợp lệ' }, { status: 400 });
    }

    await connectDB();
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) {
      return NextResponse.json({ error: 'Không tìm thấy bình luận' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Đã xóa bình luận thành công' });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
