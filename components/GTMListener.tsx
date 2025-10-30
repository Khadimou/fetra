'use client';

import { useEffect } from 'react';
import { initGTM } from '@/lib/gtm';
import { readConsent } from '@/lib/cookies';

/**
 * GTM Listener Component
 * Listens to cookie consent events and loads Google Tag Manager dynamically
 * Only loads GTM after user gives consent for analytics or marketing
 */
export default function GTMListener() {
  useEffect(() => {
    const loadGTM = () => {
      initGTM().catch((error) => {
        console.error('GTM: Failed to initialize after consent:', error);
      });
    };

    // Check existing consent on mount
    try {
      const consent = readConsent();
      if (consent?.analytics || consent?.marketing) {
        loadGTM();
      }
    } catch (error) {
      console.error('GTM: Failed to read existing consent:', error);
    }

    // Listen for consent events
    const handleAnalyticsConsent = () => loadGTM();
    const handleMarketingConsent = () => loadGTM();

    window.addEventListener('consent-analytics', handleAnalyticsConsent);
    window.addEventListener('consent-marketing', handleMarketingConsent);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('consent-analytics', handleAnalyticsConsent);
      window.removeEventListener('consent-marketing', handleMarketingConsent);
    };
  }, []);

  // This component renders nothing (no visual element)
  return null;
}
