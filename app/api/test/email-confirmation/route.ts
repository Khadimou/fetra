import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '../../../../lib/integrations/brevo';

// This route is for testing email confirmation in development
// DO NOT USE IN PRODUCTION
export async function POST(request: Request) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Test endpoint not available in production' },
      { status: 403 }
    );
  }

  try {
    const { email, name } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Missing email or name' },
        { status: 400 }
      );
    }

    // Send test email
    await sendOrderConfirmationEmail(
      email,
      name,
      {
        orderNumber: 'FETRA-TEST123',
        orderDate: new Date().toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        orderTotal: '49,90',
        currency: '€'
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Test confirmation email sent'
    });
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to send test email' },
      { status: 500 }
    );
  }
}
