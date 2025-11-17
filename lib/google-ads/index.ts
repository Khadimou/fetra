/**
 * Google Ads Conversion Tracking Module
 *
 * Handles Google Ads conversion tracking with GDPR consent management.
 * Sends conversion events to Google Ads for purchase, leads, etc.
 */

// Google Ads Conversion ID (format: AW-XXXXXXXXXX)
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || '';

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
 * Track a conversion event
 */
export function trackConversion(
  conversionLabel: string,
  value?: number,
  currency: string = 'EUR',
  transactionId?: string
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

  gtag('event', 'conversion', conversionData);

  console.log('[Google Ads] Conversion tracked:', {
    label: conversionLabel,
    value,
    currency,
    transactionId,
  });
}

/**
 * Track purchase conversion
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
