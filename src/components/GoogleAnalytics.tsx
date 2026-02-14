'use client';

import Script from 'next/script';

export default function GoogleAnalytics() {
  // Cuando tengas tu ID de Google Analytics, reemplazá 'G-XXXXXXXXXX'
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

  // Si no hay ID configurado, no renderizar nada
  if (!GA_ID) return null;

  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="lazyOnload"
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
