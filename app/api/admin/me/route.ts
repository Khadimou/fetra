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

  // Check if user has ADMIN role
  const userRole = (session.user as any).role;
  if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
    return NextResponse.json(
      { error: 'Accès administrateur requis' },
      { status: 403 }
    );
  }

  return NextResponse.json({
    email: session.user.email,
    name: session.user.name,
    role: userRole
  });
}
