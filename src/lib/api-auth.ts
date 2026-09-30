import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from './auth';

export async function requireAuth(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return {
      session: null,
      errorResponse: NextResponse.json(
        { error: 'Unauthorized. Please login to continue.' },
        { status: 401 }
      ),
    };
  }
  return { session, errorResponse: null };
}
