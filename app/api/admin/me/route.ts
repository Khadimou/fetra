import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';

/**
 * GET /api/admin/me
 * Get current admin user info
 */
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: 'Non authentifié' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    email: session.user.email,
    name: session.user.name,
    role: (session.user as any).role || 'user'
  });
}
