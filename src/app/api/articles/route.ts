import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import Category from '@/models/Category';
import Tag from '@/models/Tag';
import { requireAuth } from '@/lib/api-auth';
import { calculateReadingTime, slugify } from '@/lib/utils';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ posts: [], total: 0, totalPages: 0, page: 1 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const status = searchParams.get('status');
    const categoryParam = searchParams.get('category');
    const tagParam = searchParams.get('tag');
    const search = searchParams.get('search');
    const isFeatured = searchParams.get('isFeatured');
    const sort = searchParams.get('sort') || 'latest';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    // Filter by status (public view only sees published articles unless status=all or specific status)
    if (status && status !== 'all') {
      filter.status = status;
    } else if (status === 'all') {
      // Do not filter by status -> return all posts (published, draft, scheduled, archived)
    } else {
      filter.status = 'published';
    }

    // Filter by featured
    if (isFeatured === 'true') {
      filter.isFeatured = true;
    }

    // Filter by category slug or ID
    if (categoryParam) {
      if (mongoose.Types.ObjectId.isValid(categoryParam)) {
        filter.category = categoryParam;
      } else {
        const cat = await Category.findOne({ slug: categoryParam });
        if (cat) {
          filter.category = cat._id;
        } else {
          return NextResponse.json({ posts: [], total: 0, totalPages: 0, page });
        }
      }
    }

    // Filter by tag slug or ID
    if (tagParam) {
      if (mongoose.Types.ObjectId.isValid(tagParam)) {
        filter.tags = tagParam;
      } else {
        const tg = await Tag.findOne({ slug: tagParam });
        if (tg) {
          filter.tags = tg._id;
        } else {
          return NextResponse.json({ posts: [], total: 0, totalPages: 0, page });
        }
      }
    }

    // Search query
    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { excerpt: { $regex: search.trim(), $options: 'i' } },
        { content: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Sorting
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sortQuery: Record<string, any> = { publishedAt: -1, createdAt: -1 };
    if (sort === 'popular') {
      sortQuery = { views: -1, publishedAt: -1 };
    } else if (sort === 'oldest') {
      sortQuery = { publishedAt: 1, createdAt: 1 };
    }

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate('category', 'name slug')
        .populate('tags', 'name slug')
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      posts,
      total,
      totalPages,
      page,
      limit,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching articles:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { session, errorResponse } = await requireAuth(req);
  if (errorResponse) return errorResponse;

  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 503 });
    }

    const body = await req.json();
    const {
      title,
      slug: customSlug,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      status = 'draft',
      isFeatured = false,
      seoTitle,
      seoDescription,
      seoKeywords,
    } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Title, content, and category are required fields.' },
        { status: 400 }
      );
    }

    // Generate unique slug
    let baseSlug = customSlug ? slugify(customSlug) : slugify(title);
    if (!baseSlug) baseSlug = 'article-' + Date.now();

    let finalSlug = baseSlug;
    let slugCount = 1;
    while (await Post.findOne({ slug: finalSlug })) {
      finalSlug = `${baseSlug}-${slugCount++}`;
    }

    const readingTime = calculateReadingTime(content);

    const newPost = await Post.create({
      title,
      slug: finalSlug,
      excerpt: excerpt || '',
      content,
      featuredImage: featuredImage || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&h=630&q=80',
      category,
      tags: Array.isArray(tags) ? tags : [],
      author: {
        _id: session?.userId,
        name: session?.name || 'Spotlight Editorial Desk',
        email: session?.email || '',
      },
      status,
      isFeatured: !!isFeatured,
      views: 0,
      readingTime,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt || '',
      seoKeywords: Array.isArray(seoKeywords) ? seoKeywords : [],
      publishedAt: status === 'published' ? new Date() : null,
    });

    return NextResponse.json({ success: true, post: newPost }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error creating post:', err);
    return NextResponse.json({ error: err.message || 'Error creating post' }, { status: 500 });
  }
}
