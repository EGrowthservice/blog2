import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Tag from '@/models/Tag';
import Post from '@/models/Post';
import { requireAuth } from '@/lib/api-auth';
import { slugify } from '@/lib/utils';

export async function GET() {
  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ tags: [] });
    }

    const tags = await Tag.find({}).sort({ name: 1 }).lean();

    // Calculate article counts per tag
    const counts = await Post.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
    ]);

    const countMap = new Map();
    counts.forEach((c) => {
      countMap.set(c._id.toString(), c.count);
    });

    const tagsWithCount = tags.map((t) => ({
      ...t,
      articleCount: countMap.get(t._id.toString()) || 0,
    }));

    return NextResponse.json({ tags: tagsWithCount });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { errorResponse } = await requireAuth(req);
  if (errorResponse) return errorResponse;

  try {
    await connectDB();
    const body = await req.json();
    const { name, slug: customSlug } = body;

    if (!name) {
      return NextResponse.json({ error: 'Tag name is required.' }, { status: 400 });
    }

    const slug = customSlug ? slugify(customSlug) : slugify(name);
    const existing = await Tag.findOne({ slug });
    if (existing) {
      return NextResponse.json({ success: true, tag: existing });
    }

    const tag = await Tag.create({ name, slug });
    return NextResponse.json({ success: true, tag }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
