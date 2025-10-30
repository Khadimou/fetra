// lib/ga/index.ts
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

export async function initGA(): Promise<void> {
  if (!GA_MEASUREMENT_ID) return;
  if (typeof window === 'undefined') return;
  if ((window as unknown as { _fetra_ga_initialized?: boolean })._fetra_ga_initialized) return;
  const { loadScript } = await import('@/lib/scriptLoader');
  await loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);
  const w = window as unknown as { dataLayer: unknown[]; gtag: (...args: unknown[]) => void; _fetra_ga_initialized: boolean };
  w.dataLayer = w.dataLayer || [];
  function gtag(...args: unknown[]){ w.dataLayer.push(args); }
  w.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
  w._fetra_ga_initialized = true;
}

export const pageview = (url: string) => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;
  try { 
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    w.gtag?.('config', GA_MEASUREMENT_ID, { page_path: url }); 
  } catch {}
};

export const event = ({ action, category, label, value }: { action: string; category?: string; label?: string; value?: number }) => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;
  try { 
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    w.gtag?.('event', action, { event_category: category, event_label: label, value }); 
  } catch {}
};


