import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/integrations/brevo';

/**
 * Test endpoint to verify order confirmation emails
 * POST /api/test/order-email
 * Body: { email: string, name: string }
 */
export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await sendOrderConfirmationEmail(
      email,
      name || 'Client Test',
      {
        orderNumber: 'FETRA-TEST1234',
        orderDate: new Date().toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        orderTotal: '0,90',
        currency: '€'
      }
    );

    return NextResponse.json({ 
      ok: true, 
      message: `Order confirmation email sent to ${email}` 
    });
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { 
        error: error?.message || 'Failed to send email',
        details: error?.stack
      },
      { status: 500 }
    );
  }
}

