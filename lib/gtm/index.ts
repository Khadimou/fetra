// lib/gtm/index.ts
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || '';

declare global {
  interface Window {
    dataLayer: any[];
    _fetra_gtm_initialized?: boolean;
  }
}

/**
 * Initialize Google Tag Manager with consent-aware loading
 * Only loads after user consent for analytics or marketing
 */
export async function initGTM(): Promise<void> {
  if (!GTM_ID) {
    console.warn('GTM: NEXT_PUBLIC_GTM_ID not configured');
    return;
  }
  
  if (typeof window === 'undefined') return;
  
  // Prevent duplicate initialization
  if (window._fetra_gtm_initialized) {
    console.log('GTM: Already initialized');
    return;
  }

  try {
    // Initialize dataLayer before GTM script loads
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });

    // Load GTM script asynchronously
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    document.head.appendChild(script);

    // Add noscript iframe for GTM
    const noscript = document.createElement('noscript');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    noscript.appendChild(iframe);
    document.body.appendChild(noscript);

    // Mark as initialized
    window._fetra_gtm_initialized = true;
    
    console.log('GTM: Successfully initialized with ID:', GTM_ID);
  } catch (error) {
    console.error('GTM: Failed to initialize:', error);
  }
}

/**
 * Push data to GTM dataLayer (safe wrapper)
 */
export function gtmPush(data: Record<string, any>): void {
  if (typeof window === 'undefined') return;
  if (!window._fetra_gtm_initialized) return;
  
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data);
  } catch (error) {
    console.error('GTM: Failed to push data:', error);
  }
}

/**
 * Track page view in GTM
 */
export function gtmPageview(url: string): void {
  gtmPush({
    event: 'page_view',
    page_location: url,
    page_title: document.title
  });
}

/**
 * Track custom event in GTM
 */
export function gtmEvent(eventName: string, parameters: Record<string, any> = {}): void {
  gtmPush({
    event: eventName,
    ...parameters
  });
}
