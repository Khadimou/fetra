'use client';
import { useEffect } from 'react';

export default function HubspotSnippet() {
  useEffect(() => {
    const hubspotId = process.env.NEXT_PUBLIC_HUBSPOT_ID;
    
    if (!hubspotId) {
      console.warn('NEXT_PUBLIC_HUBSPOT_ID not configured - HubSpot tracking disabled');
      return;
    }

    // Check if script already exists
    if (document.getElementById('hs-script-loader')) {
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = 'hs-script-loader';
    script.async = true;
    script.defer = true;
    script.src = `//js.hs-scripts.com/${hubspotId}.js`;

    document.head.appendChild(script);
  }, []);

  return null;
}

