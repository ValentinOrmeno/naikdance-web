import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Naik Dance Studio | Academia de Danza Urbana en Moreno",
  description: "Estudio de danza urbana en Moreno. Clases de Urbano, K-Pop, Reggaeton, Hip Hop y más. Donde la técnica, la energía y la comunidad van juntas.",
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${oswald.variable}`}>
      <body className="font-inter bg-naik-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}