import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Tag from '@/models/Tag';
import { requireAuth } from '@/lib/api-auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { errorResponse } = await requireAuth(req);
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;
    await connectDB();

    const tag = await Tag.findByIdAndDelete(id);
    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Tag deleted successfully.' });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
