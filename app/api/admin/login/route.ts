import { NextResponse } from 'next/server';
import {
  verifyAdminCredentials,
  createAdminToken,
  ADMIN_COOKIE_NAME
} from '@/lib/auth/admin';

/**
 * POST /api/admin/login
 * Admin login endpoint
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Verify credentials
    const isValid = verifyAdminCredentials(email, password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    // Create session token
    const token = createAdminToken(email);

    // Set cookie
    const response = NextResponse.json({
      success: true,
      message: 'Connexion réussie'
    });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    });

    return response;
  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
