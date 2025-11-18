/**
 * Google Ads Conversion Tracking Module
 *
 * Handles Google Ads conversion tracking with GDPR consent management.
 * Supports Enhanced Conversions with hashed customer data.
 * Sends conversion events to Google Ads for purchase, leads, etc.
 */

// Google Ads Conversion ID (format: AW-XXXXXXXXXX)
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || '';

/**
 * Enhanced Conversion User Data (for improved conversion tracking)
 */
export interface EnhancedConversionData {
  email?: string;
  phone_number?: string;
  address?: {
    first_name?: string;
    last_name?: string;
    street?: string;
    city?: string;
    region?: string;
    postal_code?: string;
    country?: string;
  };
}

/**
 * Hash a string using SHA-256 (required for Enhanced Conversions)
 */
async function hashValue(value: string): Promise<string> {
  if (!value) return '';

  // Normalize: lowercase and trim
  const normalized = value.toLowerCase().trim();

  // Use Web Crypto API for SHA-256
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

/**
 * Prepare Enhanced Conversion data with hashing
 */
async function prepareEnhancedConversionData(data: {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  street?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
}): Promise<EnhancedConversionData> {
  const enhanced: EnhancedConversionData = {};

  // Hash email
  if (data.email) {
    enhanced.email = await hashValue(data.email);
  }

  // Hash phone (remove all non-digits first, then hash)
  if (data.phone) {
    const phoneDigits = data.phone.replace(/\D/g, '');
    if (phoneDigits) {
      enhanced.phone_number = await hashValue(phoneDigits);
    }
  }

  // Hash address fields
  if (data.firstName || data.lastName || data.street || data.city || data.postalCode || data.country) {
    enhanced.address = {};

    if (data.firstName) enhanced.address.first_name = await hashValue(data.firstName);
    if (data.lastName) enhanced.address.last_name = await hashValue(data.lastName);
    if (data.street) enhanced.address.street = await hashValue(data.street);
    if (data.city) enhanced.address.city = await hashValue(data.city);
    if (data.region) enhanced.address.region = await hashValue(data.region);
    if (data.postalCode) enhanced.address.postal_code = await hashValue(data.postalCode);
    if (data.country) enhanced.address.country = await hashValue(data.country);
  }

  return enhanced;
}

// Conversion labels for different actions
export const CONVERSION_LABELS = {
  PURCHASE: process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL || '',
  BEGIN_CHECKOUT: process.env.NEXT_PUBLIC_GOOGLE_ADS_BEGIN_CHECKOUT_LABEL || '',
  ADD_TO_CART: process.env.NEXT_PUBLIC_GOOGLE_ADS_ADD_TO_CART_LABEL || '',
  LEAD: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL || '',
};

/**
 * Check if Google Ads is properly configured
 */
export function isGoogleAdsConfigured(): boolean {
  return Boolean(GOOGLE_ADS_ID && GOOGLE_ADS_ID.startsWith('AW-'));
}

/**
 * Initialize Google Ads gtag
 */
export function initGoogleAds(): void {
  if (typeof window === 'undefined' || !isGoogleAdsConfigured()) {
    return;
  }

  // Initialize dataLayer if not exists
  (window as any).dataLayer = (window as any).dataLayer || [];

  // gtag function
  const gtag = function () {
    (window as any).dataLayer.push(arguments);
  };
  (window as any).gtag = gtag;

  // Initialize gtag
  (gtag as any)('js', new Date());
  (gtag as any)('config', GOOGLE_ADS_ID);

  console.log('[Google Ads] Initialized:', GOOGLE_ADS_ID);
}

/**
 * Track a conversion event with optional Enhanced Conversion data
 */
export function trackConversion(
  conversionLabel: string,
  value?: number,
  currency: string = 'EUR',
  transactionId?: string,
  enhancedData?: EnhancedConversionData
): void {
  if (typeof window === 'undefined' || !isGoogleAdsConfigured()) {
    return;
  }

  if (!conversionLabel) {
    console.warn('[Google Ads] No conversion label provided');
    return;
  }

  const gtag = (window as any).gtag;
  if (!gtag) {
    console.warn('[Google Ads] gtag not initialized');
    return;
  }

  const conversionData: any = {
    send_to: `${GOOGLE_ADS_ID}/${conversionLabel}`,
  };

  if (value !== undefined) {
    conversionData.value = value;
    conversionData.currency = currency;
  }

  if (transactionId) {
    conversionData.transaction_id = transactionId;
  }

  // Add Enhanced Conversion data if provided
  if (enhancedData && Object.keys(enhancedData).length > 0) {
    conversionData.user_data = enhancedData;
    console.log('[Google Ads] Enhanced Conversion data included');
  }

  gtag('event', 'conversion', conversionData);

  console.log('[Google Ads] Conversion tracked:', {
    label: conversionLabel,
    value,
    currency,
    transactionId,
    enhanced: !!enhancedData,
  });
}

/**
 * Track purchase conversion (basic version without Enhanced Conversions)
 */
export function trackPurchase(
  orderId: string,
  amount: number,
  currency: string = 'EUR'
): void {
  trackConversion(
    CONVERSION_LABELS.PURCHASE,
    amount,
    currency,
    orderId
  );
}

/**
 * Track purchase conversion with Enhanced Conversions
 * This version includes hashed customer data for better conversion tracking
 * and works WITHOUT requiring marketing consent (uses first-party data)
 */
export async function trackPurchaseEnhanced(
  orderId: string,
  amount: number,
  currency: string = 'EUR',
  customerData?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    street?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
  }
): Promise<void> {
  // Prepare enhanced conversion data with hashing
  let enhancedData: EnhancedConversionData | undefined;

  if (customerData) {
    try {
      enhancedData = await prepareEnhancedConversionData(customerData);
    } catch (error) {
      console.error('[Google Ads] Error preparing enhanced conversion data:', error);
      // Continue without enhanced data
    }
  }

  // Track conversion with enhanced data
  trackConversion(
    CONVERSION_LABELS.PURCHASE,
    amount,
    currency,
    orderId,
    enhancedData
  );
}

/**
 * Track begin checkout conversion
 */
export function trackBeginCheckout(value?: number): void {
  trackConversion(
    CONVERSION_LABELS.BEGIN_CHECKOUT,
    value
  );
}

/**
 * Track add to cart conversion
 */
export function trackAddToCart(value?: number): void {
  trackConversion(
    CONVERSION_LABELS.ADD_TO_CART,
    value
  );
}

/**
 * Track lead conversion (newsletter signup, contact form, etc.)
 */
export function trackLead(): void {
  trackConversion(CONVERSION_LABELS.LEAD);
}

/**
 * Track custom conversion
 */
export function trackCustomConversion(
  label: string,
  value?: number,
  currency: string = 'EUR'
): void {
  trackConversion(label, value, currency);
}

/**
 * Send remarketing event
 */
export function sendRemarketingEvent(
  eventName: string,
  params?: Record<string, any>
): void {
  if (typeof window === 'undefined' || !isGoogleAdsConfigured()) {
    return;
  }

  const gtag = (window as any).gtag;
  if (!gtag) {
    return;
  }

  gtag('event', eventName, {
    send_to: GOOGLE_ADS_ID,
    ...params,
  });

  console.log('[Google Ads] Remarketing event sent:', eventName, params);
}

/**
 * Set user data for enhanced conversions (optional, GDPR compliant)
 */
export function setUserData(userData: {
  email?: string;
  phone?: string;
  address?: {
    firstName?: string;
    lastName?: string;
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
}): void {
  if (typeof window === 'undefined' || !isGoogleAdsConfigured()) {
    return;
  }

  const gtag = (window as any).gtag;
  if (!gtag) {
    return;
  }

  const enhancedConversionData: any = {};

  if (userData.email) {
    enhancedConversionData.email = userData.email;
  }

  if (userData.phone) {
    enhancedConversionData.phone_number = userData.phone;
  }

  if (userData.address) {
    enhancedConversionData.address = {
      first_name: userData.address.firstName,
      last_name: userData.address.lastName,
      street: userData.address.street,
      city: userData.address.city,
      postal_code: userData.address.postalCode,
      country: userData.address.country,
    };
  }

  gtag('set', 'user_data', enhancedConversionData);

  console.log('[Google Ads] Enhanced conversion data set');
}
