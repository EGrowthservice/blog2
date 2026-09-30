import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Advertisement from '@/models/Advertisement';
import { requireAuth } from '@/lib/api-auth';

export async function GET(req: NextRequest) {
  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ advertisements: [] });
    }

    const { searchParams } = new URL(req.url);
    const position = searchParams.get('position');
    const all = searchParams.get('all') === 'true';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (!all) {
      filter.isActive = true;
    }
    if (position) {
      filter.position = position;
    }

    const advertisements = await Advertisement.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ advertisements });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { errorResponse } = await requireAuth(req);
  if (errorResponse) return errorResponse;

  try {
    await connectDB();
    const body = await req.json();
    const { name, position, type, content, adClient, adSlot, imageUrl, linkUrl, isActive } = body;

    if (!name || !position || !type) {
      return NextResponse.json(
        { error: 'Name, position, and type are required fields.' },
        { status: 400 }
      );
    }

    const ad = await Advertisement.create({
      name,
      position,
      type,
      content: content || '',
      adClient: adClient || '',
      adSlot: adSlot || '',
      imageUrl: imageUrl || '',
      linkUrl: linkUrl || '',
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json({ success: true, advertisement: ad }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || 'Error creating advertisement' }, { status: 500 });
  }
}
