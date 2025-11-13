'use client';

import { useEffect } from 'react';
import { initTikTok } from '@/lib/tiktok';
import { readConsent } from '@/lib/cookies';

/**
 * TikTok Pixel Listener Component
 * Listens to cookie consent events and loads TikTok Pixel dynamically
 * Only loads TikTok Pixel after user gives consent for marketing
 */
export default function TikTokListener() {
  useEffect(() => {
    const loadTikTok = () => {
      initTikTok().catch((error) => {
        console.error('TikTok Pixel: Failed to initialize after consent:', error);
      });
    };

    // Check existing consent on mount
    try {
      const consent = readConsent();
      if (consent?.marketing) {
        loadTikTok();
      }
    } catch (error) {
      console.error('TikTok Pixel: Failed to read existing consent:', error);
    }

    // Listen for marketing consent event
    const handleMarketingConsent = () => loadTikTok();

    window.addEventListener('consent-marketing', handleMarketingConsent);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('consent-marketing', handleMarketingConsent);
    };
  }, []);

  // This component renders nothing (no visual element)
  return null;
}

