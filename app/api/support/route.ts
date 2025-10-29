import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, orderId } = body || {};

    // Validation
    if (!email || !message) {
      return NextResponse.json(
        { error: 'Email et message requis' },
        { status: 400 }
      );
    }

    // Check configuration
    const domain = process.env.FRESHDESK_DOMAIN;
    const apiKey = process.env.FRESHDESK_API_KEY;

    if (!domain || !apiKey) {
      console.error('Freshdesk configuration missing');
      return NextResponse.json(
        { error: 'Service support non configuré' },
        { status: 500 }
      );
    }

    // Prepare ticket payload
    const payload: any = {
      description: `${message}\n\n---\nOrder ID: ${orderId || 'N/A'}`,
      subject: subject || 'Demande de support depuis le site',
      email,
      priority: 1, // Low priority
      status: 2,   // Open
      name: name || email,
      tags: ['website', 'contact-form']
    };

    // Create ticket in Freshdesk
    const res = await fetch(`https://${domain}/api/v2/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(apiKey + ':X').toString('base64')
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Freshdesk API error:', errorText);
      return NextResponse.json(
        { error: 'Erreur lors de la création du ticket' },
        { status: 500 }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      ok: true,
      ticket: {
        id: data.id,
        subject: data.subject,
        status: data.status
      }
    });
  } catch (error: any) {
    console.error('Support ticket creation error:', error);
    return NextResponse.json(
      { error: error?.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

