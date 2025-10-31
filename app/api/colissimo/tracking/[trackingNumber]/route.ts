import { NextResponse } from 'next/server';
import { getColissimoTracking } from '@/lib/integrations/colissimo';
import type { ColissimoApiResponse } from '@/lib/types/colissimo';

/**
 * GET /api/colissimo/tracking/[trackingNumber]
 * Get tracking information for a Colissimo shipment
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ trackingNumber: string }> }
) {
  try {
    const { trackingNumber } = await params;

    // Get language from query params (default: fr_FR)
    const url = new URL(request.url);
    const lang = url.searchParams.get('lang') || 'fr_FR';

    // Call Colissimo API
    const response: ColissimoApiResponse = await getColissimoTracking(trackingNumber, lang);

    // Return response with appropriate status code
    return NextResponse.json(response, {
      status: response.returnCode
    });
  } catch (error: any) {
    console.error('Tracking API error:', error);
    const { trackingNumber } = await params;
    return NextResponse.json(
      {
        lang: 'fr_FR',
        scope: 'open',
        returnCode: 500,
        returnMessage: error.message || 'Erreur serveur',
        idShip: trackingNumber
      },
      { status: 500 }
    );
  }
}
