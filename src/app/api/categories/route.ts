import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import Post from '@/models/Post';
import { requireAuth } from '@/lib/api-auth';
import { slugify } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ categories: [] });
    }

    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all') === 'true';

    const filter = all ? {} : { isActive: { $ne: false } };
    const categories = await Category.find(filter).sort({ sortOrder: 1, name: 1 }).lean();

    // Calculate article counts per category
    const counts = await Post.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const countMap = new Map();
    counts.forEach((c) => {
      if (c && c._id) {
        countMap.set(c._id.toString(), c.count);
      }
    });

    const categoriesWithCount = categories.map((cat) => ({
      ...cat,
      articleCount: countMap.get(cat._id.toString()) || 0,
    }));

    return NextResponse.json({ categories: categoriesWithCount });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching categories:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { errorResponse } = await requireAuth(req);
  if (errorResponse) return errorResponse;

  try {
    await connectDB();
    const body = await req.json();
    const { name, slug: customSlug, description, image, seoTitle, seoDescription, isActive, sortOrder } = body;

    if (!name) {
      return NextResponse.json({ error: 'Category name is required.' }, { status: 400 });
    }

    let slug = customSlug ? slugify(customSlug) : slugify(name);
    const existing = await Category.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      image: image || '',
      seoTitle: seoTitle || name,
      seoDescription: seoDescription || description || '',
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: sortOrder ? Number(sortOrder) : 0,
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error creating category:', err);
    return NextResponse.json({ error: err.message || 'Error creating category' }, { status: 500 });
  }
}
