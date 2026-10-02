import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import Post from '@/models/Post';
import { requireAuth } from '@/lib/api-auth';
import { slugify } from '@/lib/utils';
import mongoose from 'mongoose';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };
    const category = await Category.findOne(query);

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ category });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
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

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const body = await req.json();
    const { name, slug, description, image, seoTitle, seoDescription, isActive, sortOrder } = body;

    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (seoTitle !== undefined) category.seoTitle = seoTitle;
    if (seoDescription !== undefined) category.seoDescription = seoDescription;
    if (isActive !== undefined) category.isActive = isActive;
    if (sortOrder !== undefined) category.sortOrder = Number(sortOrder);

    if (slug && slug !== category.slug) {
      const cleanSlug = slugify(slug);
      const existing = await Category.findOne({ slug: cleanSlug, _id: { $ne: category._id } });
      if (existing) {
        return NextResponse.json({ error: 'Slug is already in use by another category' }, { status: 400 });
      }
      category.slug = cleanSlug;
    }

    await category.save();

    return NextResponse.json({ success: true, category });
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
    await connectDB();

    // Check if category has articles
    const idQuery = mongoose.Types.ObjectId.isValid(id)
      ? [{ category: id }, { category: new mongoose.Types.ObjectId(id) }]
      : [{ category: id }];
    const articleCount = await Post.countDocuments({ $or: idQuery });
    if (articleCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category because ${articleCount} article(s) are assigned to it.` },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
