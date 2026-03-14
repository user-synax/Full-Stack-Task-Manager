import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { errorResponse } from '@/utils/errorHandler';

export async function authMiddleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  if (!decoded || !decoded.userId) {
    return null;
  }

  return decoded.userId;
}

export async function getAuthSession(req: NextRequest) {
  const userId = await authMiddleware(req);
  if (!userId) {
    throw new Error('Unauthorized');
  }
  return userId;
}
