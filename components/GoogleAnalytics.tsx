'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { pageview, GA_MEASUREMENT_ID } from '@/lib/ga';

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    const handleRouteChange = (url: string) => {
      pageview(url);
    };
    // initial page
    pageview(window.location.pathname);
    // listen
    const handler = () => handleRouteChange(window.location.pathname);
    window.addEventListener('popstate', handler);
    return () => {
      window.removeEventListener('popstate', handler);
    };
  }, [pathname]);

  return null;
}


