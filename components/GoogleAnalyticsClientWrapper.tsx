'use client';
import dynamic from 'next/dynamic';
const GA = dynamic(() => import('./GoogleAnalytics'), { ssr: false });
export default function GoogleAnalyticsClientWrapper() { return <GA />; }


