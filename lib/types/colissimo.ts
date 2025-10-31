/**
 * Colissimo API Types
 * Based on La Poste API Suivi v2 documentation
 */

/**
 * Event type - Represents a tracking event (flashage)
 */
export type ColissimoEvent = {
  date: string; // Format: 2019-06-03T15:32:00+02:00
  label: string; // Human-readable event message
  code: string; // Event code (e.g., DR1, PC1, ET1, DI1)
};

/**
 * Timeline step type
 * Represents the visual timeline steps shown on laposte.fr
 */
export type ColissimoTimelineStep = {
  id: number; // Step ID (1-5)
  shortLabel: string; // Short label for the step
  longLabel: string; // Long label with details
  date?: string; // Optional date (only first and last steps)
  country?: string; // ISO country code
  status: boolean; // Whether step is completed
  type: number; // 1: OK, 0: Issue, -1: KO
};

/**
 * Removal point (point de retrait)
 */
export type ColissimoRemovalPoint = {
  name: string; // Point name
  type: string; // Point type: 'LP', 'BDP', 'A2P', etc.
};

/**
 * Delivery choice options
 */
export type ColissimoDeliveryChoice = {
  deliveryChoice: number; // 1: Possible, 2: Chosen
};

/**
 * Partner information (for international shipments)
 */
export type ColissimoPartner = {
  name: string; // Partner name
  network: string; // Partner network
  reference: string; // Tracking ID at partner
};

/**
 * Context data - Additional shipment information
 */
export type ColissimoContextData = {
  deliveryChoice?: ColissimoDeliveryChoice;
  removalPoint?: ColissimoRemovalPoint;
  originCountry?: string; // ISO country code
  arrivalCountry?: string; // ISO country code
  partner?: ColissimoPartner;
};

/**
 * Shipment detail
 */
export type ColissimoShipment = {
  idShip: string; // Tracking number
  urlDetail?: string; // URL to detailed tracking page
  holder: number; // 1: courrier nat, 2: courrier inter, 3: chronopost, 4: colissimo
  product: string; // Product name (e.g., "Lettre expert", "Colissimo")
  isFinal: boolean; // Is shipment at final status?
  entryDate: string; // Pickup date
  deliveryDate?: string; // Delivery date (if delivered)
  event: ColissimoEvent[]; // List of events (anti-chronological)
  timeline: ColissimoTimelineStep[]; // Visual timeline (5 steps)
  contextData?: ColissimoContextData; // Additional context
};

/**
 * API Response (Success)
 */
export type ColissimoTrackingResponse = {
  lang: string; // Response language (e.g., "fr_FR")
  scope: string; // Always "open"
  returnCode: 200 | 207; // 200: OK, 207: Multi-status
  shipment: ColissimoShipment;
};

/**
 * API Response (Error)
 */
export type ColissimoErrorResponse = {
  lang: string;
  scope: string;
  returnCode: 400 | 404 | 500 | 504;
  returnMessage: string; // Error message
  idShip: string; // Requested tracking number
};

/**
 * Union type for all API responses
 */
export type ColissimoApiResponse = ColissimoTrackingResponse | ColissimoErrorResponse;

/**
 * Helper type guard to check if response is successful
 */
export function isSuccessResponse(
  response: ColissimoApiResponse
): response is ColissimoTrackingResponse {
  return response.returnCode === 200 || response.returnCode === 207;
}

/**
 * Helper type guard to check if response is error
 */
export function isErrorResponse(
  response: ColissimoApiResponse
): response is ColissimoErrorResponse {
  return response.returnCode >= 400;
}

/**
 * Simplified tracking status for UI
 */
export type TrackingStatus =
  | 'pending' // Not yet picked up
  | 'in_transit' // In transit
  | 'out_for_delivery' // Out for delivery
  | 'available_for_pickup' // Available at pickup point
  | 'delivered' // Delivered
  | 'failed' // Delivery failed
  | 'returned' // Returned to sender
  | 'unknown'; // Unknown status

/**
 * Helper to convert Colissimo timeline to simplified status
 */
export function getSimplifiedStatus(timeline: ColissimoTimelineStep[]): TrackingStatus {
  // Find the highest completed step
  const completedSteps = timeline.filter((step) => step.status);

  if (completedSteps.length === 0) return 'unknown';

  const latestStep = completedSteps[completedSteps.length - 1];

  // Step 5: Delivered
  if (latestStep.id === 5 && latestStep.type === 1) return 'delivered';
  if (latestStep.id === 5 && latestStep.type === -1) return 'failed';

  // Step 4: Available for pickup or out for delivery
  if (latestStep.id === 4) {
    if (latestStep.shortLabel.toLowerCase().includes('retrait')) {
      return 'available_for_pickup';
    }
    return 'out_for_delivery';
  }

  // Steps 1-3: In transit
  if (latestStep.id >= 1 && latestStep.id <= 3) return 'in_transit';

  return 'unknown';
}

/**
 * Event code categories (for reference)
 * DR1-DR2: Déclaratif / Problème préparation
 * PC1-PC2: Pris en charge
 * ET1-ET4: En cours de traitement
 * EP1: En attente de présentation
 * DO1-DO3: Douane
 * PB1-PB2: Problème
 * MD2: Mis en distribution
 * ND1: Non distribuable
 * AG1: En attente retrait
 * RE1: Retourné
 * DI0-DI3: Distribué
 */
export const EVENT_CODES = {
  // Declaration
  DR1: 'Déclaratif réceptionné',
  DR2: 'Problème lors de la préparation',

  // Pickup
  PC1: 'Pris en charge',
  PC2: 'Pris en charge dans le pays d\'expédition',

  // Processing
  ET1: 'En cours de traitement',
  ET2: 'En cours de traitement dans le pays d\'expédition',
  ET3: 'En cours de traitement dans le pays de destination',
  ET4: 'En cours de traitement dans un pays de transit',
  EP1: 'En attente de présentation',

  // Customs
  DO1: 'Entrée en Douane',
  DO2: 'Sortie de Douane',
  DO3: 'Retenu en Douane',

  // Issues
  PB1: 'Problème en cours',
  PB2: 'Problème résolu',

  // Delivery
  MD2: 'Mis en distribution',
  ND1: 'Non distribuable',
  AG1: 'En attente d\'être retiré au guichet',
  RE1: 'Retourné à l\'expéditeur',

  // Delivered
  DI0: 'Distribué en lot',
  DI1: 'Distribué',
  DI2: 'Distribué à l\'expéditeur',
  DI3: 'Retardé',

  // Info
  ID0: 'Informations douane'
} as const;
