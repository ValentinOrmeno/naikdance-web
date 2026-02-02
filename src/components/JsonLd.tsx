export default function JsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DanceGroup',
    name: 'Naik Dance Studio',
    description: 'Estudio de danza urbana en Moreno, Buenos Aires. Clases de Reggaeton, Urbano, K-Pop, Hip Hop, Femme y más.',
    image: 'https://naikdance-web.vercel.app/logo.png',
    '@id': 'https://naikdance-web.vercel.app',
    url: 'https://naikdance-web.vercel.app',
    telephone: '+54-9-11-6858-2586',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Moreno',
      addressLocality: 'Moreno',
      addressRegion: 'Buenos Aires',
      addressCountry: 'AR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -34.6495,
      longitude: -58.7895,
    },
    sameAs: [
      'https://www.instagram.com/naikdance',
      'https://www.facebook.com/naikdance',
      'https://wa.me/5491168582586',
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '17:00',
        closes: '22:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '18:00',
      },
    ],
    priceRange: '$$',
    offers: {
      '@type': 'Offer',
      category: 'Clases de Danza',
      priceCurrency: 'ARS',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
