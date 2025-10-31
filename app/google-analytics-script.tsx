import Script from 'next/script';

/**
 * Google Analytics Script Component
 * Loads GA4 tracking script directly in the head
 */
export default function GoogleAnalyticsScript() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-LK1VT2ZLFN';

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

