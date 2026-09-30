import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(session.userId).select('-password');

  return NextResponse.json({
    authenticated: true,
    user: user || {
      id: session.userId,
      email: session.email,
      name: session.name,
      role: session.role,
    },
  });
}
