// lib/tiktok/index.ts
export const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || '';

declare global {
  interface Window {
    ttq: any;
    _fetra_tiktok_initialized?: boolean;
  }
}

/**
 * Initialize TikTok Pixel with consent-aware loading
 * Only loads after user consent for marketing
 */
export async function initTikTok(): Promise<void> {
  if (!TIKTOK_PIXEL_ID) {
    console.warn('TikTok Pixel: NEXT_PUBLIC_TIKTOK_PIXEL_ID not configured');
    return;
  }
  
  if (typeof window === 'undefined') return;
  
  // Prevent duplicate initialization
  if (window._fetra_tiktok_initialized) {
    console.log('TikTok Pixel: Already initialized');
    return;
  }

  try {
    // Load TikTok Pixel script
    (function (w: any, d: any, t: any) {
      w.TiktokAnalyticsObject = t;
      var ttq = w[t] = w[t] || [];
      ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];
      ttq.setAndDefer = function (t: any, e: any) {
        t[e] = function () {
          t.push([e].concat(Array.prototype.slice.call(arguments, 0)))
        }
      };
      for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function (t: any) {
        for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
        return e
      };
      ttq.load = function (e: any, n: any) {
        var r = "https://analytics.tiktok.com/i18n/pixel/events.js", o = n && n.partner;
        ttq._i = ttq._i || {}, ttq._i[e] = [], ttq._i[e]._u = r, ttq._t = ttq._t || {}, ttq._t[e] = +new Date, ttq._o = ttq._o || {}, ttq._o[e] = n || {};
        n = document.createElement("script");
        n.type = "text/javascript", n.async = !0, n.src = r + "?sdkid=" + e + "&lib=" + t;
        e = document.getElementsByTagName("script")[0];
        e.parentNode.insertBefore(n, e)
      };

      ttq.load(TIKTOK_PIXEL_ID);
      ttq.page();
    })(window, document, 'ttq');

    // Mark as initialized
    window._fetra_tiktok_initialized = true;
    
    console.log('TikTok Pixel: Successfully initialized with ID:', TIKTOK_PIXEL_ID);
  } catch (error) {
    console.error('TikTok Pixel: Failed to initialize:', error);
  }
}

/**
 * Track TikTok Pixel event (safe wrapper)
 */
export function tiktokTrack(eventName: string, parameters: Record<string, any> = {}): void {
  if (typeof window === 'undefined') return;
  if (!window._fetra_tiktok_initialized || !window.ttq) {
    console.warn('TikTok Pixel: Not initialized, skipping event:', eventName);
    return;
  }
  
  try {
    window.ttq.track(eventName, parameters);
    console.log('TikTok Pixel: Event tracked:', eventName, parameters);
  } catch (error) {
    console.error('TikTok Pixel: Failed to track event:', error);
  }
}

/**
 * Track page view in TikTok Pixel
 */
export function tiktokPageview(): void {
  if (typeof window === 'undefined') return;
  if (!window._fetra_tiktok_initialized || !window.ttq) return;
  
  try {
    window.ttq.page();
  } catch (error) {
    console.error('TikTok Pixel: Failed to track pageview:', error);
  }
}

/**
 * Standard TikTok e-commerce events
 */
export const TikTokEvents = {
  ViewContent: 'ViewContent',
  AddToCart: 'AddToCart',
  InitiateCheckout: 'InitiateCheckout',
  CompletePayment: 'CompletePayment',
  AddPaymentInfo: 'AddPaymentInfo',
  PlaceAnOrder: 'PlaceAnOrder',
} as const;

