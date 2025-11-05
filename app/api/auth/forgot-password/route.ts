import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import prisma from '@/lib/db/prisma';
import { sendEmail } from '@/lib/integrations/brevo';

/**
 * POST /api/auth/forgot-password
 * Request password reset email
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Always return success to prevent email enumeration
    // But only send email if user exists
    if (user) {
      // Generate reset token (32 bytes = 64 hex characters)
      const token = randomBytes(32).toString('hex');

      // Token expires in 1 hour
      const expires = new Date(Date.now() + 60 * 60 * 1000);

      // Delete any existing reset tokens for this email
      await prisma.verificationToken.deleteMany({
        where: { identifier: email }
      });

      // Store token in database
      await prisma.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires
        }
      });

      // Send reset email
      const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

      try {
        await sendEmail({
          to: email,
          subject: 'Réinitialisation de votre mot de passe FETRA',
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #7C8363;">Réinitialisation de mot de passe</h2>
              <p>Bonjour ${user.name || ''},</p>
              <p>Vous avez demandé à réinitialiser votre mot de passe FETRA. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #7C8363; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                  Réinitialiser mon mot de passe
                </a>
              </div>
              <p style="color: #666; font-size: 14px;">
                Ce lien est valable pendant 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.
              </p>
              <p style="color: #666; font-size: 14px;">
                Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :<br>
                <a href="${resetUrl}" style="color: #7C8363;">${resetUrl}</a>
              </p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #999; font-size: 12px; text-align: center;">
                FETRA Beauty - Rituel Visage Liftant<br>
                <a href="https://fetrabeauty.com" style="color: #7C8363;">fetrabeauty.com</a>
              </p>
            </div>
          `,
          textContent: `
Réinitialisation de mot de passe

Bonjour ${user.name || ''},

Vous avez demandé à réinitialiser votre mot de passe FETRA.

Cliquez sur ce lien pour créer un nouveau mot de passe :
${resetUrl}

Ce lien est valable pendant 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.

FETRA Beauty - fetrabeauty.com
          `
        });
      } catch (emailError) {
        console.error('Error sending reset email:', emailError);
        // Don't fail the request if email fails
      }
    }

    // Always return success (security best practice)
    return NextResponse.json({
      message: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation'
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la demande de réinitialisation' },
      { status: 500 }
    );
  }
}
