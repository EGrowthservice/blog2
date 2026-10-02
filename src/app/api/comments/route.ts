import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Post from '@/models/Post';
import mongoose from 'mongoose';
import sanitizeHtml from 'sanitize-html';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');

    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json({ error: 'Valid postId is required.' }, { status: 400 });
    }

    await connectDB();
    const comments = await Comment.find({
      postId,
      status: { $ne: 'hidden' },
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, comments });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching comments:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId, authorName, authorEmail, content } = body;

    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json({ error: 'Bài viết không hợp lệ.' }, { status: 400 });
    }

    if (!authorName || !authorName.trim()) {
      return NextResponse.json({ error: 'Vui lòng nhập tên của bạn.' }, { status: 400 });
    }

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Nội dung bình luận không được để trống.' }, { status: 400 });
    }

    await connectDB();

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Không tìm thấy bài viết.' }, { status: 404 });
    }

    // Clean text to prevent XSS
    const cleanContent = sanitizeHtml(content.trim(), {
      allowedTags: [],
      allowedAttributes: {},
    });

    const cleanAuthor = sanitizeHtml(authorName.trim(), {
      allowedTags: [],
      allowedAttributes: {},
    });

    const comment = await Comment.create({
      postId,
      authorName: cleanAuthor,
      authorEmail: authorEmail?.trim() || '',
      content: cleanContent,
      status: 'approved',
    });

    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error creating comment:', err);
    return NextResponse.json({ error: err.message || 'Lỗi khi gửi bình luận' }, { status: 500 });
  }
}
