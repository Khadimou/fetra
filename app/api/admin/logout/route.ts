import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME } from '@/lib/auth/admin';

/**
 * POST /api/admin/logout
 * Admin logout endpoint
 */
export async function POST(request: Request) {
  const response = NextResponse.json({
    success: true,
    message: 'Déconnexion réussie'
  });

  // Clear admin cookie
  response.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  });

  return response;
}
