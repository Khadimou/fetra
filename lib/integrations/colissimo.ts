/**
 * Colissimo API Integration
 * Provides functions to interact with La Poste Suivi v2 API
 */

import axios from 'axios';
import type {
  ColissimoApiResponse,
  ColissimoTrackingResponse,
  isSuccessResponse,
  isErrorResponse
} from '../types/colissimo';

// Import type guards
import { isSuccessResponse as _isSuccess, isErrorResponse as _isError } from '../types/colissimo';

const API_BASE_URL = 'https://api.laposte.fr/suivi/v2';
const DEFAULT_LANG = 'fr_FR';

/**
 * Get tracking information for a shipment
 * @param trackingNumber - Colissimo tracking number (11-15 alphanumeric chars)
 * @param lang - Language code (default: fr_FR)
 * @returns Tracking information or error
 */
export async function getColissimoTracking(
  trackingNumber: string,
  lang: string = DEFAULT_LANG
): Promise<ColissimoApiResponse> {
  const apiKey = process.env.COLISSIMO_API_KEY;

  if (!apiKey) {
    throw new Error('COLISSIMO_API_KEY not configured');
  }

  // Validate tracking number format (11-15 alphanumeric)
  if (!/^[A-Z0-9]{11,15}$/i.test(trackingNumber)) {
    return {
      lang,
      scope: 'open',
      returnCode: 400,
      returnMessage: 'Numéro invalide (ne respecte pas la syntaxe définie)',
      idShip: trackingNumber
    };
  }

  try {
    const response = await axios.get<ColissimoApiResponse>(
      `${API_BASE_URL}/idships/${trackingNumber}`,
      {
        params: { lang },
        headers: {
          'Accept': 'application/json',
          'X-Okapi-Key': apiKey
        },
        timeout: 10000 // 10 second timeout
      }
    );

    return response.data;
  } catch (error: any) {
    // Handle axios errors
    if (error.response) {
      // API returned an error response
      return error.response.data as ColissimoApiResponse;
    }

    if (error.code === 'ECONNABORTED') {
      // Timeout
      return {
        lang,
        scope: 'open',
        returnCode: 504,
        returnMessage: 'Service indisponible (timeout)',
        idShip: trackingNumber
      };
    }

    // Network or other error
    console.error('Colissimo API error:', error);
    return {
      lang,
      scope: 'open',
      returnCode: 500,
      returnMessage: 'Erreur système',
      idShip: trackingNumber
    };
  }
}

/**
 * Get tracking for multiple shipments (up to 10)
 * @param trackingNumbers - Array of tracking numbers (max 10)
 * @param lang - Language code
 * @returns Array of tracking responses
 */
export async function getMultipleTracking(
  trackingNumbers: string[],
  lang: string = DEFAULT_LANG
): Promise<ColissimoApiResponse[]> {
  if (trackingNumbers.length === 0) {
    return [];
  }

  if (trackingNumbers.length > 10) {
    throw new Error('Maximum 10 tracking numbers allowed per request');
  }

  const apiKey = process.env.COLISSIMO_API_KEY;

  if (!apiKey) {
    throw new Error('COLISSIMO_API_KEY not configured');
  }

  try {
    // Join tracking numbers with comma
    const ids = trackingNumbers.join(',');

    const response = await axios.get<ColissimoApiResponse>(
      `${API_BASE_URL}/idships/${ids}`,
      {
        params: { lang },
        headers: {
          'Accept': 'application/json',
          'X-Okapi-Key': apiKey
        },
        timeout: 15000 // 15 second timeout for multiple requests
      }
    );

    // When querying multiple IDs, API may return 207 (multi-status)
    // For simplicity, we return single response
    // In production, you might want to handle 207 differently
    return [response.data];
  } catch (error: any) {
    console.error('Colissimo multiple tracking error:', error);

    // Return error for each tracking number
    return trackingNumbers.map((id) => ({
      lang,
      scope: 'open',
      returnCode: 500,
      returnMessage: 'Erreur lors de la récupération multiple',
      idShip: id
    }));
  }
}

/**
 * Check if a shipment is delivered
 * @param trackingNumber - Colissimo tracking number
 * @returns true if delivered, false otherwise
 */
export async function isDelivered(trackingNumber: string): Promise<boolean> {
  const response = await getColissimoTracking(trackingNumber);

  if (!_isSuccess(response)) {
    return false;
  }

  // Check if shipment is final and last timeline step is completed
  return (
    response.shipment.isFinal &&
    response.shipment.timeline.some((step) => step.id === 5 && step.status === true)
  );
}

/**
 * Get the last tracking event message
 * @param trackingNumber - Colissimo tracking number
 * @returns Last event label or null
 */
export async function getLastEvent(trackingNumber: string): Promise<string | null> {
  const response = await getColissimoTracking(trackingNumber);

  if (!_isSuccess(response)) {
    return null;
  }

  // Events are in anti-chronological order, so first is latest
  const lastEvent = response.shipment.event[0];
  return lastEvent?.label || null;
}

/**
 * Get estimated delivery date (if available)
 * @param trackingNumber - Colissimo tracking number
 * @returns Delivery date or null
 */
export async function getDeliveryDate(trackingNumber: string): Promise<string | null> {
  const response = await getColissimoTracking(trackingNumber);

  if (!_isSuccess(response)) {
    return null;
  }

  return response.shipment.deliveryDate || null;
}

/**
 * Sandbox test tracking numbers (for development)
 * Use these in sandbox mode to test different scenarios
 */
export const SANDBOX_TRACKING_NUMBERS = {
  STEP_0: 'LU680211095FR', // Step 0 - Not started
  STEP_1: 'LZ712917377US', // Step 1 - Picked up
  STEP_3_COLISSIMO: '8K00009775862', // Step 3 - Colissimo in transit
  STEP_4: '861011301731382', // Step 4 - Available for pickup
  STEP_3_COLISSIMO_ALT: 'CB662173705US', // Step 3 - Alternative Colissimo
  NOT_FOUND: 'RB658828494MQ' // 404 - Not found
} as const;

/**
 * Helper to determine if using sandbox mode
 */
export function isSandboxMode(): boolean {
  const apiKey = process.env.COLISSIMO_API_KEY || '';
  // Sandbox keys typically have a different format or prefix
  // Adjust this logic based on your actual sandbox key format
  return apiKey.includes('sandbox') || process.env.NODE_ENV === 'development';
}
