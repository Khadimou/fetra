// components/ClientProviders.tsx
'use client';
import { SessionProvider } from 'next-auth/react';
import dynamic from 'next/dynamic';

const CookieConsent = dynamic(() => import('./CookieConsent'), { ssr: false });
const GAListener = dynamic(() => import('./GAListener'), { ssr: false });
const GTMListener = dynamic(() => import('./GTMListener'), { ssr: false });
const CustomerSupportWidget = dynamic(() => import('./CustomerSupportWidget'), { ssr: false });

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <GAListener />
      <GTMListener />
      <CookieConsent />
      <CustomerSupportWidget />
    </SessionProvider>
  );
}
