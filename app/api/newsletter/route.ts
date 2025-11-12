import { NextResponse } from 'next/server';
import { sendNewsletterWelcomeEmail } from '@/lib/integrations/brevo';
import { createNewsletterPromoCode } from '@/lib/promo-codes';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    }

    const apiKey = process.env.BREVO_API_KEY;
    
    if (!apiKey) {
      console.error('BREVO_API_KEY not configured');
      return NextResponse.json(
        { error: 'Service newsletter non configuré' },
        { status: 500 }
      );
    }

    // Add contact to Brevo
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        email,
        listIds: [2], // Update with your Brevo list ID
        updateEnabled: true, // Update if contact already exists
        attributes: {
          SIGNUP_DATE: new Date().toISOString(),
          SOURCE: 'Website Newsletter'
        }
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Brevo API error:', errorText);
      
      // If contact already exists, consider it a success
      if (res.status === 400 && errorText.includes('already exists')) {
        return NextResponse.json({ ok: true, message: 'Already subscribed' });
      }
      
      return NextResponse.json(
        { error: 'Erreur lors de l\'inscription' },
        { status: 500 }
      );
    }

    // Check if response has content before parsing JSON
    const contentType = res.headers.get('content-type');
    let data = null;
    
    if (contentType && contentType.includes('application/json')) {
      const responseText = await res.text();
      if (responseText && responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Failed to parse Brevo response:', responseText);
          // Still consider it a success if status was ok
        }
      }
    }
    
    // Generate unique promo code for subscriber
    let promoCode = null;
    try {
      promoCode = await createNewsletterPromoCode(email, 15, 30); // 15% off, valid for 30 days
      console.log('Promo code generated for newsletter subscriber:', promoCode.code);
    } catch (promoError: any) {
      console.error('Failed to create promo code:', promoError.message);
      // Continue anyway - promo code is nice-to-have
    }

    // Send welcome email after successful subscription with promo code
    try {
      await sendNewsletterWelcomeEmail(email, promoCode?.code);
      console.log('Newsletter welcome email sent to:', email);
    } catch (emailError: any) {
      // Log but don't fail the subscription if email fails
      console.error('Failed to send welcome email:', emailError.message);
    }

    return NextResponse.json({
      ok: true,
      data,
      promoCode: promoCode ? {
        code: promoCode.code,
        discount: Number(promoCode.discountValue),
        validUntil: promoCode.validUntil
      } : null
    });
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: error?.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

