// components/GAListener.tsx
'use client';
import { useEffect } from 'react';
import { initGA } from '@/lib/ga';
import { readConsent } from '@/lib/cookies';

export default function GAListener() {
  useEffect(()=> {
    const onConsent = () => { initGA().catch(()=>{}); };
    window.addEventListener('consent-analytics', onConsent);
    // init immediately if consent already present
    const c = readConsent();
    if (c?.analytics) onConsent();
    return () => window.removeEventListener('consent-analytics', onConsent);
  }, []);
  return null;
}
