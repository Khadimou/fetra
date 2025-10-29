import { NextResponse } from 'next/server';

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

    const data = await res.json();
    
    return NextResponse.json({ ok: true, data });
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: error?.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

