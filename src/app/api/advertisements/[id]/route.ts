import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Advertisement from '@/models/Advertisement';
import { requireAuth } from '@/lib/api-auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const ad = await Advertisement.findById(id);
    if (!ad) {
      return NextResponse.json({ error: 'Advertisement not found' }, { status: 404 });
    }

    return NextResponse.json({ advertisement: ad });
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

    const ad = await Advertisement.findById(id);
    if (!ad) {
      return NextResponse.json({ error: 'Advertisement not found' }, { status: 404 });
    }

    const body = await req.json();
    const { name, position, type, content, adClient, adSlot, imageUrl, linkUrl, isActive } = body;

    if (name) ad.name = name;
    if (position) ad.position = position;
    if (type) ad.type = type;
    if (content !== undefined) ad.content = content;
    if (adClient !== undefined) ad.adClient = adClient;
    if (adSlot !== undefined) ad.adSlot = adSlot;
    if (imageUrl !== undefined) ad.imageUrl = imageUrl;
    if (linkUrl !== undefined) ad.linkUrl = linkUrl;
    if (isActive !== undefined) ad.isActive = isActive;

    await ad.save();

    return NextResponse.json({ success: true, advertisement: ad });
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

    const ad = await Advertisement.findByIdAndDelete(id);
    if (!ad) {
      return NextResponse.json({ error: 'Advertisement not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Advertisement deleted successfully.' });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
