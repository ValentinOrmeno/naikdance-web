import type { Metadata } from "next";
import { Inter, Oswald, Bebas_Neue, Montserrat } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import PageLoader from "@/components/PageLoader";
import DeferredVercel from "@/components/DeferredVercel";
import GlobalBackground from "@/components/GlobalBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Naik Dance Studio | Academia de Danza Urbana en Moreno",
  description: "🔥 Estudio de danza urbana en Moreno, Buenos Aires. Clases de Reggaeton, Urbano, K-Pop, Hip Hop, Femme y más. Staff profesional. ¡Reservá tu clase!",
  keywords: [
    "danza urbana moreno",
    "clases de baile moreno",
    "reggaeton moreno",
    "hip hop moreno",
    "k-pop moreno",
    "academia de baile moreno",
    "naik dance",
    "urbano moreno",
    "clases de danza buenos aires",
    "estudio de danza moreno",
    "femme dance moreno",
    "lyrical jazz moreno",
  ],
  authors: [{ name: "Naik Dance Studio" }],
  creator: "Naik Dance Studio",
  publisher: "Naik Dance Studio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://naikdance.com'),
  openGraph: {
    title: "Naik Dance Studio | Academia de Danza Urbana en Moreno",
    description: "🔥 Clases de Reggaeton, Urbano, K-Pop, Hip Hop, Femme y más. Staff profesional. ¡Reservá tu clase!",
    url: 'https://naikdance.com',
    siteName: 'Naik Dance Studio',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Naik Dance Studio - Academia de Danza Urbana',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Naik Dance Studio | Danza Urbana en Moreno",
    description: "🔥 Clases de Reggaeton, Urbano, K-Pop, Hip Hop y más. ¡Reservá tu clase!",
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'UtC6iu3rLuGqVv7bKvu_Dt2uzHzd6w0at01CNJFtRbc',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${oswald.variable} ${bebas.variable} ${montserrat.variable}`}>
      <head>
        <JsonLd />
      </head>
      <body className="font-inter bg-naik-black text-white antialiased">
        <GoogleAnalytics />
        <DeferredVercel />
        <PageLoader />
        <GlobalBackground />
        {children}
      </body>
    </html>
  );
}