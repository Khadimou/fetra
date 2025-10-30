// app/api/freshdesk/create-ticket/route.ts
import { NextResponse } from 'next/server';
import { captureException } from '@/lib/sentry';

interface FreshdeskTicketRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FreshdeskTicketPayload {
  email: string;
  subject: string;
  description: string;
  priority: number;
  status: number;
  source: number;
  name?: string;
}

export async function POST(request: Request) {
  try {
    // Validation des variables d'environnement
    const { FRESHDESK_API_KEY, FRESHDESK_DOMAIN, FRESHDESK_API_BASE } = process.env;
    
    if (!FRESHDESK_API_KEY || !FRESHDESK_DOMAIN) {
      console.error('Freshdesk configuration missing');
      return NextResponse.json(
        { error: 'Service support temporairement indisponible' },
        { status: 500 }
      );
    }

    // Parse du body
    const body: FreshdeskTicketRequest = await request.json();
    const { name, email, subject, message } = body;

    // Validation basique
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    // Construction de l'URL API Freshdesk
    const freshdeskUrl = FRESHDESK_API_BASE 
      ? `${FRESHDESK_API_BASE}/api/v2/tickets`
      : `https://${FRESHDESK_DOMAIN}.freshdesk.com/api/v2/tickets`;

    // Préparation des credentials
    const credentials = Buffer.from(`${FRESHDESK_API_KEY}:X`).toString('base64');

    // Construction du payload pour Freshdesk
    const freshdeskPayload: FreshdeskTicketPayload = {
      email,
      subject,
      description: `Message de ${name} (${email}):\n\n${message}`,
      priority: 1, // Low
      status: 2,   // Open
      source: 2,   // Portal
      name
    };

    // Appel API Freshdesk
    const freshdeskResponse = await fetch(freshdeskUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(freshdeskPayload)
    });

    if (!freshdeskResponse.ok) {
      const errorText = await freshdeskResponse.text();
      console.error('Freshdesk API error:', {
        status: freshdeskResponse.status,
        statusText: freshdeskResponse.statusText,
        body: errorText
      });

      // Log l'erreur dans Sentry
      captureException(new Error(`Freshdesk API error: ${freshdeskResponse.status}`), {
        freshdeskStatus: freshdeskResponse.status,
        freshdeskError: errorText,
        userEmail: email,
        subject
      });

      return NextResponse.json(
        { error: 'Erreur lors de la création du ticket' },
        { status: 500 }
      );
    }

    const freshdeskTicket = await freshdeskResponse.json();

    console.log('Freshdesk ticket created:', {
      ticketId: freshdeskTicket.id,
      email,
      subject
    });

    return NextResponse.json({
      success: true,
      ticketId: freshdeskTicket.id
    });

  } catch (error) {
    console.error('Support ticket creation error:', error);
    
    // Log l'erreur dans Sentry
    captureException(error, {
      route: '/api/freshdesk/create-ticket'
    });

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
