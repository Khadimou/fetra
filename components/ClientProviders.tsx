// components/ClientProviders.tsx
'use client';
import dynamic from 'next/dynamic';

const CookieConsent = dynamic(() => import('./CookieConsent'), { ssr: false });
const GAListener = dynamic(() => import('./GAListener'), { ssr: false });
const GTMListener = dynamic(() => import('./GTMListener'), { ssr: false });
const CustomerSupportWidget = dynamic(() => import('./CustomerSupportWidget'), { ssr: false });

export default function ClientProviders() {
  return (
    <>
      <GAListener />
      <GTMListener />
      <CookieConsent />
      <CustomerSupportWidget />
    </>
  );
}
