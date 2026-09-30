import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import { requireAuth } from '@/lib/api-auth';
import { calculateReadingTime, slugify } from '@/lib/utils';
import mongoose from 'mongoose';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    let post;
    if (mongoose.Types.ObjectId.isValid(id)) {
      post = await Post.findById(id).populate('category').populate('tags');
    }

    if (!post) {
      post = await Post.findOne({ slug: id }).populate('category').populate('tags');
    }

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching post:', err);
    return NextResponse.json({ error: err.message || 'Error fetching post' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { errorResponse } = await requireAuth(req);
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;
    await connectDB();

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const body = await req.json();
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      status,
      isFeatured,
      seoTitle,
      seoDescription,
      seoKeywords,
      publishedAt,
    } = body;

    if (title) post.title = title;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (content !== undefined) {
      post.content = content;
      post.readingTime = calculateReadingTime(content);
    }
    if (featuredImage !== undefined) post.featuredImage = featuredImage;
    if (category) post.category = category;
    if (tags !== undefined) post.tags = tags;
    if (isFeatured !== undefined) post.isFeatured = isFeatured;
    if (seoTitle !== undefined) post.seoTitle = seoTitle;
    if (seoDescription !== undefined) post.seoDescription = seoDescription;
    if (seoKeywords !== undefined) post.seoKeywords = seoKeywords;

    // Handle slug change
    if (slug && slug !== post.slug) {
      const cleanSlug = slugify(slug);
      const existing = await Post.findOne({ slug: cleanSlug, _id: { $ne: post._id } });
      if (existing) {
        return NextResponse.json({ error: 'Slug is already in use by another article' }, { status: 400 });
      }
      post.slug = cleanSlug;
    }

    // Handle status & published date
    if (status) {
      if (status === 'published' && post.status !== 'published' && !post.publishedAt) {
        post.publishedAt = publishedAt ? new Date(publishedAt) : new Date();
      } else if (publishedAt) {
        post.publishedAt = new Date(publishedAt);
      }
      post.status = status;
    }

    await post.save();

    return NextResponse.json({ success: true, post });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error updating post:', err);
    return NextResponse.json({ error: err.message || 'Error updating post' }, { status: 500 });
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
    await connectDB();

    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Article deleted successfully.' });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error deleting post:', err);
    return NextResponse.json({ error: err.message || 'Error deleting post' }, { status: 500 });
  }
}
