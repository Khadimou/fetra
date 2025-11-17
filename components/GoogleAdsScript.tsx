'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { GOOGLE_ADS_ID, isGoogleAdsConfigured, initGoogleAds } from '@/lib/google-ads';
import { readConsent } from '@/lib/cookies';

/**
 * Google Ads Conversion Tracking Script Component
 *
 * Loads Google Ads conversion tracking script only after user consent.
 * Integrates with existing GDPR cookie consent system.
 *
 * Usage:
 * Add this component to your root layout (app/[locale]/layout.tsx)
 */
export default function GoogleAdsScript() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Check if Google Ads is configured
    if (!isGoogleAdsConfigured()) {
      console.log('[Google Ads] Not configured - skipping');
      return;
    }

    // Check existing consent on mount
    const checkConsent = () => {
      try {
        const consent = readConsent();
        // Google Ads requires marketing consent
        if (consent?.marketing) {
          setShouldLoad(true);
          // Initialize Google Ads after script loads
          setTimeout(() => {
            initGoogleAds();
          }, 100);
        }
      } catch (error) {
        console.error('[Google Ads] Failed to read consent:', error);
      }
    };

    checkConsent();

    // Listen for marketing consent event
    const handleMarketingConsent = () => {
      setShouldLoad(true);
      setTimeout(() => {
        initGoogleAds();
      }, 100);
    };

    window.addEventListener('consent-marketing', handleMarketingConsent);

    return () => {
      window.removeEventListener('consent-marketing', handleMarketingConsent);
    };
  }, []);

  // Don't render if not configured or no consent
  if (!isGoogleAdsConfigured() || !shouldLoad) {
    return null;
  }

  return (
    <>
      {/* Google Ads Global Site Tag (gtag.js) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('[Google Ads] Script loaded');
          initGoogleAds();
        }}
        onError={(e) => {
          console.error('[Google Ads] Script failed to load:', e);
        }}
      />
    </>
  );
}
